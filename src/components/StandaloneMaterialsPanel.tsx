'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { MaterialSelector } from './MaterialSelector';
import { Layers, ChevronLeft, ChevronRight, X } from 'lucide-react';

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
      className={`fixed top-20 left-4 z-30 transition-all duration-300 ease-in-out select-none ${
        isCollapsed ? '-translate-x-[calc(100%-2.5rem)]' : 'translate-x-0'
      }`}
    >
      <div className="relative w-80 bg-slate-900/95 border border-indigo-500/60 rounded-xl shadow-2xl backdrop-blur p-4 space-y-3 text-slate-200 text-xs">
        {/* Toggle strip button on right edge */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-9 top-4 w-9 h-10 bg-slate-900/95 border-r border-t border-b border-indigo-500/60 rounded-r-lg shadow-lg flex items-center justify-center text-indigo-400 hover:text-white hover:bg-indigo-600 transition-colors"
          title={isCollapsed ? 'Развернуть панель материалов' : 'Свернуть материалы'}
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
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
