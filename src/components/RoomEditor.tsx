'use client';

import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Niche } from '@/types';
import { Home, Plus, Trash2, Upload, FileImage } from 'lucide-react';

export const RoomEditor: React.FC = () => {
  const { room, updateRoom, addNiche, removeNiche, setBackgroundImage } = useAppStore();

  const handleModeChange = (mode: 'dimensions' | 'four_walls') => {
    updateRoom({ mode });
  };

  const handleNicheAdd = () => {
    addNiche({
      wall: 'A',
      offset: 500,
      width: 800,
      depth: 300,
      height: 2000,
    });
  };

  const handleBackgroundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setBackgroundImage(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      {/* Mode selection */}
      <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-700 text-xs">
        <button
          className={`flex-1 py-1.5 rounded-md font-medium transition-colors ${
            room.mode === 'dimensions'
              ? 'bg-indigo-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          onClick={() => handleModeChange('dimensions')}
        >
          Длина × Ширина × Высота
        </button>
        <button
          className={`flex-1 py-1.5 rounded-md font-medium transition-colors ${
            room.mode === 'four_walls'
              ? 'bg-indigo-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          onClick={() => handleModeChange('four_walls')}
        >
          План 4 стен (А, Б, В, Г)
        </button>
      </div>

      {/* Dimensions mode inputs */}
      {room.mode === 'dimensions' && (
        <div className="grid grid-cols-3 gap-2 bg-slate-800 p-3 rounded-lg border border-slate-700">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Длина X (мм)</label>
            <input
              type="number"
              step="50"
              value={room.length}
              onChange={(e) => updateRoom({ length: Number(e.target.value) || 1000 })}
              className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Ширина Z (мм)</label>
            <input
              type="number"
              step="50"
              value={room.width}
              onChange={(e) => updateRoom({ width: Number(e.target.value) || 1000 })}
              className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Высота Y (мм)</label>
            <input
              type="number"
              step="50"
              value={room.height}
              onChange={(e) => updateRoom({ height: Number(e.target.value) || 1000 })}
              className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      )}

      {/* Four walls mode inputs */}
      {room.mode === 'four_walls' && (
        <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
          <div className="text-xs text-slate-400 mb-2">
            Стены по часовой стрелке (А — передняя, Б — правая, В — задняя, Г — левая)
          </div>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Стена А (мм)</label>
              <input
                type="number"
                step="50"
                value={room.wallA}
                onChange={(e) => updateRoom({ wallA: Number(e.target.value) || 1000, length: Number(e.target.value) })}
                className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Стена Б (мм)</label>
              <input
                type="number"
                step="50"
                value={room.wallB}
                onChange={(e) => updateRoom({ wallB: Number(e.target.value) || 1000, width: Number(e.target.value) })}
                className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Стена В (мм)</label>
              <input
                type="number"
                step="50"
                value={room.wallC}
                onChange={(e) => updateRoom({ wallC: Number(e.target.value) || 1000 })}
                className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Стена Г (мм)</label>
              <input
                type="number"
                step="50"
                value={room.wallD}
                onChange={(e) => updateRoom({ wallD: Number(e.target.value) || 1000 })}
                className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Высота помещения (мм)</label>
            <input
              type="number"
              step="50"
              value={room.height}
              onChange={(e) => updateRoom({ height: Number(e.target.value) || 1000 })}
              className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      )}

      {/* Niches support */}
      <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-300">Ниши в стенах</span>
          <button
            onClick={handleNicheAdd}
            className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-2 py-1 rounded transition-colors"
          >
            <Plus className="w-3 h-3" />
            Добавить нишу
          </button>
        </div>

        {room.niches.length === 0 ? (
          <p className="text-xs text-slate-500 italic">Ниш пока нет</p>
        ) : (
          <div className="space-y-2">
            {room.niches.map((niche) => (
              <div key={niche.id} className="bg-slate-900 p-2 rounded border border-slate-700 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400">Стена:</span>
                    <select
                      value={niche.wall}
                      onChange={(e) => {
                        const wall = e.target.value as 'A' | 'B' | 'C' | 'D';
                        updateRoom({
                          niches: room.niches.map((n) => (n.id === niche.id ? { ...n, wall } : n)),
                        });
                      }}
                      className="bg-slate-800 border border-slate-600 rounded px-1.5 py-0.5 text-xs text-slate-200"
                    >
                      <option value="A">А (передняя)</option>
                      <option value="B">Б (правая)</option>
                      <option value="C">В (задняя)</option>
                      <option value="D">Г (левая)</option>
                    </select>
                  </div>
                  <button
                    onClick={() => removeNiche(niche.id)}
                    className="text-red-400 hover:text-red-300 p-1"
                    title="Удалить нишу"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Отступ (мм)</span>
                    <input
                      type="number"
                      step="50"
                      value={niche.offset}
                      onChange={(e) =>
                        updateRoom({
                          niches: room.niches.map((n) =>
                            n.id === niche.id ? { ...n, offset: Number(e.target.value) } : n
                          ),
                        })
                      }
                      className="w-full bg-slate-800 border border-slate-600 rounded px-1 py-0.5 text-slate-200 text-xs"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Ширина (мм)</span>
                    <input
                      type="number"
                      step="50"
                      value={niche.width}
                      onChange={(e) =>
                        updateRoom({
                          niches: room.niches.map((n) =>
                            n.id === niche.id ? { ...n, width: Number(e.target.value) } : n
                          ),
                        })
                      }
                      className="w-full bg-slate-800 border border-slate-600 rounded px-1 py-0.5 text-slate-200 text-xs"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Глубина (мм)</span>
                    <input
                      type="number"
                      step="50"
                      value={niche.depth}
                      onChange={(e) =>
                        updateRoom({
                          niches: room.niches.map((n) =>
                            n.id === niche.id ? { ...n, depth: Number(e.target.value) } : n
                          ),
                        })
                      }
                      className="w-full bg-slate-800 border border-slate-600 rounded px-1 py-0.5 text-slate-200 text-xs"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Room Reference Photo / Plan image */}
      <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
        <label className="block text-xs font-semibold text-slate-300 mb-2">
          Справочное фото / Чертеж комнаты
        </label>
        {room.backgroundImageUrl ? (
          <div className="relative group">
            <img
              src={room.backgroundImageUrl}
              alt="План помещения"
              className="w-full h-28 object-cover rounded border border-slate-700"
            />
            <button
              onClick={() => setBackgroundImage(undefined)}
              className="absolute top-1 right-1 bg-red-600/80 hover:bg-red-600 text-white p-1 rounded text-xs"
              title="Удалить план"
            >
              Удалить
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center gap-1 border border-dashed border-slate-600 hover:border-indigo-500 rounded p-4 cursor-pointer bg-slate-900/50 hover:bg-slate-900 text-xs text-slate-400 hover:text-slate-200 transition-colors">
            <FileImage className="w-5 h-5 text-indigo-400" />
            <span>Загрузить фото/чертеж комнаты</span>
            <span className="text-[10px] text-slate-500">(Отображается как фоновая подложка)</span>
            <input type="file" accept="image/*" onChange={handleBackgroundUpload} className="hidden" />
          </label>
        )}
      </div>
    </div>
  );
};
