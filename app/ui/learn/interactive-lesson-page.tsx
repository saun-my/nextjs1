'use client';

import { useState, useEffect } from 'react';
import InteractiveLearningComponent from '@/app/ui/learn/interactive-learning-component';
import { InteractiveElement, Lesson } from '@/app/lib/learn-definitions';
import { updateCourseProgress } from '@/app/lib/learn-data';

interface InteractiveLessonPageProps {
  lessonId: string;
  userId: string;
  onComplete: () => void;
}

export default function InteractiveLessonPage({ 
  lessonId, 
  userId, 
  onComplete 
}: InteractiveLessonPageProps) {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [currentElementIndex, setCurrentElementIndex] = useState(0);
  const [completedElements, setCompletedElements] = useState<Set<number>>(new Set());
  const [totalScore, setTotalScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    loadLessonData();
  }, [lessonId]);

  const loadLessonData = async () => {
    setIsLoading(true);
    try {
      // 模拟加载课程数据
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 模拟课程数据
      const mockLesson: Lesson = {
        id: lessonId,
        course_id: 'course-1',
        title: 'JavaScript 基础练习',
        objective: '掌握 JavaScript 基础语法和函数使用',
        content: '通过交互式练习学习 JavaScript 基础',
        duration_min: 30,
        order_index: 1,
        interactive_elements: [
          {
            id: 'element-1',
            type: 'code_editor',
            title: '变量声明练习',
            content: {
              title: 'JavaScript 变量声明',
              description: '编写一个函数，接收两个参数并返回它们的和',
              initialCode: `function add(a, b) {
  // 在这里编写你的代码
  
}`,
              testCases: [
                {
                  name: '测试 1: 正数相加',
                  input: [2, 3],
                  expectedOutput: 5
                },
                {
                  name: '测试 2: 负数相加',
                  input: [-1, 1],
                  expectedOutput: 0
                }
              ],
              hint: '使用 return 语句返回 a + b 的结果'
            }
          },
          {
            id: 'element-2',
            type: 'quiz',
            title: 'JavaScript 知识测验',
            content: {
              title: 'JavaScript 基础知识测验',
              questions: [
                {
                  prompt: '以下哪个是 JavaScript 的正确变量声明方式？',
                  choices: [
                    { id: 'a', text: 'var name = "John"', correct: true },
                    { id: 'b', text: 'variable name = "John"', correct: false },
                    { id: 'c', text: 'v name = "John"', correct: false },
                    { id: 'd', text: 'declare name = "John"', correct: false }
                  ]
                },
                {
                  prompt: 'JavaScript 中哪个方法可以用来向控制台输出信息？',
                  choices: [
                    { id: 'a', text: 'print()', correct: false },
                    { id: 'b', text: 'console.log()', correct: true },
                    { id: 'c', text: 'output()', correct: false },
                    { id: 'd', text: 'display()', correct: false }
                  ]
                }
              ]
            }
          },
          {
            id: 'element-3',
            type: 'drag_drop',
            title: '代码结构匹配',
            content: {
              title: 'JavaScript 代码结构匹配',
              instruction: '将左侧的代码片段拖拽到右侧对应的代码结构中',
              items: [
                { id: 'item1', text: 'function hello() {' },
                { id: 'item2', text: 'console.log("Hello World");' },
                { id: 'item3', text: '}' }
              ],
              zones: [
                { id: 'zone1', label: '函数声明开始' },
                { id: 'zone2', label: '函数体内容' },
                { id: 'zone3', label: '函数结束' }
              ],
              correctMapping: {
                zone1: ['item1'],
                zone2: ['item2'],
                zone3: ['item3']
              }
            }
          }
        ]
      };
      
      setLesson(mockLesson);
    } catch (error) {
      console.error('加载课程失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleElementComplete = (score: number) => {
    setCompletedElements((prev) => new Set([...prev, currentElementIndex]));
    setTotalScore((prev) => prev + score);
    const elements = lesson?.interactive_elements ?? [];
    if (currentElementIndex < elements.length - 1) {
      setTimeout(() => {
        setCurrentElementIndex(currentElementIndex + 1);
      }, 1000);
    } else {
      setTimeout(() => {
        setShowSummary(true);
        updateCourseProgress(
          userId,
          lesson?.course_id || '',
          lessonId,
          100,
          lesson?.duration_min || 0
        );
      }, 1000);
    }
  };

  const handleElementNavigation = (index: number) => {
    setCurrentElementIndex(index);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">正在加载课程内容...</p>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">课程加载失败</p>
        </div>
      </div>
    );
  }

  const elements = lesson.interactive_elements ?? [];
  const currentElement = elements[currentElementIndex];
  const progress = ((currentElementIndex + 1) / Math.max(elements.length, 1)) * 100;

  if (showSummary) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">恭喜完成课程！</h2>
            <p className="text-gray-600 mb-6">你已经成功完成了 "{lesson.title}" 课程</p>
            
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <div className="text-3xl font-bold text-blue-600 mb-1">{Math.round(totalScore / lesson.interactive_elements.length)}%</div>
              <div className="text-sm text-blue-800">总体得分</div>
            </div>
            
            <div className="space-y-3 mb-6">
              {lesson.interactive_elements.map((element, index) => (
                <div key={element.id} className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">{element.title}</span>
                  <span className={`font-medium ${
                    completedElements.has(index) ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {completedElements.has(index) ? '✅ 已完成' : '❌ 未完成'}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowSummary(false)}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                重新学习
              </button>
              <button
                onClick={onComplete}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                继续学习
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">{lesson.title}</h1>
              <p className="text-sm text-gray-600">{lesson.objective}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                预计时间: {lesson.duration_min} 分钟
              </div>
              <button
                onClick={onComplete}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                退出
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 进度条 */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600 min-w-0">
              进度: {currentElementIndex + 1} / {elements.length}
            </div>
            <div className="flex-1">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
            <div className="text-sm font-medium text-blue-600">{Math.round(progress)}%</div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 侧边导航 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-4 sticky top-4">
              <h3 className="font-semibold text-gray-900 mb-4">学习步骤</h3>
              <div className="space-y-2">
                {elements.map((element, index) => (
                  <button
                    key={element.id}
                    onClick={() => handleElementNavigation(index)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      index === currentElementIndex
                        ? 'bg-blue-50 border-blue-200 text-blue-800'
                        : completedElements.has(index)
                        ? 'bg-green-50 border-green-200 text-green-800'
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">
                        {completedElements.has(index) ? '✅' : index === currentElementIndex ? '⏳' : '⭕'}
                      </span>
                      <span className="text-sm font-medium">{element.title}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 主要内容区域 */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {currentElement?.title}
                  </h2>
                  <p className="text-gray-600">
                    {currentElement?.type === 'code_editor'
                      ? '通过编写代码来完成练习'
                      : currentElement?.type === 'quiz'
                      ? '选择正确的答案'
                      : currentElement?.type === 'drag_drop'
                      ? '拖拽项目到正确的位置'
                      : '完成模拟练习'}
                  </p>
                </div>

                <InteractiveLearningComponent
                  element={currentElement}
                  onComplete={handleElementComplete}
                />
              </div>
            </div>

            {/* 导航按钮 */}
            <div className="flex justify-between mt-6">
              <button
                onClick={() => handleElementNavigation(Math.max(0, currentElementIndex - 1))}
                disabled={currentElementIndex === 0}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                上一步
              </button>
              
              <div className="text-sm text-gray-500 flex items-center">
                {completedElements.has(currentElementIndex) && 
                 currentElementIndex < lesson.interactive_elements.length - 1 && (
                  <span className="text-green-600 mr-2">✅ 已完成</span>
                )}
                步骤 {currentElementIndex + 1} / {lesson.interactive_elements.length}
              </div>
              
              <button
                onClick={() => handleElementNavigation(
                  Math.min(lesson.interactive_elements.length - 1, currentElementIndex + 1)
                )}
                disabled={currentElementIndex === lesson.interactive_elements.length - 1}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                下一步
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}