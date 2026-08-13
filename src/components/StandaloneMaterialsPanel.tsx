'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { MaterialSelector } from './MaterialSelector';
import { Layers, ChevronUp, ChevronDown, X } from 'lucide-react';

export const StandaloneMaterialsPanel: React.FC = () => {
  const {
    modules,
    selectedModuleId,
    updateModule,
    defaultCarcassMaterial,
    defaultFacadeMaterial,
    setDefaultCarcassMaterial,
    setDefaultFacadeMaterial,
  } = useAppStore();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const selectedModule = modules.find((m) => m.id === selectedModuleId);

  // If a module is selected, edit selected module materials; otherwise edit global defaults
  const carcassMat = selectedModule ? selectedModule.carcassMaterial : defaultCarcassMaterial;
  const facadeMat = selectedModule ? selectedModule.facadeMaterial : defaultFacadeMaterial;

  const handleCarcassChange = (mat: typeof carcassMat) => {
    if (selectedModule) {
      updateModule(selectedModule.id, { carcassMaterial: mat });
    } else {
      setDefaultCarcassMaterial(mat);
    }
  };

  const handleFacadeChange = (mat: typeof facadeMat) => {
    if (selectedModule) {
      updateModule(selectedModule.id, { facadeMaterial: mat });
    } else {
      setDefaultFacadeMaterial(mat);
    }
  };

  return (
    <div
      className={`fixed top-16 left-4 z-30 transition-all duration-300 ease-in-out select-none ${
        isCollapsed ? '-translate-y-[calc(100%-2.5rem)]' : 'translate-y-0'
      }`}
    >
      <div className="relative w-80 bg-slate-900/95 border border-indigo-500/60 rounded-xl shadow-2xl backdrop-blur p-4 space-y-3 text-slate-200 text-xs">
        {/* Toggle strip button on bottom edge */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute left-1/2 -bottom-6 -translate-x-1/2 px-4 py-0.5 bg-slate-900/95 border-b border-l border-r border-indigo-500/60 rounded-b-lg shadow-lg flex items-center justify-center text-indigo-400 hover:text-white hover:bg-indigo-600 transition-colors gap-1 text-[11px] font-medium"
          title={isCollapsed ? 'Развернуть материалы' : 'Свернуть материалы'}
        >
          {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          <span>{isCollapsed ? 'Материалы' : 'Свернуть'}</span>
        </button>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2 text-indigo-400 font-semibold">
            <Layers className="w-4 h-4" />
            <span>Панель Материалов</span>
          </div>
          <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
            {selectedModule ? 'Выделенный объект' : 'По умолчанию'}
          </span>
        </div>

        {/* Material selectors */}
        <div className="space-y-3 max-h-72 overflow-y-auto pr-1 custom-scrollbar">
          <MaterialSelector
            label="Материал Корпуса"
            material={carcassMat}
            onChange={handleCarcassChange}
          />
          <MaterialSelector
            label="Материал Фасада"
            material={facadeMat}
            onChange={handleFacadeChange}
          />
        </div>
      </div>
    </div>
  );
};
