export type MaterialType = 'ЛДСП' | 'МДФ' | 'АГТ';

export interface MaterialConfig {
  type: MaterialType;
  color: string;
  textureUrl?: string; // base64 or object URL loaded by user
}

export type ModuleType = 'cabinet' | 'kitchen_bottom' | 'kitchen_top' | 'nightstand';

export interface FurnitureModule {
  id: string;
  name: string;
  type: ModuleType;
  x: number; // position in mm (center or top-left)
  z: number; // position in mm
  y: number; // elevation from floor in mm
  width: number; // X size in mm
  height: number; // Y size in mm
  depth: number; // Z size in mm
  rotation: number; // Y-axis rotation in degrees (0, 90, 180, 270)
  carcassMaterial: MaterialConfig;
  facadeMaterial: MaterialConfig;
}

export interface Niche {
  id: string;
  wall: 'A' | 'B' | 'C' | 'D';
  offset: number; // distance from wall start in mm
  width: number; // width in mm
  depth: number; // depth into wall in mm
  height: number; // height in mm
}

export type RoomMode = 'dimensions' | 'four_walls';

export interface RoomConfig {
  mode: RoomMode;
  // Mode: dimensions
  length: number; // X dimension mm
  width: number;  // Z dimension mm
  height: number; // Y dimension mm
  // Mode: four_walls (A = South/Front, B = East/Right, C = North/Back, D = West/Left)
  wallA: number;
  wallB: number;
  wallC: number;
  wallD: number;
  // Extra
  niches: Niche[];
  backgroundImageUrl?: string; // plan reference photo
}
