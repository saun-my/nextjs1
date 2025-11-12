export interface DashboardWidget {
  id: string;
  type: 'chart' | 'metric' | 'table' | 'progress' | 'activity' | 'calendar';
  title: string;
  description?: string;
  dataSource: string;
  config: WidgetConfig;
  size: 'small' | 'medium' | 'large';
  position: { x: number; y: number; w: number; h: number };
  refreshInterval?: number;
  interactive?: boolean;
  permissions?: string[];
}

export interface WidgetConfig {
  chartType?: 'line' | 'bar' | 'pie' | 'area' | 'scatter' | 'radar';
  dataKey?: string;
  colorScheme?: string[];
  showLegend?: boolean;
  showGrid?: boolean;
  animation?: boolean;
  responsive?: boolean;
  customStyles?: Record<string, any>;
  filters?: WidgetFilter[];
  aggregations?: AggregationConfig[];
}

export interface WidgetFilter {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'in' | 'not_in' | 'contains';
  value: any;
  type: 'select' | 'date' | 'range' | 'text' | 'checkbox';
  label?: string;
}

export interface AggregationConfig {
  type: 'sum' | 'avg' | 'count' | 'max' | 'min' | 'distinct';
  field: string;
  alias?: string;
}

export interface DashboardLayout {
  id: string;
  name: string;
  description?: string;
  widgets: DashboardWidget[];
  gridConfig: {
    cols: number;
    rowHeight: number;
    margin: [number, number];
    containerPadding: [number, number];
  };
  theme: 'light' | 'dark' | 'auto';
  breakpoints: Record<string, number>;
  layouts: Record<string, any>;
}

export interface DashboardData {
  widgets: Record<string, any>;
  metadata: {
    lastUpdated: Date;
    refreshStatus: Record<string, 'loading' | 'success' | 'error'>;
    totalWidgets: number;
    activeWidgets: number;
  };
}

export interface SmartInsight {
  id: string;
  type: 'trend' | 'anomaly' | 'opportunity' | 'risk' | 'achievement';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  dataPoints: DataPoint[];
  recommendations: Recommendation[];
  timestamp: Date;
  category: string;
  tags: string[];
  confidence: number;
  autoActionable: boolean;
}

export interface DataPoint {
  label: string;
  value: number | string;
  change?: number;
  trend?: 'up' | 'down' | 'stable';
  timestamp?: Date;
}

export interface Recommendation {
  id: string;
  text: string;
  priority: 'low' | 'medium' | 'high';
  estimatedImpact?: string;
  actionUrl?: string;
  actionText?: string;
}

export interface DashboardConfig {
  layouts: DashboardLayout[];
  dataSources: DataSourceConfig[];
  insights: SmartInsight[];
  settings: DashboardSettings;
}

export interface DataSourceConfig {
  id: string;
  name: string;
  type: 'api' | 'database' | 'file' | 'websocket';
  connection: ConnectionConfig;
  query: QueryConfig;
  refreshRate: number;
  cache: CacheConfig;
}

export interface ConnectionConfig {
  url?: string;
  method?: string;
  headers?: Record<string, string>;
  credentials?: any;
}

export interface QueryConfig {
  endpoint?: string;
  params?: Record<string, any>;
  body?: any;
  fields?: string[];
  filters?: Record<string, any>;
}

export interface CacheConfig {
  enabled: boolean;
  ttl: number;
  keyPrefix: string;
  strategy: 'memory' | 'localStorage' | 'indexedDB';
}

export interface DashboardSettings {
  autoRefresh: boolean;
  refreshInterval: number;
  showInsights: boolean;
  enableNotifications: boolean;
  theme: 'light' | 'dark' | 'auto';
  timezone: string;
  locale: string;
  dateFormat: string;
  numberFormat: string;
}

export interface UserPreferences {
  dashboardLayout: string;
  widgetPreferences: Record<string, any>;
  notificationSettings: NotificationSettings;
  theme: 'light' | 'dark' | 'auto';
  language: string;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
  frequency: 'realtime' | 'daily' | 'weekly';
  categories: string[];
}

export interface ChartData {
  labels: string[];
  datasets: Dataset[];
}

export interface Dataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
  fill?: boolean;
  tension?: number;
}

export interface MetricData {
  value: number;
  label: string;
  change?: number;
  trend?: 'up' | 'down' | 'stable';
  target?: number;
  unit?: string;
  format?: 'number' | 'currency' | 'percentage' | 'duration';
}

export interface TableData {
  headers: TableHeader[];
  rows: TableRow[];
  pagination?: PaginationConfig;
  sorting?: SortingConfig;
}

export interface TableHeader {
  key: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'currency' | 'percentage';
  sortable?: boolean;
  width?: string;
}

export interface TableRow {
  id: string;
  data: Record<string, any>;
  actions?: TableAction[];
}

export interface TableAction {
  label: string;
  icon?: string;
  action: string;
  variant?: 'primary' | 'secondary' | 'danger';
}

export interface PaginationConfig {
  enabled: boolean;
  pageSize: number;
  currentPage: number;
  totalItems: number;
  showSizeChanger: boolean;
  showQuickJumper: boolean;
}

export interface SortingConfig {
  enabled: boolean;
  defaultSortField: string;
  defaultSortOrder: 'asc' | 'desc';
  multiSort: boolean;
}

// 导出所有类型
 
