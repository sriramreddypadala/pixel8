# Pixxel8 Frontend Architecture

## 🏗️ System Overview

Pixxel8 is a production-ready photo booth management system with two main applications:

1. **Machine Software** - Touch-optimized kiosk interface for photo capture and printing
2. **Admin Portal** - Web-based dashboard for configuration and monitoring

## 📐 Architecture Principles

### 1. Separation of Concerns
- **UI Components** - Reusable, presentational components
- **Business Logic** - Centralized in Zustand stores and FSM
- **API Layer** - Typed service layer with offline support
- **State Management** - Global state with persistence

### 2. Type Safety
- Strict TypeScript configuration
- Fully typed API contracts
- Type-safe state management
- No `any` types in production code

### 3. Offline-First
- Local state persistence
- Offline queue for API requests
- Automatic sync when connection restored
- Graceful degradation

### 4. Performance
- Lazy-loaded routes
- Memoized components
- Optimized animations (60 FPS)
- Efficient re-render prevention

## 🔄 Machine Flow State Machine

### State Diagram
```
IDLE
  ↓ (START)
SETUP (Layout Selection)
  ↓ (SETUP_COMPLETE)
CAPTURE (Photo Taking)
  ↓ (CAPTURE_COMPLETE)
  ├─ EVENT MODE → PRINTING
  └─ NORMAL MODE → PAYMENT
       ↓ (PAYMENT_COMPLETE)
     PRINTING
       ↓ (PRINTING_COMPLETE)
       ├─ QR ENABLED → QR
       └─ QR DISABLED → THANK_YOU
            ↓ (THANK_YOU_COMPLETE)
          IDLE
```

### FSM Implementation
Location: `src/machines/machineFSM.ts`

**Key Features:**
- Strict state transitions
- Guard conditions for mode-based routing
- State persistence and recovery
- Error state handling
- Illegal transition prevention

**Usage:**
```typescript
import { useMachineFSM } from '@/hooks/useMachineFSM';

const { state, send, canTransition } = useMachineFSM();

// Send events
send({ type: 'START' });
send({ type: 'SETUP_COMPLETE' });

// Check if transition is allowed
if (canTransition('CANCEL')) {
  send({ type: 'CANCEL' });
}
```

## 🎨 Design System

### Motion System
Location: `src/utils/motion.ts`

**Animation Variants:**
- `pageVariants` - Page transitions
- `slideVariants` - Directional slides
- `modalVariants` - Modal animations
- `cardVariants` - Card interactions
- `alertVariants` - Alert notifications
- `successVariants` - Success states
- `pulseVariants` - Pulsing animations

**Usage:**
```typescript
import { pageVariants } from '@/utils/motion';

<motion.div variants={pageVariants} initial="initial" animate="animate">
  {content}
</motion.div>
```

### Design Tokens
Location: `src/utils/tokens.ts`

**Token Categories:**
- Colors (primary, accent, success, warning, danger, gray)
- Spacing (0-32)
- Radius (none, sm, base, md, lg, xl, 2xl, 3xl, full)
- Shadows (sm, base, md, lg, xl, 2xl, inner, glow)
- Typography (fontFamily, fontSize, fontWeight, lineHeight)
- Z-Index layers

**Usage:**
```typescript
import { COLORS, SPACING, SHADOWS } from '@/utils/tokens';

const styles = {
  backgroundColor: COLORS.primary[500],
  padding: SPACING[4],
  boxShadow: SHADOWS.lg,
};
```

## 📦 State Management

### Machine Store
Location: `src/store/machineStore.ts`

**Responsibilities:**
- Session management
- Mode control (NORMAL/EVENT)
- Print count tracking
- Configuration storage
- Backend synchronization

**Key Methods:**
```typescript
startSession()           // Initialize new session
setMode(mode)           // Switch between NORMAL/EVENT
incrementPrintCount()   // Track prints
syncPrintCount()        // Sync with backend
loadConfig()            // Load machine config
```

### Admin Store
Location: `src/store/adminStore.ts`

**Responsibilities:**
- User authentication
- Theme management
- Machine list
- Admin settings

**Key Methods:**
```typescript
setUser(user)           // Set authenticated user
logout()                // Clear session
toggleTheme()           // Switch light/dark
setMachines(machines)   // Update machine list
```

## 🔌 API Service Layer

### Architecture
Location: `src/services/`

**Service Files:**
- `api.service.ts` - Core HTTP client with offline queue
- `auth.service.ts` - Authentication endpoints
- `machine.service.ts` - Machine configuration and status
- `content.service.ts` - Content management
- `analytics.service.ts` - Analytics and reporting

