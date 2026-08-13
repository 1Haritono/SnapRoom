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
      {/* Carcass Main Box - SHADOWS DISABLED */}
      <mesh castShadow={false} receiveShadow={false}>
        <boxGeometry args={[widthM, heightM, depthM]} />
        <meshStandardMaterial
          color={module.carcassMaterial.color || '#cccccc'}
          map={carcassTexture || undefined}
          roughness={0.4}
        />
      </mesh>

      {/* Front Facade Door Panel - SHADOWS DISABLED */}
      <mesh position={[0, 0, depthM / 2 + 0.005]} castShadow={false} receiveShadow={false}>
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

// Smart Wall Component with Raycast / Ray-Vector check for wall hiding and view-dependent label visibility
interface DynamicWallProps {
  wallId: 'A' | 'B' | 'C' | 'D';
  position: [number, number, number];
  rotation?: [number, number, number];
  size: [number, number, number];
  label: string;
  roomCenter: [number, number, number];
}

const DynamicWall: React.FC<DynamicWallProps> = ({ wallId, position, rotation = [0, 0, 0], size, label, roomCenter }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [opacity, setOpacity] = useState(0.7);
  const [isLabelVisible, setIsLabelVisible] = useState(true);
  const { cameraPreset } = useAppStore();

  useFrame(({ camera }) => {
    if (!meshRef.current) return;

    const wallPos = new THREE.Vector3(...position);
    const centerPos = new THREE.Vector3(...roomCenter);

    // Vector from wall position to room center
    const wallToCenter = centerPos.clone().sub(wallPos).normalize();
    // Vector from wall position to camera
    const wallToCam = camera.position.clone().sub(wallPos).normalize();

    // Dot product check: if camera is standing behind this wall looking inside -> make wall ultra transparent (opacity 0.08)
    const dot = wallToCenter.dot(wallToCam);
    const isObscuring = dot > 0.05;

    const targetOpacity = isObscuring ? 0.08 : 0.7;
    setOpacity((prev) => THREE.MathUtils.lerp(prev, targetOpacity, 0.15));

    // Label visibility rules:
    // Front view -> show only back wall (C)
    // Top view -> show all walls
    let labelShow = true;
    if (cameraPreset === 'front') {
      labelShow = wallId === 'C';
    } else if (cameraPreset === 'left') {
      labelShow = wallId === 'B';
    } else if (cameraPreset === 'right') {
      labelShow = wallId === 'D';
    }
    setIsLabelVisible(labelShow);
  });

  return (
    <group position={position} rotation={rotation}>
      <mesh ref={meshRef} receiveShadow={false}>
        <boxGeometry args={size} />
        <meshStandardMaterial
          color="#1e293b"
          opacity={opacity}
          transparent
          depthWrite={opacity > 0.3}
        />
      </mesh>

      {/* Wall 3D Billboard Label */}
      {isLabelVisible && (
        <Billboard position={[0, size[1] / 2 + 0.2, 0]}>
          <Html center transform sprite distanceFactor={10}>
            <div className="bg-slate-900/90 text-indigo-400 text-xs font-bold px-2 py-0.5 rounded border border-slate-700 shadow-md whitespace-nowrap opacity-85 pointer-events-none select-none">
              {label}
            </div>
          </Html>
        </Billboard>
      )}
    </group>
  );
};

// Camera Controller for smooth camera transitions, repeated preset rotation steps, and free Orbit movement
interface CameraControllerProps {
  controlsRef: React.RefObject<OrbitControlsImpl>;
  roomLM: number;
  roomWM: number;
  roomHM: number;
}

const CameraController: React.FC<CameraControllerProps> = ({ controlsRef, roomLM, roomWM, roomHM }) => {
  const { cameraPreset } = useAppStore();
  const { camera } = useThree();

  const [rotationAngleOffset, setRotationAngleOffset] = useState(0);
  const prevPresetRef = useRef(cameraPreset);

  const targetCenter = useMemo(() => new THREE.Vector3(roomLM / 2, roomHM / 3, roomWM / 2), [roomLM, roomHM, roomWM]);

  // Repeated click on preset rotates camera by +90 degrees around center
  useEffect(() => {
    if (prevPresetRef.current === cameraPreset) {
      setRotationAngleOffset((prev) => prev + Math.PI / 2);
    } else {
      setRotationAngleOffset(0);
      prevPresetRef.current = cameraPreset;
    }
  }, [cameraPreset]);

  // Calculate target camera position based on preset & rotation angle offset
  const targetCamPos = useMemo(() => {
    let basePos = new THREE.Vector3();
    const radius = Math.max(roomLM, roomWM) * 1.8;

    switch (cameraPreset) {
      case 'front':
        basePos.set(roomLM / 2, roomHM / 2, roomWM / 2 + radius);
        break;
      case 'top':
        basePos.set(roomLM / 2, roomHM / 2 + radius * 1.5, roomWM / 2 + 0.01);
        break;
      case 'left':
        basePos.set(roomLM / 2 - radius, roomHM / 2, roomWM / 2);
        break;
      case 'right':
        basePos.set(roomLM / 2 + radius, roomHM / 2, roomWM / 2);
        break;
      case 'iso':
      default:
        basePos.set(roomLM / 2 + radius * 0.7, roomHM / 2 + radius * 0.7, roomWM / 2 + radius * 0.7);
        break;
    }

    if (rotationAngleOffset !== 0) {
      // Rotate basePos around targetCenter on Y axis
      const offsetVec = basePos.clone().sub(targetCenter);
      offsetVec.applyAxisAngle(new THREE.Vector3(0, 1, 0), rotationAngleOffset);
      return targetCenter.clone().add(offsetVec);
    }

    return basePos;
  }, [cameraPreset, rotationAngleOffset, roomLM, roomHM, roomWM, targetCenter]);

  // Smooth lerp transition frame update
  useFrame(() => {
    if (!controlsRef.current) return;

    // Only auto-lerp if user is not actively dragging camera with OrbitControls
    if (!controlsRef.current.state || controlsRef.current.state === -1) {
      camera.position.lerp(targetCamPos, 0.08);
      controlsRef.current.target.lerp(targetCenter, 0.05);
      controlsRef.current.update();
    }
  });

  return null;
};

