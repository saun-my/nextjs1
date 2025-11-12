'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  BookOpenIcon,
  AcademicCapIcon,
  ChartBarIcon,
  BoltIcon,
  MagnifyingGlassIcon,
  TrophyIcon,
  FireIcon,
  ClockIcon,
  ChartPieIcon,
  CogIcon,
  SparklesIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import { getUserLearningProgress, getLearningStats } from '@/app/lib/learn-data';
import { UserLearningProgress, LearningStats } from '@/app/lib/learn-definitions';

interface EnhancedNavCard {
  title: string;
  desc: string;
  href: string;
  icon: any;
  color: string;
  progress?: number;
  badge?: string;
  badgeColor?: string;
}

interface LearnNavGridEnhancedProps {
  userId: string;
}

export default function LearnNavGridEnhanced({ userId }: LearnNavGridEnhancedProps) {
  const [userProgress, setUserProgress] = useState<UserLearningProgress | null>(null);
  const [stats, setStats] = useState<LearningStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProgress() {
      try {
        const [progress, statsData] = await Promise.all([
          getUserLearningProgress(userId),
          getLearningStats(userId)
        ]);
        setUserProgress(progress);
        setStats(statsData);
      } catch (error) {
        console.error('Failed to load user progress:', error);
      } finally {
        setLoading(false);
      }
    }

    loadProgress();
  }, [userId]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(i => (
          <div key={i} className="rounded-xl border bg-white p-4 shadow-sm animate-pulse">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-200 mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  // 计算总体进度
  const overallProgress = (userProgress?.course_progress?.length ?? 0) > 0
    ? Math.round(
        (userProgress?.course_progress?.reduce((sum, cp) => sum + cp.completion_percentage, 0) ?? 0) /
        (userProgress?.course_progress?.length ?? 1)
      )
    : 0;

  // 获取正在学习的课程数量
  const activeCourses = userProgress?.course_progress
    ? userProgress.course_progress.filter(cp => cp.completion_percentage > 0 && cp.completion_percentage < 100).length
    : 0;

  // 获取最近获得的成就
  const recentAchievements = userProgress?.achievements?.slice(0, 2) ?? [];

  const cards: EnhancedNavCard[] = [
    {
      title: 'Browse Courses',
      desc: 'Explore curated English courses by level and topic.',
      href: '/learn/courses',
      icon: BookOpenIcon,
      color: 'bg-blue-50',
      progress: overallProgress,
      badge: activeCourses > 0 ? `${activeCourses} active` : undefined,
      badgeColor: 'bg-blue-100 text-blue-800',
    },
    {
      title: 'Continue Learning',
      desc: 'Pick up where you left off in your current courses.',
      href: '/learn/courses?filter=active',
      icon: FireIcon,
      color: 'bg-orange-50',
      badge: (stats?.current_streak ?? 0) > 0 ? `${stats!.current_streak} day streak` : undefined,
      badgeColor: 'bg-orange-100 text-orange-800',
    },
    {
      title: 'Smart Path',
      desc: 'AI-powered personalized learning recommendations.',
      href: '/learn/smart-path',
      icon: SparklesIcon,
      color: 'bg-purple-50',
      badge: 'AI推荐',
      badgeColor: 'bg-purple-100 text-purple-800',
    },
    {
      title: 'Interactive Learning',
      desc: 'Hands-on coding exercises and interactive lessons.',
      href: '/learn/interactive',
      icon: AcademicCapIcon,
      color: 'bg-yellow-50',
      badge: 'New',
      badgeColor: 'bg-green-100 text-green-800',
    },
    {
      title: 'Collaborative Learning',
      desc: 'Learn together with real-time collaboration and chat.',
      href: '/learn/collaborate',
      icon: UserGroupIcon,
      color: 'bg-blue-50',
      badge: '协作',
      badgeColor: 'bg-blue-100 text-blue-800',
    },
    {
      title: 'AI Insights',
      desc: 'Get AI-powered recommendations and predictions.',
      href: '/learn/ai-insights',
      icon: ChartPieIcon,
      color: 'bg-indigo-50',
      badge: 'AI',
      badgeColor: 'bg-indigo-100 text-indigo-800',
    },
    {
      title: 'Dashboard Builder',
      desc: 'Create custom learning dashboards with drag-and-drop.',
      href: '/learn/dashboard-builder',
      icon: CogIcon,
      color: 'bg-teal-50',
      badge: 'Custom',
      badgeColor: 'bg-teal-100 text-teal-800',
    },
    {
      title: 'Practice',
      desc: 'Quick exercises to reinforce what you learned.',
      href: '/learn/practice',
      icon: AcademicCapIcon,
      color: 'bg-yellow-50',
      badge: (stats?.total_lessons_completed ?? 0) > 0 ? `${stats!.total_lessons_completed} completed` : undefined,
      badgeColor: 'bg-yellow-100 text-yellow-800',
    },
    {
      title: 'My Progress',
      desc: 'Track completed lessons and scores.',
      href: '/learn/progress',
      icon: ChartBarIcon,
      color: 'bg-purple-50',
      progress: (stats?.total_courses_completed ?? 0) > 0 ? 100 : 0,
      badge: `${stats?.total_courses_completed ?? 0} courses done`,
      badgeColor: 'bg-purple-100 text-purple-800',
    },
    {
      title: 'Achievements',
      desc: 'View your earned badges and milestones.',
      href: '/learn/progress?tab=achievements',
      icon: TrophyIcon,
      color: 'bg-yellow-50',
      badge: recentAchievements.length > 0 ? `${recentAchievements.length} new` : undefined,
      badgeColor: 'bg-yellow-100 text-yellow-800',
    },
    {
      title: 'Study Time',
      desc: 'Manage your learning schedule and goals.',
      href: '/learn/progress?tab=schedule',
      icon: ClockIcon,
      color: 'bg-green-50',
      badge: (stats?.total_study_time_hours ?? 0) > 0 ? `${Math.round(stats!.total_study_time_hours!)}h total` : undefined,
      badgeColor: 'bg-green-100 text-green-800',
    },
    {
      title: 'Smart Path',
      desc: 'AI-powered personalized learning recommendations.',
      href: '/learn/smart-path',
      icon: ChartPieIcon,
      color: 'bg-purple-50',
      badge: 'AI推荐',
      badgeColor: 'bg-purple-100 text-purple-800',
    },
    {
      title: 'Search Courses',
      desc: 'Find specific topics or skills to learn.',
      href: '/learn/search',
      icon: MagnifyingGlassIcon,
      color: 'bg-gray-50',
      badge: 'Search',
      badgeColor: 'bg-gray-100 text-gray-800',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {cards.map(({ title, desc, href, icon: Icon, color, progress, badge, badgeColor }) => (
        <Link
          key={title}
          href={href}
          className="rounded-xl border bg-white p-4 shadow-sm transition-all hover:shadow-md hover:scale-105 group"
        >
          <div className="flex items-start justify-between mb-3">
            <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${color} group-hover:scale-110 transition-transform`}>
              <Icon className="h-6 w-6 text-gray-700" />
            </div>
            {badge && (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${badgeColor}`}>
                {badge}
              </span>
            )}
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
          <p className="text-sm text-gray-600 mb-3">{desc}</p>
          
          {progress !== undefined && progress > 0 && (
            <div className="mt-3">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>进度</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}
          
          {/* 显示最近成就预览 */}
          {title === 'Achievements' && recentAchievements.length > 0 && (
            <div className="mt-3 flex space-x-2">
              {recentAchievements.map((achievement, index) => (
                <div key={index} className="text-lg" title={achievement.title}>
                  {achievement.icon_url}
                </div>
              ))}
            </div>
          )}
        </Link>
      ))}
    </div>
  );
}