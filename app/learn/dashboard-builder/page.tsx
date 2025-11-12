'use client';

import { useState } from 'react';
import { ModularDashboardBuilder } from '@/app/components/ModularDashboardBuilder';
import { useDemoDashboard } from '@/app/hooks/useSmartDashboard';

export default function DashboardBuilderPage() {
  const [showDemo, setShowDemo] = useState(true);
  const { layout, updateLayout } = useDemoDashboard();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">模块化仪表板构建器</h1>
          <p className="text-gray-600">拖拽式构建个性化学习数据仪表板</p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">拖拽式布局</h3>
            <p className="text-gray-600">通过拖拽组件快速构建个性化仪表板布局</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">多种图表类型</h3>
            <p className="text-gray-600">支持折线图、柱状图、饼图、面积图等多种可视化</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">实时数据</h3>
            <p className="text-gray-600">自动刷新数据，实时监控学习进度和效果</p>
          </div>
        </div>

        {/* Demo Toggle */}
        <div className="mb-6">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={showDemo}
              onChange={(e) => setShowDemo(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-gray-700">显示演示数据</span>
          </label>
        </div>

        {/* Dashboard Builder */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          {layout ? (
            <ModularDashboardBuilder
              layout={layout}
              widgets={layout.widgets}
              onLayoutChange={(newLayout) => updateLayout(newLayout)}
              onWidgetAdd={(widget) => {
                const current = layout.widgets || [];
                updateLayout({ ...layout, widgets: [...current, widget] });
              }}
              onWidgetRemove={(widgetId) => {
                const current = layout.widgets || [];
                updateLayout({ ...layout, widgets: current.filter(w => w.id !== widgetId) });
              }}
              onWidgetUpdate={(widgetId, updates) => {
                const current = layout.widgets || [];
                updateLayout({ ...layout, widgets: current.map(w => w.id === widgetId ? { ...w, ...updates } : w) });
              }}
            />
          ) : (
            <div className="text-center text-gray-600">正在加载布局...</div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">使用说明</h3>
          <div className="space-y-2 text-blue-800">
            <p>• 点击"编辑模式"开始自定义仪表板</p>
            <p>• 拖拽组件到网格区域添加新图表</p>
            <p>• 点击组件右上角的设置图标配置数据</p>
            <p>• 使用拖拽手柄调整组件大小和位置</p>
            <p>• 点击保存按钮保存您的自定义布局</p>
          </div>
        </div>
      </div>
    </div>
  );
}
