'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { Brain, TrendingUp, Users, DollarSign, Eye, Target, Clock, CheckCircle } from 'lucide-react';
import { SmartInsight } from '@/app/lib/dashboard/types';
import { cn } from '@/app/lib/utils';

interface AIInsightEngineProps {
  className?: string;
  onInsightGenerated?: (insights: SmartInsight[]) => void;
}

export function AIInsightEngine({
  className,
  onInsightGenerated
}: AIInsightEngineProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [analysisDepth, setAnalysisDepth] = useState<'basic' | 'advanced' | 'deep'>('advanced');
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  const availableMetrics = useMemo(() => {
    return [
      { id: 'revenue', name: '收入', icon: DollarSign, category: '财务' },
      { id: 'users', name: '用户', icon: Users, category: '用户' },
      { id: 'engagement', name: '参与度', icon: Eye, category: '用户' },
      { id: 'conversion', name: '转化率', icon: Target, category: '营销' },
      { id: 'retention', name: '留存率', icon: CheckCircle, category: '用户' },
      { id: 'performance', name: '性能', icon: Clock, category: '技术' }
    ];
  }, []);

  const generateInsights = useCallback(async () => {
    setIsAnalyzing(true);
    
    // 模拟AI分析过程
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const confidence1 = Math.floor(Math.random() * 30 + 70);
    const confidence2 = Math.floor(Math.random() * 25 + 65);
    const confidence3 = Math.floor(Math.random() * 20 + 75);
    const confidence4 = Math.floor(Math.random() * 15 + 80);

    const mockInsights: SmartInsight[] = [
      {
        id: '1',
        title: '收入趋势异常',
        description: `过去${timeRange === '7d' ? '7天' : timeRange === '30d' ? '30天' : timeRange === '90d' ? '90天' : '1年'}收入增长率下降${Math.floor(Math.random() * 20 + 5)}%，需要立即关注。`,
        type: 'anomaly',
        severity: 'high',
        category: '财务',
        confidence: confidence1,
        dataPoints: [
          { label: 'income_change', value: confidence1, trend: 'down' }
        ],
        recommendations: [
          { id: 'rec-1', text: '建议分析具体下降原因，调整营销策略，优化产品定价。', priority: 'high' }
        ],
        timestamp: new Date(),
        tags: ['收入', '趋势'],
        autoActionable: false
      },
      {
        id: '2',
        title: '用户增长机会',
        description: '发现新的用户获取渠道，预计可提升用户增长15-20%。',
        type: 'opportunity',
        severity: 'medium',
        category: '用户',
        confidence: confidence2,
        dataPoints: [
          { label: 'user_growth_potential', value: confidence2, trend: 'up' }
        ],
        recommendations: [
          { id: 'rec-2', text: '建议投入更多资源到新渠道测试，监控转化效果。', priority: 'medium' }
        ],
        timestamp: new Date(),
        tags: ['用户', '渠道'],
        autoActionable: false
      },
      {
        id: '3',
        title: '系统性能优化',
        description: '检测到系统响应时间增加，可能影响用户体验。',
        type: 'risk',
        severity: 'medium',
        category: '技术',
        confidence: confidence3,
        dataPoints: [
          { label: 'latency_increase', value: confidence3, trend: 'up' }
        ],
        recommendations: [
          { id: 'rec-3', text: '优化数据库查询，增加缓存机制，监控服务器资源。', priority: 'medium' }
        ],
        timestamp: new Date(),
        tags: ['性能', '响应时间'],
        autoActionable: false
      },
      {
        id: '4',
        title: '营销ROI提升',
        description: '最近营销活动效果显著，ROI提升25%。',
        type: 'achievement',
        severity: 'low',
        category: '营销',
        confidence: confidence4,
        dataPoints: [
          { label: 'roi_increase', value: confidence4, trend: 'up' }
        ],
        recommendations: [
          { id: 'rec-4', text: '复制成功营销策略，扩大投放规模。', priority: 'low' }
        ],
        timestamp: new Date(),
        tags: ['营销', 'ROI'],
        autoActionable: true
      }
    ];

    setIsAnalyzing(false);
    
    if (onInsightGenerated) {
      onInsightGenerated(mockInsights);
    }
  }, [timeRange, selectedMetrics, onInsightGenerated]);

  const toggleMetric = useCallback((metricId: string) => {
    setSelectedMetrics(prev => 
      prev.includes(metricId) 
        ? prev.filter(id => id !== metricId)
        : [...prev, metricId]
    );
  }, []);

  const getAnalysisDepthLabel = useCallback((depth: string) => {
    switch (depth) {
      case 'basic':
        return '基础分析 - 快速概览';
      case 'advanced':
        return '高级分析 - 深度洞察';
      case 'deep':
        return '深度分析 - AI预测';
      default:
        return '高级分析';
    }
  }, []);

  const getTimeRangeLabel = useCallback((range: string) => {
    switch (range) {
      case '7d':
        return '最近7天';
      case '30d':
        return '最近30天';
      case '90d':
        return '最近90天';
      case '1y':
        return '最近1年';
      default:
        return '最近30天';
    }
  }, []);

  return (
    <div className={cn("bg-white rounded-lg shadow-sm border border-gray-200 p-6", className)}>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Brain className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">AI洞察引擎</h2>
          <p className="text-sm text-gray-600">智能分析数据，生成业务洞察</p>
        </div>
      </div>

      {/* 分析配置 */}
      <div className="space-y-6">
        {/* 时间范围选择 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            分析时间范围
          </label>
          <div className="grid grid-cols-4 gap-3">
            {(['7d', '30d', '90d', '1y'] as const).map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={cn(
                  "p-3 rounded-lg border text-sm font-medium transition-colors",
                  timeRange === range
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                )}
              >
                {getTimeRangeLabel(range)}
              </button>
            ))}
          </div>
        </div>

        {/* 分析深度 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            分析深度
          </label>
          <div className="space-y-3">
            {(['basic', 'advanced', 'deep'] as const).map(depth => (
              <label key={depth} className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="analysisDepth"
                  value={depth}
                  checked={analysisDepth === depth}
                  onChange={(e) => setAnalysisDepth(e.target.value as any)}
                  className="mr-3 text-blue-600"
                />
                <div>
                  <div className="font-medium text-gray-900">
                    {getAnalysisDepthLabel(depth)}
                  </div>
                  <div className="text-sm text-gray-600">
                    {depth === 'basic' && '快速生成基础洞察'}
                    {depth === 'advanced' && '深度分析数据模式和趋势'}
                    {depth === 'deep' && 'AI预测和高级建模'}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* 指标选择 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            选择分析指标（可选）
          </label>
          <div className="grid grid-cols-2 gap-3">
            {availableMetrics.map(metric => {
              const Icon = metric.icon;
              return (
                <label
                  key={metric.id}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors",
                    selectedMetrics.includes(metric.id)
                      ? "bg-blue-50 border-blue-300"
                      : "bg-white border-gray-200 hover:bg-gray-50"
                  )}
                >
                  <input
                    type="checkbox"
                    checked={selectedMetrics.includes(metric.id)}
                    onChange={() => toggleMetric(metric.id)}
                    className="text-blue-600"
                  />
                  <Icon className="h-5 w-5 text-gray-600" />
                  <div>
                    <div className="font-medium text-gray-900">{metric.name}</div>
                    <div className="text-xs text-gray-500">{metric.category}</div>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* 分析按钮 */}
        <div className="pt-4 border-t border-gray-200">
          <button
            onClick={generateInsights}
            disabled={isAnalyzing}
            className={cn(
              "w-full flex items-center justify-center gap-3 px-6 py-3 rounded-lg font-medium transition-colors",
              isAnalyzing
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            )}
          >
            {isAnalyzing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                AI分析中...
              </>
            ) : (
              <>
                <Brain className="h-5 w-5" />
                开始AI分析
              </>
            )}
          </button>
        </div>

        {/* 分析状态 */}
        {isAnalyzing && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              <div>
                <div className="font-medium text-blue-900">正在分析数据...</div>
                <div className="text-sm text-blue-700 mt-1">
                  AI正在处理您的数据，这可能需要几秒钟时间
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 分析说明 */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">分析说明</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• 基础分析：提供数据概览和基础趋势分析</li>
          <li>• 高级分析：深度挖掘数据模式，识别异常和机会</li>
          <li>• 深度分析：使用AI模型进行预测和高级建模</li>
          <li>• 选择特定指标可以获得更精准的分析结果</li>
        </ul>
      </div>
    </div>
  );
}

export default AIInsightEngine;