import LearningAnalyticsDashboard from '@/app/ui/learn/learning-analytics-dashboard';
import { Suspense } from 'react';

export default function LearningAnalyticsPage() {
  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Learning Analytics</h1>
          <p className="text-gray-600">Track your learning progress, analyze study patterns, and discover insights to improve your learning journey.</p>
        </div>

        {/* 分析仪表板 */}
        <Suspense fallback={
          <div className="w-full">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-64 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          </div>
        }>
          <LearningAnalyticsDashboard 
            userId="demo-user"
            timeRange="30d"
          />
        </Suspense>
      </div>
    </div>
  );
}