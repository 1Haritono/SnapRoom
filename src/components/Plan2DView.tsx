'use client';

import React from 'react';
import { useAppStore } from '@/store/useAppStore';

export const Plan2DView: React.FC = () => {
  const {
    room,
    modules,
    selectedModuleId,
    setSelectedModuleId,
    updateModule,
    planRotation,
    rotatePlanClockwise,
    rotatePlanCounterClockwise,
    resetPlanRotation,
  } = useAppStore();

  // Scale calculations for SVG (convert mm to pixels canvas size ~650x480)
  const roomLength = room.mode === 'dimensions' ? room.length : room.wallA;
  const roomWidth = room.mode === 'dimensions' ? room.width : room.wallB;

  const svgPadding = 60;
  const svgWidth = 700;
  const svgHeight = 500;

  const scaleX = (svgWidth - svgPadding * 2) / roomLength;
  const scaleZ = (svgHeight - svgPadding * 2) / roomWidth;
  const scale = Math.min(scaleX, scaleZ);

  const drawRoomW = roomLength * scale;
  const drawRoomH = roomWidth * scale;

  const handleDragModule = (id: string, e: React.MouseEvent<SVGGElement>) => {
    e.stopPropagation();
    setSelectedModuleId(id);

    const svgElement = e.currentTarget.ownerSVGElement;
    if (!svgElement) return;

    const startPoint = svgElement.createSVGPoint();
    startPoint.x = e.clientX;
    startPoint.y = e.clientY;
    const ctm = svgElement.getScreenCTM()?.inverse();
    if (!ctm) return;
    const startSvgCoords = startPoint.matrixTransform(ctm);

    const targetModule = modules.find((m) => m.id === id);
    if (!targetModule) return;

    const initialX = targetModule.x;
    const initialZ = targetModule.z;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const p = svgElement.createSVGPoint();
      p.x = moveEvent.clientX;
      p.y = moveEvent.clientY;
      const coords = p.matrixTransform(ctm);

      const dxMm = (coords.x - startSvgCoords.x) / scale;
      const dzMm = (coords.y - startSvgCoords.y) / scale;

      const newX = Math.max(0, Math.min(roomLength - targetModule.width, Math.round((initialX + dxMm) / 10) * 10));
      const newZ = Math.max(0, Math.min(roomWidth - targetModule.depth, Math.round((initialZ + dzMm) / 10) * 10));

      updateModule(id, { x: newX, z: newZ });
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className="relative w-full h-full bg-slate-950 flex flex-col items-center justify-center p-4 select-none overflow-hidden">
      <div className="absolute top-4 left-4 bg-slate-900/90 text-slate-300 text-xs px-3 py-1.5 rounded-lg border border-slate-700 backdrop-blur z-10">
        <span className="font-semibold text-indigo-400">2D План Помещения</span> (Вид сверху)
        <br />
        <span className="text-[11px] text-slate-400">Перетаскивайте модули или кликайте для выбора</span>
      </div>

      <svg
        width={svgWidth}
        height={svgHeight}
        className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-visible"
        onClick={() => setSelectedModuleId(null)}
      >
        <g transform={`translate(${svgWidth / 2}, ${svgHeight / 2}) rotate(${planRotation}) translate(${-svgWidth / 2}, ${-svgHeight / 2})`}>
          {/* Background Image / Plan */}
          {room.backgroundImageUrl && (
            <image
              href={room.backgroundImageUrl}
              x={svgPadding}
              y={svgPadding}
              width={drawRoomW}
              height={drawRoomH}
              preserveAspectRatio="none"
              opacity="0.35"
            />
          )}

          {/* Room Floor Grid */}
          <g transform={`translate(${svgPadding}, ${svgPadding})`}>
            <rect
              x="0"
              y="0"
              width={drawRoomW}
              height={drawRoomH}
              fill="#1e293b"
              stroke="#475569"
              strokeWidth="3"
            />

            {/* Wall Labels (А, Б, В, Г) with clear background badges */}
            {/* Wall A (Front / South - Bottom edge) */}
            <g transform={`translate(${drawRoomW / 2}, ${drawRoomH + 28})`}>
              <rect x="-60" y="-14" width="120" height="22" rx="4" fill="#0f172a" fillOpacity="0.85" stroke="#475569" strokeWidth="1" />
              <text x="0" y="2" fill="#60a5fa" fontSize="12" textAnchor="middle" fontWeight="bold">
                Стена А ({roomLength} мм)
              </text>
            </g>

            {/* Wall B (Right / East - Right edge) */}
            <g transform={`translate(${drawRoomW + 30}, ${drawRoomH / 2})`}>
              <rect x="-10" y="-30" width="120" height="22" rx="4" fill="#0f172a" fillOpacity="0.85" stroke="#475569" strokeWidth="1" transform="rotate(90)" />
              <text x="0" y="4" fill="#60a5fa" fontSize="12" textAnchor="middle" fontWeight="bold" transform="rotate(90)">
                Стена Б ({roomWidth} мм)
              </text>
            </g>

            {/* Wall C (Back / North - Top edge) */}
            <g transform={`translate(${drawRoomW / 2}, -24)`}>
              <rect x="-60" y="-14" width="120" height="22" rx="4" fill="#0f172a" fillOpacity="0.85" stroke="#475569" strokeWidth="1" />
              <text x="0" y="2" fill="#60a5fa" fontSize="12" textAnchor="middle" fontWeight="bold">
                Стена В ({room.mode === 'four_walls' ? room.wallC : roomLength} мм)
              </text>
            </g>

            {/* Wall D (Left / West - Left edge) */}
            <g transform={`translate(-30, ${drawRoomH / 2})`}>
              <rect x="-110" y="-30" width="120" height="22" rx="4" fill="#0f172a" fillOpacity="0.85" stroke="#475569" strokeWidth="1" transform="rotate(-90)" />
              <text x="-50" y="4" fill="#60a5fa" fontSize="12" textAnchor="middle" fontWeight="bold" transform="rotate(-90)">
                Стена Г ({room.mode === 'four_walls' ? room.wallD : roomWidth} мм)
              </text>
            </g>

            {/* Render Niches */}
            {room.niches.map((niche) => {
              let nx = 0;
              let ny = 0;
              let nw = niche.width * scale;
              let nh = niche.depth * scale;

              if (niche.wall === 'A') {
                nx = niche.offset * scale;
                ny = drawRoomH - niche.depth * scale;
              } else if (niche.wall === 'B') {
                nx = drawRoomW - niche.depth * scale;
                ny = niche.offset * scale;
                nw = niche.depth * scale;
                nh = niche.width * scale;
              } else if (niche.wall === 'C') {
                nx = niche.offset * scale;
                ny = 0;
              } else if (niche.wall === 'D') {
                nx = 0;
                ny = niche.offset * scale;
                nw = niche.depth * scale;
                nh = niche.width * scale;
              }

              return (
                <g key={niche.id}>
                  <rect
                    x={nx}
                    y={ny}
                    width={nw}
                    height={nh}
                    fill="#0f172a"
                    stroke="#ef4444"
                    strokeWidth="1.5"
                    strokeDasharray="4 2"
                  />
                  <text
                    x={nx + nw / 2}
                    y={ny + nh / 2 + 4}
                    fill="#ef4444"
                    fontSize="10"
                    textAnchor="middle"
                  >
                    Ниша
                  </text>
                </g>
              );
            })}

            {/* Furniture Modules */}
            {modules.map((m) => {
              const isSelected = selectedModuleId === m.id;
              const mx = m.x * scale;
              const mz = m.z * scale;
              const mw = m.width * scale;
              const md = m.depth * scale;

              return (
                <g
                  key={m.id}
                  transform={`translate(${mx}, ${mz}) rotate(${m.rotation}, ${mw / 2}, ${md / 2})`}
                  onMouseDown={(e) => handleDragModule(m.id, e)}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedModuleId(m.id);
                  }}
                  className="cursor-move"
                >
                  {/* Selected Outer Glow / Outline */}
                  {isSelected && (
                    <rect
                      x="-4"
                      y="-4"
                      width={mw + 8}
                      height={md + 8}
                      fill="none"
                      stroke="#818cf8"
                      strokeWidth="2.5"
                      strokeDasharray="6 3"
                      rx="4"
                      className="animate-pulse"
                    />
                  )}

                  {/* Carcass Body */}
                  <rect
                    x="0"
                    y="0"
                    width={mw}
                    height={md}
                    fill={m.carcassMaterial.color || '#3b82f6'}
                    stroke={isSelected ? '#6366f1' : '#0284c7'}
                    strokeWidth={isSelected ? '2.5' : '1.5'}
                    rx="2"
                  />

                  {/* Facade Front edge highlight */}
                  <rect
                    x="0"
                    y={md - 4}
                    width={mw}
                    height="4"
                    fill={m.facadeMaterial.color || '#f59e0b'}
                  />

                  {/* Name Label */}
                  <text
                    x={mw / 2}
                    y={md / 2 + 4}
                    fill="#ffffff"
                    fontSize="10"
                    fontWeight="bold"
                    textAnchor="middle"
                    className="pointer-events-none drop-shadow"
                  >
                    {m.name}
                  </text>
                </g>
              );
            })}
          </g>
        </g>
      </svg>
    </div>
  );
};
