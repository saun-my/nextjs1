'use client';

import { useState, useEffect } from 'react';
import { useSmartRecommendations } from '@/app/hooks/useSmartRecommendations';
import { RecommendationResult } from '@/app/lib/learning/types';
import { 
  LightBulbIcon, 
  ClockIcon, 
  StarIcon,
  ArrowRightIcon,
  AcademicCapIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

interface SmartRecommendationPanelProps {
  userId?: string;
  className?: string;
}

export default function SmartRecommendationPanel({ 
  userId = 'demo-user', 
  className = '' 
}: SmartRecommendationPanelProps) {
  const { recommendations, loading, error, refresh } = useSmartRecommendations({ userId, context: 'home', limit: 6 });
  const [selectedRecommendation, setSelectedRecommendation] = useState<RecommendationResult | null>(null);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-700 bg-green-100';
      case 'intermediate': return 'text-yellow-700 bg-yellow-100';
      case 'advanced': return 'text-red-700 bg-red-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'path': return <AcademicCapIcon className="w-5 h-5" />;
      case 'course': return <ChartBarIcon className="w-5 h-5" />;
      default: return <LightBulbIcon className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">智能推荐</h3>
          <button
            onClick={refresh}
            disabled={loading}
            className="text-sm text-blue-600 hover:text-blue-700 disabled:opacity-50"
          >
            刷新
          </button>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={refresh}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            重试
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border ${className}`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">智能推荐</h3>
            <p className="text-sm text-gray-600 mt-1">
              基于你的学习历史和兴趣为你推荐
            </p>
          </div>
          <button
            onClick={refresh}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            刷新
          </button>
        </div>

        {recommendations.length === 0 ? (
          <div className="text-center py-8">
            <LightBulbIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">暂无推荐内容</p>
            <p className="text-sm text-gray-500 mt-1">继续学习以获得个性化推荐</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recommendations.map((recommendation) => (
              <div
                key={recommendation.course.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer"
                onClick={() => setSelectedRecommendation(recommendation)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="text-blue-600">
                      {getIconForType('course')}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {recommendation.course.title}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {recommendation.course.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(recommendation.score >= 80 ? 'high' : recommendation.score >= 60 ? 'medium' : 'low')}`}>
                      {recommendation.score >= 80 ? '高优先级' : recommendation.score >= 60 ? '中优先级' : '低优先级'}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(recommendation.course.difficulty)}`}>
                      {recommendation.course.difficulty === 'beginner' ? '初级' :
                       recommendation.course.difficulty === 'intermediate' ? '中级' : '高级'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <ClockIcon className="w-4 h-4" />
                      <span>{Math.round(recommendation.estimatedCompletionTime / 60)}小时</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <StarIcon className="w-4 h-4" />
                      <span>评分 {Math.round(recommendation.score)}</span>
                    </div>
                  </div>
                  <ArrowRightIcon className="w-4 h-4" />
                </div>

                {recommendation.reasons.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="space-y-1">
                      {recommendation.reasons.slice(0, 2).map((reason, index) => (
                        <div key={index} className="flex items-center space-x-2 text-xs text-gray-600">
                          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                          <span>{reason}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedRecommendation && (
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-900">推荐详情</h4>
            <button
              onClick={() => setSelectedRecommendation(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-3">
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-2">推荐理由</h5>
              <div className="space-y-2">
                {selectedRecommendation.reasons.map((reason, index) => (
                  <div key={index} className="flex items-start space-x-2 text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-600">{reason}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex space-x-3 pt-3">
              <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors">
                开始学习
              </button>
              <button className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-50 transition-colors">
                稍后查看
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
