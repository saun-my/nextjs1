'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { Plus, Settings, Save, Eye, EyeOff, Move, Trash2, Edit3 } from 'lucide-react';
import { DashboardWidget, DashboardLayout, WidgetConfig } from '../lib/dashboard/types';
import { SmartChartWidget } from '@/app/components/SmartChartWidget';
import { SmartMetricWidget } from '@/app/components/SmartMetricWidget';
import { SmartTableWidget } from '@/app/components/SmartTableWidget';
import { SmartInsightWidget } from '@/app/components/SmartInsightWidget';
import { cn } from '@/app/lib/utils';

import { 
  generateChartData, 
  generateMetricData, 
  generateTableData
} from '@/app/lib/dashboard/data-generator';

interface ModularDashboardBuilderProps {
  layout: DashboardLayout;
  widgets: DashboardWidget[];
  onLayoutChange: (layout: DashboardLayout) => void;
  onWidgetAdd: (widget: DashboardWidget) => void;
  onWidgetRemove: (widgetId: string) => void;
  onWidgetUpdate: (widgetId: string, updates: Partial<DashboardWidget>) => void;
  className?: string;
}

export function ModularDashboardBuilder({
  layout,
  // 为 widgets 设置默认值，避免父组件未传时为 undefined
  widgets = [],
  onLayoutChange,
  onWidgetAdd,
  onWidgetRemove,
  onWidgetUpdate,
  className
}: ModularDashboardBuilderProps) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [draggedWidget, setDraggedWidget] = useState<string | null>(null);
  const [showWidgetSelector, setShowWidgetSelector] = useState(false);

  // 将组件映射类型限制到实际可用键，避免索引错误
  type WidgetComponentMap = {
    chart: typeof SmartChartWidget;
    metric: typeof SmartMetricWidget;
    table: typeof SmartTableWidget;
    insight: typeof SmartInsightWidget;
  };
  const widgetComponents: WidgetComponentMap = useMemo(() => {
    return {
      chart: SmartChartWidget,
      metric: SmartMetricWidget,
      table: SmartTableWidget,
      insight: SmartInsightWidget
    };
  }, []);

  const availableWidgetTypes = useMemo(() => {
    return [
      { type: 'chart', name: '图表', description: '数据可视化图表' },
      { type: 'metric', name: '指标', description: '关键业务指标' },
      { type: 'table', name: '表格', description: '数据表格展示' }
    ];
  }, []);

  const handleDragStart = useCallback((e: React.DragEvent, widgetId: string) => {
    setDraggedWidget(widgetId);
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (!layout || !Array.isArray(layout.widgets)) {
        // 没有可用的布局时不进行重排，直接退出
        setDraggedWidget(null);
        return;
    }
    if (draggedWidget) {
      const currentIndex = layout.widgets.findIndex(w => w.id === draggedWidget);
      if (currentIndex === -1) {
          setDraggedWidget(null);
          return;
      }
  
      const reordered = [...layout.widgets];
      const [moved] = reordered.splice(currentIndex, 1);
      reordered.splice(targetIndex, 0, moved);
  
      const updatedWidgets = reordered.map((w, idx) => ({
        ...w,
        position: { ...w.position, y: idx }
      }));
  
      onLayoutChange({ ...layout, widgets: updatedWidgets });
      setDraggedWidget(null);
    }
  }, [draggedWidget, layout, onLayoutChange]);

  const handleWidgetAdd = useCallback((type: string) => {
    const newWidget: DashboardWidget = {
      id: `widget-${Date.now()}`,
      type: type as any,
      title: `新${availableWidgetTypes.find(t => t.type === type)?.name}`,
      description: availableWidgetTypes.find(t => t.type === type)?.description,
      size: 'medium',
      // 使用 widgets.length 作为默认顺序，确保不读 undefined.length
      position: { x: 0, y: widgets.length, w: 1, h: 1 },
      config: {} as WidgetConfig,
      dataSource: 'demo'
    };
    onWidgetAdd(newWidget);
    setShowWidgetSelector(false);
  }, [availableWidgetTypes, widgets.length, onWidgetAdd]);

  const handleWidgetRemove = useCallback((widgetId: string) => {
    if (confirm('确定要删除这个组件吗？')) {
      onWidgetRemove(widgetId);
    }
  }, [onWidgetRemove]);

  const handleLayoutSave = useCallback(() => {
    localStorage.setItem('dashboard-layout', JSON.stringify(layout));
    alert('布局已保存！');
  }, [layout]);

  const handleLayoutReset = useCallback(() => {
    if (confirm('确定要重置布局吗？')) {
      localStorage.removeItem('dashboard-layout');
      window.location.reload();
    }
  }, []);

  const renderWidget = useCallback((widget: DashboardWidget, index: number) => {
    const type = widget.type;

    return (
      <div
        key={widget.id}
        className={cn("relative group", isEditMode && "cursor-move")}
        draggable={isEditMode}
        onDragStart={(e) => handleDragStart(e, widget.id)}
        onDragOver={handleDragOver}
        // 使用索引作为目标位置，避免把对象传入需要 number 的参数
        onDrop={(e) => handleDrop(e, index)}
      >
        {isEditMode && (
          <div className="absolute inset-0 bg-blue-500 bg-opacity-10 rounded-lg border-2 border-blue-500 border-dashed z-10 flex items-center justify-center">
            <div className="flex items-center gap-2 text-blue-600 font-medium">
              <Move className="h-4 w-4" />
              拖拽移动
            </div>
          </div>
        )}

        <div className="relative">
          {type === 'chart' && (
            <SmartChartWidget
              widget={widget}
              data={generateChartData(
                (() => {
                  const ct = widget.config?.chartType;
                  const safeCt: 'line' | 'bar' | 'pie' | 'area' =
                    ct === 'line' || ct === 'bar' || ct === 'pie' || ct === 'area' ? ct : 'line';
                  return safeCt;
                })()
              )}
              loading={false}
              error={null}
              className="h-full"
            />
          )}
          {type === 'metric' && (
            <SmartMetricWidget
              widget={widget}
              data={generateMetricData()}
              loading={false}
              error={null}
              className="h-full"
            />
          )}
          {type === 'table' && (
            <SmartTableWidget
              widget={widget}
              data={generateTableData()}
              loading={false}
              error={null}
              className="h-full"
            />
          )}
          {/* 移除 insight 分支 */}
          <SmartInsightWidget
            widget={widget}
            data={generateSmartInsights(5)}
            loading={false}
            error={null}
            className="h-full"
          />

          {isEditMode && (
            <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => handleWidgetRemove(widget.id)}
                className="p-1 bg-red-600 text-white rounded hover:bg-red-700"
                title="删除"
              >
                <Trash2 className="h-3 w-3" />
              </button>
              <button
                onClick={() => {
                  const newTitle = prompt('修改标题:', widget.title);
                  if (newTitle) {
                    onWidgetUpdate(widget.id, { title: newTitle });
                  }
                }}
                className="p-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                title="编辑"
              >
                <Edit3 className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }, [isEditMode, handleDragStart, handleDragOver, handleDrop, handleWidgetRemove, onWidgetUpdate]);

  const generateMockData = useCallback((type: string) => {
    switch (type) {
      case 'chart':
        return {
          labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
          datasets: [{
            label: '销售额',
            data: [12000, 19000, 15000, 25000, 22000, 30000],
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
          }]
        };
      
      case 'metric':
        return {
          label: '本月销售额',
          value: 125000,
          format: 'currency',
          unit: 'CNY',
          change: 15.2,
          trend: 'up' as const,
          target: 150000
        };
      
      case 'table':
        return {
          headers: [
            { key: 'name', label: '姓名' },
            { key: 'email', label: '邮箱' },
            { key: 'status', label: '状态' },
            { key: 'createdAt', label: '创建时间' }
          ],
          rows: [
            { id: 1, name: '张三', email: 'zhang@example.com', status: '活跃', createdAt: '2024-01-15' },
            { id: 2, name: '李四', email: 'li@example.com', status: '待激活', createdAt: '2024-01-14' },
            { id: 3, name: '王五', email: 'wang@example.com', status: '活跃', createdAt: '2024-01-13' }
          ],
          actions: [
            { id: 'view', label: '查看', variant: 'primary' },
            { id: 'edit', label: '编辑', variant: 'secondary' }
          ]
        };
      
      case 'insight':
        return [
          {
            id: '1',
            title: '销售增长机会',
            description: '本月销售额相比上月增长15.2%，建议加大营销投入以维持增长势头。',
            type: 'opportunity',
            priority: 'high',
            category: '销售',
            confidence: 85,
            impact: '高',
            recommendation: '建议增加营销预算20%，重点关注高转化率的渠道。'
          },
          {
            id: '2',
            title: '用户活跃度下降',
            description: '最近7天用户活跃度下降8%，需要关注用户体验。',
            type: 'warning',
            priority: 'medium',
            category: '用户',
            confidence: 72,
            impact: '中',
            recommendation: '建议优化用户界面，增加互动功能。'
          }
        ];
      
      default:
        return {};
    }
  }, []);

  return (
    <div className={cn("relative", className)}>
      {/* 工具栏 */}
      <div className="flex items-center justify-between mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold text-gray-900">模块化仪表板</h2>
          <div className="text-sm text-gray-600">
            共 {widgets.length} 个组件
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {isEditMode && (
            <>
              <button
                onClick={() => setShowWidgetSelector(true)}
                className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                添加组件
              </button>
              
              <button
                onClick={handleLayoutSave}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save className="h-4 w-4" />
                保存布局
              </button>
              
              <button
                onClick={handleLayoutReset}
                className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                重置
              </button>
            </>
          )}
          
          <button
            onClick={() => setIsEditMode(!isEditMode)}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-lg transition-colors",
              isEditMode
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-blue-600 text-white hover:bg-blue-700"
            )}
          >
            {isEditMode ? (
              <>
                <Eye className="h-4 w-4" />
                退出编辑
              </>
            ) : (
              <>
                <Settings className="h-4 w-4" />
                编辑模式
              </>
            )}
          </button>
        </div>
      </div>

      {/* 组件选择器 */}
      {showWidgetSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">添加组件</h3>
            <div className="space-y-2">
              {availableWidgetTypes.map(type => (
                <button
                  key={type.type}
                  onClick={() => handleWidgetAdd(type.type)}
                  className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="font-medium text-gray-900">{type.name}</div>
                  <div className="text-sm text-gray-600">{type.description}</div>
                </button>
              ))}
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowWidgetSelector(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 仪表板网格 */}
      <div className={cn(
        "grid gap-6",
        (layout?.gridConfig?.cols ?? 3) >= 4 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
        (layout?.gridConfig?.cols ?? 3) === 3 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
        (layout?.gridConfig?.cols ?? 3) <= 2 && "grid-cols-1 md:grid-cols-2"
      )}>
        {/* 统一使用 widgets 渲染，避免访问 layout.widgets */}
        {widgets.map((widget, idx) => renderWidget(widget, idx))}
      </div>

      {/* 空状态 */}
      {widgets.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Settings className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">还没有组件</h3>
          <p className="text-gray-600 mb-4">点击编辑模式开始添加组件</p>
          <button
            onClick={() => setIsEditMode(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            开始编辑
          </button>
        </div>
      )}
    </div>
  );
}

export default ModularDashboardBuilder;


function renderWidget(widget: DashboardWidget) {
  if (widget.type === 'chart') {
    const ct = widget.config?.chartType;
    const safeCt: 'line' | 'bar' | 'pie' | 'area' =
      ct === 'line' || ct === 'bar' || ct === 'pie' || ct === 'area' ? ct : 'line';
    return (
      <SmartChartWidget
        widget={widget}
        data={generateChartData(safeCt)}
        loading={false}
        error={null}
        className="h-full"
      />
    );
  }

  if (widget.type === 'metric') {
    return (
      <SmartMetricWidget
        widget={widget}
        data={generateMetricData()}
        loading={false}
        error={null}
        className="h-full"
      />
    );
  }

  if (widget.type === 'table') {
    return (
      <SmartTableWidget
        widget={widget}
        data={generateTableData()}
        loading={false}
        error={null}
        className="h-full"
      />
    );
  }

  if (widget.type === 'activity' || widget.type === 'calendar' || widget.type === 'progress') {
    return <div className="rounded-md border p-4 text-gray-600">Widget type: {widget.type}</div>;
  }

  return <div className="rounded-md border p-4 text-gray-600">Unsupported widget type</div>;
}