'use client';

import React from 'react';
import { Star, Clock, Users, TrendingUp, BookOpen, Award } from 'lucide-react';
import { RecommendationResult } from '@/app/lib/learning/types';
import { cn } from '@/app/lib/utils';

interface SmartRecommendationCardProps {
  recommendation: RecommendationResult;
  onSelect?: (id: string) => void;
  onBookmark?: (id: string) => void;
  onStartLearning?: (id: string) => void;
  variant?: 'default' | 'compact' | 'detailed';
  showExplanations?: boolean;
  showProgress?: boolean;
  className?: string;
}

export function SmartRecommendationCard({
  recommendation,
  onSelect,
  onBookmark,
  onStartLearning,
  variant = 'default',
  showExplanations = true,
  showProgress = true,
  className
}: SmartRecommendationCardProps) {
  const { course, score, reasons, estimatedCompletionTime } = recommendation;
  const { title, description, difficulty, category, tags, rating, enrolledCount, progress } = course;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}分钟`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}小时${remainingMinutes}分钟` : `${hours}小时`;
  };

  if (variant === 'compact') {
    return (
      <div className={cn(
        "bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer",
        className
      )}
      onClick={() => onSelect?.(course.id)}>
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-gray-900 truncate">{title}</h3>
            <p className="text-xs text-gray-500 mt-1">{category}</p>
          </div>
          <div className="flex items-center ml-2">
            <Star className="h-3 w-3 text-yellow-400 fill-current" />
            <span className="text-xs text-gray-600 ml-1">{rating}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-3">
          <span className={cn(
            "px-2 py-1 text-xs rounded-full",
            getDifficultyColor(difficulty)
          )}>
            {difficulty}
          </span>
          <div className="flex items-center text-xs text-gray-500">
            <Clock className="h-3 w-3 mr-1" />
            {formatDuration(estimatedCompletionTime)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300",
      className
    )}>
      {/* 头部 */}
      <div className="relative">
        <div className="h-32 bg-gradient-to-br from-blue-500 to-purple-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-20" />
          <div className="absolute top-4 right-4">
            <div className={cn(
              "px-3 py-1 rounded-full text-xs font-medium",
              getDifficultyColor(difficulty)
            )}>
              {difficulty}
            </div>
          </div>
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-white font-bold text-lg line-clamp-2">{title}</h3>
          </div>
        </div>
        
        {/* 推荐分数徽章 */}
        <div className="absolute -top-2 -right-2 bg-white rounded-full p-2 shadow-lg">
          <div className={cn("text-center", getScoreColor(score * 100))}>
            <div className="text-lg font-bold">{Math.round(score * 100)}</div>
            <div className="text-xs text-gray-500">匹配度</div>
          </div>
        </div>
      </div>

      {/* 内容 */}
      <div className="p-6">
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>
        
        {/* 标签 */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* 统计信息 */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
            <span>{rating}</span>
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            <span>{enrolledCount}人学习</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>{formatDuration(estimatedCompletionTime)}</span>
          </div>
        </div>

        {/* 学习进度 */}
        {showProgress && progress && progress > 0 && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">学习进度</span>
              <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* 推荐理由 */}
        {showExplanations && reasons && reasons.length > 0 && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center mb-2">
              <TrendingUp className="h-4 w-4 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-blue-900">推荐理由</span>
            </div>
            <ul className="text-xs text-blue-800 space-y-1">
              {reasons.slice(0, 2).map((reason, index) => (
                <li key={index} className="flex items-start">
                  <span className="w-1 h-1 bg-blue-600 rounded-full mt-1.5 mr-2 flex-shrink-0" />
                  {reason}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 操作按钮 */}
        <div className="flex gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onStartLearning?.(course.id);
            }}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            {progress && progress > 0 ? '继续学习' : '开始学习'}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onBookmark?.(course.id);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            收藏
          </button>
        </div>
      </div>
    </div>
  );
}

export function SmartRecommendationSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-pulse">
      <div className="h-32 bg-gray-200" />
      <div className="p-6">
        <div className="h-4 bg-gray-200 rounded mb-4" />
        <div className="h-3 bg-gray-200 rounded mb-2" />
        <div className="h-3 bg-gray-200 rounded mb-4 w-2/3" />
        <div className="flex gap-2 mb-4">
          <div className="h-6 bg-gray-200 rounded-full w-16" />
          <div className="h-6 bg-gray-200 rounded-full w-20" />
        </div>
        <div className="h-8 bg-gray-200 rounded-lg" />
      </div>
    </div>
  );
}