# Backend Integration Guide

## 🔌 API Integration Overview

The Pixxel8 frontend includes a fully typed, production-ready API service layer designed for seamless backend integration.

## 📋 API Endpoints Required

### Authentication

#### POST `/auth/login`
**Request:**
```typescript
{
  email: string;
  password: string;
}
```

**Response:**
```typescript
{
  success: boolean;
  data: {
    token: string;
    user: {
      id: string;
      email: string;
      name: string;
      role: 'ADMIN' | 'OPERATOR';
    };
  };
}
```

#### POST `/auth/logout`
**Headers:** `Authorization: Bearer {token}`

**Response:**
```typescript
{
  success: boolean;
  message: string;
}
```

#### POST `/auth/refresh`
**Headers:** `Authorization: Bearer {token}`

**Response:**
```typescript
{
  success: boolean;
  data: {
    token: string;
  };
}
```

---

### Machine Configuration

#### GET `/machine/config`
**Query:** `?machineId={id}`

**Response:**
```typescript
{
  success: boolean;
  data: {
    machineId: string;
    mode: 'NORMAL' | 'EVENT';
    qrEnabled: boolean;
    thankYouMessage?: string;
    eventName?: string;
    eventMessage?: string;
    promotionalImageUrl?: string;
    contactDetails?: string;
  };
}
```

#### PUT `/machine/mode`
**Request:**
```typescript
{
  machineId: string;
  mode: 'NORMAL' | 'EVENT';
  eventName?: string;
  eventMessage?: string;
}
```

**Response:**
```typescript
{
  success: boolean;
  message: string;
}
```

---

### Print Count Synchronization

#### POST `/machine/print-count`
**Request:**
```typescript
{
  machineId: string;
  totalPrints: number;
  eventPrints: number;
  normalPrints: number;
  timestamp: number;
}
```

**Response:**
```typescript
{
  success: boolean;
  message: string;
}
```

**Notes:**
- Called after each print job
- Includes breakdown by mode
- Timestamp for sync verification
- Idempotent (safe to retry)

---

### Machine Status

#### POST `/machine/status`
**Request:**
```typescript
{
  machineId: string;
  status: 'ONLINE' | 'OFFLINE' | 'MAINTENANCE';
  lastSeen: number;
  currentSession?: string;
}
```

**Response:**
```typescript
{
  success: boolean;
  message: string;
}
```

---

### Content Management

#### POST `/content/update`
**Request:**
```typescript
{
  machineId: string;
  qrEnabled: boolean;
  thankYouMessage?: string;
  promotionalImageUrl?: string;
  contactDetails?: string;
}
```

**Response:**
```typescript
{
  success: boolean;
  message: string;
}
```

#### POST `/content/upload/video`
**Content-Type:** `multipart/form-data`

**Form Data:**
- `file`: Video file (MP4 recommended)
- `machineId`: string
- `type`: 'intro' | 'promotional'

**Response:**
```typescript
{
  success: boolean;
  data: {
    url: string;
  };
}
```

---

### Analytics

#### GET `/analytics`
**Query Parameters:**
- `machineId`: string (optional, filter by machine)
- `startDate`: ISO date string (optional)
- `endDate`: ISO date string (optional)
- `mode`: 'NORMAL' | 'EVENT' (optional)

**Response:**
```typescript
{
  success: boolean;
  data: {
    totalPrints: number;
    eventPrints: number;
    normalPrints: number;
    totalRevenue: number;
    averageSessionTime: number;
    popularLayouts: Array<{
      layoutId: string;
      name: string;
      count: number;
    }>;
    dailyStats: Array<{
      date: string;
      prints: number;
      revenue: number;
    }>;
  };
}
```

#### GET `/analytics/export`
**Query:** Same as `/analytics`

**Response:** CSV file download

---

### Machine Management

#### GET `/machines`
**Response:**
```typescript
{
  success: boolean;
  data: Array<{
    id: string;
    name: string;
    location: string;
    status: 'ONLINE' | 'OFFLINE' | 'MAINTENANCE';
    mode: 'NORMAL' | 'EVENT';
    lastSeen: number;
    printStats: {
      totalPrints: number;
      eventPrints: number;
      normalPrints: number;
    };
  }>;
}
```

---

## 🔐 Authentication Flow

### Token Management
1. Frontend stores JWT token in localStorage
2. Token included in `Authorization` header for protected routes
3. Token refresh handled automatically before expiry
4. Logout clears token from storage

### Implementation
```typescript
// Automatic token injection
const response = await apiService.get('/protected-endpoint');
// Token added automatically from localStorage
```

---

## 🔄 Offline Queue System

### How It Works
1. **Online:** Requests sent immediately to backend
2. **Offline:** Requests queued in localStorage
3. **Reconnect:** Queue processed automatically
4. **Retry:** Failed requests retried with exponential backoff

### Queue Structure
```typescript
{
  id: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: any;
  timestamp: number;
  retries: number;
}
```

### Critical Endpoints for Queuing
- `/machine/print-count` - Must not lose print data
- `/machine/status` - Important for monitoring
- `/machine/mode` - Mode changes must sync

### Non-Critical (Skip if Offline)
- `/analytics` - Can be fetched later
- `/machines` - Real-time data, stale is useless

---

## ⚡ Real-Time Sync Requirements

### Mode Changes
**Requirement:** All machines must receive mode updates within 5 seconds

**Options:**
1. **WebSocket:** Recommended for real-time push
2. **Polling:** Fallback, check every 30 seconds
3. **Server-Sent Events:** Alternative to WebSocket

