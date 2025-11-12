'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Play, Pause, RotateCcw, Settings, Download, Upload, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/app/lib/utils';

interface InteractiveCodeEditorProps {
  className?: string;
  initialCode?: string;
  language?: string;
  theme?: 'light' | 'dark';
  onCodeChange?: (code: string) => void;
  onRun?: (code: string) => void;
  onSave?: (code: string) => void;
}

export function InteractiveCodeEditor({
  className,
  initialCode = '// 在这里编写你的代码\nconsole.log("Hello, World!");',
  language = 'javascript',
  theme = 'light',
  onCodeChange,
  onRun,
  onSave
}: InteractiveCodeEditorProps) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [autoRun, setAutoRun] = useState(false);
  const [fontSize, setFontSize] = useState(14);

  // 模拟代码执行
  const runCode = useCallback(async () => {
    setIsRunning(true);
    setOutput([]);
    
    // 模拟执行延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 简单的代码执行模拟
    try {
      const mockOutput: string[] = [];
      
      if (code.includes('console.log')) {
        const matches = code.match(/console\.log\(['"`](.+?)['"`]\)/g);
        if (matches) {
          matches.forEach(match => {
            const message = match.match(/['"`](.+?)['"`]/);
            if (message) {
              mockOutput.push(message[1]);
            }
          });
        }
      }
      
      if (code.includes('for') || code.includes('while')) {
        mockOutput.push('循环执行中...');
        mockOutput.push('循环完成');
      }
      
      if (code.includes('function')) {
        mockOutput.push('函数定义成功');
      }
      
      if (mockOutput.length === 0) {
        mockOutput.push('代码执行完成');
      }
      
      setOutput(mockOutput);
      
      if (onRun) {
        onRun(code);
      }
    } catch (error) {
      setOutput([`错误: ${error}`]);
    }
    
    setIsRunning(false);
  }, [code, onRun]);

  // 自动运行
  useEffect(() => {
    if (autoRun) {
      const timer = setTimeout(() => {
        runCode();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [code, autoRun, runCode]);

  const handleCodeChange = useCallback((newCode: string) => {
    setCode(newCode);
    if (onCodeChange) {
      onCodeChange(newCode);
    }
  }, [onCodeChange]);

  const handleSave = useCallback(() => {
    if (onSave) {
      onSave(code);
    } else {
      const blob = new Blob([code], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `code.${language === 'javascript' ? 'js' : language}`;
      a.click();
    }
  }, [code, language, onSave]);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        handleCodeChange(content);
      };
      reader.readAsText(file);
    }
  }, [handleCodeChange]);

  const clearOutput = useCallback(() => {
    setOutput([]);
  }, []);

  const resetCode = useCallback(() => {
    setCode(initialCode);
    setOutput([]);
  }, [initialCode]);

  const languageExamples = {
    javascript: [
      '// 基础输出\nconsole.log("Hello, World!");',
      '// 循环\nfor (let i = 0; i < 5; i++) {\n  console.log(i);\n}',
      '// 函数\nfunction greet(name) {\n  return "Hello, " + name;\n}\nconsole.log(greet("World"));'
    ],
    python: [
      '# 基础输出\nprint("Hello, World!")',
      '# 循环\nfor i in range(5):\n    print(i)',
      '# 函数\ndef greet(name):\n    return f"Hello, {name}"\n\nprint(greet("World"))'
    ],
    html: [
      '<!-- HTML 示例 -->\n<div class="container">\n  <h1>Hello World</h1>\n  <p>This is a paragraph.</p>\n</div>',
      '<!-- 表单示例 -->\n<form>\n  <input type="text" placeholder="Enter your name">\n  <button type="submit">Submit</button>\n</form>'
    ]
  };

  return (
    <div className={cn("bg-white rounded-lg shadow-sm border border-gray-200", className)}>
      {/* 头部 */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            {language.toUpperCase()}
          </div>
          <div className="text-sm text-gray-600">
            实时代码编辑器
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAutoRun(!autoRun)}
            className={cn(
              "px-3 py-1 rounded text-sm font-medium transition-colors",
              autoRun
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            )}
          >
            {autoRun ? '自动运行' : '手动运行'}
          </button>
          
          <button
            onClick={() => setShowPreview(!showPreview)}
            className={cn(
              "p-2 rounded transition-colors",
              showPreview
                ? "bg-blue-100 text-blue-600"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            )}
            title={showPreview ? "隐藏预览" : "显示预览"}
          >
            {showPreview ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </button>
          
          <button
            onClick={resetCode}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
            title="重置代码"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          
          <button
            onClick={handleSave}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
            title="保存代码"
          >
            <Download className="h-4 w-4" />
          </button>
          
          <label className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors cursor-pointer"
                 title="上传文件">
            <Upload className="h-4 w-4" />
            <input
              type="file"
              accept=".js,.py,.html,.css,.json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
          
          <button
            onClick={runCode}
            disabled={isRunning}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors",
              isRunning
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700"
            )}
          >
            {isRunning ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                运行中...
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                运行代码
              </>
            )}
          </button>
        </div>
      </div>

      <div className="flex" style={{ height: '500px' }}>
        {/* 代码编辑器 */}
        <div className={cn("flex-1 flex flex-col", !showPreview && "w-full")}>
          {/* 工具栏 */}
          <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">字体大小:</span>
              <input
                type="range"
                min="12"
                max="20"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-20"
              />
              <span className="text-sm text-gray-600">{fontSize}px</span>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={clearOutput}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
              >
                清空输出
              </button>
            </div>
          </div>
          
          {/* 代码区域 */}
          <div className="flex-1 p-4">
            <textarea
              value={code}
              onChange={(e) => handleCodeChange(e.target.value)}
              className="w-full h-full p-4 border border-gray-300 rounded-lg font-mono resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              style={{ fontSize: `${fontSize}px`, lineHeight: '1.5' }}
              spellCheck={false}
              placeholder="在这里编写你的代码..."
            />
          </div>
          
          {/* 输出区域 */}
          <div className="border-t border-gray-200">
            <div className="flex items-center justify-between p-3 bg-gray-50 border-b border-gray-200">
              <div className="text-sm font-medium text-gray-900">输出</div>
              <div className="text-xs text-gray-500">
                {output.length > 0 ? `${output.length} 行输出` : '无输出'}
              </div>
            </div>
            
            <div className="p-4 h-32 overflow-y-auto bg-gray-900 text-green-400 font-mono text-sm">
              {output.length === 0 ? (
                <div className="text-gray-500">点击"运行代码"查看输出结果</div>
              ) : (
                output.map((line, index) => (
                  <div key={index} className="mb-1">
                    {line}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* 预览面板 */}
        {showPreview && (
          <div className="w-80 border-l border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-medium text-gray-900">代码示例</h3>
              <p className="text-sm text-gray-600 mt-1">选择示例快速开始</p>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {languageExamples[language as keyof typeof languageExamples]?.map((example, index) => (
                <button
                  key={index}
                  onClick={() => handleCodeChange(example)}
                  className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
                >
                  <div className="text-xs text-gray-600 mb-2 font-mono whitespace-pre-line">
                    {example}
                  </div>
                  <div className="text-xs text-blue-600 font-medium">点击使用此示例</div>
                </button>
              ))}
            </div>
            
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="text-sm text-gray-600 mb-2">快捷键:</div>
              <div className="text-xs text-gray-500 space-y-1">
                <div>• Ctrl+Enter: 运行代码</div>
                <div>• Ctrl+S: 保存代码</div>
                <div>• Ctrl+R: 重置代码</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default InteractiveCodeEditor;