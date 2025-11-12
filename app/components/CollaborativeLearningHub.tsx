'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { 
  Users, 
  MessageCircle, 
  Share2, 
  Hand, 
  ThumbsUp, 
  Eye, 
  Settings,
  Send,
  Smile,
  Paperclip
} from 'lucide-react';
import { cn } from '@/app/lib/utils';

interface CollaborativeLearningHubProps {
  className?: string;
  courseId?: string;
  lessonId?: string;
}

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'question' | 'answer' | 'reaction';
  reactions?: { emoji: string; count: number; userReacted: boolean }[];
}

interface OnlineUser {
  id: string;
  name: string;
  avatar: string;
  status: 'active' | 'idle' | 'away';
  role: 'student' | 'instructor' | 'assistant';
}

export function CollaborativeLearningHub({
  className,
  courseId,
  lessonId
}: CollaborativeLearningHubProps) {
  const [activeTab, setActiveTab] = useState<'chat' | 'users' | 'share'>('chat');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      userId: 'user1',
      userName: '张同学',
      userAvatar: '👨‍💻',
      content: '这个知识点有点难理解，有人能解释一下吗？',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      type: 'question',
      reactions: [{ emoji: '👍', count: 3, userReacted: false }]
    },
    {
      id: '2',
      userId: 'user2',
      userName: '李同学',
      userAvatar: '👩‍🎓',
      content: '我来解释一下，这个主要是通过...',
      timestamp: new Date(Date.now() - 3 * 60 * 1000),
      type: 'answer',
      reactions: [{ emoji: '❤️', count: 5, userReacted: true }]
    }
  ]);
  
  const [newMessage, setNewMessage] = useState('');
  const [onlineUsers] = useState<OnlineUser[]>([
    { id: '1', name: '张同学', avatar: '👨‍💻', status: 'active', role: 'student' },
    { id: '2', name: '李同学', avatar: '👩‍🎓', status: 'active', role: 'student' },
    { id: '3', name: '王老师', avatar: '👨‍🏫', status: 'active', role: 'instructor' },
    { id: '4', name: 'AI助手', avatar: '🤖', status: 'active', role: 'assistant' }
  ]);

  const sendMessage = useCallback(() => {
    if (!newMessage.trim()) return;
    
    const message: ChatMessage = {
      id: Date.now().toString(),
      userId: 'current',
      userName: '我',
      userAvatar: '🙋‍♂️',
      content: newMessage,
      timestamp: new Date(),
      type: 'text',
      reactions: []
    };
    
    setMessages(prev => [...prev, message]);
    setNewMessage('');
  }, [newMessage]);

  const addReaction = useCallback((messageId: string, emoji: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const existingReaction = msg.reactions?.find(r => r.emoji === emoji);
        if (existingReaction) {
          return {
            ...msg,
            reactions: msg.reactions?.map(r => 
              r.emoji === emoji 
                ? { ...r, count: r.userReacted ? r.count - 1 : r.count + 1, userReacted: !r.userReacted }
                : r
            )
          };
        } else {
          return {
            ...msg,
            reactions: [...(msg.reactions || []), { emoji, count: 1, userReacted: true }]
          };
        }
      }
      return msg;
    }));
  }, []);

  const formatTime = useCallback((date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}小时前`;
    return date.toLocaleDateString('zh-CN');
  }, []);

  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'idle': return 'bg-yellow-500';
      case 'away': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  }, []);

  const getRoleColor = useCallback((role: string) => {
    switch (role) {
      case 'instructor': return 'text-purple-600 bg-purple-100';
      case 'assistant': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  }, []);

  return (
    <div className={cn("bg-white rounded-lg shadow-sm border border-gray-200", className)}>
      {/* 头部 */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Users className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">协作学习空间</h3>
            <p className="text-sm text-gray-600">
              {onlineUsers.length} 人在线
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* 标签页 */}
      <div className="flex border-b border-gray-200">
        {[
          { id: 'chat', name: '讨论', icon: MessageCircle },
          { id: 'users', name: '在线用户', icon: Users },
          { id: 'share', name: '分享', icon: Share2 }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors",
                activeTab === tab.id
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.name}
            </button>
          );
        })}
      </div>

      {/* 聊天 */}
      {activeTab === 'chat' && (
        <div className="flex flex-col h-96">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map(message => (
              <div key={message.id} className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm">
                    {message.userAvatar}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-gray-900">
                      {message.userName}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                  
                  <div className={cn(
                    "rounded-lg p-3 text-sm",
                    message.type === 'question' && "bg-yellow-50 border border-yellow-200",
                    message.type === 'answer' && "bg-green-50 border border-green-200",
                    message.type === 'text' && "bg-gray-50"
                  )}>
                    {message.content}
                  </div>
                  
                  {message.reactions && message.reactions.length > 0 && (
                    <div className="flex items-center gap-2 mt-2">
                      {message.reactions.map(reaction => (
                        <button
                          key={reaction.emoji}
                          onClick={() => addReaction(message.id, reaction.emoji)}
                          className={cn(
                            "flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-colors",
                            reaction.userReacted
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          )}
                        >
                          <span>{reaction.emoji}</span>
                          <span>{reaction.count}</span>
                        </button>
                      ))}
                      <button
                        onClick={() => addReaction(message.id, '👍')}
                        className="p-1 text-gray-400 hover:text-gray-600 rounded"
                      >
                        <ThumbsUp className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="border-t border-gray-200 p-4">
            <div className="flex gap-2">
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                <Paperclip className="h-4 w-4" />
              </button>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="输入消息..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              />
              <button
                onClick={sendMessage}
                disabled={!newMessage.trim()}
                className={cn(
                  "px-4 py-2 rounded-lg font-medium transition-colors",
                  newMessage.trim()
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                )}
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 在线用户 */}
      {activeTab === 'users' && (
        <div className="p-4">
          <div className="space-y-3">
            {onlineUsers.map(user => (
              <div key={user.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50">
                <div className="relative">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-lg">
                    {user.avatar}
                  </div>
                  <div className={cn(
                    "absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white",
                    getStatusColor(user.status)
                  )} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">{user.name}</span>
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium",
                      getRoleColor(user.role)
                    )}>
                      {user.role === 'instructor' ? '讲师' : user.role === 'assistant' ? 'AI助手' : '学员'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {user.status === 'active' ? '在线' : user.status === 'idle' ? '空闲' : '离开'}
                  </div>
                </div>
                
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                  <MessageCircle className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 分享 */}
      {activeTab === 'share' && (
        <div className="p-4">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">分享学习资源</h4>
              <textarea
                placeholder="分享您的学习心得、笔记或资源链接..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
              <button className="mt-2 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                分享
              </button>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">快速操作</h4>
              <div className="grid grid-cols-2 gap-2">
                <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                  <Hand className="h-4 w-4 mx-auto mb-1" />
                  举手提问
                </button>
                <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                  <Share2 className="h-4 w-4 mx-auto mb-1" />
                  分享屏幕
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CollaborativeLearningHub;