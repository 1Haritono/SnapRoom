'use client';

import React, { useMemo, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html, Billboard } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
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

// Smart Wall Component: COMPLETELY HIDES (visible = false) when obscuring camera view
interface DynamicWallProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  size: [number, number, number];
  label: string;
  roomCenter: [number, number, number];
}

const DynamicWall: React.FC<DynamicWallProps> = ({ position, rotation = [0, 0, 0], size, label, roomCenter }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [isVisible, setIsVisible] = useState(true);

  useFrame(({ camera }) => {
    if (!meshRef.current) return;

    const wallPos = new THREE.Vector3(...position);
    const centerPos = new THREE.Vector3(...roomCenter);

    // Wall normal direction pointing inside the room
    const wallToCenter = centerPos.clone().sub(wallPos).normalize();
    // Wall to camera vector
    const wallToCam = camera.position.clone().sub(wallPos).normalize();

    // Dot product check: if camera is outside looking towards room center through this wall -> hide wall completely
    const dot = wallToCenter.dot(wallToCam);
    const shouldHide = dot > 0.12;

    if (shouldHide !== !isVisible) {
      setIsVisible(!shouldHide);
    }
  });

  return (
    <group position={position} rotation={rotation}>
      <mesh ref={meshRef} receiveShadow visible={isVisible}>
        <boxGeometry args={size} />
        <meshStandardMaterial color="#1e293b" opacity={0.7} transparent />
      </mesh>

      {/* Wall 3D Billboard Label - remains visible for orientation */}
      <Billboard position={[0, size[1] / 2 + 0.2, 0]}>
        <Html center transform sprite distanceFactor={10}>
          <div className={`bg-slate-900/90 text-indigo-400 text-xs font-bold px-2 py-0.5 rounded border border-slate-700 shadow-md whitespace-nowrap transition-opacity duration-200 pointer-events-none select-none ${isVisible ? 'opacity-85' : 'opacity-40'}`}>
            {label}
          </div>
        </Html>
      </Billboard>
    </group>
  );
};

// Camera Controller Component for smooth camera presets and context menu shift commands
interface CameraControllerProps {
  controlsRef: React.RefObject<OrbitControlsImpl>;
  roomLM: number;
  roomWM: number;
  roomHM: number;
}

const CameraController: React.FC<CameraControllerProps> = ({ controlsRef, roomLM, roomWM, roomHM }) => {
  const { cameraPreset } = useAppStore();
  const { camera } = useThree();

  const targetCenter = useMemo(() => new THREE.Vector3(roomLM / 2, roomHM / 3, roomWM / 2), [roomLM, roomHM, roomWM]);

  // Target camera position based on current preset
  const targetCamPos = useMemo(() => {
    switch (cameraPreset) {
      case 'front':
        return new THREE.Vector3(roomLM / 2, roomHM / 2, roomWM * 2.2);
      case 'top':
        return new THREE.Vector3(roomLM / 2, roomHM * 2.8, roomWM / 2 + 0.01);
      case 'left':
        return new THREE.Vector3(-roomLM * 1.5, roomHM / 2, roomWM / 2);
      case 'right':
        return new THREE.Vector3(roomLM * 2.5, roomHM / 2, roomWM / 2);
      case 'iso':
      default:
        return new THREE.Vector3(roomLM * 1.4, roomHM * 1.4, roomWM * 1.7);
    }
  }, [cameraPreset, roomLM, roomHM, roomWM]);

  // Handle radial context menu camera shift actions
  useEffect(() => {
    const handleShift = (e: Event) => {
      const customEv = e as CustomEvent<{ action: string }>;
      const action = customEv.detail.action;

      if (!controlsRef.current) return;

      const step = 0.5;
      if (action === 'up') {
        camera.position.y += step;
        controlsRef.current.target.y += step;
      } else if (action === 'down') {
        camera.position.y -= step;
        controlsRef.current.target.y -= step;
      } else if (action === 'left') {
        camera.position.x -= step;
        controlsRef.current.target.x -= step;
      } else if (action === 'right') {
        camera.position.x += step;
        controlsRef.current.target.x += step;
      } else if (action === 'reset') {
        camera.position.copy(targetCamPos);
        controlsRef.current.target.copy(targetCenter);
      }
      controlsRef.current.update();
    };

    window.addEventListener('camera-shift', handleShift);
    return () => window.removeEventListener('camera-shift', handleShift);
  }, [camera, controlsRef, targetCamPos, targetCenter]);

  // Smooth lerp transition on frame update
  useFrame(() => {
    if (!controlsRef.current) return;

    camera.position.lerp(targetCamPos, 0.08);
    controlsRef.current.target.lerp(targetCenter, 0.08);
    controlsRef.current.update();
  });

  return null;
};

export const Scene3DView: React.FC = () => {
  const { room, modules, selectedModuleId, setSelectedModuleId, setContextMenu } = useAppStore();
  const controlsRef = useRef<OrbitControlsImpl>(null);

  const roomLM = mmToM(room.mode === 'dimensions' ? room.length : room.wallA);
  const roomWM = mmToM(room.mode === 'dimensions' ? room.width : room.wallB);
  const roomHM = mmToM(room.height);

  const roomCenter: [number, number, number] = [roomLM / 2, roomHM / 2, roomWM / 2];

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      open: true,
    });
  };

  return (
    <div
      className="w-full h-full bg-slate-950 relative"
      onContextMenu={handleContextMenu}
      onClick={() => setContextMenu(null)}
    >
      <Canvas
        shadows
        camera={{ position: [roomLM * 1.4, roomHM * 1.4, roomWM * 1.7], fov: 50 }}
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

        {/* Smart Walls with Complete Hiding (visible=false) when obscuring view */}
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

        <OrbitControls ref={controlsRef} target={[roomLM / 2, roomHM / 3, roomWM / 2]} makeDefault />
        <CameraController controlsRef={controlsRef} roomLM={roomLM} roomWM={roomWM} roomHM={roomHM} />
      </Canvas>
    </div>
  );
};
