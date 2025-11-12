'use client';

import { useState } from 'react';
import { CollaborativeLearningHub } from '@/app/components/CollaborativeLearningHub';

export default function CollaborativeLearningPage() {
  const [activeTab, setActiveTab] = useState<'collaborate' | 'resources' | 'discussions'>('collaborate');

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">协作学习中心</h1>
          <p className="text-gray-600">与其他学习者实时协作，分享知识和资源</p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <nav className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm">
            <button
              onClick={() => setActiveTab('collaborate')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'collaborate'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              实时协作
            </button>
            <button
              onClick={() => setActiveTab('resources')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'resources'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              资源共享
            </button>
            <button
              onClick={() => setActiveTab('discussions')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'discussions'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              讨论区
            </button>
          </nav>
        </div>

        {/* Content */}
        {activeTab === 'collaborate' && (
          <div className="space-y-6">
            <CollaborativeLearningHub />
          </div>
        )}

        {activeTab === 'resources' && (
          <div className="space-y-6">
            {/* Resource Categories */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="text-2xl mb-2">📚</div>
                <div className="text-sm font-medium text-gray-900">学习资料</div>
                <div className="text-xs text-gray-500">128 个资源</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="text-2xl mb-2">🎥</div>
                <div className="text-sm font-medium text-gray-900">视频教程</div>
                <div className="text-xs text-gray-500">64 个视频</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="text-2xl mb-2">💻</div>
                <div className="text-sm font-medium text-gray-900">代码示例</div>
                <div className="text-xs text-gray-500">256 个示例</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="text-2xl mb-2">📝</div>
                <div className="text-sm font-medium text-gray-900">笔记分享</div>
                <div className="text-xs text-gray-500">89 个笔记</div>
              </div>
            </div>

            {/* Resource List */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">最新资源</h3>
              <div className="space-y-4">
                {[
                  { title: 'JavaScript 高级编程指南', type: 'PDF', size: '2.5MB', author: '张同学', downloads: 156 },
                  { title: 'React Hooks 实战视频', type: 'Video', size: '125MB', author: '李老师', downloads: 89 },
                  { title: 'Python 数据分析代码库', type: 'Code', size: '1.8MB', author: '王开发', downloads: 234 },
                  { title: 'Vue.js 学习笔记', type: 'Note', size: '450KB', author: '陈学习', downloads: 67 }
                ].map((resource, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-sm">{resource.type[0]}</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{resource.title}</h4>
                        <p className="text-sm text-gray-500">{resource.author} • {resource.size}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">{resource.downloads} 下载</span>
                      <button className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors">
                        下载
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'discussions' && (
          <div className="space-y-6">
            {/* Discussion Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="text-2xl font-bold text-gray-900">156</div>
                <div className="text-sm text-gray-500">活跃讨论</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="text-2xl font-bold text-gray-900">892</div>
                <div className="text-sm text-gray-500">总回复数</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="text-2xl font-bold text-gray-900">234</div>
                <div className="text-sm text-gray-500">活跃用户</div>
              </div>
            </div>

            {/* Discussion Topics */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">热门讨论</h3>
                <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
                  发起讨论
                </button>
              </div>
              <div className="space-y-4">
                {[
                  { title: '如何高效学习JavaScript异步编程？', author: '小明', replies: 23, views: 156, lastReply: '2小时前', tag: 'JavaScript' },
                  { title: 'React vs Vue：选择哪个框架更好？', author: '前端小白', replies: 45, views: 289, lastReply: '1小时前', tag: '框架对比' },
                  { title: 'Python数据科学学习路径分享', author: '数据分析师', replies: 18, views: 134, lastReply: '30分钟前', tag: 'Python' },
                  { title: '前端性能优化最佳实践', author: '性能专家', replies: 31, views: 267, lastReply: '15分钟前', tag: '性能优化' }
                ].map((topic, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                            {topic.tag}
                          </span>
                        </div>
                        <h4 className="font-medium text-gray-900 mb-2">{topic.title}</h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>作者: {topic.author}</span>
                          <span>{topic.replies} 回复</span>
                          <span>{topic.views} 浏览</span>
                          <span>最后回复: {topic.lastReply}</span>
                        </div>
                      </div>
                      <button className="px-3 py-1 text-blue-600 hover:text-blue-800 transition-colors">
                        查看
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="mt-8 bg-green-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-900 mb-3">协作学习小贴士</h3>
          <div className="space-y-2 text-green-800">
            <p>• 积极参与讨论，分享您的学习心得</p>
            <p>• 尊重其他学习者的观点和建议</p>
            <p>• 定期查看新资源和讨论话题</p>
            <p>• 帮助他人解决问题，共同进步</p>
          </div>
        </div>
      </div>
    </div>
  );
}