'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
         Cell, PieChart, Pie, LineChart, Line, Area, AreaChart } from 'recharts';
import { UsersIcon, ClockIcon, TrendingUpIcon, FireIcon } from '@heroicons/react/24/outline';

interface UserActivityData {
  hour: number;
  active_users: number;
  new_users: number;
  returning_users: number;
  sessions: number;
  avg_session_duration: number;
}

interface UserDemographics {
  name: string;
  value: number;
  color: string;
}

interface EnhancedUserActivityChartProps {
  data?: UserActivityData[];
  demographics?: UserDemographics[];
  type?: 'hourly' | 'daily' | 'weekly';
  showHeatmap?: boolean;
}

export default function EnhancedUserActivityChart({ 
  data = [], 
  demographics = [],
  type = 'hourly',
  showHeatmap = true
}: EnhancedUserActivityChartProps) {
  const [activityData, setActivityData] = useState<UserActivityData[]>([]);
  const [demoData, setDemoData] = useState<UserDemographics[]>([]);
  const [selectedMetric, setSelectedMetric] = useState<'active_users' | 'sessions' | 'avg_session_duration'>('active_users');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSlice, setSelectedSlice] = useState<string | null>(null);

  // 生成模拟数据
  const generateMockActivityData = (type: string): UserActivityData[] => {
    const data: UserActivityData[] = [];
    
    if (type === 'hourly') {
      for (let hour = 0; hour < 24; hour++) {
        // 模拟真实的用户活动模式
        const baseActivity = hour >= 9 && hour <= 17 ? 100 : hour >= 18 && hour <= 23 ? 80 : 40;
        const variation = Math.random() * 30;
        
        data.push({
          hour,
          active_users: Math.round(baseActivity + variation),
          new_users: Math.round((baseActivity + variation) * 0.2),
          returning_users: Math.round((baseActivity + variation) * 0.8),
          sessions: Math.round((baseActivity + variation) * 1.5),
          avg_session_duration: Math.round(300 + Math.random() * 200) // 5-8分钟
        });
      }
    } else if (type === 'daily') {
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      days.forEach((day, index) => {
        const weekendFactor = index >= 5 ? 0.7 : 1;
        const baseActivity = 1000 * weekendFactor;
        
        data.push({
          hour: index,
          active_users: Math.round(baseActivity + Math.random() * 200),
          new_users: Math.round(baseActivity * 0.15 + Math.random() * 50),
          returning_users: Math.round(baseActivity * 0.85 + Math.random() * 150),
          sessions: Math.round(baseActivity * 1.2 + Math.random() * 300),
          avg_session_duration: Math.round(400 + Math.random() * 150)
        });
      });
    }
    
    return data;
  };

  const generateMockDemographics = (): UserDemographics[] => [
    { name: '18-24', value: 25, color: '#3B82F6' },
    { name: '25-34', value: 35, color: '#10B981' },
    { name: '35-44', value: 20, color: '#F59E0B' },
    { name: '45-54', value: 15, color: '#EF4444' },
    { name: '55+', value: 5, color: '#8B5CF6' }
  ];

  useEffect(() => {
    setIsLoading(true);
    
    setTimeout(() => {
      const newActivityData = data.length > 0 ? data : generateMockActivityData(type);
      const newDemoData = demographics.length > 0 ? demographics : generateMockDemographics();
      
      setActivityData(newActivityData);
      setDemoData(newDemoData);
      setIsLoading(false);
    }, 800);
  }, [type, data, demographics]);

  // 热力图颜色计算
  const getHeatmapColor = (value: number, maxValue: number) => {
    const intensity = value / maxValue;
    if (intensity > 0.8) return 'bg-red-500';
    if (intensity > 0.6) return 'bg-orange-400';
    if (intensity > 0.4) return 'bg-yellow-400';
    if (intensity > 0.2) return 'bg-green-400';
    return 'bg-blue-200';
  };

  // 格式化时间
  const formatHour = (hour: number) => {
    if (hour === 0) return '12 AM';
    if (hour < 12) return `${hour} AM`;
    if (hour === 12) return '12 PM';
    return `${hour - 12} PM`;
  };

  // 格式化持续时间
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
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

  const maxValue = Math.max(...activityData.map(d => d[selectedMetric]));

  return (
    <div className="w-full space-y-6">
      {/* 用户活动趋势图 */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">User Activity Trends</h2>
            <div className="flex items-center space-x-2">
              {/* 指标选择器 */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                {[
                  { key: 'active_users', label: 'Users', icon: UsersIcon },
                  { key: 'sessions', label: 'Sessions', icon: FireIcon },
                  { key: 'avg_session_duration', label: 'Duration', icon: ClockIcon }
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
            </div>
          </div>
        </div>

        <div className="p-6">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={activityData}>
              <defs>
                <linearGradient id="userActivityGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey={type === 'hourly' ? 'hour' : 'name'} 
                stroke="#6b7280" 
                fontSize={12}
                tickFormatter={type === 'hourly' ? formatHour : undefined}
              />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip 
                formatter={(value: any, name: string) => {
                  if (name === 'avg_session_duration') {
                    return [formatDuration(value), 'Avg Duration'];
                  }
                  return [value.toLocaleString(), name.replace('_', ' ')];
                }}
                labelFormatter={type === 'hourly' ? formatHour : undefined}
              />
              <Area 
                type="monotone" 
                dataKey={selectedMetric} 
                stroke="#3B82F6" 
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#userActivityGradient)"
                animationDuration={1000}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 用户人口统计饼图 */}
      {showHeatmap && (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">User Demographics</h3>
            <p className="text-sm text-gray-600 mt-1">Age distribution of active users</p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 饼图 */}
              <div>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={demoData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      onMouseEnter={(_, index) => setSelectedSlice(demoData[index].name)}
                      onMouseLeave={() => setSelectedSlice(null)}
                    >
                      {demoData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.color}
                          stroke={selectedSlice === entry.name ? '#374151' : 'none'}
                          strokeWidth={selectedSlice === entry.name ? 2 : 0}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* 图例和详细信息 */}
              <div className="flex flex-col justify-center">
                <div className="space-y-3">
                  {demoData.map((item, index) => (
                    <div 
                      key={item.name}
                      className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                        selectedSlice === item.name ? 'bg-gray-50' : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <span className="text-sm font-medium text-gray-900">
                          {item.name} years
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-gray-900">
                          {item.value}%
                        </div>
                        <div className="text-xs text-gray-500">
                          {Math.round(item.value * 50)} users
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 热力图（按小时） */}
      {type === 'hourly' && showHeatmap && (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Activity Heatmap</h3>
            <p className="text-sm text-gray-600 mt-1">User activity throughout the day</p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-24 gap-1 mb-4">
              {activityData.map((data, index) => (
                <div
                  key={index}
                  className={`aspect-square rounded ${getHeatmapColor(data[selectedMetric], maxValue)} 
                             hover:scale-110 transition-transform cursor-pointer`}
                  title={`${formatHour(data.hour)}: ${data[selectedMetric].toLocaleString()} ${selectedMetric.replace('_', ' ')}`}
                >
                  <div className="w-full h-full flex items-center justify-center text-xs font-medium text-white">
                    {data[selectedMetric] > maxValue * 0.3 ? data[selectedMetric] : ''}
                  </div>
                </div>
              ))}
            </div>

            {/* 图例 */}
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Less</span>
              <div className="flex space-x-1">
                {['bg-blue-200', 'bg-green-400', 'bg-yellow-400', 'bg-orange-400', 'bg-red-500'].map((color, index) => (
                  <div key={index} className={`w-3 h-3 rounded ${color}`}></div>
                ))}
              </div>
              <span>More</span>
            </div>

            {/* 时间标签 */}
            <div className="grid grid-cols-24 gap-1 mt-2 text-xs text-gray-500">
              {[0, 6, 12, 18].map((hour) => (
                <div key={hour} className="col-span-6 text-center">
                  {formatHour(hour)}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}