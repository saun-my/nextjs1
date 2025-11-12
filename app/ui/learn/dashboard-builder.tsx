'use client';

import { useState } from 'react';
import { PlusIcon, CogIcon, TrashIcon, ArrowsPointingOutIcon, ChartBarIcon, 
         ChartPieIcon, TableCellsIcon, EyeIcon } from '@heroicons/react/24/outline';

interface DashboardWidget {
  id: string;
  type: 'chart' | 'metric' | 'table' | 'heatmap' | 'progress' | 'activity';
  title: string;
  size: 'small' | 'medium' | 'large';
  config: {
    dataSource?: string;
    chartType?: 'line' | 'bar' | 'area' | 'pie';
    metric?: string;
    timeRange?: string;
    color?: string;
  };
  position: { x: number; y: number };
}

interface DashboardLayout {
  id: string;
  name: string;
  widgets: DashboardWidget[];
  gridSize: 'desktop' | 'tablet' | 'mobile';
  isDefault: boolean;
}

const WIDGET_TYPES = [
  { type: 'chart', label: 'Chart', icon: ChartPieIcon, description: 'Line/Bar/Area charts' },
  { type: 'metric', label: 'Metric Card', icon: ChartBarIcon, description: 'Single metric display' },
  { type: 'table', label: 'Data Table', icon: TableCellsIcon, description: 'Tabular data view' },
  { type: 'heatmap', label: 'Heatmap', icon: ArrowsPointingOutIcon, description: 'Activity heatmap' },
  { type: 'progress', label: 'Progress', icon: ChartPieIcon, description: 'Progress indicators' },
  { type: 'activity', label: 'Activity Feed', icon: EyeIcon, description: 'Recent activity' }
];

const SAMPLE_LAYOUTS: DashboardLayout[] = [
  {
    id: 'learning-overview',
    name: 'Learning Overview',
    gridSize: 'desktop',
    isDefault: true,
    widgets: [
      {
        id: 'study-time',
        type: 'metric',
        title: 'Study Time',
        size: 'small',
        config: { metric: 'total_study_time', color: 'blue' },
        position: { x: 0, y: 0 }
      },
      {
        id: 'courses-completed',
        type: 'metric',
        title: 'Courses Completed',
        size: 'small',
        config: { metric: 'courses_completed', color: 'green' },
        position: { x: 1, y: 0 }
      },
      {
        id: 'learning-trend',
        type: 'chart',
        title: 'Learning Trend',
        size: 'large',
        config: { chartType: 'line', dataSource: 'learning_activity' },
        position: { x: 0, y: 1 }
      },
      {
        id: 'activity-heatmap',
        type: 'heatmap',
        title: 'Study Activity',
        size: 'medium',
        config: { dataSource: 'study_sessions' },
        position: { x: 2, y: 0 }
      }
    ]
  }
];

