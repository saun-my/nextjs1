'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
         Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { BookOpenIcon, ClockIcon, TrophyIcon, CalendarIcon, FireIcon } from '@heroicons/react/24/outline';
import { LearningStats, UserLearningProgress, CourseProgress } from '@/app/lib/learn-definitions';
import { getLearningStats, getUserLearningProgress } from '@/app/lib/learn-data';

interface LearningAnalyticsData {
  date: string;
  lessons_completed: number;
  study_time_minutes: number;
  quiz_scores: number;
  streak_days: number;
  courses_started: number;
  achievements_earned: number;
}

interface HeatmapData {
  hour: number;
  day: number;
  value: number;
  date: string;
}

interface LearningAnalyticsDashboardProps {
  userId: string;
  timeRange?: '7d' | '30d' | '90d' | '1y';
}

export default function LearningAnalyticsDashboard({ 
  userId, 
  timeRange = '30d' 
}: LearningAnalyticsDashboardProps) {
  const [analyticsData, setAnalyticsData] = useState<LearningAnalyticsData[]>([]);
  const [heatmapData, setHeatmapData] = useState<HeatmapData[]>([]);
  const [userProgress, setUserProgress] = useState<UserLearningProgress | null>(null);
  const [stats, setStats] = useState<LearningStats | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<'lessons_completed' | 'study_time_minutes' | 'quiz_scores'>('lessons_completed');
  const [chartType, setChartType] = useState<'line' | 'area' | 'bar'>('area');
  const [isLoading, setIsLoading] = useState(true);

  // 生成学习分析数据
  const generateLearningAnalytics = (days: number): LearningAnalyticsData[] => {
    const data: LearningAnalyticsData[] = [];
    const now = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      // 模拟学习模式：工作日学习更多
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const baseMultiplier = isWeekend ? 0.6 : 1;
      
      // 添加一些随机性和趋势
      const trendFactor = 1 + (days - i) * 0.002;
      const randomFactor = 0.8 + Math.random() * 0.4;
      
      data.push({
        date: date.toISOString().split('T')[0],
        lessons_completed: Math.round((3 + Math.random() * 5) * baseMultiplier * trendFactor * randomFactor),
        study_time_minutes: Math.round((45 + Math.random() * 60) * baseMultiplier * trendFactor * randomFactor),
        quiz_scores: Math.round((75 + Math.random() * 20) * randomFactor),
        streak_days: Math.min(30, Math.round((days - i) * 0.8)),
        courses_started: Math.round(Math.random() * 0.3),
        achievements_earned: Math.round(Math.random() * 0.5)
      });
    }
    
    return data;
  };

  // 生成热力图数据
  const generateHeatmapData = (): HeatmapData[] => {
    const data: HeatmapData[] = [];
    const now = new Date();
    
    // 生成过去 7 天的数据
    for (let day = 0; day < 7; day++) {
      const date = new Date(now);
      date.setDate(date.getDate() - day);
      
      for (let hour = 0; hour < 24; hour++) {
        // 模拟学习高峰时段
        let baseValue = 0;
        if (hour >= 8 && hour <= 12) baseValue = 80; // 上午学习高峰
        else if (hour >= 14 && hour <= 18) baseValue = 70; // 下午学习
        else if (hour >= 19 && hour <= 22) baseValue = 60; // 晚上学习
        else baseValue = 10; // 其他时间
        
        // 周末减少
        const dayOfWeek = date.getDay();
        const weekendFactor = dayOfWeek === 0 || dayOfWeek === 6 ? 0.5 : 1;
        
        data.push({
          hour,
          day: 6 - day, // 反转，使今天在最后
          value: Math.round((baseValue + Math.random() * 20) * weekendFactor),
          date: date.toISOString().split('T')[0]
        });
      }
    }
    
    return data;
  };

  // 获取热力图颜色
  const getHeatmapColor = (value: number) => {
    if (value === 0) return 'bg-gray-100';
    if (value < 20) return 'bg-blue-200';
    if (value < 40) return 'bg-blue-300';
    if (value < 60) return 'bg-green-400';
    if (value < 80) return 'bg-yellow-400';
    return 'bg-red-400';
  };

  // 获取星期标签
  const getDayLabel = (dayIndex: number) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date().getDay();
    return days[(today + dayIndex) % 7];
  };

  // 获取时间标签
  const getHourLabel = (hour: number) => {
    if (hour === 0) return '12a';
    if (hour < 12) return `${hour}a`;
    if (hour === 12) return '12p';
    return `${hour - 12}p`;
  };

  useEffect(() => {
    setIsLoading(true);
    
    const loadData = async () => {
      try {
        // 模拟数据加载
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365;
        
        // 生成模拟数据
        const analytics = generateLearningAnalytics(days);
        const heatmap = generateHeatmapData();
        
        setAnalyticsData(analytics);
        setHeatmapData(heatmap);
        
        // 模拟用户进度数据
        setUserProgress({
          user_id: userId,
          course_progress: [],
          overall_stats: {
            total_courses_completed: Math.round(analytics.length * 0.1),
            total_lessons_completed: analytics.reduce((sum, d) => sum + d.lessons_completed, 0),
            total_study_time_hours: Math.round(analytics.reduce((sum, d) => sum + d.study_time_minutes, 0) / 60),
            average_score: Math.round(analytics.reduce((sum, d) => sum + d.quiz_scores, 0) / analytics.length),
            current_streak: Math.max(...analytics.map(d => d.streak_days)),
            longest_streak: Math.max(...analytics.map(d => d.streak_days))
          },
          achievements: [],
          learning_streak: Math.max(...analytics.map(d => d.streak_days)),
          last_study_date: new Date()
        });
        
        setStats({
          total_courses_completed: Math.round(analytics.length * 0.1),
          total_lessons_completed: analytics.reduce((sum, d) => sum + d.lessons_completed, 0),
          total_study_time_hours: Math.round(analytics.reduce((sum, d) => sum + d.study_time_minutes, 0) / 60),
          current_streak: Math.max(...analytics.map(d => d.streak_days)),
          longest_streak: Math.max(...analytics.map(d => d.streak_days)),
          average_score: Math.round(analytics.reduce((sum, d) => sum + d.quiz_scores, 0) / analytics.length)
        });
        
      } catch (error) {
        console.error('Failed to load analytics data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [userId, timeRange]);

  // 计算趋势
  const calculateTrend = (data: LearningAnalyticsData[], metric: keyof LearningAnalyticsData) => {
    if (data.length < 2) return 0;
    
    const recent = data.slice(-7).reduce((sum, d) => sum + (d[metric] as number), 0) / 7;
    const previous = data.slice(-14, -7).reduce((sum, d) => sum + (d[metric] as number), 0) / 7;
    
    return previous > 0 ? ((recent - previous) / previous) * 100 : 0;
  };

  // 渲染图表
  const renderChart = () => {
    const commonProps = {
      data: analyticsData,
      margin: { top: 5, right: 30, left: 20, bottom: 5 }
    };

    switch (chartType) {
      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
            <YAxis stroke="#6b7280" fontSize={12} />
            <Tooltip 
              formatter={(value: any, name: string) => [
                name === 'study_time_minutes' ? `${Math.round(value)} min` : value,
                name.replace('_', ' ')
              ]}
            />
            <Line 
              type="monotone" 
              dataKey={selectedMetric} 
              stroke="#3B82F6" 
              strokeWidth={3}
              dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
              animationDuration={1000}
            />
          </LineChart>
        );
      
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
            <YAxis stroke="#6b7280" fontSize={12} />
            <Tooltip 
              formatter={(value: any, name: string) => [
                name === 'study_time_minutes' ? `${Math.round(value)} min` : value,
                name.replace('_', ' ')
              ]}
            />
            <Bar 
              dataKey={selectedMetric} 
              fill="#3B82F6"
              radius={[4, 4, 0, 0]}
              animationDuration={1000}
            />
          </BarChart>
        );
      
      default: // area
        return (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id="learningGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
            <YAxis stroke="#6b7280" fontSize={12} />
            <Tooltip 
              formatter={(value: any, name: string) => [
                name === 'study_time_minutes' ? `${Math.round(value)} min` : value,
                name.replace('_', ' ')
              ]}
            />
            <Area 
              type="monotone" 
              dataKey={selectedMetric} 
              stroke="#3B82F6" 
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#learningGradient)"
              animationDuration={1000}
            />
          </AreaChart>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
      </div>
    );
  }

  const trends = {
    lessons: calculateTrend(analyticsData, 'lessons_completed'),
    studyTime: calculateTrend(analyticsData, 'study_time_minutes'),
    quizScores: calculateTrend(analyticsData, 'quiz_scores')
  };

  return (
    <div className="w-full space-y-6">
      {/* 概览卡片 */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">总学习时间</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total_study_time_hours}h</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <ClockIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4">
              <span className={`text-sm ${
                trends.studyTime >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {trends.studyTime >= 0 ? '↗' : '↘'} {Math.abs(trends.studyTime).toFixed(1)}%
              </span>
              <span className="text-sm text-gray-500 ml-2">vs last week</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">完成课程</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total_courses_completed}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <BookOpenIcon className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-gray-500">持续学习中</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">当前连胜</p>
                <p className="text-2xl font-bold text-gray-900">{stats.current_streak}天</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <FireIcon className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-gray-500">保持学习节奏</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">平均测验分数</p>
                <p className="text-2xl font-bold text-gray-900">{stats.average_score}%</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <TrophyIcon className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4">
              <span className={`text-sm ${
                trends.quizScores >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {trends.quizScores >= 0 ? '↗' : '↘'} {Math.abs(trends.quizScores).toFixed(1)}%
              </span>
              <span className="text-sm text-gray-500 ml-2">vs last week</span>
            </div>
          </div>
        </div>
      )}

      {/* 趋势分析图表 */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Learning Trends</h2>
            <div className="flex items-center space-x-2">
              {/* 指标选择器 */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                {[
                  { key: 'lessons_completed', label: 'Lessons', icon: BookOpenIcon },
                  { key: 'study_time_minutes', label: 'Study Time', icon: ClockIcon },
                  { key: 'quiz_scores', label: 'Quiz Scores', icon: TrophyIcon }
                ].map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setSelectedMetric(key as any)}
                    className={`flex items-center space-x-1 px-3 py-1 text-xs rounded-md transition-colors ${
                      selectedMetric === key
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="h-3 w-3" />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
              
              {/* 图表类型选择器 */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                {[{type: 'area', icon: '📊'}, {type: 'line', icon: '📈'}, {type: 'bar', icon: '📊'}].map(({type: t, icon}) => (
                  <button
                    key={t}
                    onClick={() => setChartType(t as any)}
                    className={`px-2 py-1 text-xs rounded-md transition-colors ${
                      chartType === t
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    title={`切换到${t === 'area' ? '面积图' : t === 'line' ? '折线图' : '柱状图'}`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <ResponsiveContainer width="100%" height={300}>
            {renderChart()}
          </ResponsiveContainer>
        </div>
      </div>

      {/* 学习活动热力图 */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Study Activity Heatmap</h3>
              <p className="text-sm text-gray-600 mt-1">Your learning activity patterns throughout the week</p>
            </div>
            <div className="flex items-center space-x-2">
              <CalendarIcon className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-600">Last 7 days</span>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="overflow-x-auto">
            <div className="grid grid-cols-25 gap-1 min-w-max">
              {/* 时间标签 */}
              <div className="col-span-1"></div>
              {Array.from({ length: 24 }, (_, i) => (
                <div key={i} className="text-xs text-gray-500 text-center w-4">
                  {i % 4 === 0 ? getHourLabel(i) : ''}
                </div>
              ))}
              
              {/* 热力图数据 */}
              {Array.from({ length: 7 }, (_, day) => (
                <div key={day} className="contents">
                  {/* 星期标签 */}
                  <div className="text-xs text-gray-500 text-right pr-2 w-12">
                    {getDayLabel(day)}
                  </div>
                  
                  {/* 热力图格子 */}
                  {Array.from({ length: 24 }, (_, hour) => {
                    const dataPoint = heatmapData.find(d => d.day === day && d.hour === hour);
                    const value = dataPoint?.value || 0;
                    
                    return (
                      <div
                        key={`${day}-${hour}`}
                        className={`w-4 h-4 rounded-sm ${getHeatmapColor(value)} 
                                   hover:ring-2 hover:ring-blue-400 hover:ring-opacity-50 
                                   transition-all cursor-pointer`}
                        title={`${getDayLabel(day)} ${getHourLabel(hour)}: ${value} minutes`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* 图例 */}
          <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
            <span>Less</span>
            <div className="flex space-x-1">
              {['bg-gray-100', 'bg-blue-200', 'bg-blue-300', 'bg-green-400', 'bg-yellow-400', 'bg-red-400'].map((color, index) => (
                <div key={index} className={`w-3 h-3 rounded ${color}`}></div>
              ))}
            </div>
            <span>More</span>
          </div>
        </div>
      </div>
    </div>
  );
}
