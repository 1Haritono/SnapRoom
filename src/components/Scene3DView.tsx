'use client';

import React, { useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Billboard } from '@react-three/drei';
import * as THREE from 'three';
import { useAppStore } from '@/store/useAppStore';
import { FurnitureModule } from '@/types';

// Convert mm to meters for Three.js scene scale
const mmToM = (mm: number) => mm / 1000;

interface Module3DProps {
  module: FurnitureModule;
  isSelected: boolean;
  onSelect: () => void;
}

const Module3D: React.FC<Module3DProps> = ({ module, isSelected, onSelect }) => {
  const widthM = mmToM(module.width);
  const heightM = mmToM(module.height);
  const depthM = mmToM(module.depth);

  const posX = mmToM(module.x) + widthM / 2;
  const posY = mmToM(module.y) + heightM / 2;
  const posZ = mmToM(module.z) + depthM / 2;

  // Custom textures loading
  const carcassTexture = useMemo(() => {
    if (!module.carcassMaterial.textureUrl) return null;
    const loader = new THREE.TextureLoader();
    const tex = loader.load(module.carcassMaterial.textureUrl);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }, [module.carcassMaterial.textureUrl]);

  const facadeTexture = useMemo(() => {
    if (!module.facadeMaterial.textureUrl) return null;
    const loader = new THREE.TextureLoader();
    const tex = loader.load(module.facadeMaterial.textureUrl);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }, [module.facadeMaterial.textureUrl]);

  const rotY = (module.rotation * Math.PI) / 180;

  return (
    <group position={[posX, posY, posZ]} rotation={[0, rotY, 0]} onClick={(e) => { e.stopPropagation(); onSelect(); }}>
      {/* Carcass Main Box */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[widthM, heightM, depthM]} />
        <meshStandardMaterial
          color={module.carcassMaterial.color || '#cccccc'}
          map={carcassTexture || undefined}
          roughness={0.4}
        />
      </mesh>

      {/* Front Facade Door Panel */}
      <mesh position={[0, 0, depthM / 2 + 0.005]} castShadow receiveShadow>
        <boxGeometry args={[widthM - 0.01, heightM - 0.01, 0.018]} />
        <meshStandardMaterial
          color={module.facadeMaterial.color || '#ffffff'}
          map={facadeTexture || undefined}
          roughness={0.2}
          metalness={module.facadeMaterial.type === 'АГТ' ? 0.3 : 0.0}
        />
      </mesh>

      {/* Handles */}
      <mesh position={[widthM / 2 - 0.08, 0, depthM / 2 + 0.02]}>
        <boxGeometry args={[0.02, 0.15, 0.01]} />
        <meshStandardMaterial color="#333333" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Selection Glow and Box Outline */}
      {isSelected && (
        <>
          <lineSegments>
            <edgesGeometry args={[new THREE.BoxGeometry(widthM + 0.02, heightM + 0.02, depthM + 0.02)]} />
            <lineBasicMaterial color="#6366f1" linewidth={4} />
          </lineSegments>
          {/* Subtle Selection Bounding Box */}
          <mesh>
            <boxGeometry args={[widthM + 0.03, heightM + 0.03, depthM + 0.03]} />
            <meshBasicMaterial color="#818cf8" wireframe transparent opacity={0.35} />
          </mesh>
        </>
      )}
    </group>
  );
};

// Smart Wall Component with dynamic opacity based on camera angle
interface DynamicWallProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  size: [number, number, number];
  label: string;
  roomCenter: [number, number, number];
}

const DynamicWall: React.FC<DynamicWallProps> = ({ position, rotation = [0, 0, 0], size, label, roomCenter }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [opacity, setOpacity] = useState(0.5);

  useFrame(({ camera }) => {
    if (!meshRef.current) return;

    // Vector from wall center to camera
    const wallPos = new THREE.Vector3(...position);
    const centerPos = new THREE.Vector3(...roomCenter);
    
    // Wall normal direction pointing inside the room
    const wallToCenter = centerPos.clone().sub(wallPos).normalize();
    
    // Wall to camera vector
    const wallToCam = camera.position.clone().sub(wallPos).normalize();

    // Dot product: if camera is outside looking towards room center through this wall
    const dot = wallToCenter.dot(wallToCam);

    // If dot product > 0.1, camera is standing behind this wall looking inside -> make transparent
    const targetOpacity = dot > 0.15 ? 0.12 : 0.65;
    
    // Smooth lerp transition
    setOpacity((prev) => THREE.MathUtils.lerp(prev, targetOpacity, 0.1));
  });

  return (
    <group position={position} rotation={rotation}>
      <mesh ref={meshRef} receiveShadow>
        <boxGeometry args={size} />
        <meshStandardMaterial color="#1e293b" transparent opacity={opacity} depthWrite={opacity > 0.3} />
      </mesh>

      {/* Wall 3D Billboard Label */}
      <Billboard position={[0, size[1] / 2 + 0.2, 0]}>
        <Html center transform sprite distanceFactor={10}>
          <div className="bg-slate-900/90 text-indigo-400 text-xs font-bold px-2 py-0.5 rounded border border-slate-700 shadow-md whitespace-nowrap opacity-85 pointer-events-none select-none">
            {label}
          </div>
        </Html>
      </Billboard>
    </group>
  );
};

