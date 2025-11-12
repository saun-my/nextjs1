import { 
  ChartData, 
  Dataset, 
  MetricData, 
  TableData, 
  TableHeader, 
  TableRow,
  SmartInsight,
  DataPoint,
  Recommendation 
} from './types';

// 生成模拟图表数据
export function generateChartData(type: 'line' | 'bar' | 'pie' | 'area' = 'line'): ChartData {
  const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];
  
  switch (type) {
    case 'line':
    case 'area':
      return {
        labels: months.slice(0, 6),
        datasets: [
          {
            label: '学习时长',
            data: [120, 150, 180, 220, 280, 320],
            borderColor: colors[0],
            backgroundColor: type === 'area' ? `${colors[0]}20` : colors[0],
            fill: type === 'area',
            tension: 0.4
          },
          {
            label: '完成课程',
            data: [8, 12, 15, 18, 25, 30],
            borderColor: colors[1],
            backgroundColor: type === 'area' ? `${colors[1]}20` : colors[1],
            fill: type === 'area',
            tension: 0.4
          }
        ]
      };
    
    case 'bar':
      return {
        labels: ['React', 'Vue', 'Angular', 'Svelte', 'Next.js', 'Nuxt.js'],
        datasets: [
          {
            label: '学习人数',
            data: [2500, 1800, 1200, 800, 2200, 900],
            backgroundColor: colors
          }
        ]
      };
    
    case 'pie':
      return {
        labels: ['前端开发', '后端开发', '数据科学', '移动开发', 'DevOps'],
        datasets: [
          {
            label: '技能分布',
            data: [35, 28, 15, 12, 10],
            backgroundColor: colors
          }
        ]
      };
    
    default:
      return generateChartData('line');
  }
}

// 生成模拟指标数据
export function generateMetricData(type: 'revenue' | 'users' | 'engagement' | 'performance' = 'users'): MetricData {
  const baseData = {
    revenue: {
      value: 125000,
      label: '总收入',
      change: 12.5,
      trend: 'up' as const,
      target: 150000,
      unit: '¥',
      format: 'currency' as const
    },
    users: {
      value: 2847,
      label: '活跃用户',
      change: 8.3,
      trend: 'up' as const,
      target: 3000,
      unit: '',
      format: 'number' as const
    },
    engagement: {
      value: 78.5,
      label: '学习参与度',
      change: -2.1,
      trend: 'down' as const,
      target: 85,
      unit: '%',
      format: 'percentage' as const
    },
    performance: {
      value: 92,
      label: '系统性能',
      change: 0,
      trend: 'stable' as const,
      target: 95,
      unit: '%',
      format: 'percentage' as const
    }
  };

  return baseData[type];
}

