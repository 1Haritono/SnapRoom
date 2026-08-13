'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { RoomEditor } from '@/components/RoomEditor';
import { FurnitureEditor } from '@/components/FurnitureEditor';
import { Plan2DView } from '@/components/Plan2DView';
import { Scene3DView } from '@/components/Scene3DView';
import { SelectedModulePanel } from '@/components/SelectedModulePanel';
import { StandaloneMaterialsPanel } from '@/components/StandaloneMaterialsPanel';
import { TopViewBar } from '@/components/TopViewBar';
import { RadialContextMenu } from '@/components/RadialContextMenu';
import { RoomDimensionsBar } from '@/components/RoomDimensionsBar';
import { Box, Home, Eye, LayoutGrid, RotateCw, RotateCcw, RefreshCw, ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from 'lucide-react';

export default function HomeApp() {
  const {
    viewMode,
    setViewMode,
    planRotation,
    rotatePlanClockwise,
    rotatePlanCounterClockwise,
    resetPlanRotation,
    isSidebarCollapsed,
    toggleSidebarCollapsed,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'room' | 'furniture'>('room');

  return (
    <div className="flex h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans relative">
      {/* Left Sidebar Menu - Collapses UPWARDS */}
      <div
        className={`h-full bg-slate-900 border-r border-slate-800 flex flex-col z-20 shadow-2xl transition-all duration-300 relative w-96 ${
          isSidebarCollapsed ? '-translate-y-[calc(100%-4rem)]' : 'translate-y-0'
        }`}
      >
        {/* Toggle Button at the bottom edge of sidebar */}
        <button
          onClick={toggleSidebarCollapsed}
          className="absolute left-1/2 -bottom-6 -translate-x-1/2 px-4 py-0.5 bg-slate-900/95 border-b border-l border-r border-indigo-500/60 rounded-b-lg shadow-lg flex items-center justify-center text-indigo-400 hover:text-white hover:bg-indigo-600 transition-colors gap-1 text-[11px] font-medium z-30"
          title={isSidebarCollapsed ? 'Развернуть меню' : 'Свернуть меню'}
        >
          {isSidebarCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          <span>{isSidebarCollapsed ? 'Настройки помещения и мебели' : 'Свернуть'}</span>
        </button>

        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center gap-2">
            <Box className="w-6 h-6 text-indigo-500" />
            <div>
              <h1 className="font-bold text-base text-white tracking-tight">SnapRoom</h1>
              <p className="text-[10px] text-slate-400">SnapRoom 1.5 — 3D & 2D Конструктор</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-900">
          <button
            onClick={() => {
              setActiveTab('room');
              if (isSidebarCollapsed) toggleSidebarCollapsed();
            }}
            className={`flex-1 py-3 px-2 flex items-center justify-center gap-2 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'room'
                ? 'border-indigo-500 text-indigo-400 bg-slate-800/40'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>1. Помещение</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('furniture');
              if (isSidebarCollapsed) toggleSidebarCollapsed();
            }}
            className={`flex-1 py-3 px-2 flex items-center justify-center gap-2 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'furniture'
                ? 'border-indigo-500 text-indigo-400 bg-slate-800/40'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Box className="w-4 h-4" />
            <span>2. Мебель</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-4">
          {activeTab === 'room' && <RoomEditor />}
          {activeTab === 'furniture' && <FurnitureEditor />}
        </div>

        {/* Footer info */}
        {!isSidebarCollapsed && (
          <div className="p-3 border-t border-slate-800 text-[11px] text-slate-500 text-center bg-slate-900/50">
            Данные сохраняются автоматически в LocalStorage
          </div>
        )}
      </div>

      {/* Viewport (2D / 3D main canvas) */}
      <div className="flex-1 h-full relative flex flex-col">
        {/* Top Control Bar */}
        <div className="absolute top-4 right-4 left-4 z-30 flex items-center justify-between pointer-events-none">
          {/* Info Badge */}
          <div className="bg-slate-900/90 text-slate-300 text-xs px-3 py-1.5 rounded-lg border border-slate-700 backdrop-blur pointer-events-auto">
            <span className="font-semibold text-indigo-400">
              {viewMode === '3D' ? '3D Просмотр' : '2D План'}
            </span>{' '}
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              {viewMode === '3D'
                ? '(Удержание ПКМ — радиальное меню)'
                : '(Перетаскивайте объекты мышкой)'}
            </span>
          </div>

          <div className="flex items-center gap-3 pointer-events-auto">
            {/* 3D Camera View Presets Bar */}
            <TopViewBar />

            {/* 2D Plan View Rotation Toolbar */}
            {viewMode === '2D' && (
              <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-lg border border-slate-700 backdrop-blur shadow-lg text-xs">
                <button
                  onClick={rotatePlanCounterClockwise}
                  className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
                  title="Повернуть вид на 90° против часовой"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={rotatePlanClockwise}
                  className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
                  title="Повернуть вид на 90° по часовой"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
                <button
                  onClick={resetPlanRotation}
                  className="flex items-center gap-1 px-2 py-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                  title="Сбросить угол вида"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{planRotation}°</span>
                </button>
              </div>
            )}

            {/* View Mode Toggle */}
            <div className="flex bg-slate-900/90 p-1 rounded-lg border border-slate-700 backdrop-blur shadow-lg">
              <button
                onClick={() => setViewMode('2D')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                  viewMode === '2D'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Убрать объём (Плоский 2D вид)"
              >
                <LayoutGrid className="w-4 h-4" />
                <span>2D План (Без объёма)</span>
              </button>
              <button
                onClick={() => setViewMode('3D')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                  viewMode === '3D'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Включить объём (Объёмный 3D вид)"
              >
                <Eye className="w-4 h-4" />
                <span>3D Просмотр (С объёмом)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Canvas Display */}
        <div className="w-full h-full">
          {viewMode === '2D' ? <Plan2DView /> : <Scene3DView />}
        </div>
      </div>

      {/* Standalone Materials Collapsible Panel */}
      <StandaloneMaterialsPanel />

      {/* Floating Bottom Dimensions Bar in 3D */}
      {viewMode === '3D' && <RoomDimensionsBar />}

      {/* Floating Selected Object Properties Inspector Panel */}
      <SelectedModulePanel />

      {/* Radial Context Menu for Right Click */}
      <RadialContextMenu />
    </div>
  );
}
