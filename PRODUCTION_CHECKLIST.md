# Pixxel8 Production Deployment Checklist

## 🚀 Pre-Deployment

### Environment Configuration
- [ ] Copy `.env.example` to `.env`
- [ ] Set `VITE_API_BASE_URL` to production backend URL
- [ ] Set `VITE_MACHINE_ID` to unique machine identifier
- [ ] Set `VITE_ENABLE_MOCK_API=false` for production
- [ ] Verify all environment variables are correct

### Build & Test
- [ ] Run `npm install` to ensure all dependencies are installed
- [ ] Run `npm run build` to create production build
- [ ] Test production build locally with `npm run preview`
- [ ] Verify no console errors in production build
- [ ] Test all machine flows (Idle → Thank You)
- [ ] Test admin portal authentication and features
- [ ] Verify offline functionality works correctly
- [ ] Test mode switching (Normal ↔ Event)

## 🖥️ Kiosk Hardware Setup

### Browser Configuration (Chrome/Edge Recommended)

#### Launch Flags for Kiosk Mode
```bash
# Windows
chrome.exe --kiosk "http://localhost:3000/machine" --disable-pinch --overscroll-history-navigation=0

# Linux
chromium-browser --kiosk "http://localhost:3000/machine" --disable-pinch --overscroll-history-navigation=0

# macOS
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --kiosk "http://localhost:3000/machine" --disable-pinch
```

#### Additional Recommended Flags
```bash
--disable-infobars                    # Hide "Chrome is being controlled" banner
--disable-session-crashed-bubble      # Disable crash recovery prompt
--disable-restore-session-state       # Don't restore previous session
--disable-background-timer-throttling # Prevent timer throttling
--disable-backgrounding-occluded-windows
--disable-renderer-backgrounding
--disable-features=TranslateUI        # Disable translate popup
--no-first-run                        # Skip first run experience
--disable-component-update            # Disable auto-updates
--autoplay-policy=no-user-gesture-required # Allow video autoplay
```

### System Configuration

#### Disable Sleep/Screensaver
**Windows:**
```powershell
powercfg /change monitor-timeout-ac 0
powercfg /change standby-timeout-ac 0
```

**Linux:**
```bash
xset s off
xset -dpms
xset s noblank
```

**macOS:**
```bash
sudo pmset -a displaysleep 0
sudo pmset -a sleep 0
```

#### Disable Keyboard Shortcuts
- Disable Alt+F4, Ctrl+W, Ctrl+Q (close window)
- Disable F11 (fullscreen toggle)
- Disable Ctrl+Shift+I (DevTools)
- Disable right-click context menu

#### Auto-Start on Boot
**Windows (Task Scheduler):**
1. Create task to run Chrome with kiosk flags on login
2. Set to run with highest privileges
3. Configure to restart on failure

**Linux (systemd):**
```ini
[Unit]
Description=Pixxel8 Kiosk
After=graphical.target

[Service]
Type=simple
User=kiosk
ExecStart=/usr/bin/chromium-browser --kiosk http://localhost:3000/machine
Restart=always

[Install]
WantedBy=graphical.target
```

## 🌐 Network & Connectivity

### Offline Resilience
- [ ] Verify local storage persistence works
- [ ] Test offline queue functionality
- [ ] Confirm print count syncs when connection restored
- [ ] Test session recovery after network interruption

### Cache Strategy
- [ ] Configure service worker for offline assets (if needed)
- [ ] Set appropriate cache headers for static assets
- [ ] Verify images and videos are cached locally

## 🔒 Security

### Admin Access
- [ ] Change default admin password from `admin123`
- [ ] Restrict admin portal access to internal network only
- [ ] Enable HTTPS for production deployment
- [ ] Configure CORS properly on backend

### Kiosk Lockdown
- [ ] Disable browser navigation (back/forward)
- [ ] Prevent URL bar access
- [ ] Disable file downloads
- [ ] Block external navigation
- [ ] Implement session timeout with auto-reset

## 🎨 UI/UX Verification

### Machine Software
- [ ] Idle screen video plays smoothly
- [ ] Touch interactions are responsive (no lag)
- [ ] Layout selection cards animate correctly
- [ ] Photo capture countdown works
- [ ] Payment screen displays correctly (Normal mode)
- [ ] Printing animation is smooth
- [ ] QR code generates successfully
- [ ] Thank you screen auto-resets to idle

