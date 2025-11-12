'use client';

import React from 'react';
import { BookOpen, Sparkles, TrendingUp } from 'lucide-react';
import { SmartRecommendationGrid } from '@/app/components/SmartRecommendationGrid';

export default function SmartPathPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 页面头部 */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-full p-3">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              智能学习路径推荐
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              基于AI算法分析您的学习偏好、技能水平和职业目标，为您推荐最适合的学习路径
            </p>
          </div>

          {/* 特色功能展示 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">个性化推荐</h3>
              <p className="text-gray-600">
                根据您的学习历史、技能评估和兴趣偏好，提供量身定制的学习建议
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <BookOpen className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">智能路径规划</h3>
              <p className="text-gray-600">
                分析技能差距，推荐最优学习顺序，帮助您高效达成学习目标
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">实时优化</h3>
              <p className="text-gray-600">
                持续学习您的反馈，不断优化推荐算法，提供更精准的建议
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 推荐内容区域 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <SmartRecommendationGrid
          title="为您推荐的课程"
          subtitle="基于您的学习画像和当前技能水平，我们为您精选了以下课程"
          userId="demo-user"
          context="learning-path"
          limit={9}
          showFilters={true}
          showHeader={true}
          className="mb-12"
        />

        {/* 学习路径建议 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">推荐学习路径</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">前端开发路径</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <div>
                    <div className="font-medium text-gray-900">HTML & CSS 基础</div>
                    <div className="text-sm text-gray-600">构建网页的基础知识</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <div>
                    <div className="font-medium text-gray-900">JavaScript 核心</div>
                    <div className="text-sm text-gray-600">掌握编程逻辑和语法</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <div>
                    <div className="font-medium text-gray-900">React 框架</div>
                    <div className="text-sm text-gray-600">构建现代化用户界面</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">后端开发路径</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <div>
                    <div className="font-medium text-gray-900">Node.js 基础</div>
                    <div className="text-sm text-gray-600">服务器端JavaScript</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <div>
                    <div className="font-medium text-gray-900">数据库设计</div>
                    <div className="text-sm text-gray-600">数据存储和管理</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <div>
                    <div className="font-medium text-gray-900">API 开发</div>
                    <div className="text-sm text-gray-600">构建RESTful接口</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}