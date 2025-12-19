# BOOTH MANAGEMENT SYSTEM
## Smartwatch-Style Device Control

---

## 🎯 Core Concept

**Admin Portal = Control App**  
**Photo Booth = Smart Device**

Each booth operates as an independent smart device that syncs configuration dynamically without requiring restarts.

---

## 📱 How It Works

### Admin Portal Flow

```
Machines List → Select Booth → Control Panel → Save Config → Sync
```

### Machine App Flow

```
Boot → Identify (boothId) → Fetch Config → Apply → Monitor for Updates
```

---

## 🖥️ Machines Management Page

**Location:** `/admin/machines`

### Summary Cards
- **Total Booths** - Count of all registered booths
- **Online** - Booths currently connected
- **In Session** - Booths actively being used
- **Offline** - Booths not responding

### Booth Cards Display
Each booth card shows:
- **Booth Name** - Human-readable identifier
- **Booth ID** - Unique device identifier
- **Status** - Online / In Session / Offline / Error
- **Current Mode** - Normal or Event
- **Active Grid** - Current layout template
- **Total Prints** - Lifetime session count
- **Last Seen** - Relative time since last heartbeat

### Status Indicators
- 🟢 **Green** - Online and ready
- 🔵 **Blue** - In active session
- ⚫ **Gray** - Offline
- 🔴 **Red** - Error state

### Pending Config Warning
- ⚠️ **Yellow badge** - Configuration update queued
- Shows "Will apply after current session"

---

## ⚙️ Booth Control Panel

**Trigger:** Click any booth card

### Configuration Options

#### 1. Operating Mode
- **Normal Mode** - Pay per print (price configurable)
- **Event Mode** - Free unlimited prints

#### 2. Grid Layout
- 2x2 Classic
- 3x3 Grid
- Photo Strip
- Collage

#### 3. Price (Normal Mode Only)
- Configurable in ₹
- Only shown when Normal mode is selected

### Sync Status Indicators

| Status | Icon | Color | Meaning |
|--------|------|-------|---------|
| **Synced** | ✓ | Green | No pending changes |
| **Unsaved Changes** | ⚠ | Blue | Local edits not saved |
| **Booth in Session** | ⚠ | Orange | Changes will queue |
| **Pending** | ⏱ | Yellow | Queued for next sync |

### Save Behavior

#### If Booth is IDLE:
```
Save Changes → Apply Instantly → Booth Updates Immediately
```

#### If Booth is IN SESSION:
```
Save Changes → Queue Update → Show Warning → Apply After Session Ends
```

### Action Buttons
- **Save Changes** - Apply configuration (instant or queued)
- **Queue Changes** - (shown when booth is in session)
- **Cancel** - Discard unsaved changes

---

## 🔄 Sync Architecture

### State Management

Each booth maintains:
```typescript
{
  activeConfig: BoothConfig,      // Currently running config
  pendingConfig: BoothConfig?,    // Queued update (if in session)
  lastSyncedAt: timestamp         // Last successful sync
}
```

### Config Scoping
- All configurations are **booth-specific**
- No global overwrites
- Each booth fetches only its own config using `boothId`

### Update Flow

```mermaid
Admin Changes Config
    ↓
Check Booth Status
    ↓
┌─────────────┬─────────────┐
│   IDLE      │  IN SESSION │
│   Apply     │   Queue     │
│   Instantly │   Update    │
└─────────────┴─────────────┘
         ↓           ↓
    Booth Syncs  Session Ends
         ↓           ↓
    Config Active ← Apply Queued
```

---

## 🚀 Machine App Integration

### Booth Identification

Each machine must identify itself on boot:
```typescript
const boothId = localStorage.getItem('boothId') || generateBoothId();
```

### Config Fetching

**Endpoint:** `GET /booths/{boothId}/config`

```typescript
const config = await boothService.getBoothConfig(boothId);
```

### Heartbeat System

Machines send periodic heartbeats:
```typescript
setInterval(() => {
  boothService.sendHeartbeat({
    boothId,
    status: currentStatus,
    isInSession: sessionActive,
  });
}, 30000); // Every 30 seconds
```

### Config Sync Hook