**Frontend Implementation:**
```typescript
// WebSocket example (to be implemented)
const ws = new WebSocket('ws://api.example.com/machine/subscribe');
ws.onmessage = (event) => {
  const { type, data } = JSON.parse(event.data);
  if (type === 'MODE_UPDATE') {
    machineStore.setMode(data.mode);
  }
};
```

---

## 🛡️ Error Handling

### Error Response Format
```typescript
{
  success: false;
  error: string;        // Error code (e.g., 'UNAUTHORIZED')
  message: string;      // Human-readable message
}
```

### HTTP Status Codes
- `200` - Success
- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid/expired token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error
- `503` - Service Unavailable

### Frontend Handling
```typescript
try {
  const response = await apiService.post('/endpoint', data);
  // Handle success
} catch (error) {
  if (error.status === 401) {
    // Redirect to login
  } else if (error.status === 503) {
    // Queue for retry
  } else {
    // Show error message
  }
}
```

---

## 🔍 Request/Response Logging

### Backend Requirements
Log the following for debugging:
- Request method and endpoint
- Request body (sanitized)
- Response status
- Response time
- Machine ID (from request)
- User ID (if authenticated)
- Timestamp

### Frontend Logging
Currently logs to console in development:
```typescript
console.log('[API]', method, endpoint, data);
```

**Production:** Consider sending logs to monitoring service (Sentry, LogRocket, etc.)

---

## 🚀 Performance Requirements

### Response Time Targets
- Authentication: < 500ms
- Config retrieval: < 300ms
- Print count sync: < 1000ms (non-blocking)
- Analytics: < 2000ms

### Caching Strategy
**Backend should cache:**
- Machine configurations (5 minutes)
- Layout data (1 hour)
- Analytics aggregations (15 minutes)

**Frontend caches:**
- Machine config in Zustand store
- Print counts in localStorage
- User session in localStorage

---

## 🧪 Testing the Integration

### Mock API Mode
Set `VITE_ENABLE_MOCK_API=true` to test without backend.

### Testing Checklist
- [ ] Authentication flow works
- [ ] Mode switching syncs correctly
- [ ] Print counts increment and sync
- [ ] Offline queue processes correctly
- [ ] Error responses handled gracefully
- [ ] Token refresh works automatically
- [ ] Logout clears session properly

### Example Test Scenarios

**Scenario 1: Normal Operation**
1. Machine starts → GET `/machine/config`
2. User completes session → POST `/machine/print-count`
3. Admin changes mode → PUT `/machine/mode`
4. Machine receives update → Mode switches

**Scenario 2: Offline Operation**
1. Machine loses connection
2. User completes session → Queued
3. Connection restored → Queue processes
4. Backend receives print count

**Scenario 3: Token Expiry**
1. Token expires during session
2. Next API call fails with 401
3. Frontend refreshes token automatically
4. Original request retried with new token

---

## 📊 Database Schema Recommendations

### Machines Table
```sql
CREATE TABLE machines (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  status ENUM('ONLINE', 'OFFLINE', 'MAINTENANCE'),
  mode ENUM('NORMAL', 'EVENT'),
  last_seen TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Print Jobs Table
```sql
CREATE TABLE print_jobs (
  id VARCHAR(255) PRIMARY KEY,
  machine_id VARCHAR(255) REFERENCES machines(id),
  session_id VARCHAR(255),
  mode ENUM('NORMAL', 'EVENT'),
  layout_id VARCHAR(255),
  copies INT,
  price DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Print Stats Table (Aggregated)
```sql
CREATE TABLE print_stats (
  machine_id VARCHAR(255) REFERENCES machines(id),
  date DATE,
  total_prints INT DEFAULT 0,
  event_prints INT DEFAULT 0,
  normal_prints INT DEFAULT 0,
  total_revenue DECIMAL(10, 2) DEFAULT 0,
  PRIMARY KEY (machine_id, date)
);
```

---

## 🔧 Environment Configuration

### Backend Environment Variables
```env
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/pixxel8

# JWT
JWT_SECRET=your-secret-key-here
JWT_EXPIRY=24h

# CORS
ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com

# File Upload
MAX_FILE_SIZE=50MB
UPLOAD_DIR=/var/uploads/pixxel8
```

### Frontend Environment Variables
```env
# API
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_MACHINE_ID=machine-001
VITE_ENABLE_MOCK_API=false

# Optional
VITE_WS_URL=wss://api.yourdomain.com/ws
VITE_SENTRY_DSN=https://...
```

---

## 📞 Support & Troubleshooting

### Common Issues

**Issue:** Print counts not syncing
**Solution:** Check offline queue in localStorage, verify network connectivity

**Issue:** Mode changes not reflecting
**Solution:** Implement WebSocket or reduce polling interval

**Issue:** Token expiry errors
**Solution:** Ensure token refresh endpoint works, check token expiry time

**Issue:** Slow API responses
**Solution:** Add caching, optimize database queries, use CDN for static assets

### Debug Mode
Enable detailed logging:
```typescript
localStorage.setItem('debug', 'api:*');
```

---

## ✅ Integration Checklist

- [ ] All endpoints implemented
- [ ] Authentication flow tested
- [ ] Offline queue verified
- [ ] Error handling confirmed
- [ ] Token refresh working
- [ ] CORS configured correctly
- [ ] Database schema created
- [ ] Performance targets met
- [ ] Logging implemented
- [ ] Security reviewed

---

**Questions?** Contact the frontend team for clarification on any integration points.