### Offline Queue
**How it works:**
1. API requests are intercepted
2. If offline, requests are queued in localStorage
3. When connection restored, queue is processed
4. Failed requests are retried with exponential backoff

**Implementation:**
```typescript
// Automatic queuing
await machineService.syncPrintCount(data);
// If offline, queued automatically
// Syncs when connection restored
```

### Mock API Mode
Set `VITE_ENABLE_MOCK_API=true` for development without backend.

**Mock responses:**
- Simulated latency
- Realistic data structures
- Error scenarios for testing

## 🎯 Component Architecture

### UI Components
Location: `src/components/ui/`

**Base Components:**
- `Button` - All button variants with loading states
- `Card` - Container with hover effects
- `Input` - Form input with validation
- `Modal` - Animated modal dialogs
- `Toggle` - Animated toggle switch
- `Loader` - Loading indicators
- `Alert` - Toast notifications
- `ErrorState` - Error displays with recovery
- `EmptyState` - Empty state placeholders
- `Skeleton` - Loading skeletons
- `ProgressBar` - Progress indicators
- `PageTransition` - Route transition wrapper

### Machine Components
Location: `src/components/machine/`

**Specialized Components:**
- `AdminLockButton` - Password-protected admin access
- `LayoutCard` - Photo layout selection card
- `CountdownTimer` - 3-2-1 countdown animation
- `PhotoPreview` - Captured photo display
- `IdleWarningModal` - Session timeout warning

### Admin Components
Location: `src/components/admin/`

**Dashboard Components:**
- `Sidebar` - Navigation sidebar
- `StatCard` - Statistics display card

## 🔐 Session Management

### Idle Timeout
Location: `src/hooks/useIdleTimeout.ts`

**Features:**
- Configurable timeout duration
- Warning before timeout
- Countdown display
- Activity detection (touch, mouse, keyboard)
- Auto-reset on activity

**Usage:**
```typescript
const { isIdle, showWarning, timeLeft, resetTimer } = useIdleTimeout({
  timeout: 120000,      // 2 minutes
  warningTime: 30000,   // 30 seconds warning
  onIdle: handleIdle,
  onWarning: handleWarning,
});
```

### Session Recovery
**Crash Recovery:**
- FSM state persisted to localStorage
- Session restored if < 5 minutes old
- Terminal states (IDLE, THANK_YOU, ERROR) not restored
- Graceful fallback to IDLE

## 🎭 Mode-Based Logic

### Normal Mode (Paid)
- Payment required before printing
- Full flow: IDLE → SETUP → CAPTURE → PAYMENT → PRINTING → QR → THANK_YOU
- Payment screen displayed
- Separate print counter

### Event Mode (Free)
- No payment required
- Shortened flow: IDLE → SETUP → CAPTURE → PRINTING → QR → THANK_YOU
- Payment screen skipped automatically
- Event-specific branding
- Separate print counter
- Event name and message customization

### Mode Switching
**Admin Portal:**
- Toggle switch in Mode Management page
- Real-time sync to all machines
- Event settings (name, message)
- Print counter reset

**FSM Guards:**
```typescript
// Automatic payment skip in EVENT mode
if (context.mode === 'EVENT') {
  nextState = 'PRINTING'; // Skip PAYMENT
}
```

## 📊 Print Count Tracking

### Counter Types
1. **Total Prints** - All prints across all modes
2. **Event Prints** - Prints in EVENT mode only
3. **Normal Prints** - Prints in NORMAL mode only

### Persistence
- Stored in Zustand with localStorage persistence
- Synced to backend on increment
- Offline-safe with queue
- Atomic increments

### Sync Strategy
```typescript
// Increment locally first (instant feedback)
incrementPrintCount(copies, mode);

// Sync to backend (background)
await syncPrintCount();
// If offline, queued automatically
```

## 🚨 Error Handling

### Error States
**Component-Level:**
- `ErrorState` component with retry/home actions
- Animated error displays
- Clear error messages
- Recovery options

**Global Error Boundary:**
- Catches React errors
- Displays fallback UI
- Logs errors for debugging
- Graceful degradation

### Error Types
1. **Camera Failure** - Permission or hardware issues
2. **Printer Failure** - Printer offline or paper jam
3. **Network Failure** - API timeout or offline
4. **Payment Failure** - Payment processing error
5. **QR Generation Failure** - QR code creation error

### Recovery Strategies
- **Retry** - Attempt operation again
- **Skip** - Continue without failed operation
- **Reset** - Return to IDLE state
- **Offline Mode** - Queue for later sync