// 生成模拟表格数据
export function generateTableData(type: 'courses' | 'users' | 'revenue' | 'activity' = 'courses'): TableData {
  const headers: Record<string, TableHeader[]> = {
    courses: [
      { key: 'title', label: '课程名称', type: 'text', sortable: true },
      { key: 'category', label: '分类', type: 'text', sortable: true },
      { key: 'students', label: '学员数', type: 'number', sortable: true },
      { key: 'rating', label: '评分', type: 'number', sortable: true },
      { key: 'revenue', label: '收入', type: 'currency', sortable: true },
      { key: 'status', label: '状态', type: 'text', sortable: false }
    ],
    users: [
      { key: 'name', label: '姓名', type: 'text', sortable: true },
      { key: 'email', label: '邮箱', type: 'text', sortable: true },
      { key: 'courses', label: '课程数', type: 'number', sortable: true },
      { key: 'progress', label: '进度', type: 'percentage', sortable: true },
      { key: 'joined', label: '加入时间', type: 'date', sortable: true },
      { key: 'status', label: '状态', type: 'text', sortable: false }
    ],
    revenue: [
      { key: 'date', label: '日期', type: 'date', sortable: true },
      { key: 'course', label: '课程', type: 'text', sortable: true },
      { key: 'amount', label: '金额', type: 'currency', sortable: true },
      { key: 'students', label: '学员数', type: 'number', sortable: true },
      { key: 'conversion', label: '转化率', type: 'percentage', sortable: true },
      { key: 'source', label: '来源', type: 'text', sortable: true }
    ],
    activity: [
      { key: 'timestamp', label: '时间', type: 'date', sortable: true },
      { key: 'user', label: '用户', type: 'text', sortable: true },
      { key: 'action', label: '操作', type: 'text', sortable: true },
      { key: 'course', label: '课程', type: 'text', sortable: true },
      { key: 'duration', label: '时长', type: 'duration', sortable: true },
      { key: 'status', label: '状态', type: 'text', sortable: false }
    ]
  };

  const generateRows = (type: string, count: number = 10): TableRow[] => {
    const rows: TableRow[] = [];
    
    for (let i = 1; i <= count; i++) {
      switch (type) {
        case 'courses':
          rows.push({
            id: `course-${i}`,
            data: {
              title: `热门课程 ${i}`,
              category: ['前端开发', '后端开发', '数据科学', '移动开发'][Math.floor(Math.random() * 4)],
              students: Math.floor(Math.random() * 1000) + 100,
              rating: (Math.random() * 2 + 3).toFixed(1),
              revenue: Math.floor(Math.random() * 50000) + 10000,
              status: Math.random() > 0.7 ? '热门' : '正常'
            }
          });
          break;
        
        case 'users':
          rows.push({
            id: `user-${i}`,
            data: {
              name: `用户${i}`,
              email: `user${i}@example.com`,
              courses: Math.floor(Math.random() * 10) + 1,
              progress: Math.floor(Math.random() * 100),
              joined: new Date(2024 - Math.floor(Math.random() * 2), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
              status: Math.random() > 0.8 ? '活跃' : '正常'
            }
          });
          break;
        
        case 'revenue':
          rows.push({
            id: `revenue-${i}`,
            data: {
              date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
              course: `课程 ${Math.floor(Math.random() * 20) + 1}`,
              amount: Math.floor(Math.random() * 10000) + 1000,
              students: Math.floor(Math.random() * 100) + 10,
              conversion: (Math.random() * 20 + 5).toFixed(1),
              source: ['直接访问', '搜索引擎', '社交媒体', '推荐'][Math.floor(Math.random() * 4)]
            }
          });
          break;
        
        case 'activity':
          rows.push({
            id: `activity-${i}`,
            data: {
              timestamp: new Date(Date.now() - Math.random() * 86400000 * 30), // 最近30天
              user: `用户${Math.floor(Math.random() * 100) + 1}`,
              action: ['开始学习', '完成课程', '发表评论', '获得证书'][Math.floor(Math.random() * 4)],
              course: `课程 ${Math.floor(Math.random() * 20) + 1}`,
              duration: Math.floor(Math.random() * 120) + 30,
              status: Math.random() > 0.9 ? '异常' : '正常'
            }
          });
          break;
      }
    }
    
    return rows;
  };

  return {
    headers: headers[type],
    rows: generateRows(type),
    pagination: {
      enabled: true,
      pageSize: 10,
      currentPage: 1,
      totalItems: 50,
      showSizeChanger: true,
      showQuickJumper: true
    },
    sorting: {
      enabled: true,
      defaultSortField: 'title',
      defaultSortOrder: 'asc',
      multiSort: false
    }
  };
}

// 生成智能洞察数据
export function generateSmartInsights(count: number = 5): SmartInsight[] {
  const insights: SmartInsight[] = [];
  const types: Array<'trend' | 'anomaly' | 'opportunity' | 'risk' | 'achievement'> = 
    ['trend', 'anomaly', 'opportunity', 'risk', 'achievement'];
  
  const severities: Array<'low' | 'medium' | 'high' | 'critical'> = 
    ['low', 'medium', 'high', 'critical'];
  
  const categories = ['学习进度', '用户参与', '收入分析', '系统性能', '内容质量'];
  
  for (let i = 1; i <= count; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const severity = severities[Math.floor(Math.random() * severities.length)];
    const category = categories[Math.floor(Math.random() * categories.length)];
    
    const dataPoints: DataPoint[] = [
      {
        label: '当前值',
        value: Math.floor(Math.random() * 1000) + 100,
        change: (Math.random() * 40 - 20).toFixed(1),
        trend: Math.random() > 0.5 ? 'up' : 'down',
        timestamp: new Date()
      },
      {
        label: '对比值',
        value: Math.floor(Math.random() * 800) + 200,
        change: (Math.random() * 30 - 15).toFixed(1),
        trend: Math.random() > 0.5 ? 'up' : 'down',
        timestamp: new Date(Date.now() - 86400000 * 7) // 一周前
      }
    ];
    
    const recommendations: Recommendation[] = [
      {
        id: `rec-${i}-1`,
        text: `建议优化${category}相关策略`,
        priority: severity === 'critical' ? 'high' : severity === 'high' ? 'medium' : 'low',
        estimatedImpact: `预计提升${(Math.random() * 20 + 5).toFixed(1)}%`,
        actionUrl: `/dashboard/analytics?focus=${category}`,
        actionText: '查看详情'
      }
    ];
    
    if (Math.random() > 0.5) {
      recommendations.push({
        id: `rec-${i}-2`,
        text: `考虑调整${category}配置参数`,
        priority: 'medium',
        estimatedImpact: `预计改善${(Math.random() * 15 + 3).toFixed(1)}%`,
        actionUrl: `/settings/${category.toLowerCase()}`,
        actionText: '配置设置'
      });
    }
    
    insights.push({
      id: `insight-${i}`,
      type,
      title: `${category} - ${type === 'trend' ? '趋势分析' : 
                           type === 'anomaly' ? '异常检测' :
                           type === 'opportunity' ? '机会识别' :
                           type === 'risk' ? '风险评估' : '成就达成'}`,
      description: `在${category}方面发现${type === 'trend' ? '重要趋势' : 
                                      type === 'anomaly' ? '异常模式' :
                                      type === 'opportunity' ? '优化机会' :
                                      type === 'risk' ? '潜在风险' : '显著成就'}，需要关注`,
      severity,
      dataPoints,
      recommendations,
      timestamp: new Date(Date.now() - Math.random() * 86400000 * 7), // 最近一周
      category,
      tags: [category.toLowerCase(), type, severity],
      confidence: Math.random() * 0.3 + 0.7, // 70-100%
      autoActionable: Math.random() > 0.3
    });
  }
  
  return insights.sort((a, b) => {
    const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
    return severityOrder[b.severity] - severityOrder[a.severity];
  });
}

// 生成实时数据更新
export function generateRealtimeUpdate() {
  const metrics = ['users', 'revenue', 'engagement', 'performance'];
  const metric = metrics[Math.floor(Math.random() * metrics.length)];
  
  return {
    type: 'update',
    metric,
    data: generateMetricData(metric as any),
    timestamp: new Date()
  };
}