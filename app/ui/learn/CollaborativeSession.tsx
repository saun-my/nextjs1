'use client';

import { useState, useEffect } from 'react';
import { clsx } from 'clsx';

interface CollaborativeUser {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'away' | 'offline';
  cursor?: { x: number; y: number };
  currentFile?: string;
}

interface CollaborativeEdit {
  userId: string;
  fileName: string;
  line: number;
  content: string;
  timestamp: number;
}

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: number;
  type: 'text' | 'code' | 'question';
}

interface CollaborativeSessionProps {
  sessionId: string;
  onUsersChange?: (users: CollaborativeUser[]) => void;
  onEdit?: (edit: CollaborativeEdit) => void;
  onMessage?: (message: ChatMessage) => void;
}

export default function CollaborativeSession({
  sessionId,
  onUsersChange,
  onEdit,
  onMessage
}: CollaborativeSessionProps) {
  const [users, setUsers] = useState<CollaborativeUser[]>([
    {
      id: '1',
      name: '张三',
      avatar: '👨‍💻',
      status: 'online',
      currentFile: 'main.js'
    },
    {
      id: '2', 
      name: '李四',
      avatar: '👩‍💻',
      status: 'online',
      currentFile: 'utils.js'
    },
    {
      id: '3',
      name: '王五',
      avatar: '🧑‍💻',
      status: 'away',
      currentFile: 'index.html'
    }
  ]);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      userId: '1',
      userName: '张三',
      content: '大家好！今天我们来一起学习 JavaScript 吧！',
      timestamp: Date.now() - 300000,
      type: 'text'
    },
    {
      id: '2',
      userId: '2',
      userName: '李四',
      content: '```javascript\nfunction hello() {\n  console.log("Hello World!");\n}\n```',
      timestamp: Date.now() - 240000,
      type: 'code'
    }
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showUserList, setShowUserList] = useState(true);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  // 模拟实时协作编辑
  useEffect(() => {
    const interval = setInterval(() => {
      // 随机用户进行编辑
      const onlineUsers = users.filter(u => u.status === 'online');
      if (onlineUsers.length > 0 && Math.random() > 0.7) {
        const randomUser = onlineUsers[Math.floor(Math.random() * onlineUsers.length)];
        const edit: CollaborativeEdit = {
          userId: randomUser.id,
          fileName: randomUser.currentFile || 'main.js',
          line: Math.floor(Math.random() * 20) + 1,
          content: `// ${randomUser.name} 正在编辑...`,
          timestamp: Date.now()
        };
        onEdit?.(edit);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [users, onEdit]);

  // 发送消息
  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      userId: 'current-user',
      userName: '我',
      content: newMessage,
      timestamp: Date.now(),
      type: newMessage.includes('```') ? 'code' : 'text'
    };

    setMessages(prev => [...prev, message]);
    onMessage?.(message);
    setNewMessage('');
    setIsTyping(false);
  };

  // 格式化时间
  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    
    if (diff < 60000) return '刚刚';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} 分钟前`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} 小时前`;
    return new Date(timestamp).toLocaleDateString();
  };

  // 获取用户状态颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* 用户列表 */}
      {showUserList && (
        <div className="w-64 bg-white border-r border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">在线用户</h3>
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              {users.filter(u => u.status === 'online').length}
            </span>
          </div>

          <div className="space-y-3">
            {users.map(user => (
              <div
                key={user.id}
                className={`flex items-center p-2 rounded-lg cursor-pointer transition-colors ${
                  selectedUser === user.id ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'
                }`}
                onClick={() => setSelectedUser(selectedUser === user.id ? null : user.id)}
              >
                <div className="relative">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm">
                    {user.avatar}
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                    getStatusColor(user.status)
                  }`} />
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user.currentFile}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-900 mb-2">协作状态</h4>
            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                <span>实时编辑同步</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
                <span>代码共享</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-2" />
                <span>即时通讯</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 主要内容区域 */}
      <div className="flex-1 flex flex-col">
        {/* 工具栏 */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold text-gray-900">协作学习会话</h2>
            <span className="text-sm text-gray-500">会话 ID: {sessionId}</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowUserList(!showUserList)}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              {showUserList ? '隐藏用户' : '显示用户'}
            </button>
            <button
              onClick={() => {
                // 邀请新用户的逻辑
                navigator.clipboard.writeText(`${window.location.origin}/collaborate/${sessionId}`);
                alert('邀请链接已复制到剪贴板！');
              }}
              className="px-3 py-1 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
            >
              邀请用户
            </button>
          </div>
        </div>

        {/* 聊天消息区域 */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map(message => {
                const user = users.find(u => u.id === message.userId);
                const isCurrentUser = message.userId === 'current-user';

                return (
                  <div key={message.id} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                    {!isCurrentUser && (
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm mr-3 flex-shrink-0">
                        {user?.avatar || '👤'}
                      </div>
                    )}
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      isCurrentUser 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-200 text-gray-900'
                    }`}>
                      {!isCurrentUser && (
                        <p className="text-xs font-medium mb-1 opacity-75">{message.userName}</p>
                      )}
                      {message.type === 'code' ? (
                        <pre className={`text-xs overflow-x-auto ${
                          isCurrentUser ? 'text-blue-100' : 'text-gray-800'
                        }`}>
                          <code>{message.content.replace(/```/g, '')}</code>
                        </pre>
                      ) : (
                        <p className="text-sm">{message.content}</p>
                      )}
                      <p className={`text-xs mt-1 opacity-75 ${
                        isCurrentUser ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                );
              })}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-200 text-gray-900 px-4 py-2 rounded-lg">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      <span className="text-sm ml-2">正在输入...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 消息输入区域 */}
        <div className="border-t border-gray-200 bg-white p-4">
          <div className="flex items-end space-x-2">
            <div className="flex-1">
              <textarea
                value={newMessage}
                onChange={(e) => {
                  setNewMessage(e.target.value);
                  setIsTyping(e.target.value.length > 0);
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="输入消息... (按 Enter 发送，Shift+Enter 换行)"
                className="w-full resize-none border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={2}
              />
            </div>
            <button
              onClick={sendMessage}
              disabled={!newMessage.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              发送
            </button>
          </div>

          {/* 快捷操作 */}
          <div className="flex items-center space-x-2 mt-2">
            <button
              onClick={() => setNewMessage('```javascript\n// 在这里输入你的代码\n```')}
              className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
            >
              代码块
            </button>
            <button
              onClick={() => setNewMessage('❓ 问题：')}
              className="px-2 py-1 text-xs bg-yellow-100 hover:bg-yellow-200 rounded transition-colors"
            >
              提问
            </button>
            <button
              onClick={() => setNewMessage('✅ 解决方案：')}
              className="px-2 py-1 text-xs bg-green-100 hover:bg-green-200 rounded transition-colors"
            >
              解答
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}