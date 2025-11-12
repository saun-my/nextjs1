'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { Brain, TrendingUp, AlertTriangle, CheckCircle, Info, RefreshCw, Download, Settings } from 'lucide-react';
import { DashboardWidget, SmartInsight } from '../lib/dashboard/types';
import { cn } from '@/app/lib/utils';

interface SmartInsightWidgetProps {
  widget: DashboardWidget;
  data: SmartInsight[];
  loading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
  onExport?: (format: 'json' | 'csv') => void;
  onSettings?: () => void;
  className?: string;
}

export function SmartInsightWidget({
  widget,
  data,
  loading = false,
  error = null,
  onRefresh,
  onExport,
  onSettings,
  className
}: SmartInsightWidgetProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [showSettings, setShowSettings] = useState(false);
  // 新增：优先级选择状态
  const [selectedPriority, setSelectedPriority] = useState<string>('all');

  const categories = useMemo(() => {
    const cats = new Set(data.map((insight) => insight.category));
    return Array.from(cats);
  }, [data]);

  const severities = useMemo(() => {
    return ['critical', 'high', 'medium', 'low'];
  }, []);

  // 新增：优先级列表
  const priorities = useMemo(() => {
    return ['high', 'medium', 'low'];
  }, []);

  const filteredInsights = useMemo(() => {
    return data.filter((insight) => {
      const categoryMatch =
        selectedCategory === 'all' || insight.category === selectedCategory;
      const severityMatch =
        selectedSeverity === 'all' || insight.severity === selectedSeverity;
      return categoryMatch && severityMatch;
    });
  }, [data, selectedCategory, selectedSeverity]);

  const getInsightIcon = useCallback((type: string) => {
    switch (type) {
      case 'opportunity':
        return <TrendingUp className="h-5 w-5 text-green-600" />;
      case 'risk':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'achievement':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'trend':
        return <TrendingUp className="h-5 w-5 text-blue-600" />;
      case 'anomaly':
      default:
        return <Info className="h-5 w-5 text-blue-600" />;
    }
  }, []);

  const getSeverityColor = useCallback((severity: string) => {
    switch (severity) {
      case 'critical':
        return 'border-red-300 bg-red-50';
      case 'high':
        return 'border-red-200 bg-red-50';
      case 'medium':
        return 'border-yellow-200 bg-yellow-50';
      case 'low':
        return 'border-blue-200 bg-blue-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  }, []);

  const getSeverityBadgeColor = useCallback((severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-200 text-red-900';
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }, []);

  // 新增：优先级样式
  const getPriorityColor = useCallback((priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-red-200 bg-red-50';
      case 'medium':
        return 'border-yellow-200 bg-yellow-50';
      case 'low':
        return 'border-blue-200 bg-blue-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  }, []);

  const getPriorityBadgeColor = useCallback((priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }, []);

  const handleExport = useCallback((format: 'json' | 'csv') => {
    if (onExport) {
      onExport(format);
      return;
    }

    const exportData = {
      widgetId: widget.id,
      insights: filteredInsights,
      timestamp: new Date(),
    };

    switch (format) {
      case 'json':
        const jsonBlob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const jsonUrl = URL.createObjectURL(jsonBlob);
        const jsonLink = document.createElement('a');
        jsonLink.href = jsonUrl;
        jsonLink.download = `${widget.id}-insights-${new Date().toISOString()}.json`;
        jsonLink.click();
        break;

      case 'csv':
        const csvContent =
          'data:text/csv;charset=utf-8,' +
          '标题,描述,类型,严重程度,类别,置信度,影响,建议,时间戳\n' +
          filteredInsights
            .map((insight) => {
              const firstRec = insight.recommendations?.[0];
              const impact = firstRec?.estimatedImpact || '';
              const recommendationText = firstRec?.text || '';
              return `"${insight.title}","${insight.description}","${insight.type}","${insight.severity}","${insight.category}","${insight.confidence}","${impact}","${recommendationText}","${new Date().toISOString()}"`;
            })
            .join('\n');
        const csvLink = document.createElement('a');
        csvLink.href = encodeURI(csvContent);
        csvLink.download = `${widget.id}-insights-${new Date().toISOString()}.csv`;
        csvLink.click();
        break;
    }
  }, [filteredInsights, widget.id, onExport]);

  if (loading) {
    return (
      <div className={cn("bg-white rounded-lg shadow-sm border border-gray-200", className)}>
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-16"></div>
            </div>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("bg-white rounded-lg shadow-sm border border-gray-200", className)}>
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
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
        </div>
        <div className="p-6">
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
      </div>
    );
  }

  return (
    <div className={cn("bg-white rounded-lg shadow-sm border border-gray-200", className)}>
      {/* 头部 */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Brain className="h-6 w-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{widget.title}</h3>
              {widget.description && (
                <p className="text-sm text-gray-600 mt-1">{widget.description}</p>
              )}
            </div>
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

        {/* 过滤器 */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">类别:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">全部</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
            {/* 修改为严重程度筛选 */}
            <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">严重程度:</label>
                <select
                    value={selectedSeverity}
                    onChange={(e) => setSelectedSeverity(e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value="all">全部</option>
                    {severities.map(severity => (
                        <option key={severity} value={severity}>
                            {severity === 'critical' ? '危急' : severity === 'high' ? '高' : severity === 'medium' ? '中' : '低'}
                        </option>
                    ))}
                </select>
            </div>
        </div>
      </div>

      {/* 洞察内容 */}
      <div className="p-6">
        {filteredInsights.length === 0 ? (
          <div className="text-center py-8">
            <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">暂无相关洞察</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredInsights.map((insight, index) => {
              const firstRec = insight.recommendations?.[0];
              const impact = firstRec?.estimatedImpact || '—';
              return (
                <div
                  key={index}
                  className={cn(
                    "rounded-lg border p-4",
                    // 使用严重程度颜色而非优先级
                    getSeverityColor(insight.severity)
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {getInsightIcon(insight.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-semibold text-gray-900">
                          {insight.title}
                        </h4>
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "px-2 py-1 rounded-full text-xs font-medium",
                            // 使用严重程度徽章颜色
                            getSeverityBadgeColor(insight.severity)
                          )}>
                            {insight.severity === 'critical' ? '危急' : insight.severity === 'high' ? '高' : insight.severity === 'medium' ? '中' : '低'}
                          </span>
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {insight.category}
                          </span>
                        </div>
                      </div>

                      <p className="text-sm text-gray-700 mb-3">
                        {insight.description}
                      </p>

                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <div className="text-xs text-gray-500 mb-1">置信度</div>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${insight.confidence}%` }}
                              />
                            </div>
                            <span className="text-xs font-medium text-gray-700">
                              {insight.confidence}%
                            </span>
                          </div>
                        </div>

                        <div>
                          <div className="text-xs text-gray-500 mb-1">影响程度</div>
                          <div className="text-sm font-medium text-gray-900">
                            {impact}
                          </div>
                        </div>
                      </div>

                      {insight.recommendations?.length > 0 && (
                        <div className="bg-white rounded-lg p-3 border border-gray-200">
                          <div className="text-xs font-medium text-gray-700 mb-2">建议</div>
                          <ul className="space-y-2">
                            {insight.recommendations.map((rec) => (
                              <li key={rec.id} className="flex items-start justify-between gap-2">
                                <div className="text-sm text-gray-600">{rec.text}</div>
                                <span
                                  className={cn(
                                    "px-2 py-0.5 rounded-full text-xs font-medium",
                                    getPriorityBadgeColor(rec.priority)
                                  )}
                                >
                                  {rec.priority === 'high' ? '高优' : rec.priority === 'medium' ? '中优' : '低优'}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 统计信息 */}
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div>
            共 {filteredInsights.length} 条洞察
          </div>
          <div>
            最后更新: {new Date().toLocaleString('zh-CN')}
          </div>
        </div>
      </div>
    </div>
  );
}

export function SmartInsightSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-16"></div>
          </div>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
        </div>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SmartInsightWidget;
