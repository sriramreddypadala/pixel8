# BOOTH-FIRST ARCHITECTURE
## Strict Enforcement Guide

---

## 🎯 Core Principle

**Every action, setting, sync, and state mutation MUST be scoped to a `boothId`.**

There is:
- ❌ NO global control
- ❌ NO shared configuration  
- ❌ NO cross-booth side effects

---

## 📱 Machine (Photo Booth) Flow

### First Installation
```
1. boothId configured (immutable)
2. boothName assigned (optional)
3. Booth registered with backend
```

### Startup Sequence
```
1. Authenticate using boothId
2. Register online status
3. Fetch ONLY own configuration
4. Load cached config as fallback
5. Start heartbeat loop
```

### Runtime Behavior
```typescript
// ✅ Correct: Booth-scoped
const config = await boothService.getBoothConfig(boothId);

// ❌ Wrong: Global fetch
const config = await boothService.getAllConfigs();
```

### Offline Resilience
- Persist last valid config locally
- Continue operating with cached config
- Auto-sync when connection restores
- Never block on network failures

---

## 👨‍💼 Admin Flow

### Login → Booth Selection (Mandatory)
```
1. Admin authenticates
2. Landing: Booth Selection Modal
3. Admin selects ONE booth
4. Selected booth = Active Context
5. All actions affect ONLY this booth
```

### UI Requirements
Admin UI MUST always display:
- ✅ Active Booth Name
- ✅ Booth ID (truncated)
- ✅ Online/Offline status
- ✅ "Change Booth" action

### Booth Context Persistence
```typescript
// adminStore.ts
interface AdminStore {
  selectedBoothId: string | null;  // Persisted
  selectedBoothName: string | null;  // Persisted
  
  setSelectedBooth: (boothId: string, boothName?: string) => void;
  clearBoothSelection: () => void;
  hasBoothSelected: () => boolean;
}
```

---

## 🎛️ Control Panel Behavior

### Allowed Actions (Booth-Scoped)
- Change mode (Normal/Event)
- Change grid layout
- Change still count
- Change pricing
- Change print limits
- Future: Visual themes

### Action Rules
```typescript
// ✅ Every action includes boothId
onSave({
  boothId: booth.identity.boothId,  // Required
  mode,
  activeGridId,
  price,
  updatedAt: new Date().toISOString(),
});

// ❌ Never do this
updateGlobalMode('event');  // NO GLOBAL ACTIONS
```

---

## 🔄 Sync & Session Logic

### Session-Safe Updates

**If booth is IDLE:**
```typescript
if (canApplyConfigImmediately()) {
  setActiveConfig(pendingConfig);  // Apply instantly
  console.log('✅ Config applied immediately');
}
```

**If booth is IN SESSION:**
```typescript
if (isInSession) {
  setPendingConfig(pendingConfig);  // Queue for later
  console.log('⏳ Config queued - will apply after session');
}

// Auto-apply when session ends
setSessionState(false);  // Triggers applyPendingConfig()
```

### State Management
```typescript
interface BoothConfigState {
  activeConfig: BoothConfig;      // Currently running
  pendingConfig?: BoothConfig;    // Queued changes
  hasPendingChanges: boolean;     // Flag
}
```

---

## 📊 Data Contract

### Booth Identity (Immutable)
```typescript
interface BoothIdentity {
  boothId: string;        // UUID, set once
  boothName: string;      // Human-readable
  location?: string;      // Optional
  registeredAt: string;   // ISO timestamp
}
```

### Booth Configuration (Mutable)
```typescript
interface BoothConfig {
  boothId: string;              // Required, scopes config
  mode: 'normal' | 'event';
  activeGridId: string;
  price: number;
  theme: string;
  printLimit?: number;
  updatedAt: string;
}
```

### API Contract
```typescript
// ✅ All endpoints require boothId
GET    /booths/:boothId/config
PUT    /booths/:boothId/config
POST   /booths/heartbeat { boothId, status, isInSession }
GET    /booths/:boothId/pending-config

// ❌ These should NOT exist
PUT    /config/global
POST   /config/broadcast
```

---

## 🎨 UI/UX Requirements

### Booth Selection
- ✅ Mandatory on admin login
- ✅ Cannot be bypassed
- ✅ Persisted across sessions
- ✅ Clear "Change Booth" action

