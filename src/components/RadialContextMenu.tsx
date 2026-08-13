'use client';

import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import {
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Compass,
  X,
} from 'lucide-react';

export const RadialContextMenu: React.FC = () => {
  const { contextMenu, setContextMenu, setCameraPreset } = useAppStore();

  if (!contextMenu || !contextMenu.open) return null;

  const handleAction = (actionName: string) => {
    // Custom camera shift events dispatched to Three scene
    window.dispatchEvent(new CustomEvent('camera-shift', { detail: { action: actionName } }));
  };

  const closeMenu = () => {
    setContextMenu(null);
  };

  return (
    <div
      className="fixed z-50 select-none animate-in zoom-in-75 fade-in duration-150"
      style={{ left: contextMenu.x - 90, top: contextMenu.y - 90 }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Background radial ring */}
      <div className="relative w-44 h-44 rounded-full bg-slate-900/90 border border-indigo-500/50 shadow-2xl backdrop-blur-md flex items-center justify-center">
        {/* Center reset / orbit button */}
        <button
          onClick={() => {
            setCameraPreset('iso');
            handleAction('reset');
            closeMenu();
          }}
          className="w-11 h-11 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shadow-lg transition-transform active:scale-95 z-10"
          title="Сброс / Свободный ракурс (Изометрия)"
        >
          <Compass className="w-5 h-5" />
        </button>

        {/* Up Arrow */}
        <button
          onClick={() => handleAction('up')}
          className="absolute top-2 w-9 h-9 rounded-full bg-slate-800 hover:bg-indigo-700 text-slate-200 hover:text-white flex items-center justify-center border border-slate-700 transition-all active:scale-90"
          title="Переместить вверх"
        >
          <ArrowUp className="w-4 h-4" />
        </button>

        {/* Down Arrow */}
        <button
          onClick={() => handleAction('down')}
          className="absolute bottom-2 w-9 h-9 rounded-full bg-slate-800 hover:bg-indigo-700 text-slate-200 hover:text-white flex items-center justify-center border border-slate-700 transition-all active:scale-90"
          title="Переместить вниз"
        >
          <ArrowDown className="w-4 h-4" />
        </button>

        {/* Left Arrow */}
        <button
          onClick={() => handleAction('left')}
          className="absolute left-2 w-9 h-9 rounded-full bg-slate-800 hover:bg-indigo-700 text-slate-200 hover:text-white flex items-center justify-center border border-slate-700 transition-all active:scale-90"
          title="Переместить влево"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        {/* Right Arrow */}
        <button
          onClick={() => handleAction('right')}
          className="absolute right-2 w-9 h-9 rounded-full bg-slate-800 hover:bg-indigo-700 text-slate-200 hover:text-white flex items-center justify-center border border-slate-700 transition-all active:scale-90"
          title="Переместить вправо"
        >
          <ArrowRight className="w-4 h-4" />
        </button>

        {/* Close Button at top-right edge */}
        <button
          onClick={closeMenu}
          className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-slate-800 hover:bg-red-600 text-slate-400 hover:text-white flex items-center justify-center border border-slate-700 text-xs transition-colors"
          title="Закрыть меню"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
