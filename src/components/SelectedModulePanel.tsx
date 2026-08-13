import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { RotateCw, Trash2, Box, Move, X, ChevronUp, ChevronDown } from 'lucide-react';
import { MaterialSelector } from './MaterialSelector';

export const SelectedModulePanel: React.FC = () => {
  const {
    modules,
    selectedModuleId,
    setSelectedModuleId,
    updateModule,
    removeModule,
    isInspectorCollapsed,
    toggleInspectorCollapsed,
  } = useAppStore();

  const selectedModule = modules.find((m) => m.id === selectedModuleId);

  if (!selectedModule) return null;

  const handleRotate = () => {
    const newRotation = (selectedModule.rotation + 90) % 360;
    updateModule(selectedModule.id, { rotation: newRotation });
  };

  return (
    <div
      className={`fixed right-4 bottom-4 z-30 transition-all duration-300 ease-in-out select-none ${
        isInspectorCollapsed ? 'translate-y-[calc(100%-2.75rem)]' : 'translate-y-0'
      }`}
    >
      <div className="relative w-80 bg-slate-900/95 border border-indigo-500/60 rounded-xl shadow-2xl backdrop-blur p-4 space-y-4 text-slate-200 text-xs">
        {/* Toggle strip button on top edge for collapsing UPWARDS / DOWNWARDS */}
        <button
          onClick={toggleInspectorCollapsed}
          className="absolute left-1/2 -top-6 -translate-x-1/2 px-4 py-0.5 bg-slate-900/95 border-t border-l border-r border-indigo-500/60 rounded-t-lg shadow-lg flex items-center justify-center text-indigo-400 hover:text-white hover:bg-indigo-600 transition-colors gap-1 text-[11px] font-medium"
          title={isInspectorCollapsed ? 'Развернуть свойства' : 'Свернуть свойства'}
        >
          {isInspectorCollapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          <span>{isInspectorCollapsed ? 'Свойства объекта' : 'Свернуть'}</span>
        </button>

        {/* Header with Title and Close button */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2 text-indigo-400 font-semibold">
            <Box className="w-4 h-4" />
            <span>Свойства выделенного объекта</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSelectedModuleId(null)}
              className="text-slate-400 hover:text-slate-200 p-1 rounded hover:bg-slate-800 transition-colors"
              title="Закрыть панель"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Editable Module Name & Rotate/Delete buttons */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={selectedModule.name}
            onChange={(e) => updateModule(selectedModule.id, { name: e.target.value })}
            className="bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white font-semibold focus:outline-none focus:border-indigo-500 flex-1"
            placeholder="Название модуля..."
          />
          <button
            onClick={handleRotate}
            className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-2.5 py-1.5 rounded transition-colors"
            title="Повернуть модуль на 90°"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>{selectedModule.rotation}°</span>
          </button>
          <button
            onClick={() => removeModule(selectedModule.id)}
            className="flex items-center gap-1 bg-red-950/80 hover:bg-red-900 border border-red-800/80 text-red-300 px-2.5 py-1.5 rounded transition-colors"
            title="Удалить данный модуль"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Dimensions Inputs */}
        <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800 space-y-1.5">
          <div className="text-[11px] font-semibold text-slate-400">Габариты модуля (мм)</div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-[10px] text-slate-500 mb-0.5">Ширина (X)</label>
              <input
                type="number"
                step="50"
                value={selectedModule.width}
                onChange={(e) =>
                  updateModule(selectedModule.id, { width: Number(e.target.value) || 50 })
                }
                className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-500 mb-0.5">Высота (Y)</label>
              <input
                type="number"
                step="50"
                value={selectedModule.height}
                onChange={(e) =>
                  updateModule(selectedModule.id, { height: Number(e.target.value) || 50 })
                }
                className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-500 mb-0.5">Глубина (Z)</label>
              <input
                type="number"
                step="50"
                value={selectedModule.depth}
                onChange={(e) =>
                  updateModule(selectedModule.id, { depth: Number(e.target.value) || 50 })
                }
                className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Position Coordinates */}
        <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800 space-y-1.5">
          <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
            <Move className="w-3.5 h-3.5 text-indigo-400" />
            <span>Положение в пространстве (мм)</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-[10px] text-slate-500 mb-0.5">Позиция X</label>
              <input
                type="number"
                step="50"
                value={selectedModule.x}
                onChange={(e) => updateModule(selectedModule.id, { x: Number(e.target.value) })}
                className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-500 mb-0.5">Высота Y (от пола)</label>
              <input
                type="number"
                step="50"
                value={selectedModule.y}
                onChange={(e) => updateModule(selectedModule.id, { y: Number(e.target.value) })}
                className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-500 mb-0.5">Позиция Z</label>
              <input
                type="number"
                step="50"
                value={selectedModule.z}
                onChange={(e) => updateModule(selectedModule.id, { z: Number(e.target.value) })}
                className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Materials Quick Access */}
        <div className="max-h-52 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
          <MaterialSelector
            label="Материал Корпуса"
            material={selectedModule.carcassMaterial}
            onChange={(mat) => updateModule(selectedModule.id, { carcassMaterial: mat })}
          />
          <MaterialSelector
            label="Материал Фасада"
            material={selectedModule.facadeMaterial}
            onChange={(mat) => updateModule(selectedModule.id, { facadeMaterial: mat })}
          />
        </div>
      </div>
    </div>
  );
};