Use `useBoothSync` hook for automatic updates:
```typescript
const { syncConfig, hasPendingUpdate } = useBoothSync(boothId);

// Polls for pending configs
// Applies updates when session ends
// Session-safe logic built-in
```

---

## 🛡️ Session Safety

### Critical Rules

1. **Never interrupt active sessions**
2. **Queue all updates during sessions**
3. **Apply updates only when idle**
4. **Show clear pending indicators**

### Implementation

```typescript
if (isInSession) {
  // Queue the update
  setPendingConfig(newConfig);
  showPendingIndicator();
} else {
  // Apply immediately
  setActiveConfig(newConfig);
  applyToMachine();
}
```

### Session End Detection

```typescript
onSessionEnd(() => {
  if (hasPendingConfig) {
    applyPendingConfig();
    clearPendingFlag();
  }
});
```

---

## 📊 Data Flow

### Admin → Backend
```
Admin edits config
  ↓
POST /booths/{boothId}/config
  ↓
Backend stores config
  ↓
Sets pending flag if in session
```

### Backend → Machine
```
Machine polls for updates
  ↓
GET /booths/{boothId}/pending-config
  ↓
If pending && !inSession
  ↓
Apply new config
  ↓
Confirm sync
```

---

## 🎨 UX Principles

### Real-Time Feel
- Instant visual feedback
- Live status updates
- Smooth animations

### Clear Communication
- Explicit sync status
- Warning for session conflicts
- Success confirmations

### No Surprises
- Predictable behavior
- Safe defaults
- Undo capability

### Professional Polish
- Consistent design language
- Responsive interactions
- Error resilience

---

## 🔧 Technical Stack

### Frontend
- **React** - UI framework
- **Zustand** - State management
- **Framer Motion** - Animations
- **TailwindCSS** - Styling

### Components
- `BoothControlPanel` - Config editor modal
- `MachinesPage` - Booth list and selection
- `GlassPanel` - Cinematic UI container
- `GlassButton` - Premium button component

### Services
- `boothService` - API integration
- `useBoothSync` - Config sync hook

---

## 📝 API Endpoints

### Booth Management
```
GET    /booths                    - List all booths (admin)
GET    /booths/{boothId}          - Get booth info
POST   /booths/register           - Register new booth
```

### Configuration
```
GET    /booths/{boothId}/config          - Get active config
POST   /booths/{boothId}/config          - Update config
GET    /booths/{boothId}/pending-config  - Check for pending updates
```

### Heartbeat
```
POST   /booths/{boothId}/heartbeat       - Send status update
```

---

## ✅ Testing Checklist

### Admin Portal
- [ ] Booth list loads correctly
- [ ] Status indicators accurate
- [ ] Control panel opens on click
- [ ] Config changes save properly
- [ ] Pending state shows correctly
- [ ] Session warnings display

### Machine App
- [ ] Booth identifies itself
- [ ] Fetches correct config
- [ ] Applies updates when idle
- [ ] Queues updates during session
- [ ] Heartbeat sends regularly
- [ ] Sync status accurate

### Integration
- [ ] Admin changes reflect on machine
- [ ] Session safety enforced
- [ ] No config conflicts
- [ ] Sync indicators match reality

---

## 🚨 Common Issues

### Booth Shows Offline
- Check heartbeat interval
- Verify network connectivity
- Confirm boothId is correct

### Config Not Applying
- Check if booth is in session
- Verify pending config exists
- Confirm session end detection

### Multiple Booths Conflict
- Ensure boothId scoping
- Check config isolation
- Verify no global state

---

## 🎯 Best Practices

1. **Always scope by boothId**
2. **Never force config during session**
3. **Show clear sync status**
4. **Handle offline gracefully**
5. **Log all config changes**
6. **Test session transitions**
7. **Validate config before apply**

---

## 📚 Related Documentation

- `MULTI_BOOTH_ARCHITECTURE.md` - Overall system design
- `VIDEO_UI_DESIGN_SYSTEM.md` - UI/UX guidelines
- `BACKEND_INTEGRATION.md` - API integration guide

---

## 🎉 Result

Admin feels like controlling smart devices:
- ✅ Select any booth
- ✅ Change settings easily
- ✅ See live status
- ✅ Safe, reliable updates
- ✅ Professional experience

**The system behaves like a fleet of smartwatches controlled from a central app.**
