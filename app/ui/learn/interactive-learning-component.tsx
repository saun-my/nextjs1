'use client';

import { useState, useEffect, useRef } from 'react';
import { InteractiveElement } from '@/app/lib/learn-definitions';

interface InteractiveLearningComponentProps {
  element: InteractiveElement;
  onComplete: (score: number) => void;
}

export default function InteractiveLearningComponent({ 
  element, 
  onComplete 
}: InteractiveLearningComponentProps) {
  switch (element.type) {
    case 'code_editor':
      return <CodeEditorComponent config={element.content} onComplete={onComplete} />;
    case 'quiz':
      return <QuizComponent config={element.content} onComplete={onComplete} />;
    case 'drag_drop':
      return <DragDropComponent config={element.content} onComplete={onComplete} />;
    case 'simulation':
      return <SimulationComponent config={element.content} onComplete={onComplete} />;
    default:
      return <div>未知的交互类型</div>;
  }
}

// 代码编辑器组件
function CodeEditorComponent({ 
  config, 
  onComplete 
}: { 
  config: any; 
  onComplete: (score: number) => void;
}) {
  const [code, setCode] = useState(config.initialCode || '');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [showHint, setShowHint] = useState(false);

  const runCode = async () => {
    setIsRunning(true);
    setOutput('正在运行代码...');

    try {
      // 模拟代码执行（实际项目中可以使用 Web Workers 或后端执行）
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 简单的 JavaScript 执行模拟
      let result = '';
      try {
        // 创建一个安全的执行环境
        const func = new Function('console', `
          const log = [];
          const console = { log: (msg) => log.push(String(msg)) };
          ${code}
          return log.join('\\n');
        `);
        result = func();
      } catch (error: any) {
        result = `错误: ${error.message}`;
      }

      setOutput(result || '代码执行完成，没有输出');
      
      // 运行测试用例
      runTests();
    } catch (error) {
      setOutput('代码执行出错');
    } finally {
      setIsRunning(false);
    }
  };

  const runTests = () => {
    const results = config.testCases?.map((testCase: any) => {
      try {
        // 简单的测试逻辑
        const testFunc = new Function('input', code);
        const result = testFunc(testCase.input);
        const passed = result === testCase.expectedOutput;
        
        return {
          name: testCase.name,
          passed,
          input: testCase.input,
          expected: testCase.expectedOutput,
          actual: result
        };
      } catch (error: any) {
        return {
          name: testCase.name,
          passed: false,
          error: error.message
        };
      }
    }) || [];

    setTestResults(results);

    // 计算分数
    const passedTests = results.filter((r: any) => r.passed).length;
    const totalTests = results.length;
    const score = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;

    if (score === 100) {
      onComplete(score);
    }
  };

  const resetCode = () => {
    setCode(config.initialCode || '');
    setOutput('');
    setTestResults([]);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="bg-gray-50 px-4 py-3 border-b">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-gray-900">{config.title || '代码练习'}</h4>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowHint(!showHint)}
              className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded-md hover:bg-yellow-200"
            >
              💡 提示
            </button>
            <button
              onClick={resetCode}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              重置
            </button>
            <button
              onClick={runCode}
              disabled={isRunning}
              className="px-4 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isRunning ? '运行中...' : '▶ 运行'}
            </button>
          </div>
        </div>
        {config.description && (
          <p className="text-sm text-gray-600 mt-2">{config.description}</p>
        )}
        {showHint && config.hint && (
          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-800">💡 {config.hint}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
        {/* 代码编辑器 */}
        <div className="border-r">
          <div className="bg-gray-800 text-white px-4 py-2 text-sm font-mono">
            JavaScript 编辑器
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-64 p-4 font-mono text-sm bg-gray-900 text-green-400 border-none resize-none focus:outline-none"
            placeholder="在这里编写你的代码..."
          />
        </div>

        {/* 输出区域 */}
        <div>
          <div className="bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700">
            输出结果
          </div>
          <div className="h-64 p-4 bg-black text-green-400 font-mono text-sm overflow-auto">
            {output || '点击"运行"查看结果'}
          </div>
        </div>
      </div>

      {/* 测试结果 */}
      {testResults.length > 0 && (
        <div className="border-t p-4">
          <h5 className="font-medium text-gray-900 mb-3">测试结果：</h5>
          <div className="space-y-2">
            {testResults.map((result, index) => (
              <div key={index} className={`flex items-center space-x-2 p-2 rounded ${
                result.passed ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
              }`}>
                <span className="text-lg">{result.passed ? '✅' : '❌'}</span>
                <div className="flex-1">
                  <div className="font-medium">{result.name}</div>
                  {result.input && (
                    <div className="text-sm opacity-75">
                      输入: {JSON.stringify(result.input)} | 
                      期望: {JSON.stringify(result.expected)} | 
                      实际: {JSON.stringify(result.actual)}
                    </div>
                  )}
                  {result.error && (
                    <div className="text-sm opacity-75">错误: {result.error}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-md">
            <div className="text-sm text-blue-800">
              通过率: {testResults.filter(r => r.passed).length}/{testResults.length} 
              ({Math.round((testResults.filter(r => r.passed).length / testResults.length) * 100)}%)
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 测验组件
function QuizComponent({
  config,
  onComplete
}: {
  config: any;
  onComplete: (score: number) => void;
}) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const questions = config.questions || [];
  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSelect = (answerId: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: answerId
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // 计算分数（单选）
      let correctCount = 0;
      questions.forEach((question: any, index: number) => {
        const selectedAnswer = selectedAnswers[index];
        const correctId = question.choices.find((choice: any) => choice.correct)?.id;
        if (selectedAnswer && correctId && selectedAnswer === correctId) {
          correctCount++;
        }
      });
  
      const finalScore = Math.round((correctCount / questions.length) * 100);
      setScore(finalScore);
      setShowResults(true);
      onComplete(finalScore);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  if (showResults) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="text-center">
          <div className="text-6xl mb-4">
            {score >= 80 ? '🎉' : score >= 60 ? '👍' : '💪'}
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">测试完成！</h3>
          <p className="text-lg text-gray-600 mb-4">
            你的得分: <span className={`font-bold ${
              score >= 80 ? 'text-green-600' : 
              score >= 60 ? 'text-yellow-600' : 'text-red-600'
            }`}>{score}分</span>
          </p>
          <div className="space-y-3">
            {questions.map((question: any, index: number) => {
              const selectedAnswer = selectedAnswers[index];
              const correctAnswer = question.choices.find((choice: any) => choice.correct)?.id;
              const isCorrect = selectedAnswer === correctAnswer;
              
              return (
                <div key={index} className={`p-3 rounded-lg ${
                  isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                }`}>
                  <div className="flex items-center space-x-2">
                    <span>{isCorrect ? '✅' : '❌'}</span>
                    <span className="font-medium">{question.prompt}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-semibold text-gray-900">{config.title || '测验'}</h4>
          <span className="text-sm text-gray-500">
            问题 {currentQuestionIndex + 1} / {questions.length}
          </span>
        </div>
        
        {/* 进度条 */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {currentQuestion && (
        <div className="space-y-4">
          <h5 className="text-lg font-medium text-gray-900">{currentQuestion.prompt}</h5>
          
          <div className="space-y-3">
            {currentQuestion.choices.map((choice: any) => (
              <label key={choice.id} className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name={`question-${currentQuestionIndex}`}
                  value={choice.id}
                  checked={selectedAnswers[currentQuestionIndex] === choice.id}
                  onChange={() => handleAnswerSelect(choice.id)}
                  className="text-blue-600"
                />
                <span className="text-gray-700">{choice.text}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-between mt-6">
        <button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          上一题
        </button>
        
        <button
          onClick={handleNext}
          disabled={!selectedAnswers[currentQuestionIndex]}
          className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {currentQuestionIndex === questions.length - 1 ? '完成测验' : '下一题'}
        </button>
      </div>
    </div>
  );
}

// 拖拽组件（简化版）
function DragDropComponent({ 
  config, 
  onComplete 
}: { 
  config: any; 
  onComplete: (score: number) => void;
}) {
  const [draggedItems, setDraggedItems] = useState<string[]>([]);
  const [dropZones, setDropZones] = useState<Record<string, string[]>>({});

  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    e.dataTransfer.setData('text/plain', itemId);
  };

  const handleDrop = (e: React.DragEvent, zoneId: string) => {
    e.preventDefault();
    const itemId = e.dataTransfer.getData('text/plain');
    
    setDropZones(prev => ({
      ...prev,
      [zoneId]: [...(prev[zoneId] || []), itemId]
    }));
    
    setDraggedItems(prev => [...prev, itemId]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const checkAnswer = () => {
    // 约束类型，避免隐式 any
    const correctAnswers: Record<string, string[]> = config.correctMapping || {};
    let correctCount = 0;
    let totalCount = 0;
  
    Object.keys(correctAnswers).forEach((zoneId) => {
      const userAnswer = (dropZones[zoneId] || []) as string[];
      const correctAnswer = correctAnswers[zoneId] || [];
      totalCount += correctAnswer.length;
  
      correctAnswer.forEach((item: string) => {
        if (userAnswer.includes(item)) {
          correctCount++;
        }
      });
    });
  
    const score = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;
    onComplete(score);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h4 className="text-lg font-semibold text-gray-900 mb-4">{config.title || '拖拽练习'}</h4>
      <p className="text-gray-600 mb-6">{config.instruction}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 可拖拽项目 */}
        <div>
          <h5 className="font-medium text-gray-900 mb-3">可拖拽项目</h5>
          <div className="space-y-2">
            {config.items?.map((item: any) => (
              <div
                key={item.id}
                draggable={!draggedItems.includes(item.id)}
                onDragStart={(e) => handleDragStart(e, item.id)}
                className={`p-3 border rounded-lg cursor-move ${
                  draggedItems.includes(item.id) ? 'opacity-50' : 'hover:bg-gray-50'
                }`}
              >
                {item.text}
              </div>
            ))}
          </div>
        </div>
        
        {/* 放置区域 */}
        <div>
          <h5 className="font-medium text-gray-900 mb-3">放置区域</h5>
          <div className="space-y-3">
            {config.zones?.map((zone: any) => (
              <div
                key={zone.id}
                onDrop={(e) => handleDrop(e, zone.id)}
                onDragOver={handleDragOver}
                className="min-h-16 p-3 border-2 border-dashed border-gray-300 rounded-lg"
              >
                <div className="font-medium text-gray-700 mb-2">{zone.label}</div>
                <div className="space-y-1">
                  {(dropZones[zone.id] || []).map((itemId) => {
                    const item = config.items.find((i: any) => i.id === itemId);
                    return item ? (
                      <div key={itemId} className="p-2 bg-blue-50 rounded">
                        {item.text}
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mt-6 text-center">
        <button
          onClick={checkAnswer}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          检查答案
        </button>
      </div>
    </div>
  );
}

// 模拟组件
function SimulationComponent({ 
  config, 
  onComplete 
}: { 
  config: any; 
  onComplete: (score: number) => void;
}) {
  const [simulationState, setSimulationState] = useState(config.initialState || {});
  const [actions, setActions] = useState<any[]>([]);

  const handleAction = (action: any) => {
    const newActions = [...actions, action];
    setActions(newActions);
    
    // 模拟状态变化
    const newState = { ...simulationState, ...action.effect };
    setSimulationState(newState);
    
    // 检查是否完成
    if (config.completionCondition && config.completionCondition(newState, newActions)) {
      const score = config.calculateScore ? config.calculateScore(newState, newActions) : 100;
      onComplete(score);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h4 className="text-lg font-semibold text-gray-900 mb-4">{config.title || '模拟练习'}</h4>
      <p className="text-gray-600 mb-6">{config.description}</p>
      
      {/* 状态显示 */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h5 className="font-medium text-gray-900 mb-2">当前状态</h5>
        <pre className="text-sm text-gray-700">{JSON.stringify(simulationState, null, 2)}</pre>
      </div>
      
      {/* 可用操作 */}
      <div className="space-y-3">
        <h5 className="font-medium text-gray-900">可用操作</h5>
        {config.availableActions?.map((action: any, index: number) => (
          <button
            key={index}
            onClick={() => handleAction(action)}
            className="w-full p-3 text-left border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="font-medium text-gray-900">{action.label}</div>
            <div className="text-sm text-gray-600">{action.description}</div>
          </button>
        ))}
      </div>
      
      {/* 操作历史 */}
      {actions.length > 0 && (
        <div className="mt-6">
          <h5 className="font-medium text-gray-900 mb-2">操作历史</h5>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {actions.map((action, index) => (
              <div key={index} className="text-sm text-gray-600 p-2 bg-gray-50 rounded">
                {index + 1}. {action.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}