'use client';

import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { MaterialConfig, MaterialType } from '@/types';
import { Layers, Image as ImageIcon } from 'lucide-react';

interface MaterialSelectorProps {
  label: string;
  material: MaterialConfig;
  onChange: (mat: MaterialConfig) => void;
}

export const MaterialSelector: React.FC<MaterialSelectorProps> = ({ label, material, onChange }) => {
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...material, type: e.target.value as MaterialType });
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...material, color: e.target.value });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        onChange({
          ...material,
          textureUrl: event.target.result as string,
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const removeTexture = () => {
    onChange({
      ...material,
      textureUrl: undefined,
    });
  };

  return (
    <div className="bg-slate-800 p-3 rounded-lg border border-slate-700 mb-3 text-sm text-slate-200">
      <div className="flex items-center gap-2 font-medium mb-2 text-indigo-400">
        <Layers className="w-4 h-4" />
        <span>{label}</span>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-2">
        <div>
          <label className="block text-xs text-slate-400 mb-1">Тип материала</label>
          <select
            value={material.type}
            onChange={handleTypeChange}
            className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
          >
            <option value="ЛДСП">ЛДСП</option>
            <option value="МДФ">МДФ</option>
            <option value="АГТ">АГТ</option>
          </select>
        </div>

        <div>
          <label className="block text-xs text-slate-400 mb-1">Цвет (основа)</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={material.color}
              onChange={handleColorChange}
              className="w-8 h-7 bg-slate-900 border border-slate-700 rounded cursor-pointer p-0"
            />
            <span className="text-xs font-mono text-slate-400">{material.color}</span>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-xs text-slate-400 mb-1">Текстура / Фото картинка</label>
        {material.textureUrl ? (
          <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded border border-slate-700">
            <img src={material.textureUrl} alt="Material texture" className="w-8 h-8 object-cover rounded" />
            <span className="text-xs text-emerald-400 flex-1 truncate">Текстура загружена</span>
            <button
              onClick={removeTexture}
              className="text-xs text-red-400 hover:text-red-300 px-1 py-0.5"
              title="Удалить текстуру"
            >
              ✕
            </button>
          </div>
        ) : (
          <label className="flex items-center justify-center gap-1.5 border border-dashed border-slate-600 hover:border-indigo-500 rounded p-1.5 cursor-pointer bg-slate-900/50 hover:bg-slate-900 text-xs text-slate-400 hover:text-slate-200 transition-colors">
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Загрузить фото картинки</span>
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </label>
        )}
      </div>
    </div>
  );
};
