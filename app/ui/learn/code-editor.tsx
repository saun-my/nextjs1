'use client';

import { useState, useEffect } from 'react';
import { clsx } from 'clsx';

interface CodeEditorProps {
  initialCode?: string;
  language?: string;
  onChange?: (code: string) => void;
  onRun?: (code: string) => void;
  height?: string;
  readonly?: boolean;
}

export default function CodeEditor({
  initialCode = '',
  language = 'javascript',
  onChange,
  onRun,
  height = '300px',
  readonly = false
}: CodeEditorProps) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    setCode(initialCode);
  }, [initialCode]);

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    onChange?.(newCode);
  };

  const handleRun = async () => {
    if (!onRun) {
      // 默认执行逻辑 - 简单的代码执行模拟
      try {
        setIsRunning(true);
        setOutput('// 正在执行代码...\n');
        
        // 模拟异步执行
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 简单的代码执行模拟
        let result = '';
        if (code.includes('console.log')) {
          const match = code.match(/console\.log\(['"`](.*?)['"`]\)/);
          if (match) {
            result = match[1];
          }
        } else if (code.includes('return')) {
          const match = code.match(/return\s+(.*);/);
          if (match) {
            result = eval(match[1]);
          }
        } else {
          result = '代码执行完成';
        }
        
        setOutput(`// 执行结果:\n${result}`);
      } catch (error) {
        setOutput(`// 错误:\n${error instanceof Error ? error.message : '执行失败'}`);
      } finally {
        setIsRunning(false);
      }
      return;
    }
    
    setIsRunning(true);
    try {
      await onRun(code);
    } finally {
      setIsRunning(false);
    }
  };

  const getLanguageDisplay = () => {
    const langMap: Record<string, string> = {
      'javascript': 'JavaScript',
      'typescript': 'TypeScript',
      'python': 'Python',
      'html': 'HTML',
      'css': 'CSS',
      'json': 'JSON'
    };
    return langMap[language] || language.toUpperCase();
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
      {/* 编辑器头部 */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">
            {getLanguageDisplay()}
          </span>
          <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
            {language}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          {!readonly && (
            <button
              onClick={handleRun}
              disabled={isRunning}
              className={clsx(
                'px-3 py-1 text-sm rounded-md transition-colors',
                'flex items-center space-x-1',
                isRunning
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              )}
            >
              {isRunning ? (
                <>
                  <div className="w-3 h-3 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
                  <span>运行中...</span>
                </>
              ) : (
                <>
                  <span>▶</span>
                  <span>运行</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* 代码编辑区域 */}
      <div className="relative">
        <textarea
          value={code}
          onChange={(e) => handleCodeChange(e.target.value)}
          readOnly={readonly}
          className={clsx(
            'w-full p-4 font-mono text-sm leading-relaxed',
            'focus:outline-none resize-none',
            'bg-gray-900 text-green-400',
            readonly ? 'bg-gray-100 text-gray-600' : 'hover:bg-gray-800'
          )}
          style={{ height, minHeight: '200px' }}
          placeholder={`在这里输入 ${getLanguageDisplay()} 代码...`}
          spellCheck={false}
        />
        
        {/* 行号 */}
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gray-800 border-r border-gray-700 pt-4 pointer-events-none">
          {code.split('\n').map((_, index) => (
            <div key={index} className="text-gray-500 text-sm font-mono text-right pr-2 leading-relaxed">
              {index + 1}
            </div>
          ))}
        </div>
        
        {/* 代码区域缩进 */}
        <div className="ml-12">
          <textarea
            value={code}
            onChange={(e) => handleCodeChange(e.target.value)}
            readOnly={readonly}
            className={clsx(
              'w-full p-4 font-mono text-sm leading-relaxed',
              'focus:outline-none resize-none',
              'bg-transparent text-green-400',
              readonly ? 'text-gray-600' : ''
            )}
            style={{ height, minHeight: '200px' }}
            placeholder={`在这里输入 ${getLanguageDisplay()} 代码...`}
            spellCheck={false}
          />
        </div>
      </div>

      {/* 输出区域 */}
      {output && (
        <div className="border-t border-gray-200 bg-gray-50">
          <div className="px-4 py-2 bg-gray-100 border-b border-gray-200">
            <span className="text-sm font-medium text-gray-700">输出</span>
          </div>
          <pre className="p-4 font-mono text-sm text-gray-800 whitespace-pre-wrap max-h-40 overflow-y-auto">
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}