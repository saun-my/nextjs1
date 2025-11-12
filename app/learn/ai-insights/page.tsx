'use client';

import { AIInsightEngine } from '@/app/components/AIInsightEngine';

export default function AIInsightsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI驱动业务洞察</h1>
          <p className="text-gray-600">智能分析学习数据，提供个性化业务建议</p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">智能分析</h3>
            <p className="text-gray-600">AI自动分析学习数据，发现隐藏的模式和趋势</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">趋势预测</h3>
            <p className="text-gray-600">基于历史数据预测未来学习趋势和效果</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">个性化建议</h3>
            <p className="text-gray-600">根据学习行为提供定制化的改进建议</p>
          </div>
        </div>

        {/* AI Insight Engine */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <AIInsightEngine />
        </div>

        {/* Sample Insights */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">示例洞察</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-l-4 border-blue-500">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-gray-900">学习参与度提升</h3>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">趋势</span>
              </div>
              <p className="text-gray-600 mb-3">过去30天，用户平均学习时长增加了23%，特别是在前端开发课程方面表现突出。</p>
              <div className="text-sm text-blue-600 font-medium">置信度: 85%</div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-l-4 border-green-500">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-gray-900">课程完成率优化</h3>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">建议</span>
              </div>
              <p className="text-gray-600 mb-3">建议将复杂课程分解为更小的模块，预计可提升完成率15-20%。</p>
              <div className="text-sm text-green-600 font-medium">置信度: 78%</div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-l-4 border-yellow-500">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-gray-900">学习路径个性化</h3>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">机会</span>
              </div>
              <p className="text-gray-600 mb-3">基于用户行为分析，推荐个性化学习路径可提升学习效果30%。</p>
              <div className="text-sm text-yellow-600 font-medium">置信度: 92%</div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-l-4 border-red-500">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-gray-900">潜在流失风险</h3>
                <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">警告</span>
              </div>
              <p className="text-gray-600 mb-3">检测到部分用户在过去7天内活跃度下降，建议发送个性化提醒。</p>
              <div className="text-sm text-red-600 font-medium">置信度: 67%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}