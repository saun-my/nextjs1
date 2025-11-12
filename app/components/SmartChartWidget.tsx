'use client';

import React, { useState, useCallback } from 'react';
import { Line, Bar, Pie, Scatter, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  RadialLinearScale,
  ChartOptions
} from 'chart.js';
import { RefreshCw, Download, Settings, TrendingUp } from 'lucide-react';
import { DashboardWidget, ChartData } from '../lib/dashboard/types';
import { cn } from '@/app/lib/utils';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  RadialLinearScale
);

interface SmartChartWidgetProps {
  widget: DashboardWidget;
  data: ChartData;
  loading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
  onExport?: (format: 'png' | 'csv' | 'json') => void;
  onSettings?: () => void;
  className?: string;
}

export function SmartChartWidget({
  widget,
  data,
  loading = false,
  error = null,
  onRefresh,
  onExport,
  onSettings,
  className
}: SmartChartWidgetProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [selectedDataset, setSelectedDataset] = useState(0);

  const { config } = widget;
  const chartType = config.chartType || 'line';

  // 图表配置选项
  const getChartOptions = useCallback(() => {
    const baseOptions = {
      responsive: config.responsive !== false,
      maintainAspectRatio: false,
      // 明确限制为 false | undefined，避免被推断为 boolean
      animation: config.animation === false ? (false as false) : undefined,
      plugins: {
        legend: {
          display: config.showLegend !== false,
          position: 'top' as const,
        },
        title: {
          display: false,
        },
        tooltip: {
          enabled: true,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#fff',
          bodyColor: '#fff',
          borderColor: '#374151',
          borderWidth: 1,
          cornerRadius: 6,
        }
      },
      scales: {
        x: {
          display: config.showGrid !== false,
          grid: {
            display: config.showGrid !== false,
            color: '#E5E7EB'
          }
        },
        y: {
          display: config.showGrid !== false,
          grid: {
            display: config.showGrid !== false,
            color: '#E5E7EB'
          }
        }
      }
    };

    // 根据图表类型调整配置
    switch (chartType) {
      case 'pie': {
        // 移除 scales 属性以匹配 Pie 的类型
        const { scales, ...rest } = baseOptions;
        return rest;
      }
      case 'radar':
        return {
          ...baseOptions,
          scales: {
            r: {
              beginAtZero: true,
              grid: {
                color: '#E5E7EB'
              }
            }
          }
        };
      default:
        return baseOptions;
    }
  }, [chartType, config]);

  // 渲染图表
  const renderChart = useCallback(() => {
    if (loading || error || !data) {
      return null;
    }

    const effectiveData = chartType === 'area'
      ? { ...data, datasets: data.datasets.map((ds) => ({ ...ds, fill: true })) }
      : data;

    const options = getChartOptions();

    switch (chartType) {
      case 'line':
        return (
          <Line
            data={effectiveData}
            options={options as ChartOptions<'line'>}
            className="w-full h-full"
          />
        );
      case 'bar':
        return (
          <Bar
            data={effectiveData}
            options={options as ChartOptions<'bar'>}
            className="w-full h-full"
          />
        );
      case 'pie':
        return (
          <Pie
            data={effectiveData}
            options={options as ChartOptions<'pie'>}
            className="w-full h-full"
          />
        );
      case 'area':
        return (
          <Line
            data={effectiveData}
            options={options as ChartOptions<'line'>}
            className="w-full h-full"
          />
        );
      case 'scatter':
        return (
          <Scatter
            data={effectiveData}
            options={options as ChartOptions<'scatter'>}
            className="w-full h-full"
          />
        );
      case 'radar':
        return (
          <Radar
            data={effectiveData}
            options={options as ChartOptions<'radar'>}
            className="w-full h-full"
          />
        );
      default:
        return (
          <Line
            data={effectiveData}
            options={options as ChartOptions<'line'>}
            className="w-full h-full"
          />
        );
    }
  }, [chartType, data, loading, error, getChartOptions]);

  // 导出功能
  const handleExport = useCallback((format: 'png' | 'csv' | 'json') => {
    if (onExport) {
      onExport(format);
      return;
    }

    // 默认导出逻辑
    switch (format) {
      case 'csv':
        const csvData = data.datasets.map((dataset, index) => ({
          label: dataset.label,
          data: dataset.data.join(',')
        }));
        const csvContent = "data:text/csv;charset=utf-8," + 
          "Label,Data\n" + 
          csvData.map(row => `"${row.label}","${row.data}"`).join("\n");
        const csvLink = document.createElement('a');
        csvLink.href = encodeURI(csvContent);
        csvLink.download = `${widget.id}-data-${new Date().toISOString()}.csv`;
        csvLink.click();
        break;
      
      case 'json':
        const jsonBlob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const jsonUrl = URL.createObjectURL(jsonBlob);
        const jsonLink = document.createElement('a');
        jsonLink.href = jsonUrl;
        jsonLink.download = `${widget.id}-data-${new Date().toISOString()}.json`;
        jsonLink.click();
        break;
      
      case 'png':
        // 这里需要实现图表截图功能
        console.log('PNG export would be implemented with canvas');
        break;
    }
  }, [data, onExport, widget.id]);

  if (loading) {
    return (
      <div className={cn("bg-white rounded-lg shadow-sm border border-gray-200 p-6", className)}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{widget.title}</h3>
            {widget.description && (
              <p className="text-sm text-gray-600 mt-1">{widget.description}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          </div>
        </div>
        <div className="h-64 bg-gray-100 rounded-lg animate-pulse" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("bg-white rounded-lg shadow-sm border border-gray-200 p-6", className)}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{widget.title}</h3>
            {widget.description && (
              <p className="text-sm text-gray-600 mt-1">{widget.description}</p>
            )}
          </div>
          <button
            onClick={onRefresh}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
        <div className="h-64 flex items-center justify-center bg-red-50 rounded-lg border border-red-200">
          <div className="text-center">
            <div className="text-red-500 mb-2">⚠️</div>
            <p className="text-red-700 font-medium">{error}</p>
            <button
              onClick={onRefresh}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
            >
              重试
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("bg-white rounded-lg shadow-sm border border-gray-200", className)}>
      {/* 头部 */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{widget.title}</h3>
          {widget.description && (
            <p className="text-sm text-gray-600 mt-1">{widget.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            title="刷新"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
          
          <div className="relative">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              title="设置"
            >
              <Settings className="h-4 w-4" />
            </button>
            
            {showSettings && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                <div className="py-1">
                  <button
                    onClick={() => {
                      handleExport('csv');
                      setShowSettings(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Download className="h-4 w-4 inline mr-2" />
                    导出CSV
                  </button>
                  <button
                    onClick={() => {
                      handleExport('json');
                      setShowSettings(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Download className="h-4 w-4 inline mr-2" />
                    导出JSON
                  </button>
                  {onSettings && (
                    <button
                      onClick={() => {
                        onSettings();
                        setShowSettings(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Settings className="h-4 w-4 inline mr-2" />
                      高级设置
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="p-6">
        <div className="h-80">
          {renderChart()}
        </div>
        
        {/* 数据摘要 */}
        {data.datasets && data.datasets.length > 0 && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-gray-900">数据摘要</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              {data.datasets.map((dataset, index) => {
                const total = dataset.data.reduce((sum, value) => sum + (typeof value === 'number' ? value : 0), 0);
                const average = total / dataset.data.length;
                return (
                  <div key={index} className="text-center">
                    <div className="text-lg font-semibold text-gray-900">
                      {dataset.label}
                    </div>
                    <div className="text-xs text-gray-600">
                      总计: {total.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-600">
                      平均: {average.toFixed(1)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SmartChartWidget;