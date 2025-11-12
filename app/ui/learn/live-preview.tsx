'use client';

import { useState, useEffect, useRef } from 'react';
import { clsx } from 'clsx';

interface LivePreviewProps {
  code: string;
  language: string;
  onValidation?: (isValid: boolean, errors: string[]) => void;
  autoRun?: boolean;
  runDelay?: number;
}

interface ValidationError {
  line: number;
  message: string;
  type: 'error' | 'warning' | 'info';
}

export default function LivePreview({
  code,
  language,
  onValidation,
  autoRun = true,
  runDelay = 1000
}: LivePreviewProps) {
  const [output, setOutput] = useState('');
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [lastRun, setLastRun] = useState<Date | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 简单的语法验证
  const validateCode = (code: string): ValidationError[] => {
    const validationErrors: ValidationError[] = [];
    const lines = code.split('\n');

    lines.forEach((line, index) => {
      // JavaScript/TypeScript 基础验证
      if (language === 'javascript' || language === 'typescript') {
        // 检查未闭合的括号
        const openBrackets = (line.match(/\(/g) || []).length;
        const closeBrackets = (line.match(/\)/g) || []).length;
        if (openBrackets !== closeBrackets) {
          validationErrors.push({
            line: index + 1,
            message: '括号未闭合',
            type: 'error'
          });
        }

        // 检查未闭合的大括号
        const openBraces = (line.match(/\{/g) || []).length;
        const closeBraces = (line.match(/\}/g) || []).length;
        if (openBraces !== closeBraces) {
          validationErrors.push({
            line: index + 1,
            message: '大括号未闭合',
            type: 'warning'
          });
        }

        // 检查未闭合的引号
        const singleQuotes = (line.match(/'/g) || []).length;
        const doubleQuotes = (line.match(/"/g) || []).length;
        if (singleQuotes % 2 !== 0) {
          validationErrors.push({
            line: index + 1,
            message: '单引号未闭合',
            type: 'error'
          });
        }
        if (doubleQuotes % 2 !== 0) {
          validationErrors.push({
            line: index + 1,
            message: '双引号未闭合',
            type: 'error'
          });
        }

        // 检查分号缺失（警告）
        if (line.trim() && 
            !line.trim().endsWith(';') && 
            !line.trim().startsWith('//') &&
            !line.trim().startsWith('/*') &&
            !line.trim().endsWith('{') &&
            !line.trim().endsWith('}') &&
            !line.includes('if') &&
            !line.includes('for') &&
            !line.includes('while') &&
            !line.includes('function') &&
            !line.includes('=>')) {
          validationErrors.push({
            line: index + 1,
            message: '可能缺少分号',
            type: 'warning'
          });
        }
      }

      // HTML 验证
      if (language === 'html') {
        // 检查未闭合的标签
        const openTags = line.match(/<([a-zA-Z][a-zA-Z0-9]*)[^>]*>/g) || [];
        const closeTags = line.match(/<\/([a-zA-Z][a-zA-Z0-9]*)>/g) || [];
        
        openTags.forEach(tag => {
          const tagName = tag.match(/<([a-zA-Z][a-zA-Z0-9]*)[^>]*>/)?.[1];
          if (tagName && !['br', 'hr', 'img', 'input', 'meta', 'link'].includes(tagName.toLowerCase())) {
            const hasCloseTag = closeTags.some(ct => 
              ct.match(/<\/([a-zA-Z][a-zA-Z0-9]*)>/)?.[1].toLowerCase() === tagName.toLowerCase()
            );
            if (!hasCloseTag) {
              validationErrors.push({
                line: index + 1,
                message: `标签 <${tagName}> 可能没有闭合`,
                type: 'warning'
              });
            }
          }
        });
      }

      // CSS 验证
      if (language === 'css') {
        // 检查属性值缺失
        if (line.includes(':') && !line.includes(';') && line.trim()) {
          validationErrors.push({
            line: index + 1,
            message: 'CSS 属性可能缺少分号',
            type: 'warning'
          });
        }

        // 检查未闭合的选择器
        if (line.includes('{') && !line.includes('}')) {
          validationErrors.push({
            line: index + 1,
            message: 'CSS 选择器未闭合',
            type: 'error'
          });
        }
      }
    });

    return validationErrors;
  };

  // 执行代码
  const executeCode = async (code: string) => {
    setIsRunning(true);
    setOutput('// 正在执行...\n');

    try {
      // 模拟异步执行
      await new Promise(resolve => setTimeout(resolve, 500));

      let result = '';
      
      // 根据语言类型执行不同的逻辑
      switch (language) {
        case 'javascript':
        case 'typescript':
          result = executeJavaScript(code);
          break;
        case 'html':
          result = executeHTML(code);
          break;
        case 'css':
          result = executeCSS(code);
          break;
        default:
          result = '不支持的语言类型';
      }

      setOutput(result);
      setLastRun(new Date());
    } catch (error) {
      setOutput(`// 执行错误:\n${error instanceof Error ? error.message : '未知错误'}`);
    } finally {
      setIsRunning(false);
    }
  };

  // JavaScript 执行逻辑
  const executeJavaScript = (code: string): string => {
    try {
      // 简单的 JavaScript 执行模拟
      if (code.includes('console.log')) {
        const logs: string[] = [];
        const matches = code.match(/console\.log\(['"`](.*?)['"`]\)/g);
        if (matches) {
          matches.forEach(match => {
            const content = match.match(/console\.log\(['"`](.*?)['"`]\)/)?.[1];
            if (content) logs.push(content);
          });
        }
        return logs.length > 0 ? logs.join('\n') : 'console.log 执行完成';
      }

      if (code.includes('function')) {
        return '函数定义成功';
      }

      if (code.includes('return')) {
        const returnMatch = code.match(/return\s+(.+);/);
        if (returnMatch) {
          try {
            // 安全的表达式求值
            const expression = returnMatch[1];
            if (expression.includes('+') || expression.includes('-') || expression.includes('*') || expression.includes('/')) {
              // 简单的数学表达式
              const result = eval(expression);
              return `返回值: ${result}`;
            }
            return `返回值: ${expression}`;
          } catch {
            return `返回值: ${returnMatch[1]}`;
          }
        }
      }

      return 'JavaScript 代码执行成功';
    } catch (error) {
      throw new Error(`JavaScript 执行错误: ${error}`);
    }
  };

  // HTML 执行逻辑
  const executeHTML = (code: string): string => {
    try {
      // 创建临时 iframe 来渲染 HTML
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      document.body.appendChild(iframe);
      
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (iframeDoc) {
        iframeDoc.open();
        iframeDoc.write(code);
        iframeDoc.close();
        
        // 获取渲染后的内容
        const content = iframeDoc.body.innerHTML;
        document.body.removeChild(iframe);
        
        return `HTML 渲染成功:\n${content.substring(0, 200)}${content.length > 200 ? '...' : ''}`;
      }
      
      document.body.removeChild(iframe);
      return 'HTML 渲染完成';
    } catch (error) {
      return `HTML 渲染错误: ${error}`;
    }
  };

  // CSS 执行逻辑
  const executeCSS = (code: string): string => {
    try {
      // 创建临时样式元素
      const styleElement = document.createElement('style');
      styleElement.textContent = code;
      document.head.appendChild(styleElement);
      
      // 获取应用的样式规则数量
      const rulesCount = styleElement.sheet?.cssRules.length || 0;
      
      // 清理临时样式
      setTimeout(() => {
        document.head.removeChild(styleElement);
      }, 5000);
      
      return `CSS 样式应用成功，共 ${rulesCount} 条规则`;
    } catch (error) {
      return `CSS 样式错误: ${error}`;
    }
  };

  // 自动运行逻辑
  useEffect(() => {
    if (!autoRun) return;

    // 清除之前的定时器
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // 验证代码
    const validationErrors = validateCode(code);
    setErrors(validationErrors);
    onValidation?.(validationErrors.length === 0, validationErrors.map(e => e.message));

    // 延迟执行代码
    timeoutRef.current = setTimeout(() => {
      executeCode(code);
    }, runDelay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [code, language, autoRun, runDelay]);

  // 手动运行
  const handleManualRun = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    executeCode(code);
  };

  return (
    <div className="border border-gray-200 rounded-lg bg-white">
      {/* 头部控制栏 */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <span className="text-sm font-medium text-gray-700">实时预览</span>
          <span className="text-xs text-gray-500 bg-blue-100 text-blue-800 px-2 py-1 rounded">
            {language}
          </span>
          {lastRun && (
            <span className="text-xs text-gray-500">
              最后运行: {lastRun.toLocaleTimeString()}
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handleManualRun}
            disabled={isRunning}
            className={clsx(
              'px-3 py-1 text-sm rounded-md transition-colors',
              'flex items-center space-x-1',
              isRunning
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'
            )}
          >
            {isRunning ? (
              <>
                <div className="w-3 h-3 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
                <span>运行中</span>
              </>
            ) : (
              <>
                <span>▶</span>
                <span>立即运行</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="flex">
        {/* 错误列表 */}
        {errors.length > 0 && (
          <div className="w-1/3 border-r border-gray-200">
            <div className="px-4 py-2 bg-red-50 border-b border-red-200">
              <h3 className="text-sm font-medium text-red-800">
                检测到 {errors.length} 个问题
              </h3>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {errors.map((error, index) => (
                <div
                  key={index}
                  className={clsx(
                    'px-4 py-2 text-sm border-b border-gray-100',
                    error.type === 'error' ? 'text-red-700 bg-red-50' :
                    error.type === 'warning' ? 'text-yellow-700 bg-yellow-50' :
                    'text-blue-700 bg-blue-50'
                  )}
                >
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs bg-gray-200 px-1 rounded">
                      {error.line}
                    </span>
                    <span>{error.message}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 输出区域 */}
        <div className={clsx('flex-1', errors.length > 0 ? 'w-2/3' : 'w-full')}>
          <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
            <h3 className="text-sm font-medium text-gray-700">输出结果</h3>
          </div>
          <div className="p-4">
            {isRunning ? (
              <div className="flex items-center space-x-2 text-gray-500">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span>正在执行代码...</span>
              </div>
            ) : output ? (
              <pre className="font-mono text-sm text-gray-800 whitespace-pre-wrap max-h-64 overflow-y-auto">
                {output}
              </pre>
            ) : (
              <div className="text-gray-500 text-sm">
                等待代码执行...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}