### Visual Indicators
```
┌─────────────────────────────┐
│ 🖥️ Active Booth             │
│ Main Street Booth           │
│ ID: booth-abc123...         │
│ [Change]                    │
└─────────────────────────────┘
```

### Sync Status Feedback
- 🟢 **Synced** - No pending changes
- 🔵 **Unsaved** - Local edits not saved
- 🟠 **In Session** - Changes will queue
- 🟡 **Pending** - Queued, will apply after session
- 🔴 **Offline** - Using cached config

### No Global Actions
- ❌ No "Apply to All Booths" button
- ❌ No "Broadcast Settings" feature
- ❌ No "Global Mode Toggle"
- ✅ Only booth-scoped actions

---

## 🏗️ Implementation Checklist

### Machine Side
- [x] `boothStore.ts` - Booth identity & config state
- [x] `useBoothSync.ts` - Auto-sync with boothId scoping
- [x] `booth.service.ts` - All API calls boothId-scoped
- [x] Persist identity locally (Zustand persist)
- [x] Offline fallback with cached config
- [x] Session-safe config application

### Admin Side
- [x] `adminStore.ts` - selectedBoothId state (persisted)
- [x] `ActiveBoothIndicator.tsx` - Shows active booth
- [x] `BoothSelector.tsx` - Mandatory booth selection modal
- [x] `MachinesPage.tsx` - Sets booth context on selection
- [x] `BoothControlPanel.tsx` - Booth-scoped config changes
- [x] Sidebar integration with booth indicator

### API Layer
- [x] All booth endpoints require boothId parameter
- [x] No global config endpoints
- [x] Heartbeat includes boothId
- [x] Pending config check is booth-scoped

---

## 🔒 System Behavior Standards

### Professional
- Clear booth context at all times
- No ambiguous actions
- Predictable behavior
- Error messages include boothId

### Predictable
- Same action = same result
- No hidden side effects
- Explicit booth scoping
- Session safety guaranteed

### Scalable
- Works with 1 booth or 1000 booths
- No performance degradation
- Independent booth operations
- Parallel booth management

### Production-Ready
- Offline resilience
- Session safety
- Clear error handling
- Comprehensive logging

### Client-Trustworthy
- No accidental cross-booth changes
- Clear audit trail (boothId in logs)
- Professional UX
- Reliable sync behavior

---

## 🚫 Anti-Patterns (DO NOT DO)

### Global State Mutations
```typescript
// ❌ WRONG
setState({ mode: 'event' });  // Affects what?

// ✅ CORRECT
setState({ 
  booths: booths.map(b => 
    b.boothId === targetBoothId 
      ? { ...b, mode: 'event' }
      : b
  )
});
```

### Broadcast Updates
```typescript
// ❌ WRONG
booths.forEach(booth => updateConfig(booth));

// ✅ CORRECT
updateConfig(selectedBoothId, newConfig);
```

### Implicit Context
```typescript
// ❌ WRONG
function updateMode(mode: string) {
  // Which booth?
}

// ✅ CORRECT
function updateMode(boothId: string, mode: string) {
  // Explicit booth scoping
}
```

---

## 📝 Logging Standards

### Always Include boothId
```typescript
// ✅ CORRECT
console.log(`[${boothId}] Config updated:`, config);
console.error(`[${boothId}] Sync failed:`, error);

// ❌ WRONG
console.log('Config updated');  // Which booth?
```

### Audit Trail
```typescript
{
  timestamp: "2024-01-15T10:30:00Z",
  boothId: "booth-abc123",
  action: "config_update",
  changes: { mode: "event" },
  adminUser: "admin@example.com"
}
```

---

## 🎯 Final Standard

The system MUST behave like:
- **POS Terminals** - Each terminal independent
- **Smart Wearables** - Control app manages devices
- **Kiosk Management** - Central control, device-scoped actions

**Result:**
- Professional ✅
- Predictable ✅
- Scalable ✅
- Production-Ready ✅
- Client-Trustworthy ✅

---

## 📚 Related Documentation

- `BOOTH_MANAGEMENT_GUIDE.md` - Smartwatch-style control system
- `BACKEND_INTEGRATION.md` - API integration patterns
- `VIDEO_UI_IMPLEMENTATION.md` - UI/UX guidelines

---

**Last Updated:** December 19, 2024  
**Architecture Version:** 2.0 (Booth-First Enforcement)
