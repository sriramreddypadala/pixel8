// ====================================================
// GRID SYSTEM TYPES - PRODUCTION READY
// ====================================================

export type AspectRatio = '4:6' | '2:3' | '1:1' | '16:9';

export type GridSlot = {
  id: string;
  x: number;        // percentage (0-100)
  y: number;        // percentage (0-100)
  width: number;    // percentage (0-100)
  height: number;   // percentage (0-100)
  radius?: number;  // border radius in pixels
  zIndex?: number;  // layer order
};

export type GridTemplate = {
  id: string;
  name: string;
  stillCount: number;    // Number of photos required
  price: number;         // Price in INR
  aspectRatio: AspectRatio;
  canvasWidth: number;   // pixels at 300 DPI
  canvasHeight: number;  // pixels at 300 DPI
  previewType: 'grid' | 'strip' | 'collage';
  backgroundColor?: string;
  backgroundImage?: string;
  logo?: {
    url: string;
    x: number;      // percentage
    y: number;      // percentage
    width: number;  // percentage
    height: number; // percentage
  };
  slots: GridSlot[];
  isEnabled: boolean;    // Admin can disable
  sortOrder: number;     // Display order
  createdAt: number;
  updatedAt: number;
};

export type GridRenderOptions = {
  dpi?: number;           // default 300
  quality?: number;       // 0-1, default 0.95
  format?: 'png' | 'jpeg';
  includeBackground?: boolean;
  includeLogo?: boolean;
};

export type GridPreviewData = {
  gridId: string;
  photos: string[];  // base64 data URLs
  timestamp: number;
};

// ====================================================
// ASPECT RATIO CONFIGURATIONS
// ====================================================

export const ASPECT_RATIOS: Record<AspectRatio, { width: number; height: number; label: string }> = {
  '4:6': { width: 4, height: 6, label: '4x6 Photo Print' },
  '2:3': { width: 2, height: 3, label: '2x3 Wallet Size' },
  '1:1': { width: 1, height: 1, label: 'Square (Instagram)' },
  '16:9': { width: 16, height: 9, label: 'Widescreen' },
};

// ====================================================
// DPI CONFIGURATIONS
// ====================================================

export const DPI_PRESETS = {
  SCREEN: 72,
  PRINT_DRAFT: 150,
  PRINT_STANDARD: 300,
  PRINT_HIGH: 600,
} as const;

// ====================================================
// MOCK GRID TEMPLATES FOR TESTING
// ====================================================