export default function DashboardBuilder() {
  const [currentLayout, setCurrentLayout] = useState<DashboardLayout>(SAMPLE_LAYOUTS[0]);
  const [layouts, setLayouts] = useState<DashboardLayout[]>(SAMPLE_LAYOUTS);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedWidget, setSelectedWidget] = useState<DashboardWidget | null>(null);
  const [showWidgetSelector, setShowWidgetSelector] = useState(false);

  // 添加新组件
  const addWidget = (type: string) => {
    const newWidget: DashboardWidget = {
      id: `widget-${Date.now()}`,
      type: type as any,
      title: `New ${type} Widget`,
      size: 'medium',
      config: {},
      position: { x: 0, y: currentLayout.widgets.length }
    };

    const newLayout = {
      ...currentLayout,
      widgets: [...currentLayout.widgets, newWidget]
    };

    setCurrentLayout(newLayout);
    setLayouts(layouts.map(l => l.id === newLayout.id ? newLayout : l));
    setShowWidgetSelector(false);
    setSelectedWidget(newWidget);
    setIsEditing(true);
  };

  // 删除组件
  const removeWidget = (widgetId: string) => {
    const newLayout = {
      ...currentLayout,
      widgets: currentLayout.widgets.filter(w => w.id !== widgetId)
    };

    setCurrentLayout(newLayout);
    setLayouts(layouts.map(l => l.id === newLayout.id ? newLayout : l));
    setSelectedWidget(null);
  };

  // 更新组件配置
  const updateWidget = (widgetId: string, updates: Partial<DashboardWidget>) => {
    const newLayout = {
      ...currentLayout,
      widgets: currentLayout.widgets.map(w => 
        w.id === widgetId ? { ...w, ...updates } : w
      )
    };

    setCurrentLayout(newLayout);
    setLayouts(layouts.map(l => l.id === newLayout.id ? newLayout : l));
  };

  // 保存布局
  const saveLayout = () => {
    setLayouts(layouts.map(l => l.id === currentLayout.id ? currentLayout : l));
    setIsEditing(false);
    setSelectedWidget(null);
  };

  // 切换布局
  const switchLayout = (layoutId: string) => {
    const layout = layouts.find(l => l.id === layoutId);
    if (layout) {
      setCurrentLayout(layout);
    }
  };

  // 移动组件位置
  const moveWidget = (widgetId: string, direction: 'up' | 'down') => {
    const currentIndex = currentLayout.widgets.findIndex(w => w.id === widgetId);
    if (currentIndex === -1) return;

    const newWidgets = [...currentLayout.widgets];
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    if (targetIndex >= 0 && targetIndex < newWidgets.length) {
      [newWidgets[currentIndex], newWidgets[targetIndex]] = [newWidgets[targetIndex], newWidgets[currentIndex]];
      
      const newLayout = {
        ...currentLayout,
        widgets: newWidgets
      };
      
      setCurrentLayout(newLayout);
      setLayouts(layouts.map(l => l.id === newLayout.id ? newLayout : l));
    }
  };

  // 渲染组件
  const renderWidget = (widget: DashboardWidget, index: number) => {
    const baseClasses = `
      bg-white rounded-lg border shadow-sm p-4 h-full
      ${isEditing ? 'hover:shadow-md' : ''}
      ${selectedWidget?.id === widget.id ? 'ring-2 ring-blue-500' : ''}
    `;

    const sizeClasses = {
      small: 'col-span-1 row-span-1',
      medium: 'col-span-2 row-span-1',
      large: 'col-span-3 row-span-2'
    };

    return (
      <div key={widget.id} className={`${baseClasses} ${sizeClasses[widget.size]}`}>
        {/* 组件头部 */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900">{widget.title}</h3>
          {isEditing && (
            <div className="flex space-x-1">
              <button
                onClick={() => moveWidget(widget.id, 'up')}
                disabled={index === 0}
                className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                title="Move up"
              >
                ↑
              </button>
              <button
                onClick={() => moveWidget(widget.id, 'down')}
                disabled={index === currentLayout.widgets.length - 1}
                className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                title="Move down"
              >
                ↓
              </button>
              <button
                onClick={() => setSelectedWidget(widget)}
                className="p-1 text-gray-400 hover:text-gray-600"
                title="配置"
              >
                <CogIcon className="h-4 w-4" />
              </button>
              <button
                onClick={() => removeWidget(widget.id)}
                className="p-1 text-gray-400 hover:text-red-600"
                title="删除"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* 组件内容 */}
        <div className="flex-1">
          {renderWidgetContent(widget)}
        </div>
      </div>
    );
  };

  // 渲染组件内容
  const renderWidgetContent = (widget: DashboardWidget) => {
    // 这里使用模拟数据，实际应用中应该从 API 获取
    switch (widget.type) {
      case 'metric':
        return (
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 mb-1">1,234</div>
            <div className="text-xs text-gray-500">+12% from last week</div>
          </div>
        );
      
      case 'chart':
        return (
          <div className="h-32 bg-gray-50 rounded flex items-center justify-center">
            <div className="text-gray-400 text-sm">Chart Placeholder</div>
          </div>
        );
      
      case 'table':
        return (
          <div className="h-32 bg-gray-50 rounded flex items-center justify-center">
            <div className="text-gray-400 text-sm">Table Placeholder</div>
          </div>
        );
      
      case 'heatmap':
        return (
          <div className="h-32 bg-gray-50 rounded flex items-center justify-center">
            <div className="text-gray-400 text-sm">Heatmap Placeholder</div>
          </div>
        );
      
      case 'progress':
        return (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-600">
              <span>Course A</span>
              <span>75%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
            </div>
            <div className="flex justify-between text-xs text-gray-600">
              <span>Course B</span>
              <span>45%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: '45%' }}></div>
            </div>
          </div>
        );
      
      case 'activity':
        return (
          <div className="space-y-2 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-700">Completed lesson on React Hooks</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-700">Started new course: Advanced TypeScript</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-gray-700">Earned achievement: Quick Learner</span>
            </div>
          </div>
        );
      
      default:
        return <div className="text-gray-400 text-sm">Unknown widget type</div>;
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 页面头部 */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Builder</h1>
            <p className="text-gray-600 mt-1">Customize your learning analytics dashboard</p>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* 布局选择器 */}
            <div className="flex space-x-2">
              {layouts.map(layout => (
                <button
                  key={layout.id}
                  onClick={() => switchLayout(layout.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentLayout.id === layout.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {layout.name}
                </button>
              ))}
            </div>

            {/* 编辑模式切换 */}
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isEditing
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {isEditing ? 'Exit Edit' : 'Edit Layout'}
            </button>

            {/* 添加组件按钮 */}
            {isEditing && (
              <button
                onClick={() => setShowWidgetSelector(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <PlusIcon className="h-4 w-4" />
                <span>Add Widget</span>
              </button>
            )}

            {/* 保存按钮 */}
            {isEditing && (
              <button
                onClick={saveLayout}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
              >
                Save Layout
              </button>
            )}
          </div>
        </div>

        {/* 仪表板网格 */}
        <div className="grid grid-cols-4 gap-4 auto-rows-fr">
          {currentLayout.widgets.map((widget, index) => renderWidget(widget, index))}
        </div>

        {/* 组件选择器模态框 */}
        {showWidgetSelector && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-96 overflow-hidden">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Add Widget</h2>
                  <button
                    onClick={() => setShowWidgetSelector(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-64">
                <div className="grid grid-cols-2 gap-4">
                  {WIDGET_TYPES.map(({ type, label, icon: Icon, description }) => (
                    <button
                      key={type}
                      onClick={() => addWidget(type)}
                      className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
                    >
                      <div className="flex items-center space-x-3 mb-2">
                        <Icon className="h-6 w-6 text-blue-600" />
                        <span className="font-medium text-gray-900">{label}</span>
                      </div>
                      <p className="text-sm text-gray-600">{description}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 组件配置面板 */}
        {selectedWidget && isEditing && (
          <div className="fixed right-4 top-20 w-80 bg-white rounded-xl shadow-xl border p-6 z-40">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Widget Settings</h3>
              <button
                onClick={() => setSelectedWidget(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={selectedWidget.title}
                  onChange={(e) => updateWidget(selectedWidget.id, { title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
                <select
                  value={selectedWidget.size}
                  onChange={(e) => updateWidget(selectedWidget.id, { size: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data Source</label>
                <select
                  value={selectedWidget.config.dataSource || ''}
                  onChange={(e) => updateWidget(selectedWidget.id, { 
                    config: { ...selectedWidget.config, dataSource: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select data source...</option>
                  <option value="learning_activity">Learning Activity</option>
                  <option value="quiz_scores">Quiz Scores</option>
                  <option value="course_progress">Course Progress</option>
                  <option value="study_sessions">Study Sessions</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}