export const Scene3DView: React.FC = () => {
  const { room, modules, selectedModuleId, setSelectedModuleId, setContextMenu } = useAppStore();
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const rightClickTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isMouseDownRightRef = useRef(false);

  const roomLM = mmToM(room.mode === 'dimensions' ? room.length : room.wallA);
  const roomWM = mmToM(room.mode === 'dimensions' ? room.width : room.wallB);
  const roomHM = mmToM(room.height);

  const roomCenter: [number, number, number] = [roomLM / 2, roomHM / 2, roomWM / 2];

  // Mouse Down Event for Right Click hold (Radial Menu) vs Click
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 2) { // Right Click
      isMouseDownRightRef.current = true;
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      rightClickTimerRef.current = setTimeout(() => {
        if (isMouseDownRightRef.current) {
          setContextMenu({ x: mouseX, y: mouseY, open: true });
        }
      }, 250); // Show radial menu if right-clicked and held > 250ms
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (e.button === 2) {
      isMouseDownRightRef.current = false;
      if (rightClickTimerRef.current) {
        clearTimeout(rightClickTimerRef.current);
      }
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  return (
    <div
      className="w-full h-full bg-slate-950 relative"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onContextMenu={handleContextMenu}
    >
      <Canvas
        shadows={false}
        camera={{ position: [roomLM * 1.4, roomHM * 1.4, roomWM * 1.7], fov: 50 }}
        onPointerDown={(e) => {
          if (e.button === 0 && e.target === e.currentTarget) {
            setSelectedModuleId(null);
          }
        }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight
          position={[roomLM * 2, roomHM * 3, roomWM * 2]}
          intensity={1.2}
          castShadow={false}
        />
        <pointLight position={[roomLM / 2, roomHM - 0.2, roomWM / 2]} intensity={0.5} />

        {/* Floor - SHADOWS DISABLED */}
        <mesh position={[roomLM / 2, 0, roomWM / 2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow={false}>
          <planeGeometry args={[roomLM, roomWM]} />
          <meshStandardMaterial color="#334155" roughness={0.8} />
        </mesh>

        {/* Floor Grid */}
        <gridHelper
          args={[Math.max(roomLM, roomWM) * 1.5, 20, '#64748b', '#475569']}
          position={[roomLM / 2, 0.001, roomWM / 2]}
        />

        {/* Smart Walls with Ultra Transparency (opacity = 0.08) when obscuring view */}
        <DynamicWall
          wallId="A"
          position={[roomLM / 2, roomHM / 2, roomWM]}
          size={[roomLM, roomHM, 0.05]}
          label={`Стена А (${room.mode === 'dimensions' ? room.length : room.wallA} мм)`}
          roomCenter={roomCenter}
        />
        <DynamicWall
          wallId="B"
          position={[roomLM, roomHM / 2, roomWM / 2]}
          rotation={[0, -Math.PI / 2, 0]}
          size={[roomWM, roomHM, 0.05]}
          label={`Стена Б (${room.mode === 'dimensions' ? room.width : room.wallB} мм)`}
          roomCenter={roomCenter}
        />
        <DynamicWall
          wallId="C"
          position={[roomLM / 2, roomHM / 2, 0]}
          size={[roomLM, roomHM, 0.05]}
          label={`Стена В (${room.mode === 'four_walls' ? room.wallC : room.length} мм)`}
          roomCenter={roomCenter}
        />
        <DynamicWall
          wallId="D"
          position={[0, roomHM / 2, roomWM / 2]}
          rotation={[0, Math.PI / 2, 0]}
          size={[roomWM, roomHM, 0.05]}
          label={`Стена Г (${room.mode === 'four_walls' ? room.wallD : room.width} мм)`}
          roomCenter={roomCenter}
        />

        {/* Render Furniture Modules with disabled shadows */}
        {modules.map((m) => (
          <Module3D
            key={m.id}
            module={m}
            isSelected={selectedModuleId === m.id}
            onSelect={() => setSelectedModuleId(m.id)}
          />
        ))}

        <OrbitControls
          ref={controlsRef}
          target={[roomLM / 2, roomHM / 3, roomWM / 2]}
          makeDefault
          enableDamping
          dampingFactor={0.05}
        />
        <CameraController controlsRef={controlsRef} roomLM={roomLM} roomWM={roomWM} roomHM={roomHM} />
      </Canvas>
    </div>
  );
};
