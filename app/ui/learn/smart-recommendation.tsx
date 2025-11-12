'use client';

import { useState, useEffect } from 'react';
import { getLearningRecommendations, getLearningStats, getUserAchievements } from '@/app/lib/learn-data';
import { LearningRecommendation, LearningStats, Achievement } from '@/app/lib/learn-definitions';
import Image from 'next/image';
import Link from 'next/link';

interface SmartRecommendationProps {
  userId: string;
}

export default function SmartRecommendation({ userId }: SmartRecommendationProps) {
  const [recommendations, setRecommendations] = useState<LearningRecommendation[]>([]);
  const [stats, setStats] = useState<LearningStats | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [recs, statsData, achievementsData] = await Promise.all([
          getLearningRecommendations(userId),
          getLearningStats(userId),
          getUserAchievements(userId)
        ]);
        
        setRecommendations(recs);
        setStats(statsData);
        setAchievements(achievementsData.slice(0, 3)); // 只显示最近3个成就
      } catch (error) {
        console.error('Failed to load recommendation data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [userId]);

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const getRecommendationTypeColor = (type: LearningRecommendation['type']) => {
    switch (type) {
      case 'continue': return 'bg-blue-100 text-blue-800';
      case 'next_level': return 'bg-purple-100 text-purple-800';
      case 'related': return 'bg-green-100 text-green-800';
      case 'trending': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRecommendationTypeIcon = (type: LearningRecommendation['type']) => {
    switch (type) {
      case 'continue': return '🎯';
      case 'next_level': return '🚀';
      case 'related': return '🔗';
      case 'trending': return '🔥';
      default: return '💡';
    }
  };

  return (
    <div className="space-y-8">
      {/* 学习统计概览 */}
      {stats && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">学习概览</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.total_courses_completed}</div>
              <div className="text-sm text-gray-600">完成课程</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.total_lessons_completed}</div>
              <div className="text-sm text-gray-600">完成课时</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.total_study_time_hours}h</div>
              <div className="text-sm text-gray-600">学习时长</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.current_streak}</div>
              <div className="text-sm text-gray-600">连续天数</div>
            </div>
          </div>
        </div>
      )}

      {/* 个性化推荐 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">为你推荐</h3>
          <span className="text-sm text-gray-500">基于你的学习历史</span>
        </div>
        
        {recommendations.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">🎓</div>
            <p>开始你的学习之旅吧！</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recommendations.map((rec) => (
              <div key={rec.course_id} className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{getRecommendationTypeIcon(rec.type)}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRecommendationTypeColor(rec.type)}`}>
                      {rec.type === 'continue' && '继续学习'}
                      {rec.type === 'next_level' && '进阶课程'}
                      {rec.type === 'related' && '相关课程'}
                      {rec.type === 'trending' && '热门课程'}
                    </span>
                  </div>
                  <div className="text-sm font-medium text-gray-500">
                    {rec.score}%
                  </div>
                </div>
                
                <h4 className="font-semibold text-gray-900 mb-2">课程标题</h4>
                <p className="text-sm text-gray-600 mb-4">{rec.reason}</p>
                
                <Link
                  href={`/learn/courses/${rec.course_id}`}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                >
                  开始学习
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 最近成就 */}
      {achievements.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">最新成就</h3>
          <div className="grid gap-3 md:grid-cols-3">
            {achievements.map((achievement) => (
              <div key={achievement.id} className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{achievement.icon_url}</div>
                  <div>
                    <h4 className="font-medium text-gray-900">{achievement.title}</h4>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                    <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium ${
                      achievement.rarity === 'legendary' ? 'bg-yellow-100 text-yellow-800' :
                      achievement.rarity === 'epic' ? 'bg-purple-100 text-purple-800' :
                      achievement.rarity === 'rare' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {achievement.rarity === 'legendary' && '传说'}
                      {achievement.rarity === 'epic' && '史诗'}
                      {achievement.rarity === 'rare' && '稀有'}
                      {achievement.rarity === 'common' && '普通'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}