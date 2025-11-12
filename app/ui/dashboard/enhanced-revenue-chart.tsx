'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, 
         XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CalendarIcon, ChartBarIcon, ArrowTrendingUpIcon, UsersIcon } from '@heroicons/react/24/outline';

interface DashboardChartData {
  name: string;
  revenue: number;
  users: number;
  orders: number;
  conversion_rate: number;
}

interface MetricData {
  title: string;
  value: string;
  change: number;
  icon: any;
  color: string;
}

interface EnhancedRevenueChartProps {
  data?: DashboardChartData[];
  title?: string;
  type?: 'line' | 'area' | 'bar';
  showMetrics?: boolean;
  timeRange?: '7d' | '30d' | '90d' | '1y';
}

export default function EnhancedRevenueChart({ 
  data = [], 
  title = 'Revenue Analytics',
  type = 'area',
  showMetrics = true,
  timeRange = '30d'
}: EnhancedRevenueChartProps) {
  const [chartData, setChartData] = useState<DashboardChartData[]>([]);
  const [selectedMetric, setSelectedMetric] = useState<'revenue' | 'users' | 'orders'>('revenue');
  const [animationKey, setAnimationKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [range, setRange] = useState<'7d' | '30d' | '90d' | '1y'>(timeRange);
  const [chartType, setChartType] = useState<'line' | 'area' | 'bar'>(type);

  // 生成模拟数据
  const generateMockData = (days: number): DashboardChartData[] => {
    const data: DashboardChartData[] = [];
    const now = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      const baseRevenue = 50000 + Math.random() * 30000;
      const baseUsers = 1000 + Math.random() * 500;
      const baseOrders = 200 + Math.random() * 100;
      
      // 添加一些趋势和季节性
      const trendFactor = 1 + (days - i) * 0.01;
      const weekendFactor = date.getDay() === 0 || date.getDay() === 6 ? 0.8 : 1;
      
      data.push({
        name: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        revenue: Math.round(baseRevenue * trendFactor * weekendFactor),
        users: Math.round(baseUsers * trendFactor * weekendFactor),
        orders: Math.round(baseOrders * trendFactor * weekendFactor),
        conversion_rate: Math.round((baseOrders / baseUsers) * 100 * 100) / 100
      });
    }
    
    return data;
  };

  useEffect(() => {
    setIsLoading(true);
    
    // 模拟数据加载
    setTimeout(() => {
      const days = range === '7d' ? 7 : range === '30d' ? 30 : range === '90d' ? 90 : 365;
      const newData = data.length > 0 ? data : generateMockData(days);
      setChartData(newData);
      setAnimationKey(prev => prev + 1);
      setIsLoading(false);
    }, 800);
  }, [range, data]);

  // 计算指标数据
  const calculateMetrics = (): MetricData[] => {
    if (chartData.length === 0) return [];
    
    const latest = chartData[chartData.length - 1];
    const previous = chartData[chartData.length - 2] || latest;
    
    return [
      {
        title: 'Revenue',
        value: `$${latest.revenue.toLocaleString()}`,
        change: ((latest.revenue - previous.revenue) / previous.revenue) * 100,
        icon: ArrowTrendingUpIcon,
        color: 'text-green-600'
      },
      {
        title: 'Active Users',
        value: latest.users.toLocaleString(),
        change: ((latest.users - previous.users) / previous.users) * 100,
        icon: UsersIcon,
        color: 'text-blue-600'
      },
      {
        title: 'Orders',
        value: latest.orders.toLocaleString(),
        change: ((latest.orders - previous.orders) / previous.orders) * 100,
        icon: ChartBarIcon,
        color: 'text-purple-600'
      }
    ];
  };

  const metrics = calculateMetrics();

  // 图表颜色配置
  const chartColors = {
    revenue: '#10B981',
    users: '#3B82F6',
    orders: '#8B5CF6'
  };

  // 自定义工具提示
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value.toLocaleString()}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // 渲染不同类型的图表
  const renderChart = () => {
    const commonProps = {
      data: chartData,
      key: animationKey,
      margin: { top: 5, right: 30, left: 20, bottom: 5 }
    };

    switch (chartType) {
      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
            <YAxis stroke="#6b7280" fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey={selectedMetric} 
              stroke={chartColors[selectedMetric]} 
              strokeWidth={3}
              dot={{ fill: chartColors[selectedMetric], strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: chartColors[selectedMetric], strokeWidth: 2 }}
              animationDuration={1000}
            />
          </LineChart>
        );
      
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
            <YAxis stroke="#6b7280" fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar 
              dataKey={selectedMetric} 
              fill={chartColors[selectedMetric]}
              radius={[4, 4, 0, 0]}
              animationDuration={1000}
            />
          </BarChart>
        );
      
      default: // area
        return (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id={`gradient-${selectedMetric}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColors[selectedMetric]} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={chartColors[selectedMetric]} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
            <YAxis stroke="#6b7280" fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area 
              type="monotone" 
              dataKey={selectedMetric} 
              stroke={chartColors[selectedMetric]} 
              strokeWidth={2}
              fillOpacity={1}
              fill={`url(#gradient-${selectedMetric})`}
              animationDuration={1000}
            />
          </AreaChart>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="w-full md:col-span-4">
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

  return (
    <div className="w-full md:col-span-4">
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {/* 头部 */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            <div className="flex items-center space-x-2">
              {/* 时间范围选择器 */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                {['7d', '30d', '90d', '1y'].map((rangeOption) => (
                  <button
                    key={rangeOption}
                    onClick={() => setRange(rangeOption as any)}
                    className={`px-3 py-1 text-xs rounded-md transition-colors ${
                      range === rangeOption
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {rangeOption}
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
          
          {/* 指标卡片 */}
          {showMetrics && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              {metrics.map((metric, index) => (
                <button
                  key={metric.title}
                  onClick={() => setSelectedMetric(metric.title.toLowerCase().replace(' ', '_') as any)}
                  className={`p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                    selectedMetric === metric.title.toLowerCase().replace(' ', '_')
                      ? 'border-blue-200 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <metric.icon className={`h-5 w-5 ${metric.change >= 0 ? 'text-green-500' : 'text-red-500'}`} />
                    <span className={`text-sm font-medium ${
                      metric.change >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {metric.change >= 0 ? '+' : ''}{metric.change.toFixed(1)}%
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {metric.value}
                  </div>
                  <div className="text-sm text-gray-600">
                    {metric.title}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 图表区域 */}
        <div className="p-6">
          <ResponsiveContainer width="100%" height={400}>
            {renderChart()}
          </ResponsiveContainer>
        </div>

        {/* 底部信息 */}
        <div className="px-6 py-4 bg-gray-50 border-t">
          <div className="flex items-center text-sm text-gray-600">
            <CalendarIcon className="h-4 w-4 mr-2" />
            <span>Last updated: {new Date().toLocaleString()}</span>
            <span className="mx-2">•</span>
            <span>Data refresh every 5 minutes</span>
          </div>
        </div>
      </div>
    </div>
  );
}
