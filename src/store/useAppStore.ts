import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { RoomConfig, FurnitureModule, MaterialConfig, Niche, ModuleType } from '@/types';

interface AppState {
  // View mode
  viewMode: '2D' | '3D';
  setViewMode: (mode: '2D' | '3D') => void;

  // 3D Camera Presets: 'iso' | 'front' | 'top' | 'left' | 'right'
  cameraPreset: 'iso' | 'front' | 'top' | 'left' | 'right';
  setCameraPreset: (preset: 'iso' | 'front' | 'top' | 'left' | 'right') => void;

  // Radial Context Menu State
  contextMenu: { x: number; y: number; open: boolean } | null;
  setContextMenu: (menu: { x: number; y: number; open: boolean } | null) => void;

  // 2D Plan View Rotation angle (0, 90, 180, 270)
  planRotation: number;
  rotatePlanClockwise: () => void;
  rotatePlanCounterClockwise: () => void;
  resetPlanRotation: () => void;

  // Room
  room: RoomConfig;
  updateRoom: (partial: Partial<RoomConfig>) => void;
  addNiche: (niche: Omit<Niche, 'id'>) => void;
  removeNiche: (id: string) => void;
  setBackgroundImage: (url?: string) => void;

  // Modules
  modules: FurnitureModule[];
  selectedModuleId: string | null;
  setSelectedModuleId: (id: string | null) => void;
  addModule: (type: ModuleType) => void;
  updateModule: (id: string, partial: Partial<FurnitureModule>) => void;
  removeModule: (id: string) => void;

  // Global default materials
  defaultCarcassMaterial: MaterialConfig;
  defaultFacadeMaterial: MaterialConfig;
  setDefaultCarcassMaterial: (mat: MaterialConfig) => void;
  setDefaultFacadeMaterial: (mat: MaterialConfig) => void;
}

const DEFAULT_CARCASS: MaterialConfig = {
  type: 'ЛДСП',
  color: '#d4a373',
};

const DEFAULT_FACADE: MaterialConfig = {
  type: 'МДФ',
  color: '#fefae0',
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      viewMode: '3D',
      setViewMode: (mode) => set({ viewMode: mode }),

      cameraPreset: 'iso',
      setCameraPreset: (preset) => set({ cameraPreset: preset }),

      contextMenu: null,
      setContextMenu: (menu) => set({ contextMenu: menu }),

      planRotation: 0,
      rotatePlanClockwise: () => set((state) => ({ planRotation: (state.planRotation + 90) % 360 })),
      rotatePlanCounterClockwise: () => set((state) => ({ planRotation: (state.planRotation - 90 + 360) % 360 })),
      resetPlanRotation: () => set({ planRotation: 0 }),

      room: {
        mode: 'dimensions',
        length: 4000,
        width: 3000,
        height: 2500,
        wallA: 4000,
        wallB: 3000,
        wallC: 4000,
        wallD: 3000,
        niches: [],
      },
      updateRoom: (partial) =>
        set((state) => ({
          room: { ...state.room, ...partial },
        })),

      addNiche: (niche) =>
        set((state) => ({
          room: {
            ...state.room,
            niches: [...state.room.niches, { ...niche, id: 'niche-' + Date.now() }],
          },
        })),

      removeNiche: (id) =>
        set((state) => ({
          room: {
            ...state.room,
            niches: state.room.niches.filter((n) => n.id !== id),
          },
        })),

      setBackgroundImage: (url) =>
        set((state) => ({
          room: { ...state.room, backgroundImageUrl: url },
        })),

      modules: [
        {
          id: 'mod-1',
          name: 'Шкаф распашной',
          type: 'cabinet',
          x: 1000,
          z: 600,
          y: 0,
          width: 800,
          height: 2000,
          depth: 600,
          rotation: 0,
          carcassMaterial: DEFAULT_CARCASS,
          facadeMaterial: DEFAULT_FACADE,
        },
        {
          id: 'mod-2',
          name: 'Тумба напольная',
          type: 'nightstand',
          x: 2200,
          z: 500,
          y: 0,
          width: 600,
          height: 500,
          depth: 500,
          rotation: 0,
          carcassMaterial: DEFAULT_CARCASS,
          facadeMaterial: DEFAULT_FACADE,
        },
      ],
      selectedModuleId: 'mod-1',
      setSelectedModuleId: (id) => set({ selectedModuleId: id }),

      addModule: (type) => {
        const id = 'mod-' + Date.now();
        let name = 'Модуль';
        let width = 600;
        let height = 720;
        let depth = 500;
        let y = 0;

        switch (type) {
          case 'cabinet':
            name = 'Шкаф';
            width = 800;
            height = 2100;
            depth = 600;
            y = 0;
            break;
          case 'kitchen_bottom':
            name = 'Кухонный низ';
            width = 600;
            height = 850;
            depth = 600;
            y = 0;
            break;
          case 'kitchen_top':
            name = 'Кухонный верх';
            width = 600;
            height = 720;
            depth = 350;
            y = 1400; // hanging
            break;
          case 'nightstand':
            name = 'Тумба';
            width = 500;
            height = 500;
            depth = 450;
            y = 0;
            break;
        }

        const newMod: FurnitureModule = {
          id,
          name,
          type,
          x: 1500,
          z: 1500,
          y,
          width,
          height,
          depth,
          rotation: 0,
          carcassMaterial: get().defaultCarcassMaterial,
          facadeMaterial: get().defaultFacadeMaterial,
        };

        set((state) => ({
          modules: [...state.modules, newMod],
          selectedModuleId: id,
        }));
      },

      updateModule: (id, partial) =>
        set((state) => ({
          modules: state.modules.map((m) => (m.id === id ? { ...m, ...partial } : m)),
        })),

      removeModule: (id) =>
        set((state) => ({
          modules: state.modules.filter((m) => m.id !== id),
          selectedModuleId: state.selectedModuleId === id ? null : state.selectedModuleId,
        })),

      defaultCarcassMaterial: DEFAULT_CARCASS,
      defaultFacadeMaterial: DEFAULT_FACADE,
      setDefaultCarcassMaterial: (mat) => set({ defaultCarcassMaterial: mat }),
      setDefaultFacadeMaterial: (mat) => set({ defaultFacadeMaterial: mat }),
    }),
    {
      name: 'bazis-mebelshchik-storage',
    }
  )
);
