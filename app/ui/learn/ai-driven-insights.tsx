'use client';

import { useState, useEffect } from 'react';
import { SparklesIcon, ArrowTrendingUpIcon, ExclamationTriangleIcon, LightBulbIcon, 
         ChartBarIcon, ClockIcon, AcademicCapIcon } from '@heroicons/react/24/outline';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
         Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';

interface InsightData {
  id: string;
  type: 'trend' | 'anomaly' | 'recommendation' | 'prediction';
  title: string;
  description: string;
  confidence: number; // 0-100
  impact: 'low' | 'medium' | 'high';
  timestamp: string;
  data?: any;
  action_items?: string[];
}

interface TrendData {
  date: string;
  value: number;
  predicted?: boolean;
  confidence_interval?: [number, number];
}

interface AnomalyData {
  date: string;
  value: number;
  is_anomaly: boolean;
  expected_range?: [number, number];
  severity: 'low' | 'medium' | 'high';
}

export default function AIDrivenInsights() {
  const [insights, setInsights] = useState<InsightData[]>([]);
  const [selectedInsight, setSelectedInsight] = useState<InsightData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'trends' | 'anomalies' | 'recommendations'>('all');

  // 模拟AI洞察数据生成
  const generateAIInsights = (): InsightData[] => {
    return [
      {
        id: '1',
        type: 'trend',
        title: 'Learning Efficiency Increasing',
        description: 'Your study efficiency has improved by 23% over the past 2 weeks. You are completing lessons 15% faster while maintaining the same accuracy.',
        confidence: 87,
        impact: 'high',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        data: {
          trend: 'upward',
          percentage_change: 23,
          time_period: '2 weeks'
        },
        action_items: [
          'Continue your current study routine',
          'Consider increasing your daily study time slightly',
          'Focus on more challenging topics while maintaining efficiency'
        ]
      },
      {
        id: '2',
        type: 'anomaly',
        title: 'Unusual Study Pattern Detected',
        description: 'Your study time dropped significantly on Tuesday and Wednesday. This is 40% below your weekly average.',
        confidence: 92,
        impact: 'medium',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        data: {
          anomaly_type: 'drop',
          percentage_change: -40,
          affected_days: ['Tuesday', 'Wednesday']
        },
        action_items: [
          'Review what caused the study time reduction',
          'Plan makeup sessions if possible',
          'Consider adjusting your schedule to prevent future drops'
        ]
      },
      {
        id: '3',
        type: 'prediction',
        title: 'Course Completion Prediction',
        description: 'Based on your current pace, you are likely to complete your current course 3 days ahead of schedule.',
        confidence: 78,
        impact: 'medium',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        data: {
          predicted_completion: '3 days ahead',
          current_progress: 67,
          estimated_completion_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        },
        action_items: [
          'Consider starting the next course early',
          'Use extra time for review and practice',
          'Explore advanced topics in the current subject area'
        ]
      },
      {
        id: '4',
        type: 'recommendation',
        title: 'Optimal Study Time Recommendation',
        description: 'AI analysis suggests studying between 9-11 AM for maximum retention. Your current 7 PM sessions show 20% lower retention rates.',
        confidence: 85,
        impact: 'high',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        data: {
          optimal_time: '9-11 AM',
          current_time: '7 PM',
          retention_improvement: 20
        },
        action_items: [
          'Try shifting study sessions to morning hours',
          'Experiment with different time slots',
          'Track retention rates to validate the recommendation'
        ]
      },
      {
        id: '5',
        type: 'trend',
        title: 'Quiz Performance Trending Up',
        description: 'Your quiz scores have shown consistent improvement over the past month, with a 12% increase in average score.',
        confidence: 91,
        impact: 'medium',
        timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
        data: {
          trend: 'upward',
          percentage_change: 12,
          time_period: '1 month'
        },
        action_items: [
          'Continue with current study methods',
          'Challenge yourself with more difficult quizzes',
          'Help other students who might be struggling'
        ]
      }
    ];
  };

  // 生成趋势数据
  const generateTrendData = (): TrendData[] => {
    const data: TrendData[] = [];
    const now = new Date();
    
    // 历史数据（过去30天）
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      data.push({
        date: date.toISOString().split('T')[0],
        value: 70 + Math.sin(i * 0.2) * 10 + Math.random() * 5,
        predicted: false
      });
    }
    
    // 预测数据（未来7天）
    for (let i = 1; i <= 7; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() + i);
      
      const baseValue = 75 + Math.sin((29 + i) * 0.2) * 10;
      
      data.push({
        date: date.toISOString().split('T')[0],
        value: baseValue,
        predicted: true,
        confidence_interval: [baseValue - 3, baseValue + 3]
      });
    }
    
    return data;
  };

  // 生成异常数据
  const generateAnomalyData = (): AnomalyData[] => {
    const data: AnomalyData[] = [];
    const now = new Date();
    
    for (let i = 14; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      const baseValue = 60 + Math.sin(i * 0.3) * 15;
      const isAnomaly = Math.random() < 0.15; // 15% 异常概率
      
      data.push({
        date: date.toISOString().split('T')[0],
        value: isAnomaly ? baseValue + (Math.random() - 0.5) * 40 : baseValue + Math.random() * 5,
        is_anomaly: isAnomaly,
        expected_range: [baseValue - 10, baseValue + 10],
        severity: isAnomaly ? (Math.random() > 0.5 ? 'high' : 'medium') : 'low'
      });
    }
    
    return data;
  };

  // 获取洞察图标
  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'trend': return ArrowTrendingUpIcon;
      case 'anomaly': return ExclamationTriangleIcon;
      case 'prediction': return SparklesIcon;
      case 'recommendation': return LightBulbIcon;
      default: return ChartBarIcon;
    }
  };

  // 获取影响颜色
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  // 获取类型颜色
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'trend': return 'text-blue-600 bg-blue-50';
      case 'anomaly': return 'text-red-600 bg-red-50';
      case 'prediction': return 'text-purple-600 bg-purple-50';
      case 'recommendation': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  // 过滤洞察
  const filteredInsights = insights.filter(insight => 
    activeTab === 'all' || insight.type === activeTab.slice(0, -1)
  );

  useEffect(() => {
    setIsLoading(true);
    
    // 模拟AI分析延迟
    setTimeout(() => {
      const aiInsights = generateAIInsights();
      setInsights(aiInsights);
      setIsLoading(false);
    }, 2000);
  }, []);

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="animate-pulse">
            <div className="flex items-center space-x-3 mb-6">
              <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* 页面头部 */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 p-2 rounded-lg">
              <SparklesIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">AI-Powered Learning Insights</h2>
              <p className="text-gray-600">Intelligent analysis of your learning patterns and recommendations</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              {insights.length} Insights
            </div>
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              AI Powered
            </div>
          </div>
        </div>

        {/* 标签页 */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {[
            { key: 'all', label: 'All Insights', count: insights.length },
            { key: 'trends', label: 'Trends', count: insights.filter(i => i.type === 'trend').length },
            { key: 'anomalies', label: 'Anomalies', count: insights.filter(i => i.type === 'anomaly').length },
            { key: 'recommendations', label: 'Recommendations', count: insights.filter(i => i.type === 'recommendation').length }
          ].map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === key
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {label} ({count})
            </button>
          ))}
        </div>
      </div>

      {/* 洞察列表 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredInsights.map((insight) => {
          const IconComponent = getInsightIcon(insight.type);
          
          return (
            <div
              key={insight.id}
              className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedInsight(insight)}
            >
              <div className="p-6">
                {/* 洞察头部 */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${getTypeColor(insight.type)}`}>
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{insight.title}</h3>
                      <p className="text-sm text-gray-500 capitalize">{insight.type}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(insight.impact)}`}>
                      {insight.impact} impact
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(insight.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* 洞察描述 */}
                <p className="text-gray-700 text-sm mb-4">{insight.description}</p>

                {/* 置信度 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">Confidence:</span>
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${insight.confidence}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-600 font-medium">{insight.confidence}%</span>
                  </div>
                  
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    View Details →
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 详细洞察模态框 */}
      {selectedInsight && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${getTypeColor(selectedInsight.type)}`}>
                    {(() => {
                      const IconComponent = getInsightIcon(selectedInsight.type);
                      return <IconComponent className="h-6 w-6" />;
                    })()}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{selectedInsight.title}</h2>
                    <p className="text-sm text-gray-500 capitalize">{selectedInsight.type} Analysis</p>
                  </div>
                </div>
                
                <button
                  onClick={() => setSelectedInsight(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="space-y-6">
                {/* 详细描述 */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Analysis Details</h3>
                  <p className="text-gray-700">{selectedInsight.description}</p>
                </div>

                {/* 数据可视化 */}
                {(selectedInsight.type === 'trend' || selectedInsight.type === 'prediction') && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Trend Visualization</h3>
                    <div className="h-64 bg-gray-50 rounded-lg p-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={generateTrendData()}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Line 
                            type="monotone" 
                            dataKey="value" 
                            stroke="#3B82F6" 
                            strokeWidth={2}
                            dot={{ r: 3 }}
                          />
                          <ReferenceLine x={new Date().toISOString().split('T')[0]} stroke="#9CA3AF" strokeDasharray="5 5" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}

                {selectedInsight.type === 'anomaly' && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Anomaly Detection</h3>
                    <div className="h-64 bg-gray-50 rounded-lg p-4">
                      <ResponsiveContainer width="100%" height="100%">
                        {(() => {
                          const data = generateAnomalyData();
                          return (
                            <BarChart data={data}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="date" />
                              <YAxis />
                              <Tooltip />
                              <Bar dataKey="value" fill="#3B82F6">
                                {data.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.is_anomaly ? '#EF4444' : '#3B82F6'} />
                                ))}
                              </Bar>
                            </BarChart>
                          );
                        })()}
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}

                {/* 行动建议 */}
                {selectedInsight.action_items && selectedInsight.action_items.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Recommended Actions</h3>
                    <div className="space-y-2">
                      {selectedInsight.action_items.map((action, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                          <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </div>
                          <p className="text-gray-700">{action}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 置信度和统计信息 */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Confidence Level</div>
                      <div className="flex items-center space-x-2">
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                            style={{ width: `${selectedInsight.confidence}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-900">{selectedInsight.confidence}%</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Impact Level</div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getImpactColor(selectedInsight.impact)}`}>
                        {selectedInsight.impact.toUpperCase()} Impact
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}