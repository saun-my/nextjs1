'use client';

import { useState, useEffect } from 'react';
import { clsx } from 'clsx';
import { ChevronLeftIcon, ChevronRightIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface Step {
  id: string;
  title: string;
  description: string;
  content: {
    type: 'text' | 'code' | 'quiz' | 'challenge';
    data: any;
  };
  validation?: {
    required?: boolean;
    testCases?: Array<{
      input?: string;
      expectedOutput?: string;
      description: string;
    }>;
  };
}

interface StepWizardProps {
  steps: Step[];
  onComplete?: (results: any[]) => void;
  onStepChange?: (stepIndex: number, step: Step) => void;
  allowSkip?: boolean;
  showProgress?: boolean;
  title?: string;
}

interface StepResult {
  stepId: string;
  completed: boolean;
  userAnswer?: any;
  validationPassed?: boolean;
  timeSpent: number;
}

export default function StepWizard({
  steps,
  onComplete,
  onStepChange,
  allowSkip = false,
  showProgress = true,
  title = '交互式学习向导'
}: StepWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [stepResults, setStepResults] = useState<StepResult[]>([]);
  const [stepStartTime, setStepStartTime] = useState<Date>(new Date());
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    setStepStartTime(new Date());
    onStepChange?.(currentStep, steps[currentStep]);
  }, [currentStep]);

  const currentStepData = steps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;
  const progress = ((currentStep + 1) / steps.length) * 100;

  // 记录步骤结果
  const recordStepResult = (completed: boolean, userAnswer?: any, validationPassed?: boolean) => {
    const timeSpent = Date.now() - stepStartTime.getTime();
    const result: StepResult = {
      stepId: currentStepData.id,
      completed,
      userAnswer,
      validationPassed,
      timeSpent
    };

    setStepResults(prev => {
      const filtered = prev.filter(r => r.stepId !== currentStepData.id);
      return [...filtered, result];
    });
  };

  // 下一步
  const handleNext = () => {
    if (isLastStep) {
      // 完成所有步骤
      onComplete?.(stepResults);
    } else {
      recordStepResult(true, userAnswers[currentStepData.id]);
      setCurrentStep(prev => prev + 1);
    }
  };

  // 上一步
  const handlePrevious = () => {
    if (!isFirstStep) {
      recordStepResult(false, userAnswers[currentStepData.id]);
      setCurrentStep(prev => prev - 1);
    }
  };

  // 跳过当前步骤
  const handleSkip = () => {
    if (allowSkip) {
      recordStepResult(false, null, false);
      if (isLastStep) {
        onComplete?.(stepResults);
      } else {
        setCurrentStep(prev => prev + 1);
      }
    }
  };

  // 更新用户答案
  const updateUserAnswer = (answer: any) => {
    setUserAnswers(prev => ({
      ...prev,
      [currentStepData.id]: answer
    }));
  };

  // 验证当前步骤
  const validateCurrentStep = async () => {
    if (!currentStepData.validation) return true;

    setIsValidating(true);
    try {
      // 模拟验证过程
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 这里可以添加实际的验证逻辑
      const passed = Math.random() > 0.3; // 模拟 70% 通过率
      
      recordStepResult(passed, userAnswers[currentStepData.id], passed);
      return passed;
    } finally {
      setIsValidating(false);
    }
  };

  // 渲染步骤内容
  const renderStepContent = () => {
    const { type, data } = currentStepData.content;

    switch (type) {
      case 'text':
        return (
          <div className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: data.content }} />
            {data.code && (
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
                <code>{data.code}</code>
              </pre>
            )}
          </div>
        );

      case 'code':
        return (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">{data.title}</h4>
              <p className="text-gray-600 text-sm mb-4">{data.description}</p>
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                <code>{data.template}</code>
              </pre>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                你的代码：
              </label>
              <textarea
                value={userAnswers[currentStepData.id] || ''}
                onChange={(e) => updateUserAnswer(e.target.value)}
                className="w-full h-32 p-3 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="在这里输入你的代码..."
              />
            </div>
          </div>
        );

      case 'quiz':
        return (
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">{data.question}</h4>
            <div className="space-y-2">
              {data.options.map((option: string, index: number) => (
                <label key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="quiz-answer"
                    value={index}
                    checked={userAnswers[currentStepData.id] === index}
                    onChange={(e) => updateUserAnswer(parseInt(e.target.value))}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>
        );

      case 'challenge':
        return (
          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-medium text-yellow-900 mb-2">{data.title}</h4>
              <p className="text-yellow-800 text-sm">{data.description}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                你的解决方案：
              </label>
              <textarea
                value={userAnswers[currentStepData.id] || ''}
                onChange={(e) => updateUserAnswer(e.target.value)}
                className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="描述你的解决方案..."
              />
            </div>
          </div>
        );

      default:
        return <div>未知的内容类型</div>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
      {/* 标题 */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <p className="text-gray-600 mt-1">
          步骤 {currentStep + 1} / {steps.length}: {currentStepData.title}
        </p>
      </div>

      {/* 进度条 */}
      {showProgress && (
        <div className="px-6 py-4 bg-gray-50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">进度</span>
            <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* 步骤内容 */}
      <div className="px-6 py-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {currentStepData.title}
          </h3>
          <p className="text-gray-600 mb-6">{currentStepData.description}</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          {renderStepContent()}
        </div>

        {/* 验证状态 */}
        {currentStepData.validation && (
          <div className="mt-4 flex items-center justify-between">
            <button
              onClick={validateCurrentStep}
              disabled={isValidating}
              className={clsx(
                'px-4 py-2 rounded-lg font-medium transition-colors',
                isValidating
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
              )}
            >
              {isValidating ? (
                <>
                  <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin inline mr-2"></div>
                  验证中...
                </>
              ) : (
                '验证答案'
              )}
            </button>

            {stepResults.find(r => r.stepId === currentStepData.id)?.validationPassed && (
              <div className="flex items-center text-green-600">
                <CheckCircleIcon className="w-5 h-5 mr-1" />
                <span className="text-sm font-medium">验证通过</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 导航按钮 */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
        <button
          onClick={handlePrevious}
          disabled={isFirstStep}
          className={clsx(
            'flex items-center px-4 py-2 rounded-lg font-medium transition-colors',
            isFirstStep
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gray-600 text-white hover:bg-gray-700'
          )}
        >
          <ChevronLeftIcon className="w-4 h-4 mr-1" />
          上一步
        </button>

        <div className="flex items-center space-x-3">
          {allowSkip && (
            <button
              onClick={handleSkip}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
            >
              跳过
            </button>
          )}

          <button
            onClick={handleNext}
            className={clsx(
              'flex items-center px-4 py-2 rounded-lg font-medium transition-colors',
              'bg-blue-600 text-white hover:bg-blue-700'
            )}
          >
            {isLastStep ? '完成学习' : '下一步'}
            {!isLastStep && <ChevronRightIcon className="w-4 h-4 ml-1" />}
          </button>
        </div>
      </div>
    </div>
  );
}