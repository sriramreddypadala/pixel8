/**
 * MOCK BOOTH DATA
 * Sample booth data for development
 */

import type { BoothInfo } from '@/types/booth.types';

export const MOCK_BOOTHS: BoothInfo[] = [
  {
    identity: {
      boothId: 'booth-001',
      boothName: 'Main Hall Booth',
      installDate: '2024-01-15T10:00:00Z',
    },
    config: {
      boothId: 'booth-001',
      mode: 'event',
      activeGridId: 'grid-2x2-classic',
      price: 100,
      theme: 'dark-premium',
      updatedAt: '2024-01-15T10:00:00Z',
    },
    status: {
      boothId: 'booth-001',
      status: 'online',
      currentMode: 'event',
      activeGridId: 'grid-2x2-classic',
      isInSession: false,
      lastHeartbeat: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
      hasPendingConfig: false,
    },
    stats: {
      totalSessions: 487,
      todaySessions: 23,
      lastSessionTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    },
  },
  {
    identity: {
      boothId: 'booth-002',
      boothName: 'VIP Lounge Booth',
      installDate: '2024-01-16T11:00:00Z',
    },
    config: {
      boothId: 'booth-002',
      mode: 'normal',
      activeGridId: 'grid-3x3-grid',
      price: 150,
      theme: 'dark-premium',
      updatedAt: '2024-01-16T11:00:00Z',
    },
    status: {
      boothId: 'booth-002',
      status: 'in-session',
      currentMode: 'normal',
      activeGridId: 'grid-3x3-grid',
      isInSession: true,
      sessionStartTime: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      lastHeartbeat: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
      hasPendingConfig: true,
    },
    stats: {
      totalSessions: 356,
      todaySessions: 18,
      lastSessionTime: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    },
  },
  {
    identity: {
      boothId: 'booth-003',
      boothName: 'Garden Booth',
      installDate: '2024-01-17T12:00:00Z',
    },
    config: {
      boothId: 'booth-003',
      mode: 'event',
      activeGridId: 'grid-strip',
      price: 80,
      theme: 'dark-premium',
      updatedAt: '2024-01-17T12:00:00Z',
    },
    status: {
      boothId: 'booth-003',
      status: 'online',
      currentMode: 'event',
      activeGridId: 'grid-strip',
      isInSession: false,
      lastHeartbeat: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      hasPendingConfig: false,
    },
    stats: {
      totalSessions: 289,
      todaySessions: 15,
      lastSessionTime: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    },
  },
  {
    identity: {
      boothId: 'booth-004',
      boothName: 'Rooftop Booth',
      installDate: '2024-01-18T13:00:00Z',
    },
    config: {
      boothId: 'booth-004',
      mode: 'normal',
      activeGridId: 'grid-2x2-classic',
      price: 100,
      theme: 'dark-premium',
      updatedAt: '2024-01-18T13:00:00Z',
    },
    status: {
      boothId: 'booth-004',
      status: 'offline',
      currentMode: 'normal',
      activeGridId: 'grid-2x2-classic',
      isInSession: false,
      lastHeartbeat: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      hasPendingConfig: false,
    },
    stats: {
      totalSessions: 115,
      todaySessions: 0,
      lastSessionTime: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(),
    },
  },
];