### Admin Portal
- [ ] Login authentication works
- [ ] Dashboard loads all statistics
- [ ] Mode toggle switches correctly
- [ ] All navigation links work
- [ ] Dark mode toggle functions properly
- [ ] Logout clears session correctly

## 📊 Performance

### Optimization Checks
- [ ] Page load time < 2 seconds
- [ ] Animations run at 60 FPS
- [ ] No memory leaks during extended use
- [ ] Images are optimized (WebP format recommended)
- [ ] Video files are compressed appropriately
- [ ] Bundle size is optimized (< 1MB gzipped)

### Hardware Requirements
- **Minimum:**
  - CPU: Dual-core 2.0 GHz
  - RAM: 4 GB
  - Storage: 10 GB available
  - Display: 1920x1080 touchscreen
  - Network: 10 Mbps (for backend sync)

- **Recommended:**
  - CPU: Quad-core 2.5 GHz
  - RAM: 8 GB
  - Storage: 20 GB SSD
  - Display: 1920x1080 or higher touchscreen
  - Network: 50 Mbps

## 🔧 Backend Integration

### API Endpoints Verification
- [ ] `/auth/login` - Authentication works
- [ ] `/machine/config` - Config retrieval successful
- [ ] `/machine/mode` - Mode updates sync correctly
- [ ] `/machine/print-count` - Print count syncs properly
- [ ] `/content/update` - Content updates work
- [ ] `/analytics` - Analytics data retrieves correctly

### Error Handling
- [ ] Test API timeout scenarios
- [ ] Verify retry logic works correctly
- [ ] Confirm graceful degradation on API failures
- [ ] Test offline queue processing

## 📱 Touch Optimization

### Touch Targets
- [ ] All buttons are minimum 44x44px
- [ ] Touch feedback is immediate (< 100ms)
- [ ] No accidental double-taps
- [ ] Swipe gestures disabled where not needed
- [ ] Pinch-to-zoom disabled

### Accessibility
- [ ] High contrast mode supported
- [ ] Font sizes are readable from 2 feet away
- [ ] Error messages are clear and actionable
- [ ] Success states are visually obvious

## 🐛 Known Issues & Workarounds

### Browser-Specific
- **Chrome:** May show "Restore pages?" on crash - disable with flags
- **Edge:** Similar to Chrome, use same kiosk flags
- **Firefox:** Not recommended for kiosk mode

### Hardware-Specific
- **Low-end devices:** Reduce animation complexity if needed
- **Touchscreen calibration:** May need OS-level calibration
- **Network interruptions:** Ensure offline queue is working

## 📝 Monitoring & Maintenance

### Daily Checks
- [ ] Verify machine is online and responsive
- [ ] Check print count accuracy
- [ ] Review error logs (if backend provides)
- [ ] Confirm payment processing (Normal mode)

### Weekly Maintenance
- [ ] Clear browser cache if performance degrades
- [ ] Restart kiosk system
- [ ] Update content/layouts if needed
- [ ] Review analytics data

### Monthly Updates
- [ ] Check for frontend updates
- [ ] Update browser to latest stable version
- [ ] Review and optimize performance
- [ ] Backup configuration and data

## 🆘 Troubleshooting

### Machine Won't Start
1. Check network connectivity
2. Verify environment variables
3. Check browser console for errors
4. Restart browser/system

### Photos Not Capturing
1. Check camera permissions
2. Verify camera hardware connection
3. Test with different browser
4. Check console for camera errors

### Printing Issues
1. Verify printer connection
2. Check print queue
3. Test printer with other software
4. Review printer driver logs

### Admin Portal Not Loading
1. Verify correct URL
2. Check authentication credentials
3. Clear browser cache
4. Check network connectivity to backend

## ✅ Final Sign-Off

- [ ] All checklist items completed
- [ ] System tested end-to-end
- [ ] Staff trained on operation
- [ ] Emergency contact information posted
- [ ] Backup plan documented
- [ ] Go-live date scheduled

---

**Deployment Date:** _______________  
**Deployed By:** _______________  
**Verified By:** _______________  
**Notes:** _______________
