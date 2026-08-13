'use client';

import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Box, Move3D, Eye, Layers } from 'lucide-react';

export const RoomDimensionsBar: React.FC = () => {
  const { room, modules, selectedModuleId } = useAppStore();

  const selectedModule = modules.find((m) => m.id === selectedModuleId);

  const roomLength = room.mode === 'dimensions' ? room.length : room.wallA;
  const roomWidth = room.mode === 'dimensions' ? room.width : room.wallB;

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-4 bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-2 shadow-2xl backdrop-blur text-xs text-slate-300 pointer-events-auto">
      {/* Room dimensions summary */}
      <div className="flex items-center gap-2 border-r border-slate-700 pr-4">
        <Move3D className="w-4 h-4 text-indigo-400" />
        <span className="font-semibold text-slate-200">Помещение:</span>
        <span className="font-mono text-indigo-300">
          {roomLength} × {roomWidth} × {room.height} <span className="text-[10px] text-slate-400">мм</span>
        </span>
      </div>

      {/* Selected Module dimensions summary if any */}
      {selectedModule ? (
        <div className="flex items-center gap-2">
          <Box className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold text-emerald-300 truncate max-w-[140px]">
            {selectedModule.name}:
          </span>
          <span className="font-mono text-emerald-400 font-bold">
            {selectedModule.width} × {selectedModule.height} × {selectedModule.depth}{' '}
            <span className="text-[10px] text-slate-400">мм</span>
          </span>
        </div>
      ) : (
        <div className="text-slate-500 text-[11px] italic">
          Кликните по модулю для просмотра габаритов
        </div>
      )}
    </div>
  );
};