## 🔄 Routing Architecture

### Route Structure
```
/                    → Redirect to /machine
/machine/*           → Machine Software App
  /machine           → Idle Screen
  /machine/setup     → Layout Selection
  /machine/capture   → Photo Capture
  /machine/payment   → Payment (NORMAL mode)
  /machine/printing  → Printing Progress
  /machine/qr        → QR Code Display
  /machine/thankyou  → Thank You Screen

/admin/*             → Admin Portal App
  /admin             → Dashboard
  /admin/mode        → Mode Management
  /admin/content     → Content Management (placeholder)
  /admin/layouts     → Layout Builder (placeholder)
  /admin/machines    → Machine Management (placeholder)
  /admin/analytics   → Analytics (placeholder)
```

### Route Guards
- Admin routes require authentication
- Machine routes are public
- FSM prevents illegal navigation
- Session guards for refresh recovery

## 🎨 Animation Strategy

### Performance Guidelines
- Target 60 FPS on all animations
- Use `transform` and `opacity` for GPU acceleration
- Avoid animating `width`, `height`, `top`, `left`
- Use `will-change` sparingly
- Debounce/throttle expensive operations

### Animation Hierarchy
1. **Micro-interactions** (< 200ms) - Button taps, toggles
2. **Transitions** (200-500ms) - Page changes, modals
3. **Feedback** (500-1000ms) - Success states, errors
4. **Ambient** (> 1000ms) - Pulsing, idle animations

### Accessibility
- Respect `prefers-reduced-motion`
- Provide non-animated alternatives
- Ensure animations don't cause seizures
- Maintain usability without animations

## 🔧 Development Workflow

### Local Development
```bash
npm install          # Install dependencies
npm run dev          # Start dev server (port 3000)
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Environment Variables
```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_MACHINE_ID=machine-001
VITE_ENABLE_MOCK_API=true
```

### Testing Strategy
1. **Unit Tests** - Component logic (future)
2. **Integration Tests** - API services (future)
3. **E2E Tests** - Full user flows (future)
4. **Manual Testing** - Touch interactions, animations

## 📈 Performance Optimization

### Code Splitting
- Lazy-load admin routes
- Dynamic imports for heavy components
- Route-based splitting

### Memoization
```typescript
const MemoizedComponent = React.memo(Component);
const memoizedValue = useMemo(() => expensiveCalc(), [deps]);
const memoizedCallback = useCallback(() => {}, [deps]);
```

### Image Optimization
- Use WebP format
- Lazy load images
- Responsive images with srcset
- Compress videos

### Bundle Optimization
- Tree-shaking unused code
- Minification in production
- Gzip/Brotli compression
- CDN for static assets

## 🔒 Security Considerations

### Admin Access
- Password-protected admin lock
- Token-based authentication
- Secure session storage
- HTTPS in production

### Data Protection
- No sensitive data in localStorage
- Sanitize user inputs
- CORS configuration
- Rate limiting (backend)

### Kiosk Security
- Disable browser shortcuts
- Prevent URL bar access
- Block external navigation
- Auto-logout on idle

## 📱 Touch Optimization

### Touch Targets
- Minimum 44x44px (Apple HIG)
- Adequate spacing between targets
- Visual feedback on touch
- No accidental double-taps

### Gestures
- Tap - Primary interaction
- Long press - Secondary actions
- Swipe - Disabled (prevent accidental navigation)
- Pinch - Disabled (prevent zoom)

### Haptic Feedback
- Consider vibration API for touch feedback
- Subtle feedback on button taps
- Error vibration patterns

## 🚀 Deployment

### Build Process
```bash
npm run build
# Output: dist/ directory
```

### Hosting Options
1. **Static Hosting** - Vercel, Netlify, AWS S3
2. **Kiosk Device** - Electron app or fullscreen browser
3. **Docker** - Containerized deployment

### Environment Configuration
- Production API URL
- Machine-specific IDs
- Feature flags
- Analytics tracking

## 📚 Further Reading

- [PRODUCTION_CHECKLIST.md](./PRODUCTION_CHECKLIST.md) - Deployment checklist
- [README.md](./README.md) - Getting started guide
- [Framer Motion Docs](https://www.framer.com/motion/)
- [Zustand Docs](https://zustand-demo.pmnd.rs/)
- [React Router Docs](https://reactrouter.com/)

---

**Last Updated:** December 2024  
**Version:** 1.0.0  
**Maintainer:** Pixxel8 Team
