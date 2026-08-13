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
  RotateCw,
  RotateCcw,
  RefreshCw,
} from 'lucide-react';

export const TopViewBar: React.FC = () => {
  const {
    cameraPreset,
    setCameraPreset,
    planRotation,
    rotatePlanClockwise,
    rotatePlanCounterClockwise,
    resetPlanRotation,
    viewMode,
  } = useAppStore();

  if (viewMode !== '3D') return null;

  const presets = [
    { id: 'left', label: 'Вид сбоку (Левый)', icon: ArrowLeft },
    { id: 'front', label: 'Вид спереди', icon: ArrowDown },
    { id: 'right', label: 'Вид сбоку (Правый)', icon: ArrowRight },
    { id: 'top', label: 'Вид сверху', icon: ArrowUp },
    { id: 'iso', label: 'Изометрия (Свободный)', icon: Compass },
  ] as const;

  return (
    <div className="flex items-center gap-1 bg-slate-900/90 p-1.5 rounded-lg border border-slate-700 backdrop-blur shadow-lg text-xs">
      <span className="text-[11px] font-semibold text-slate-400 px-2 border-r border-slate-700">
        Ракурс:
      </span>
      {presets.map((p) => {
        const Icon = p.icon;
        const isActive = cameraPreset === p.id;
        return (
          <button
            key={p.id}
            onClick={() => setCameraPreset(p.id)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all font-medium ${
              isActive
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
            title={p.label}
          >
            <Icon className="w-3.5 h-3.5" />
            <span className="hidden md:inline text-[11px]">{p.label.split(' ')[0]}</span>
          </button>
        );
      })}
    </div>
  );
};
