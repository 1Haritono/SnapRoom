'use client';

import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { ModuleType } from '@/types';
import { Box, Plus, Trash2, RotateCw, Move } from 'lucide-react';
import { MaterialSelector } from './MaterialSelector';

export const FurnitureEditor: React.FC = () => {
  const {
    modules,
    selectedModuleId,
    setSelectedModuleId,
    addModule,
    updateModule,
    removeModule,
  } = useAppStore();

  const selectedModule = modules.find((m) => m.id === selectedModuleId);

  const handleRotate = () => {
    if (!selectedModule) return;
    const newRotation = (selectedModule.rotation + 90) % 360;
    updateModule(selectedModule.id, { rotation: newRotation });
  };

  return (
    <div className="space-y-4">
      {/* Quick Add Module buttons */}
      <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
        <div className="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
          <Plus className="w-4 h-4 text-indigo-400" />
          <span>Добавить корпусную мебель</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => addModule('cabinet')}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-700 text-slate-200 border border-slate-700 p-2 rounded text-xs transition-colors"
          >
            <Box className="w-4 h-4 text-emerald-400" />
            <span>Шкаф</span>
          </button>
          <button
            onClick={() => addModule('kitchen_bottom')}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-700 text-slate-200 border border-slate-700 p-2 rounded text-xs transition-colors"
          >
            <Box className="w-4 h-4 text-amber-400" />
            <span>Кухонный низ</span>
          </button>
          <button
            onClick={() => addModule('kitchen_top')}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-700 text-slate-200 border border-slate-700 p-2 rounded text-xs transition-colors"
          >
            <Box className="w-4 h-4 text-cyan-400" />
            <span>Кухонный верх</span>
          </button>
          <button
            onClick={() => addModule('nightstand')}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-700 text-slate-200 border border-slate-700 p-2 rounded text-xs transition-colors"
          >
            <Box className="w-4 h-4 text-purple-400" />
            <span>Тумба</span>
          </button>
        </div>
      </div>

      {/* List of modules */}
      <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
        <div className="text-xs font-semibold text-slate-300 mb-2">Модули на плане ({modules.length})</div>
        {modules.length === 0 ? (
          <p className="text-xs text-slate-500 italic">Нажмите кнопку выше, чтобы добавить мебель</p>
        ) : (
          <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
            {modules.map((m) => (
              <div
                key={m.id}
                onClick={() => setSelectedModuleId(m.id)}
                className={`flex items-center justify-between p-2 rounded text-xs cursor-pointer border transition-colors ${
                  selectedModuleId === m.id
                    ? 'bg-indigo-900/50 border-indigo-500 text-white'
                    : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="font-medium truncate flex-1">{m.name}</div>
                <div className="text-[10px] text-slate-400 font-mono mr-2">
                  {m.width}×{m.height}×{m.depth}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeModule(m.id);
                  }}
                  className="text-red-400 hover:text-red-300 p-0.5"
                  title="Удалить"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Selected Module inspector */}
      {selectedModule && (
        <div className="bg-slate-800 p-3 rounded-lg border border-indigo-500/50 space-y-3">
          <div className="flex items-center justify-between">
            <input
              type="text"
              value={selectedModule.name}
              onChange={(e) => updateModule(selectedModule.id, { name: e.target.value })}
              className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white font-semibold focus:outline-none focus:border-indigo-500 flex-1 mr-2"
            />
            <button
              onClick={handleRotate}
              className="flex items-center gap-1 bg-slate-700 hover:bg-slate-600 text-xs px-2 py-1 rounded text-slate-200"
              title="Повернуть на 90°"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>{selectedModule.rotation}°</span>
            </button>
          </div>

          {/* Dimensions */}
          <div>
            <div className="text-[11px] font-semibold text-slate-400 mb-1.5">Размеры (мм)</div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[10px] text-slate-400 mb-0.5">Ширина (X)</label>
                <input
                  type="number"
                  step="50"
                  value={selectedModule.width}
                  onChange={(e) =>
                    updateModule(selectedModule.id, { width: Number(e.target.value) || 100 })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 mb-0.5">Высота (Y)</label>
                <input
                  type="number"
                  step="50"
                  value={selectedModule.height}
                  onChange={(e) =>
                    updateModule(selectedModule.id, { height: Number(e.target.value) || 100 })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 mb-0.5">Глубина (Z)</label>
                <input
                  type="number"
                  step="50"
                  value={selectedModule.depth}
                  onChange={(e) =>
                    updateModule(selectedModule.id, { depth: Number(e.target.value) || 100 })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Position */}
          <div>
            <div className="text-[11px] font-semibold text-slate-400 mb-1.5 flex items-center gap-1">
              <Move className="w-3.5 h-3.5" />
              <span>Положение на плане (мм)</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[10px] text-slate-400 mb-0.5">X</label>
                <input
                  type="number"
                  step="50"
                  value={selectedModule.x}
                  onChange={(e) => updateModule(selectedModule.id, { x: Number(e.target.value) })}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 mb-0.5">Высота Y (от пола)</label>
                <input
                  type="number"
                  step="50"
                  value={selectedModule.y}
                  onChange={(e) => updateModule(selectedModule.id, { y: Number(e.target.value) })}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 mb-0.5">Z</label>
                <input
                  type="number"
                  step="50"
                  value={selectedModule.z}
                  onChange={(e) => updateModule(selectedModule.id, { z: Number(e.target.value) })}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Separate Materials */}
          <div className="pt-2 border-t border-slate-700">
            <div className="text-xs font-semibold text-slate-300 mb-2">Назначение материалов</div>
            <MaterialSelector
              label="Корпус (Верх и Низ)"
              material={selectedModule.carcassMaterial}
              onChange={(mat) => updateModule(selectedModule.id, { carcassMaterial: mat })}
            />
            <MaterialSelector
              label="Фасады"
              material={selectedModule.facadeMaterial}
              onChange={(mat) => updateModule(selectedModule.id, { facadeMaterial: mat })}
            />
          </div>
        </div>
      )}
    </div>
  );
};
