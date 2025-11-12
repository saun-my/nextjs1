'use client';

import { useState } from 'react';
import { ModularDashboardBuilder } from '@/app/components/ModularDashboardBuilder';
import { AIInsightEngine } from '@/app/components/AIInsightEngine';
import { useDemoDashboard } from '@/app/hooks/useSmartDashboard';

export default function AnalyticsDashboard() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'insights'>('dashboard');
  const { layout, data, loading, error, refresh, updateLayout } = useDemoDashboard();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">智能数据分析仪表板</h1>
          <p className="text-gray-600">实时监控学习进度，获取AI驱动的业务洞察</p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <nav className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'dashboard'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              仪表板
            </button>
            <button
              onClick={() => setActiveTab('insights')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'insights'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              AI洞察
            </button>
          </nav>
        </div>

        {/* Content */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Dashboard Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="text-sm font-medium text-gray-500 mb-1">总访问量</div>
                <div className="text-2xl font-bold text-gray-900">12,543</div>
                <div className="text-sm text-green-600">+12.5%</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="text-sm font-medium text-gray-500 mb-1">活跃用户</div>
                <div className="text-2xl font-bold text-gray-900">3,247</div>
                <div className="text-sm text-green-600">+8.2%</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="text-sm font-medium text-gray-500 mb-1">课程完成率</div>
                <div className="text-2xl font-bold text-gray-900">78.3%</div>
                <div className="text-sm text-blue-600">+3.1%</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="text-sm font-medium text-gray-500 mb-1">平均学习时长</div>
                <div className="text-2xl font-bold text-gray-900">2.4h</div>
                <div className="text-sm text-red-600">-5.3%</div>
              </div>
            </div>

            {/* Modular Dashboard Builder */}
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
              <div className="bg-white rounded-lg shadow-sm border p-6 text-center text-gray-600">正在初始化仪表板...</div>
            )}
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="space-y-6">
            <AIInsightEngine />
          </div>
        )}
      </div>
    </div>
  );
}
