'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  DashboardWidget, 
  DashboardLayout, 
  DashboardData, 
  SmartInsight,
  ChartData,
  MetricData,
  TableData 
} from '@/app/lib/dashboard/types';
import {
  generateChartData,
  generateMetricData,
  generateTableData,
  generateSmartInsights,
  generateRealtimeUpdate
} from '@/app/lib/dashboard/data-generator';

interface UseSmartDashboardProps {
  layoutId?: string;
  autoRefresh?: boolean;
  refreshInterval?: number;
  enableInsights?: boolean;
  enableRealtime?: boolean;
}

interface UseSmartDashboardReturn {
  layout: DashboardLayout | null;
  data: DashboardData;
  insights: SmartInsight[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  updateWidget: (widgetId: string, data: any) => void;
  updateLayout: (layout: DashboardLayout) => void;
  refreshWidget: (widgetId: string) => Promise<void>;
  exportData: (format: 'json' | 'csv' | 'pdf') => void;
}

export function useSmartDashboard({
  layoutId = 'default',
  autoRefresh = true,
  refreshInterval = 30000, // 30秒
  enableInsights = true,
  enableRealtime = true
}: UseSmartDashboardProps): UseSmartDashboardReturn {
  const [layout, setLayout] = useState<DashboardLayout | null>(null);
  const [data, setData] = useState<DashboardData>({
    widgets: {},
    metadata: {
      lastUpdated: new Date(),
      refreshStatus: {},
      totalWidgets: 0,
      activeWidgets: 0
    }
  });
  const [insights, setInsights] = useState<SmartInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const realtimeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // 生成默认布局
  const generateDefaultLayout = useCallback((): DashboardLayout => {
    return {
      id: 'default',
      name: '智能仪表板',
      description: 'AI驱动的智能数据仪表板',
      widgets: [
        {
          id: 'revenue-chart',
          type: 'chart',
          title: '收入趋势',
          dataSource: 'revenue',
          config: {
            chartType: 'line',
            colorScheme: ['#3B82F6', '#10B981'],
            showLegend: true,
            showGrid: true,
            animation: true
          },
          size: 'large',
          position: { x: 0, y: 0, w: 8, h: 4 },
          refreshInterval: 30000,
          interactive: true
        },
        {
          id: 'active-users',
          type: 'metric',
          title: '活跃用户',
          dataSource: 'users',
          config: {
            format: 'number',
            showTrend: true,
            colorScheme: ['#3B82F6']
          },
          size: 'small',
          position: { x: 8, y: 0, w: 4, h: 2 },
          refreshInterval: 15000
        },
        {
          id: 'engagement-rate',
          type: 'metric',
          title: '学习参与度',
          dataSource: 'engagement',
          config: {
            format: 'percentage',
            showTrend: true,
            colorScheme: ['#10B981']
          },
          size: 'small',
          position: { x: 8, y: 2, w: 4, h: 2 },
          refreshInterval: 15000
        },
        {
          id: 'top-courses',
          type: 'table',
          title: '热门课程',
          dataSource: 'courses',
          config: {
            showPagination: true,
            pageSize: 5,
            enableSorting: true
          },
          size: 'medium',
          position: { x: 0, y: 4, w: 6, h: 6 },
          refreshInterval: 60000
        },
        {
          id: 'learning-progress',
          type: 'progress',
          title: '学习进度',
          dataSource: 'progress',
          config: {
            showPercentage: true,
            colorScheme: ['#F59E0B', '#10B981', '#3B82F6']
          },
          size: 'medium',
          position: { x: 6, y: 4, w: 6, h: 6 },
          refreshInterval: 30000
        }
      ],
      gridConfig: {
        cols: 12,
        rowHeight: 80,
        margin: [16, 16],
        containerPadding: [0, 0]
      },
      theme: 'light',
      breakpoints: {
        lg: 1200,
        md: 996,
        sm: 768,
        xs: 480,
        xxs: 0
      },
      layouts: {
        lg: [],
        md: [],
        sm: [],
        xs: [],
        xxs: []
      }
    };
  }, []);

  // 获取组件数据
  const fetchWidgetData = useCallback(async (widget: DashboardWidget): Promise<any> => {
    try {
      switch (widget.type) {
        case 'chart':
          return generateChartData(widget.config.chartType || 'line');
        
        case 'metric':
          return generateMetricData(widget.dataSource as any);
        
        case 'table':
          return generateTableData(widget.dataSource as any);
        
        case 'progress':
          return {
            total: 100,
            completed: Math.floor(Math.random() * 100),
            inProgress: Math.floor(Math.random() * 50),
            notStarted: Math.floor(Math.random() * 30)
          };
        
        case 'activity':
          return Array.from({ length: 10 }, (_, i) => ({
            id: `activity-${i}`,
            user: `用户${Math.floor(Math.random() * 100) + 1}`,
            action: ['开始学习', '完成课程', '发表评论', '获得证书'][Math.floor(Math.random() * 4)],
            timestamp: new Date(Date.now() - Math.random() * 86400000)
          }));
        
        case 'calendar':
          return {
            events: Array.from({ length: 20 }, (_, i) => ({
              id: `event-${i}`,
              title: `学习活动 ${i + 1}`,
              date: new Date(Date.now() + Math.random() * 86400000 * 30),
              type: ['课程', '考试', '讨论', '项目'][Math.floor(Math.random() * 4)]
            }))
          };
        
        default:
          return {};
      }
    } catch (error) {
      console.error(`Failed to fetch data for widget ${widget.id}:`, error);
      throw error;
    }
  }, []);

  // 刷新所有数据
  const refreshData = useCallback(async () => {
    if (!layout) return;

    try {
      setLoading(true);
      setError(null);

      const widgetData: Record<string, any> = {};
      const refreshStatus: Record<string, 'loading' | 'success' | 'error'> = {};

      // 并行获取所有组件数据
      const dataPromises = layout.widgets.map(async (widget) => {
        refreshStatus[widget.id] = 'loading';
        try {
          const data = await fetchWidgetData(widget);
          widgetData[widget.id] = data;
          refreshStatus[widget.id] = 'success';
        } catch (error) {
          refreshStatus[widget.id] = 'error';
          console.error(`Error refreshing widget ${widget.id}:`, error);
        }
      });

      await Promise.all(dataPromises);

      // 生成智能洞察
      if (enableInsights) {
        const newInsights = generateSmartInsights(5);
        setInsights(newInsights);
      }

      setData({
        widgets: widgetData,
        metadata: {
          lastUpdated: new Date(),
          refreshStatus,
          totalWidgets: layout.widgets.length,
          activeWidgets: Object.values(refreshStatus).filter(status => status === 'success').length
        }
      });

    } catch (error) {
      setError(error instanceof Error ? error.message : '获取仪表板数据失败');
      console.error('Failed to refresh dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, [layout, enableInsights, fetchWidgetData]);

  // 刷新单个组件
  const refreshWidget = useCallback(async (widgetId: string) => {
    if (!layout) return;

    const widget = layout.widgets.find(w => w.id === widgetId);
    if (!widget) return;

    try {
      setData(prev => ({
        ...prev,
        metadata: {
          ...prev.metadata,
          refreshStatus: {
            ...prev.metadata.refreshStatus,
            [widgetId]: 'loading'
          }
        }
      }));

      const widgetData = await fetchWidgetData(widget);

      setData(prev => ({
        ...prev,
        widgets: {
          ...prev.widgets,
          [widgetId]: widgetData
        },
        metadata: {
          ...prev.metadata,
          refreshStatus: {
            ...prev.metadata.refreshStatus,
            [widgetId]: 'success'
          },
          lastUpdated: new Date()
        }
      }));

    } catch (error) {
      setData(prev => ({
        ...prev,
        metadata: {
          ...prev.metadata,
          refreshStatus: {
            ...prev.metadata.refreshStatus,
            [widgetId]: 'error'
          }
        }
      }));
      console.error(`Failed to refresh widget ${widgetId}:`, error);
    }
  }, [layout, fetchWidgetData]);

  // 更新组件数据
  const updateWidget = useCallback((widgetId: string, newData: any) => {
    setData(prev => ({
      ...prev,
      widgets: {
        ...prev.widgets,
        [widgetId]: newData
      }
    }));
  }, []);

  // 更新布局
  const updateLayout = useCallback((newLayout: DashboardLayout) => {
    setLayout(newLayout);
  }, []);

  // 导出数据
  const exportData = useCallback((format: 'json' | 'csv' | 'pdf') => {
    const dataToExport = {
      layout,
      data,
      insights,
      exportedAt: new Date()
    };

    switch (format) {
      case 'json':
        const jsonBlob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
        const jsonUrl = URL.createObjectURL(jsonBlob);
        const jsonLink = document.createElement('a');
        jsonLink.href = jsonUrl;
        jsonLink.download = `dashboard-data-${new Date().toISOString()}.json`;
        jsonLink.click();
        break;
      
      case 'csv':
        // 简化的CSV导出，实际项目中需要更复杂的逻辑
        const csvData = Object.entries(data.widgets).map(([key, value]) => ({
          widget: key,
          data: JSON.stringify(value)
        }));
        const csvContent = "data:text/csv;charset=utf-8," + 
          "Widget,Data\n" + 
          csvData.map(row => `"${row.widget}","${row.data}"`).join("\n");
        const csvLink = document.createElement('a');
        csvLink.href = encodeURI(csvContent);
        csvLink.download = `dashboard-data-${new Date().toISOString()}.csv`;
        csvLink.click();
        break;
      
      case 'pdf':
        // 这里需要集成PDF生成库，如jsPDF
        console.log('PDF export would be implemented here');
        break;
    }
  }, [layout, data, insights]);

  // 初始化
  useEffect(() => {
    const initDashboard = async () => {
      try {
        setLoading(true);
        
        // 生成默认布局
        const defaultLayout = generateDefaultLayout();
        setLayout(defaultLayout);
        
        // 初始数据加载
        await refreshData();
        
      } catch (error) {
        setError(error instanceof Error ? error.message : '初始化仪表板失败');
        console.error('Failed to initialize dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    initDashboard();
  }, []);

  // 自动刷新
  useEffect(() => {
    if (!autoRefresh) return;

    // 清除现有定时器
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
    }

    // 设置新的定时器
    refreshIntervalRef.current = setInterval(() => {
      refreshData();
    }, refreshInterval);

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [autoRefresh, refreshInterval, refreshData]);

  // 实时更新
  useEffect(() => {
    if (!enableRealtime) return;

    if (realtimeIntervalRef.current) {
      clearInterval(realtimeIntervalRef.current);
    }

    realtimeIntervalRef.current = setInterval(() => {
      const update = generateRealtimeUpdate();
      
      // 更新对应组件的数据
      setData(prev => {
        const currentWidgetData = prev.widgets[update.metric];
        if (currentWidgetData) {
          return {
            ...prev,
            widgets: {
              ...prev.widgets,
              [update.metric]: update.data
            }
          };
        }
        return prev;
      });
    }, 5000); // 5秒更新一次

    return () => {
      if (realtimeIntervalRef.current) {
        clearInterval(realtimeIntervalRef.current);
      }
    };
  }, [enableRealtime]);

  return {
    layout,
    data,
    insights,
    loading,
    error,
    refresh: refreshData,
    updateWidget,
    updateLayout,
    refreshWidget,
    exportData
  };
}

// 演示用的Hook
export function useDemoDashboard() {
  return useSmartDashboard({
    layoutId: 'demo',
    autoRefresh: true,
    refreshInterval: 30000,
    enableInsights: true,
    enableRealtime: true
  });
}