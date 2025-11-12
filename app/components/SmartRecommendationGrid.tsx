'use client';

import React, { useState, useCallback } from 'react';
import { Filter, RefreshCw, SlidersHorizontal } from 'lucide-react';
import { useDemoRecommendations } from '@/app/hooks/useSmartRecommendations';
import { SmartRecommendationCard, SmartRecommendationSkeleton } from './SmartRecommendationCard';
import { RecommendationFilters } from './RecommendationFilters';
import { cn } from '@/app/lib/utils';

interface SmartRecommendationGridProps {
  title?: string;
  subtitle?: string;
  userId?: string;
  context?: 'home' | 'course-detail' | 'learning-path' | 'search';
  limit?: number;
  showFilters?: boolean;
  showHeader?: boolean;
  className?: string;
  onCourseSelect?: (courseId: string) => void;
  onCourseBookmark?: (courseId: string) => void;
  onCourseStart?: (courseId: string) => void;
}

export function SmartRecommendationGrid({
  title = "为您推荐",
  subtitle = "基于您的学习偏好和进度，为您精选最适合的课程",
  userId = 'demo-user',
  context = 'home',
  limit = 6,
  showFilters = true,
  showHeader = true,
  className,
  onCourseSelect,
  onCourseBookmark,
  onCourseStart
}: SmartRecommendationGridProps) {
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);
  const [filters, setFilters] = useState({
    difficulty: [],
    category: [],
    duration: [],
    excludeCompleted: true,
    maxDifficulty: 'advanced'
  });

  const {
    recommendations,
    loading,
    error,
    refresh,
    hasMore,
    totalCount,
    userProfile
  } = useDemoRecommendations();

  const handleFilterChange = useCallback((newFilters: any) => {
    setFilters(newFilters);
    // 这里可以触发重新获取推荐
  }, []);

  const handleRefresh = useCallback(async () => {
    await refresh();
  }, [refresh]);

  if (error) {
    return (
      <div className={cn("bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center", className)}>
        <div className="text-red-500 mb-2">⚠️</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">获取推荐失败</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={handleRefresh}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          重试
        </button>
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      {/* 头部 */}
      {showHeader && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
              {subtitle && (
                <p className="text-gray-600 mt-1">{subtitle}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              {showFilters && (
                <button
                  onClick={() => setShowFiltersPanel(!showFiltersPanel)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors",
                    showFiltersPanel 
                      ? "bg-blue-50 border-blue-300 text-blue-700" 
                      : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                  )}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  筛选
                </button>
              )}
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
                刷新
              </button>
            </div>
          </div>

          {/* 用户画像信息 */}
          {userProfile && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">您的学习画像</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {userProfile.learningStyle}型学习者，偏好{userProfile.preferredDifficulty}难度
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">{totalCount}</div>
                  <div className="text-xs text-gray-500">推荐课程</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 筛选面板 */}
      {showFiltersPanel && showFilters && (
        <div className="mb-6">
          <RecommendationFilters
            filters={filters}
            onFiltersChange={handleFilterChange}
          />
        </div>
      )}

      {/* 推荐网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          // 加载骨架屏
          Array.from({ length: 6 }).map((_, index) => (
            <SmartRecommendationSkeleton key={index} />
          ))
        ) : recommendations.length === 0 ? (
          // 空状态
          <div className="col-span-full text-center py-12">
            <div className="text-gray-400 mb-4">
              <BookOpen className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">暂无推荐课程</h3>
            <p className="text-gray-600 mb-4">试试调整筛选条件或刷新推荐</p>
            <button
              onClick={handleRefresh}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              刷新推荐
            </button>
          </div>
        ) : (
          // 推荐卡片
          recommendations.map((recommendation) => (
            <SmartRecommendationCard
              key={recommendation.course.id}
              recommendation={recommendation}
              onSelect={onCourseSelect}
              onBookmark={onCourseBookmark}
              onStartLearning={onCourseStart}
              showExplanations={true}
              showProgress={true}
            />
          ))
        )}
      </div>

      {/* 加载更多 */}
      {hasMore && !loading && (
        <div className="text-center mt-8">
          <button
            onClick={() => {
              // 这里可以实现加载更多逻辑
              console.log('Load more recommendations');
            }}
            className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            加载更多推荐
          </button>
        </div>
      )}
    </div>
  );
}

export default SmartRecommendationGrid;