export const MOCK_GRID_TEMPLATES: GridTemplate[] = [
  // 1 Still Options
  {
    id: 'single_portrait',
    name: 'Single Portrait',
    stillCount: 1,
    price: 50,
    aspectRatio: '4:6',
    canvasWidth: 1200,
    canvasHeight: 1800,
    previewType: 'grid',
    backgroundColor: '#ffffff',
    logo: { url: '/logo.png', x: 42.5, y: 2, width: 15, height: 8 },
    slots: [
      { id: 's1', x: 5, y: 10, width: 90, height: 85, radius: 16, zIndex: 1 },
    ],
    isEnabled: true,
    sortOrder: 1,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'single_landscape',
    name: 'Single Landscape',
    stillCount: 1,
    price: 50,
    aspectRatio: '2:3',
    canvasWidth: 1200,
    canvasHeight: 1800,
    previewType: 'grid',
    backgroundColor: '#f8f9fa',
    slots: [
      { id: 's1', x: 5, y: 25, width: 90, height: 50, radius: 12, zIndex: 1 },
    ],
    isEnabled: true,
    sortOrder: 2,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },

  // 2 Still Options
  {
    id: 'split_2_vertical',
    name: '2 Vertical Split',
    stillCount: 2,
    price: 70,
    aspectRatio: '4:6',
    canvasWidth: 1200,
    canvasHeight: 1800,
    previewType: 'grid',
    backgroundColor: '#ffffff',
    logo: { url: '/logo.png', x: 42.5, y: 2, width: 15, height: 8 },
    slots: [
      { id: 's1', x: 5, y: 12, width: 42, height: 82, radius: 12, zIndex: 1 },
      { id: 's2', x: 53, y: 12, width: 42, height: 82, radius: 12, zIndex: 1 },
    ],
    isEnabled: true,
    sortOrder: 3,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'split_2_horizontal',
    name: '2 Horizontal Split',
    stillCount: 2,
    price: 70,
    aspectRatio: '4:6',
    canvasWidth: 1200,
    canvasHeight: 1800,
    previewType: 'grid',
    backgroundColor: '#ffffff',
    slots: [
      { id: 's1', x: 5, y: 5, width: 90, height: 43, radius: 12, zIndex: 1 },
      { id: 's2', x: 5, y: 52, width: 90, height: 43, radius: 12, zIndex: 1 },
    ],
    isEnabled: true,
    sortOrder: 4,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },

  // 4 Still Options
  {
    id: 'grid_2x2_classic',
    name: '2×2 Classic',
    stillCount: 4,
    price: 100,
    aspectRatio: '4:6',
    canvasWidth: 1200,
    canvasHeight: 1800,
    previewType: 'grid',
    backgroundColor: '#ffffff',
    logo: { url: '/logo.png', x: 42.5, y: 2, width: 15, height: 8 },
    slots: [
      { id: 's1', x: 5, y: 12, width: 42, height: 38, radius: 12, zIndex: 1 },
      { id: 's2', x: 53, y: 12, width: 42, height: 38, radius: 12, zIndex: 1 },
      { id: 's3', x: 5, y: 56, width: 42, height: 38, radius: 12, zIndex: 1 },
      { id: 's4', x: 53, y: 56, width: 42, height: 38, radius: 12, zIndex: 1 },
    ],
    isEnabled: true,
    sortOrder: 5,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'strip_4_vertical',
    name: 'Photo Strip',
    stillCount: 4,
    price: 80,
    aspectRatio: '4:6',
    canvasWidth: 1200,
    canvasHeight: 1800,
    previewType: 'strip',
    backgroundColor: '#ffffff',
    logo: { url: '/logo.png', x: 42.5, y: 1, width: 15, height: 5 },
    slots: [
      { id: 's1', x: 10, y: 8, width: 80, height: 19, radius: 8, zIndex: 1 },
      { id: 's2', x: 10, y: 30, width: 80, height: 19, radius: 8, zIndex: 1 },
      { id: 's3', x: 10, y: 52, width: 80, height: 19, radius: 8, zIndex: 1 },
      { id: 's4', x: 10, y: 74, width: 80, height: 19, radius: 8, zIndex: 1 },
    ],
    isEnabled: true,
    sortOrder: 6,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'collage_4_overlap',
    name: 'Overlapping Collage',
    stillCount: 4,
    price: 90,
    aspectRatio: '4:6',
    canvasWidth: 1200,
    canvasHeight: 1800,
    previewType: 'collage',
    backgroundColor: '#fef3c7',
    slots: [
      { id: 's1', x: 5, y: 10, width: 50, height: 40, radius: 20, zIndex: 1 },
      { id: 's2', x: 45, y: 5, width: 50, height: 40, radius: 20, zIndex: 2 },
      { id: 's3', x: 5, y: 55, width: 50, height: 40, radius: 20, zIndex: 3 },
      { id: 's4', x: 45, y: 50, width: 50, height: 40, radius: 20, zIndex: 4 },
    ],
    isEnabled: true,
    sortOrder: 7,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },

  // 6 Still Options
  {
    id: 'grid_3x2',
    name: '3×2 Grid',
    stillCount: 6,
    price: 120,
    aspectRatio: '4:6',
    canvasWidth: 1200,
    canvasHeight: 1800,
    previewType: 'grid',
    backgroundColor: '#ffffff',
    logo: { url: '/logo.png', x: 42.5, y: 1, width: 15, height: 5 },
    slots: [
      { id: 's1', x: 5, y: 8, width: 28, height: 26, radius: 8, zIndex: 1 },
      { id: 's2', x: 36, y: 8, width: 28, height: 26, radius: 8, zIndex: 1 },
      { id: 's3', x: 67, y: 8, width: 28, height: 26, radius: 8, zIndex: 1 },
      { id: 's4', x: 5, y: 37, width: 28, height: 26, radius: 8, zIndex: 1 },
      { id: 's5', x: 36, y: 37, width: 28, height: 26, radius: 8, zIndex: 1 },
      { id: 's6', x: 67, y: 37, width: 28, height: 26, radius: 8, zIndex: 1 },
    ],
    isEnabled: true,
    sortOrder: 8,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'film_strip_6',
    name: 'Film Strip Style',
    stillCount: 6,
    price: 110,
    aspectRatio: '4:6',
    canvasWidth: 1200,
    canvasHeight: 1800,
    previewType: 'strip',
    backgroundColor: '#1f2937',
    slots: [
      { id: 's1', x: 10, y: 5, width: 80, height: 13, radius: 6, zIndex: 1 },
      { id: 's2', x: 10, y: 20, width: 80, height: 13, radius: 6, zIndex: 1 },
      { id: 's3', x: 10, y: 35, width: 80, height: 13, radius: 6, zIndex: 1 },
      { id: 's4', x: 10, y: 50, width: 80, height: 13, radius: 6, zIndex: 1 },
      { id: 's5', x: 10, y: 65, width: 80, height: 13, radius: 6, zIndex: 1 },
      { id: 's6', x: 10, y: 80, width: 80, height: 13, radius: 6, zIndex: 1 },
    ],
    isEnabled: true,
    sortOrder: 9,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },

  // 9 Still Options
  {
    id: 'grid_3x3',
    name: '3×3 Grid',
    stillCount: 9,
    price: 150,
    aspectRatio: '4:6',
    canvasWidth: 1200,
    canvasHeight: 1800,
    previewType: 'grid',
    backgroundColor: '#ffffff',
    logo: { url: '/logo.png', x: 42.5, y: 1, width: 15, height: 4 },
    slots: [
      { id: 's1', x: 5, y: 6, width: 28, height: 26, radius: 8, zIndex: 1 },
      { id: 's2', x: 36, y: 6, width: 28, height: 26, radius: 8, zIndex: 1 },
      { id: 's3', x: 67, y: 6, width: 28, height: 26, radius: 8, zIndex: 1 },
      { id: 's4', x: 5, y: 35, width: 28, height: 26, radius: 8, zIndex: 1 },
      { id: 's5', x: 36, y: 35, width: 28, height: 26, radius: 8, zIndex: 1 },
      { id: 's6', x: 67, y: 35, width: 28, height: 26, radius: 8, zIndex: 1 },
      { id: 's7', x: 5, y: 64, width: 28, height: 26, radius: 8, zIndex: 1 },
      { id: 's8', x: 36, y: 64, width: 28, height: 26, radius: 8, zIndex: 1 },
      { id: 's9', x: 67, y: 64, width: 28, height: 26, radius: 8, zIndex: 1 },
    ],
    isEnabled: true,
    sortOrder: 10,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];