export const Scene3DView: React.FC = () => {
  const { room, modules, selectedModuleId, setSelectedModuleId } = useAppStore();

  const roomLM = mmToM(room.mode === 'dimensions' ? room.length : room.wallA);
  const roomWM = mmToM(room.mode === 'dimensions' ? room.width : room.wallB);
  const roomHM = mmToM(room.height);

  const roomCenter: [number, number, number] = [roomLM / 2, roomHM / 2, roomWM / 2];

  return (
    <div className="w-full h-full bg-slate-950 relative">
      <div className="absolute top-4 left-4 bg-slate-900/90 text-slate-300 text-xs px-3 py-1.5 rounded-lg border border-slate-700 backdrop-blur z-10">
        <span className="font-semibold text-indigo-400">3D Сцена</span> (Левая кнопка — вращение, Колесо — зум, Правая кнопка — панорама)
        <br />
        <span className="text-[11px] text-slate-400">Стены перед камерой автоматически становятся прозрачными</span>
      </div>

      <Canvas
        shadows
        camera={{ position: [roomLM * 1.3, roomHM * 1.3, roomWM * 1.6], fov: 50 }}
        onPointerDown={(e) => {
          if (e.target === e.currentTarget) {
            setSelectedModuleId(null);
          }
        }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight
          position={[roomLM * 2, roomHM * 3, roomWM * 2]}
          intensity={1.2}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[roomLM / 2, roomHM - 0.2, roomWM / 2]} intensity={0.5} />

        {/* Floor */}
        <mesh position={[roomLM / 2, 0, roomWM / 2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[roomLM, roomWM]} />
          <meshStandardMaterial color="#334155" roughness={0.8} />
        </mesh>

        {/* Floor Grid */}
        <gridHelper
          args={[Math.max(roomLM, roomWM) * 1.5, 20, '#64748b', '#475569']}
          position={[roomLM / 2, 0.001, roomWM / 2]}
        />

        {/* Smart Walls with Dynamic Transparency & 3D Labels */}
        {/* Wall A (Front Wall at Z=roomWM) */}
        <DynamicWall
          position={[roomLM / 2, roomHM / 2, roomWM]}
          size={[roomLM, roomHM, 0.05]}
          label={`Стена А (${room.mode === 'dimensions' ? room.length : room.wallA} мм)`}
          roomCenter={roomCenter}
        />

        {/* Wall B (Right Wall at X=roomLM) */}
        <DynamicWall
          position={[roomLM, roomHM / 2, roomWM / 2]}
          rotation={[0, -Math.PI / 2, 0]}
          size={[roomWM, roomHM, 0.05]}
          label={`Стена Б (${room.mode === 'dimensions' ? room.width : room.wallB} мм)`}
          roomCenter={roomCenter}
        />

        {/* Wall C (Back Wall at Z=0) */}
        <DynamicWall
          position={[roomLM / 2, roomHM / 2, 0]}
          size={[roomLM, roomHM, 0.05]}
          label={`Стена В (${room.mode === 'four_walls' ? room.wallC : room.length} мм)`}
          roomCenter={roomCenter}
        />

        {/* Wall D (Left Wall at X=0) */}
        <DynamicWall
          position={[0, roomHM / 2, roomWM / 2]}
          rotation={[0, Math.PI / 2, 0]}
          size={[roomWM, roomHM, 0.05]}
          label={`Стена Г (${room.mode === 'four_walls' ? room.wallD : room.width} мм)`}
          roomCenter={roomCenter}
        />

        {/* Render Furniture Modules */}
        {modules.map((m) => (
          <Module3D
            key={m.id}
            module={m}
            isSelected={selectedModuleId === m.id}
            onSelect={() => setSelectedModuleId(m.id)}
          />
        ))}

        <OrbitControls target={[roomLM / 2, roomHM / 3, roomWM / 2]} makeDefault />
      </Canvas>
    </div>
  );
};
