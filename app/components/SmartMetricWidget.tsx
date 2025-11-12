'use client';

import React, { useState, useCallback } from 'react';
import { TrendingUp, TrendingDown, Minus, RefreshCw, Download, Settings } from 'lucide-react';
import { DashboardWidget } from '@/app/lib/dashboard/types';
import { MetricData } from '@/app/lib/dashboard/types';
import { cn } from '@/app/lib/utils';

interface SmartMetricWidgetProps {
  widget: DashboardWidget;
  data: MetricData;
  loading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
  onExport?: (format: 'json' | 'csv') => void;
  onSettings?: () => void;
  className?: string;
}

export function SmartMetricWidget({
  widget,
  data,
  loading = false,
  error = null,
  onRefresh,
  onExport,
  onSettings,
  className
}: SmartMetricWidgetProps) {
  const [showSettings, setShowSettings] = useState(false);

  const formatValue = useCallback((value: number, format?: string, unit?: string) => {
    let formatted = value.toString();
    
    switch (format) {
      case 'currency':
        formatted = new Intl.NumberFormat('zh-CN', {
          style: 'currency',
          currency: 'CNY',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(value);
        break;
      
      case 'percentage':
        formatted = `${value.toFixed(1)}%`;
        break;
      
      case 'duration':
        if (value < 60) {
          formatted = `${value}分钟`;
        } else {
          const hours = Math.floor(value / 60);
          const minutes = value % 60;
          formatted = minutes > 0 ? `${hours}小时${minutes}分钟` : `${hours}小时`;
        }
        break;
      
      default:
        formatted = new Intl.NumberFormat('zh-CN').format(value);
        break;
    }
    
    return formatted;
  }, []);

  const getTrendIcon = useCallback((trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4" />;
      case 'down':
        return <TrendingDown className="h-4 w-4" />;
      case 'stable':
        return <Minus className="h-4 w-4" />;
      default:
        return null;
    }
  }, []);

  const getTrendColor = useCallback((trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      case 'stable':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  }, []);

  const getProgressPercentage = useCallback((current: number, target?: number) => {
    if (!target) return 0;
    return Math.min((current / target) * 100, 100);
  }, []);

  const handleExport = useCallback((format: 'json' | 'csv') => {
    if (onExport) {
      onExport(format);
      return;
    }

    const exportData = {
      widgetId: widget.id,
      metric: data,
      timestamp: new Date()
    };

    switch (format) {
      case 'json':
        const jsonBlob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const jsonUrl = URL.createObjectURL(jsonBlob);
        const jsonLink = document.createElement('a');
        jsonLink.href = jsonUrl;
        jsonLink.download = `${widget.id}-metric-${new Date().toISOString()}.json`;
        jsonLink.click();
        break;
      
      case 'csv':
        const csvContent = "data:text/csv;charset=utf-8," + 
          "Metric,Value,Change,Trend,Target,Timestamp\n" +
          `"${data.label}","${data.value}","${data.change || 0}","${data.trend || 'stable'}","${data.target || 'N/A'}","${new Date().toISOString()}"`;
        const csvLink = document.createElement('a');
        csvLink.href = encodeURI(csvContent);
        csvLink.download = `${widget.id}-metric-${new Date().toISOString()}.csv`;
        csvLink.click();
        break;
    }
  }, [data, onExport, widget.id]);

  if (loading) {
    return (
      <div className={cn("bg-white rounded-lg shadow-sm border border-gray-200 p-6", className)}>
        <div className="flex items-center justify-between mb-4">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-16"></div>
          </div>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
        </div>
        <div className="h-12 bg-gray-200 rounded-lg animate-pulse mb-4"></div>
        <div className="h-2 bg-gray-200 rounded-full animate-pulse"></div>
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
        <div className="h-32 flex items-center justify-center bg-red-50 rounded-lg border border-red-200">
          <div className="text-center">
            <div className="text-red-500 mb-2">⚠️</div>
            <p className="text-red-700 font-medium text-sm">{error}</p>
            <button
              onClick={onRefresh}
              className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
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
        <div className="space-y-4">
          {/* 主要指标 */}
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {formatValue(data.value, data.format, data.unit)}
            </div>
            <div className="text-sm text-gray-600">{data.label}</div>
          </div>

          {/* 趋势信息 */}
          {data.change !== undefined && data.trend && (
            <div className="flex items-center justify-center gap-2">
              <div className={cn("flex items-center gap-1", getTrendColor(data.trend))}>
                {getTrendIcon(data.trend)}
                <span className="text-sm font-medium">
                  {data.change > 0 ? '+' : ''}{data.change.toFixed(1)}%
                </span>
              </div>
              <span className="text-xs text-gray-500">vs 上期</span>
            </div>
          )}

          {/* 进度条（如果有目标）*/}
          {data.target && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">进度</span>
                <span className="text-gray-900 font-medium">
                  {getProgressPercentage(data.value, data.target).toFixed(0)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getProgressPercentage(data.value, data.target)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>当前</span>
                <span>目标: {formatValue(data.target, data.format, data.unit)}</span>
              </div>
            </div>
          )}

          {/* 额外信息 */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
            <div className="text-center">
              <div className="text-sm text-gray-600">状态</div>
              <div className={cn("text-sm font-medium", getTrendColor(data.trend || 'stable'))}>
                {data.trend === 'up' ? '上升' : data.trend === 'down' ? '下降' : '稳定'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600">更新时间</div>
              <div className="text-sm font-medium text-gray-900">
                {new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SmartMetricSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-16"></div>
        </div>
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
      </div>
      <div className="h-12 bg-gray-200 rounded-lg animate-pulse mb-4"></div>
      <div className="h-2 bg-gray-200 rounded-full animate-pulse"></div>
    </div>
  );
}

export default SmartMetricWidget;