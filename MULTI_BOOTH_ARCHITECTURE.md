# PIXXEL8 MULTI-BOOTH ARCHITECTURE

## Overview
Enterprise-grade multi-booth photo booth system with centralized admin control and session-safe configuration management.

## Core Principles

### 1. Booth Identification
- Each booth has a **unique, immutable `boothId`**
- Set once during installation
- Persisted locally in browser storage
- All API calls are booth-scoped

### 2. Session Immutability (NON-NEGOTIABLE)
Once a photo session starts, the following are **LOCKED**:
- Mode (Normal/Event)
- Grid template
- Still count
- Pricing
- Theme

**Admin changes during active sessions are QUEUED and applied AFTER session completion.**

### 3. Configuration System

```typescript
interface BoothConfigState {
  activeConfig: BoothConfig;      // Currently applied
  pendingConfig?: BoothConfig;    // Queued for later
  hasPendingChanges: boolean;
}
```

**Rules:**
- Booth IDLE → Apply config immediately
- Booth IN SESSION → Queue config
- Auto-apply queued config when session ends

### 4. Offline-Safe Operation
- Last valid config persisted locally
- Continues functioning without backend
- Auto-syncs when connection restored
- Offline queue for critical operations

## Architecture Components

### Backend API Endpoints

```
POST   /booths/register              # Register new booth
GET    /booths                       # List all booths (Admin)
GET    /booths/:boothId              # Get booth info
GET    /booths/:boothId/config       # Get booth config
PUT    /booths/:boothId/config       # Update booth config (Admin)
POST   /booths/heartbeat             # Booth heartbeat
GET    /booths/:boothId/pending-config  # Check for pending updates
```

### Frontend Stores

#### `boothStore` - Booth-scoped state
```typescript
- identity: BoothIdentity           # Immutable booth ID
- configState: BoothConfigState     # Active/pending configs
- status: BoothStatusType           # online/offline/in-session
- isInSession: boolean              # Session lock flag
```

#### `machineStore` - Existing machine state
- No changes to existing logic
- Integrates with booth session tracking

### Admin Portal

#### Booth List Page (`/admin/booths`)
Shows all registered booths with:
- Booth name & ID
- Online/Offline status
- Current mode
- Active grid
- Pending update indicator
- Last active time

#### Booth Detail Page (`/admin/booths/:boothId`)
Edit booth-specific settings:
- Mode (Normal/Event)
- Grid template
- Still count
- Pricing
- Print limits

**Changes are booth-targeted and session-safe.**

### Machine Application

#### Booth Registration
On first launch:
1. Generate unique `boothId`
2. Prompt for booth name
3. Register with backend
4. Persist identity locally

#### Config Sync
- Heartbeat every 30 seconds
- Config check every 60 seconds
- Auto-apply when idle
- Queue when in session

#### Session Tracking
Machine app tracks session state:
- `idle` → Can apply config
- `setup`, `capture`, `review`, `printing` → Session active, queue config
- Session end → Auto-apply pending config

## Data Flow

### Admin Updates Config
```
1. Admin changes booth config via portal
2. Backend stores new config
3. Machine polls for updates (60s interval)
4. If idle: Apply immediately
5. If in session: Queue for later
6. Session ends: Auto-apply queued config
```

### Booth Heartbeat
```
1. Machine sends heartbeat every 30s
2. Includes: boothId, status, isInSession
3. Backend updates booth status
4. Admin portal shows real-time status
```

## Implementation Files

### Types
- `src/types/booth.types.ts` - All booth-related types

### Services
- `src/services/booth.service.ts` - Booth API integration

### Stores
- `src/store/boothStore.ts` - Booth state management

### Hooks
- `src/hooks/useBoothSync.ts` - Auto sync hook

### Admin Pages
- `src/pages/admin/BoothListPage.tsx` - Booth list view
- `src/pages/admin/BoothDetailPage.tsx` - Booth config editor

### Machine Integration
- Machine app uses `useBoothSync()` hook
- Tracks session state via existing machine FSM
- Auto-applies pending configs on session end

## Scaling Strategy

### Current: 2 Booths
- Simple polling (30s heartbeat, 60s config check)
- Direct REST API calls
- Local persistence

### Future: Many Booths
- WebSocket for real-time updates
- Server-sent events for config push
- Redis pub/sub for instant sync
- Load balancing for API
- Database sharding by boothId

**Architecture supports seamless scaling without code changes.**

## Security

### Booth Authentication
- Each booth has unique API token
- Token stored securely in local storage
- All API calls include booth token
- Backend validates booth identity

### Admin Authorization
- Admin JWT tokens
- Role-based access control
- Audit log for config changes
- Booth-scoped permissions

## Error Handling

### Network Loss
- Continue with last valid config
- Queue critical operations
- Auto-retry when online
- User sees no interruption

### Config Conflicts
- Timestamp-based resolution
- Admin sees conflict warning
- Manual resolution if needed

### Session Interruption
- Never force-apply during session
- Always queue and wait
- Clear user feedback

## Testing Strategy

### Unit Tests
- Booth store logic
- Config queue/apply logic
- Session safety rules

### Integration Tests
- Admin → Booth config flow
- Session-safe updates
- Offline/online transitions

### E2E Tests
- Multi-booth scenarios
- Concurrent sessions
- Config sync timing

## Deployment

### Booth Setup
1. Install software on kiosk
2. First launch: Registration wizard
3. Enter booth name
4. System generates boothId
5. Register with backend
6. Download initial config
7. Ready to use

### Admin Setup
1. Login to admin portal
2. See all registered booths
3. Configure each booth independently
4. Monitor real-time status

## Future Enhancements

### Phase 2
- Real-time WebSocket sync
- Booth groups/locations
- Bulk config updates
- Config templates

### Phase 3
- Analytics per booth
- Remote diagnostics
- A/B testing configs
- Dynamic pricing

### Phase 4
- Multi-tenant support
- White-label booths
- Franchise management
- Revenue sharing

---

**This architecture is production-ready, scales cleanly, and maintains session safety at all times.**
