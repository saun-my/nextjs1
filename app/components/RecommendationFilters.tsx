'use client';

import React, { useState, useCallback } from 'react';
import { X, Filter, Clock, BarChart3, Tag } from 'lucide-react';
import { cn } from '@/app/lib/utils';

interface RecommendationFiltersProps {
  filters: any;
  onFiltersChange: (filters: any) => void;
  className?: string;
}

const DIFFICULTY_OPTIONS = [
  { value: 'beginner', label: '初级', color: 'bg-green-100 text-green-800' },
  { value: 'intermediate', label: '中级', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'advanced', label: '高级', color: 'bg-red-100 text-red-800' }
];

const CATEGORY_OPTIONS = [
  { value: 'programming', label: '编程开发' },
  { value: 'design', label: '设计创意' },
  { value: 'business', label: '商业管理' },
  { value: 'marketing', label: '市场营销' },
  { value: 'data-science', label: '数据科学' },
  { value: 'ai-ml', label: '人工智能' }
];

const DURATION_OPTIONS = [
  { value: 'short', label: '少于2小时', maxMinutes: 120 },
  { value: 'medium', label: '2-8小时', minMinutes: 120, maxMinutes: 480 },
  { value: 'long', label: '8小时以上', minMinutes: 480 }
];

export function RecommendationFilters({
  filters,
  onFiltersChange,
  className
}: RecommendationFiltersProps) {
  const [localFilters, setLocalFilters] = useState(filters);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleFilterChange = useCallback((key: string, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  }, [localFilters, onFiltersChange]);

  const toggleArrayFilter = useCallback((key: string, value: string) => {
    const current = localFilters[key] || [];
    const newValues = current.includes(value)
      ? current.filter((v: string) => v !== value)
      : [...current, value];
    handleFilterChange(key, newValues);
  }, [localFilters, handleFilterChange]);

  const clearAllFilters = useCallback(() => {
    const clearedFilters = {
      difficulty: [],
      category: [],
      duration: [],
      excludeCompleted: true,
      maxDifficulty: 'advanced'
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  }, [onFiltersChange]);

  const hasActiveFilters = 
    localFilters.difficulty.length > 0 ||
    localFilters.category.length > 0 ||
    localFilters.duration.length > 0;

  return (
    <div className={cn("bg-white rounded-lg border border-gray-200 p-6", className)}>
      {/* 头部 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-medium text-gray-900">筛选条件</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            清除全部
          </button>
        )}
      </div>

      {/* 基础筛选 */}
      <div className="space-y-6">
        {/* 难度筛选 */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
            <BarChart3 className="h-4 w-4" />
            难度等级
          </label>
          <div className="flex flex-wrap gap-2">
            {DIFFICULTY_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => toggleArrayFilter('difficulty', option.value)}
                className={cn(
                  "px-3 py-2 rounded-lg text-sm font-medium border transition-colors",
                  localFilters.difficulty.includes(option.value)
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* 分类筛选 */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
            <Tag className="h-4 w-4" />
            课程分类
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {CATEGORY_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => toggleArrayFilter('category', option.value)}
                className={cn(
                  "px-3 py-2 rounded-lg text-sm font-medium border transition-colors text-center",
                  localFilters.category.includes(option.value)
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* 时长筛选 */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
            <Clock className="h-4 w-4" />
            课程时长
          </label>
          <div className="flex flex-wrap gap-2">
            {DURATION_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => toggleArrayFilter('duration', option.value)}
                className={cn(
                  "px-3 py-2 rounded-lg text-sm font-medium border transition-colors",
                  localFilters.duration.includes(option.value)
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* 高级选项 */}
        <div className="pt-4 border-t border-gray-200">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-700 font-medium"
          >
            高级选项
            <svg
              className={cn("h-4 w-4 transition-transform", showAdvanced && "rotate-180")}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showAdvanced && (
            <div className="mt-4 space-y-4">
              {/* 排除已完成课程 */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  排除已完成的课程
                </label>
                <button
                  onClick={() => handleFilterChange('excludeCompleted', !localFilters.excludeCompleted)}
                  className={cn(
                    "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                    localFilters.excludeCompleted ? "bg-blue-600" : "bg-gray-200"
                  )}
                >
                  <span
                    className={cn(
                      "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                      localFilters.excludeCompleted ? "translate-x-6" : "translate-x-1"
                    )}
                  />
                </button>
              </div>

              {/* 最大难度限制 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  最大难度等级
                </label>
                <select
                  value={localFilters.maxDifficulty}
                  onChange={(e) => handleFilterChange('maxDifficulty', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="beginner">初级</option>
                  <option value="intermediate">中级</option>
                  <option value="advanced">高级</option>
                  <option value="expert">专家</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 活动筛选标签 */}
      {hasActiveFilters && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {localFilters.difficulty.map((diff: string) => {
              const option = DIFFICULTY_OPTIONS.find(opt => opt.value === diff);
              return option ? (
                <span
                  key={diff}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                >
                  {option.label}
                  <button
                    onClick={() => toggleArrayFilter('difficulty', diff)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ) : null;
            })}
            {localFilters.category.map((cat: string) => {
              const option = CATEGORY_OPTIONS.find(opt => opt.value === cat);
              return option ? (
                <span
                  key={cat}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                >
                  {option.label}
                  <button
                    onClick={() => toggleArrayFilter('category', cat)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ) : null;
            })}
            {localFilters.duration.map((dur: string) => {
              const option = DURATION_OPTIONS.find(opt => opt.value === dur);
              return option ? (
                <span
                  key={dur}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                >
                  {option.label}
                  <button
                    onClick={() => toggleArrayFilter('duration', dur)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ) : null;
            })}
          </div>
        </div>
      )}
    </div>
  );
}