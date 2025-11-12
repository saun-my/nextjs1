'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { Search, Filter, Download, RefreshCw, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { DashboardWidget } from '../lib/dashboard/types';
import { TableData, TableHeader, TableRow, TableAction } from '../lib/dashboard/types';
import { cn } from '@/app/lib/utils';

interface SmartTableWidgetProps {
  widget: DashboardWidget;
  data: TableData;
  loading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
  onExport?: (format: 'json' | 'csv') => void;
  onSettings?: () => void;
  onRowClick?: (row: TableRow) => void;
  onActionClick?: (action: TableAction, row: TableRow) => void;
  className?: string;
}

export function SmartTableWidget({
  widget,
  data,
  loading = false,
  error = null,
  onRefresh,
  onExport,
  onSettings,
  onRowClick,
  onActionClick,
  className
}: SmartTableWidgetProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showSettings, setShowSettings] = useState(false);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  const filteredData = useMemo(() => {
    if (!searchTerm) return data.rows;
    return data.rows.filter(row => {
      return Object.values(row.data || {}).some(value =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [data.rows, searchTerm]);

  const sortedData = useMemo(() => {
    if (!sortField) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = a.data?.[sortField];
      const bVal = b.data?.[sortField];
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      }
      const aStr = String(aVal ?? '');
      const bStr = String(bVal ?? '');
      const cmp = aStr.localeCompare(bStr, 'zh-CN');
      return sortOrder === 'asc' ? cmp : -cmp;
    });
  }, [filteredData, sortField, sortOrder]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return sortedData.slice(start, end);
  }, [sortedData, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  const handleSort = useCallback((field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  }, [sortField, sortOrder]);

  const handleExport = useCallback((format: 'json' | 'csv') => {
    if (onExport) {
      onExport(format);
      return;
    }

    const exportData = {
      widgetId: widget.id,
      headers: data.headers,
      rows: sortedData,
      timestamp: new Date()
    };

    switch (format) {
      case 'json':
        const jsonBlob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const jsonUrl = URL.createObjectURL(jsonBlob);
        const jsonLink = document.createElement('a');
        jsonLink.href = jsonUrl;
        jsonLink.download = `${widget.id}-table-${new Date().toISOString()}.json`;
        jsonLink.click();
        break;
      
      case 'csv':
        const csvHeaders = data.headers.map(h => h.label).join(',');
        const csvRows = sortedData.map(row =>
          data.headers.map(header => `"${String(row.data?.[header.key] ?? '')}"`).join(',')
        ).join('\n');
        const csvContent = "data:text/csv;charset=utf-8," + csvHeaders + "\n" + csvRows;
        const csvLink = document.createElement('a');
        csvLink.href = encodeURI(csvContent);
        csvLink.download = `${widget.id}-table-${new Date().toISOString()}.csv`;
        csvLink.click();
        break;
    }
  }, [data.headers, sortedData, widget.id, onExport]);

  const handleRowSelect = useCallback((rowId: string) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(rowId)) {
      newSelected.delete(rowId);
    } else {
      newSelected.add(rowId);
    }
    setSelectedRows(newSelected);
  }, [selectedRows]);

  const handleSelectAll = useCallback(() => {
    if (selectedRows.size === paginatedData.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(paginatedData.map(row => row.id)));
    }
  }, [selectedRows, paginatedData]);

  if (loading) {
    return (
      <div className={cn("bg-white rounded-lg shadow-sm border border-gray-200", className)}>
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-16"></div>
            </div>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("bg-white rounded-lg shadow-sm border border-gray-200", className)}>
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{widget.title}</h3>
              {widget.description && (
                <p className="text-sm text-gray-600 mt-1">{widget.description}</p>
              )}
            </div>
            <button
              onClick={onRefresh}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="h-32 flex items-center justify-center bg-red-50 rounded-lg border border-red-200">
            <div className="text-center">
              <div className="text-red-500 mb-2">⚠️</div>
              <p className="text-red-700 font-medium text-sm">{error}</p>
              <button
                onClick={onRefresh}
                className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
              >
                重试
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("bg-white rounded-lg shadow-sm border border-gray-200", className)}>
      {/* 头部 */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{widget.title}</h3>
            {widget.description && (
              <p className="text-sm text-gray-600 mt-1">{widget.description}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onRefresh}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              title="刷新"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
            
            <div className="relative">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                title="设置"
              >
                <Settings className="h-4 w-4" />
              </button>
              
              {showSettings && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                  <div className="py-1">
                    <button
                      onClick={() => {
                        handleExport('csv');
                        setShowSettings(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Download className="h-4 w-4 inline mr-2" />
                      导出CSV
                    </button>
                    <button
                      onClick={() => {
                        handleExport('json');
                        setShowSettings(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Download className="h-4 w-4 inline mr-2" />
                      导出JSON
                    </button>
                    {onSettings && (
                      <button
                        onClick={() => {
                          onSettings();
                          setShowSettings(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Settings className="h-4 w-4 inline mr-2" />
                        高级设置
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 搜索和过滤 */}
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索数据..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={5}>5条/页</option>
            <option value={10}>10条/页</option>
            <option value={25}>25条/页</option>
            <option value={50}>50条/页</option>
          </select>
        </div>
      </div>

      {/* 表格 */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {data.headers.map((header: TableHeader) => (
                <th
                  key={header.key}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  <button
                    onClick={() => handleSort(header.key)}
                    className="flex items-center gap-1 hover:text-gray-700"
                  >
                    {header.label}
                    {sortField === header.key && (
                      <span className="text-blue-600">
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </button>
                </th>
              ))}
              {paginatedData.some(r => r.actions && r.actions.length > 0) && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.map((row, index) => (
              <tr
                key={String(row.id || index)}
                className="hover:bg-gray-50"
                onClick={() => onRowClick && onRowClick(row)}
              >
                {data.headers.map((header: TableHeader) => (
                  <td key={header.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {String(row.data?.[header.key] ?? '')}
                  </td>
                ))}
                {row.actions && row.actions.length > 0 && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      {row.actions.map((action: TableAction) => (
                        <button
                          key={action.action}
                          onClick={(e) => {
                            e.stopPropagation();
                            onActionClick && onActionClick(action, row);
                          }}
                          className={cn(
                            "px-3 py-1 rounded text-sm font-medium transition-colors",
                            action.variant === 'primary' && 'bg-blue-600 text-white hover:bg-blue-700',
                            action.variant === 'secondary' && 'bg-gray-100 text-gray-700 hover:bg-gray-200',
                            action.variant === 'danger' && 'bg-red-600 text-white hover:bg-red-700'
                          )}
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 分页 */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              显示第 {(currentPage - 1) * pageSize + 1} 到 {Math.min(currentPage * pageSize, sortedData.length)} 条，
              共 {sortedData.length} 条数据
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              
              <div className="flex items-center gap-1">
                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={cn(
                        "px-3 py-2 rounded-lg text-sm font-medium",
                        currentPage === pageNum
                          ? "bg-blue-600 text-white"
                          : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                      )}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function SmartTableSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-16"></div>
          </div>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
        </div>
        <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
      </div>
      <div className="p-6">
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SmartTableWidget;
