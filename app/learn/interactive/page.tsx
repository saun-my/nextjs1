'use client';

import { useState } from 'react';
import { InteractiveCodeEditor } from '@/app/components/InteractiveCodeEditor';

export default function InteractiveLearningPage() {
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');

  const languages = [
    { value: 'javascript', label: 'JavaScript', icon: '🟨' },
    { value: 'python', label: 'Python', icon: '🐍' },
    { value: 'html', label: 'HTML', icon: '🌐' },
    { value: 'css', label: 'CSS', icon: '🎨' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">交互式代码学习</h1>
          <p className="text-gray-600">实时编写、运行和预览代码，提升编程技能</p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">实时代码编辑</h3>
            <p className="text-gray-600">支持多种编程语言的实时代码编辑和语法高亮</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m6-6h-1m-4 0h-1m-6 4h-1m-4 0h-1" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">即时预览</h3>
            <p className="text-gray-600">代码修改后自动运行并显示结果，无需手动刷新</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">文件管理</h3>
            <p className="text-gray-600">支持文件上传下载，保存和管理您的代码项目</p>
          </div>
        </div>

        {/* Language Selector */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">编程语言:</label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {languages.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.icon} {lang.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center space-x-4"></div>
          </div>
        </div>

        {/* Interactive Code Editor */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <InteractiveCodeEditor 
            language={selectedLanguage}
          />
        </div>

        {/* Learning Resources */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">学习资源</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">JavaScript 基础</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• 变量声明和作用域</li>
                <li>• 函数定义和调用</li>
                <li>• 数组和对象操作</li>
                <li>• 异步编程基础</li>
              </ul>
              <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
                开始学习
              </button>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Python 入门</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• 基本语法和数据类型</li>
                <li>• 控制流程和循环</li>
                <li>• 函数和模块</li>
                <li>• 文件操作和异常处理</li>
              </ul>
              <button className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors">
                开始学习
              </button>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">HTML & CSS</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• HTML 标签和结构</li>
                <li>• CSS 选择器和属性</li>
                <li>• 布局技术（Flexbox, Grid）</li>
                <li>• 响应式设计</li>
              </ul>
              <button className="mt-4 px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors">
                开始学习
              </button>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">算法练习</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• 排序算法实现</li>
                <li>• 搜索算法优化</li>
                <li>• 数据结构应用</li>
                <li>• 复杂度分析</li>
              </ul>
              <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors">
                开始练习
              </button>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">使用提示</h3>
          <div className="space-y-2 text-blue-800">
            <p>• 使用 Ctrl+S 快捷键保存当前代码</p>
            <p>• 支持多文件编辑，点击"新建文件"创建新文件</p>
            <p>• 使用控制台查看代码输出和错误信息</p>
            <p>• 分享您的代码片段与其他学习者交流</p>
          </div>
        </div>
      </div>
    </div>
  );
}
