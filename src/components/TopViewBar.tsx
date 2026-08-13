'use client';

import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import {
  Box,
  Eye,
  Compass,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Layers,
  Square,
} from 'lucide-react';

export const TopViewBar: React.FC = () => {
  const {
    cameraPreset,
    setCameraPreset,
    triggerCameraRotate,
    viewMode,
  } = useAppStore();

  if (viewMode !== '3D') return null;

  // Custom Isometric Cube Icon components for sleek visual presentation
  const presets = [
    {
      id: 'left',
      label: 'Вид сбоку (Левый)',
      shortLabel: 'Вид слева',
      svgIcon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 3l9 4.5v9L12 21l-9-4.5v-9L12 3z" />
          <path d="M12 12L3 7.5" strokeWidth="2.5" stroke="#818cf8" />
          <path d="M12 12v9" strokeWidth="2.5" stroke="#818cf8" />
        </svg>
      ),
    },
    {
      id: 'front',
      label: 'Вид спереди (Фронт)',
      shortLabel: 'Спереди',
      svgIcon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="4" y="4" width="16" height="16" rx="2" strokeWidth="2" />
          <path d="M4 12h16" stroke="#818cf8" strokeWidth="2" />
        </svg>
      ),
    },
    {
      id: 'right',
      label: 'Вид сбоку (Правый)',
      shortLabel: 'Вид справа',
      svgIcon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 3l9 4.5v9L12 21l-9-4.5v-9L12 3z" />
          <path d="M12 12l9-4.5" strokeWidth="2.5" stroke="#818cf8" />
          <path d="M12 12v9" strokeWidth="2.5" stroke="#818cf8" />
        </svg>
      ),
    },
    {
      id: 'top',
      label: 'Вид сверху',
      shortLabel: 'Сверху',
      svgIcon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 3l9 5-9 5-9-5 9-5z" fill="#818cf8" fillOpacity="0.4" stroke="#818cf8" strokeWidth="2" />
          <path d="M3 8v8l9 5 9-5V8" />
        </svg>
      ),
    },
    {
      id: 'iso',
      label: 'Изометрия (Свободный 3D)',
      shortLabel: 'Изометрия',
      svgIcon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2l9 5v10l-9 5-9-5V7l9-5z" />
          <path d="M12 12l9-5M12 12v10M12 12L3 7" stroke="#818cf8" strokeWidth="2" />
        </svg>
      ),
    },
  ] as const;

  const handlePresetClick = (id: 'left' | 'right' | 'front' | 'top' | 'iso') => {
    setCameraPreset(id);
    triggerCameraRotate(id);
  };

  return (
    <div className="flex items-center gap-1 bg-slate-900/90 p-1.5 rounded-lg border border-slate-700 backdrop-blur shadow-lg text-xs">
      <span className="text-[11px] font-semibold text-slate-400 px-2 border-r border-slate-700">
        Ракурсы:
      </span>
      {presets.map((p) => {
        const isActive = cameraPreset === p.id;
        return (
          <button
            key={p.id}
            onClick={() => handlePresetClick(p.id)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md transition-all font-medium border ${
              isActive
                ? 'bg-indigo-600 text-white border-indigo-500 shadow'
                : 'bg-slate-950/40 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800 hover:border-slate-700'
            }`}
            title={p.label}
          >
            {p.svgIcon}
            <span className="hidden md:inline text-[11px]">{p.shortLabel}</span>
          </button>
        );
      })}
    </div>
  );
};
