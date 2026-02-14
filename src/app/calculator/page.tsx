'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useApp } from '@/contexts/AppContext';

type CalculatorMode = 'basic' | 'scientific' | 'programmer';

export default function CalculatorPage() {
  const { language, setLanguage } = useApp();
  const [mode, setMode] = useState<CalculatorMode>('basic');
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [previousValue, setPreviousValue] = useState<string | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [programmerValue, setProgrammerValue] = useState('');
  const [programmerBase, setProgrammerBase] = useState<'dec' | 'hex' | 'oct' | 'bin'>('dec');

  const handleNumberClick = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num);
      setExpression(expression + ' ' + num);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
      setExpression(expression + num);
    }
  };

  const handleDecimalClick = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setExpression(expression + ' 0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
      setExpression(expression + '.');
    }
  };

  const handleOperatorClick = (op: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(display);
      setExpression(display + ' ' + op);
    } else if (operation) {
      const result = calculate(previousValue, inputValue, operation);
      setDisplay(String(result));
      setExpression(previousValue + ' ' + operation + ' ' + display + ' = ' + result);
      setPreviousValue(String(result));
    } else {
      setExpression(expression + ' ' + op);
    }

    setWaitingForOperand(true);
    setOperation(op);
  };

  const calculate = (first: string, second: number, op: string): number => {
    const firstValue = parseFloat(first);
    switch (op) {
      case '+':
        return firstValue + second;
      case '-':
        return firstValue - second;
      case '×':
        return firstValue * second;
      case '÷':
        return firstValue / second;
      default:
        return second;
    }
  };

  const handleEqualClick = () => {
    if (previousValue === null || operation === null) return;

    const inputValue = parseFloat(display);
    const result = calculate(previousValue, inputValue, operation);
    setDisplay(String(result));
    setExpression(previousValue + ' ' + operation + ' ' + display + ' = ' + result);
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(true);
  };

  const handleClearClick = () => {
    setDisplay('0');
    setExpression('');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const handlePercentClick = () => {
    const value = parseFloat(display);
    setDisplay(String(value / 100));
    setExpression(expression + ' %');
  };

  const handleToggleSign = () => {
    const value = parseFloat(display);
    setDisplay(String(value * -1));
  };

  const handleScientificFunction = (func: string) => {
    const value = parseFloat(display);
    let result: number;
    switch (func) {
      case 'sin':
        result = Math.sin(value * Math.PI / 180);
        break;
      case 'cos':
        result = Math.cos(value * Math.PI / 180);
        break;
      case 'tan':
        result = Math.tan(value * Math.PI / 180);
        break;
      case 'log':
        result = Math.log10(value);
        break;
      case 'ln':
        result = Math.log(value);
        break;
      case 'sqrt':
        result = Math.sqrt(value);
        break;
      case 'pow':
        result = Math.pow(value, 2);
        break;
      case 'fact':
        result = factorial(Math.floor(value));
        break;
      default:
        result = value;
    }
    setDisplay(String(result));
    setExpression(func + '(' + value + ') = ' + result);
    setWaitingForOperand(true);
  };

  const factorial = (n: number): number => {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
  };

  const handleProgrammerChange = (value: string) => {
    setProgrammerValue(value);
  };

  const handleProgrammerBaseChange = (base: 'dec' | 'hex' | 'oct' | 'bin') => {
    if (programmerValue === '') return;
    
    let decimalValue: number;
    switch (base) {
      case 'dec':
        decimalValue = parseInt(programmerValue, 10);
        break;
      case 'hex':
        decimalValue = parseInt(programmerValue, 16);
        break;
      case 'oct':
        decimalValue = parseInt(programmerValue, 8);
        break;
      case 'bin':
        decimalValue = parseInt(programmerValue, 2);
        break;
    }
    
    if (!isNaN(decimalValue)) {
      setProgrammerValue(decimalValue.toString(base === 'dec' ? 10 : base === 'hex' ? 16 : base === 'oct' ? 8 : 2));
    }
    
    setProgrammerBase(base);
  };

  const getProgrammerValues = () => {
    if (programmerValue === '') return { dec: '', hex: '', oct: '', bin: '' };
    
    const decimalValue = parseInt(programmerValue, programmerBase === 'dec' ? 10 : programmerBase === 'hex' ? 16 : programmerBase === 'oct' ? 8 : 2);
    if (isNaN(decimalValue)) return { dec: '', hex: '', oct: '', bin: '' };
    
    return {
      dec: decimalValue.toString(10),
      hex: decimalValue.toString(16).toUpperCase(),
      oct: decimalValue.toString(8),
      bin: decimalValue.toString(2),
    };
  };

  const programmerValues = getProgrammerValues();

  const BasicCalculator = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="bg-gray-700 text-gray-300 text-right p-4 rounded-lg text-lg font-mono min-h-[60px]">
          {expression || (language === 'zh' ? '计算过程' : 'Calculation Process')}
        </div>
        <div className="bg-gray-900 text-white text-right p-6 rounded-lg text-4xl font-mono">
          {display}
        </div>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {['C', '±', '%', '÷'].map((btn) => (
          <button
            key={btn}
            onClick={() => {
              if (btn === 'C') handleClearClick();
              else if (btn === '±') handleToggleSign();
              else if (btn === '%') handlePercentClick();
              else handleOperatorClick('÷');
            }}
            className={`p-4 text-xl font-semibold rounded-lg transition-all ${
              btn === 'C' ? 'bg-red-500 hover:bg-red-600 text-white' :
              ['±', '%'].includes(btn) ? 'bg-gray-300 hover:bg-gray-400 text-gray-800' :
              'bg-orange-500 hover:bg-orange-600 text-white'
            }`}
          >
            {btn}
          </button>
        ))}
        {['7', '8', '9', '×'].map((btn) => (
          <button
            key={btn}
            onClick={() => {
              if (btn === '×') handleOperatorClick('×');
              else handleNumberClick(btn);
            }}
            className={`p-4 text-xl font-semibold rounded-lg transition-all ${
              btn === '×' ? 'bg-orange-500 hover:bg-orange-600 text-white' :
              'bg-gray-100 hover:bg-gray-200 text-gray-800'
            }`}
          >
            {btn}
          </button>
        ))}
        {['4', '5', '6', '-'].map((btn) => (
          <button
            key={btn}
            onClick={() => {
              if (btn === '-') handleOperatorClick('-');
              else handleNumberClick(btn);
            }}
            className={`p-4 text-xl font-semibold rounded-lg transition-all ${
              btn === '-' ? 'bg-orange-500 hover:bg-orange-600 text-white' :
              'bg-gray-100 hover:bg-gray-200 text-gray-800'
            }`}
          >
            {btn}
          </button>
        ))}
        {['1', '2', '3', '+'].map((btn) => (
          <button
            key={btn}
            onClick={() => {
              if (btn === '+') handleOperatorClick('+');
              else handleNumberClick(btn);
            }}
            className={`p-4 text-xl font-semibold rounded-lg transition-all ${
              btn === '+' ? 'bg-orange-500 hover:bg-orange-600 text-white' :
              'bg-gray-100 hover:bg-gray-200 text-gray-800'
            }`}
          >
            {btn}
          </button>
        ))}
        {['0', '.', '='].map((btn) => (
          <button
            key={btn}
            onClick={() => {
              if (btn === '=') handleEqualClick();
              else handleDecimalClick();
            }}
            className={`p-4 text-xl font-semibold rounded-lg transition-all ${
              btn === '=' ? 'bg-orange-500 hover:bg-orange-600 text-white col-span-2' :
              'bg-gray-100 hover:bg-gray-200 text-gray-800'
            }`}
          >
            {btn}
          </button>
        ))}
      </div>
    </div>
  );

  const ScientificCalculator = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="bg-gray-700 text-gray-300 text-right p-4 rounded-lg text-lg font-mono min-h-[60px]">
          {expression || (language === 'zh' ? '计算过程' : 'Calculation Process')}
        </div>
        <div className="bg-gray-900 text-white text-right p-6 rounded-lg text-4xl font-mono">
          {display}
        </div>
      </div>
      <div className="grid grid-cols-5 gap-2">
        {[
          'sin', 'cos', 'tan', 'log', 'ln',
          '√', 'x²', 'x!', '(', ')',
          '7', '8', '9', '÷', 'C',
          '4', '5', '6', '×', '±',
          '1', '2', '3', '-', '%',
          '0', '.', '=', '+'
        ].map((btn) => (
          <button
            key={btn}
            onClick={() => {
              if (['sin', 'cos', 'tan', 'log', 'ln', '√', 'x²', 'x!'].includes(btn)) {
                handleScientificFunction(btn);
              } else if (btn === 'C') handleClearClick();
              else if (btn === '±') handleToggleSign();
              else if (btn === '%') handlePercentClick();
              else if (['÷', '×', '-', '+'].includes(btn)) handleOperatorClick(btn);
              else if (btn === '=') handleEqualClick();
              else if (btn === '.') handleDecimalClick();
              else handleNumberClick(btn);
            }}
            className={`p-3 text-sm font-semibold rounded-lg transition-all ${
              ['sin', 'cos', 'tan', 'log', 'ln', '√', 'x²', 'x!'].includes(btn) ? 'bg-purple-500 hover:bg-purple-600 text-white' :
              btn === 'C' ? 'bg-red-500 hover:bg-red-600 text-white' :
              ['÷', '×', '-', '+'].includes(btn) ? 'bg-orange-500 hover:bg-orange-600 text-white' :
              'bg-gray-100 hover:bg-gray-200 text-gray-800'
            }`}
          >
            {btn}
          </button>
        ))}
      </div>
    </div>
  );

  const ProgrammerCalculator = () => (
    <div className="space-y-4">
      <div className="flex gap-2 mb-4">
        {[
          { key: 'dec', label: 'DEC' },
          { key: 'hex', label: 'HEX' },
          { key: 'oct', label: 'OCT' },
          { key: 'bin', label: 'BIN' },
        ].map((base) => (
          <button
            key={base.key}
            onClick={() => handleProgrammerBaseChange(base.key as any)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              programmerBase === base.key
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
            }`}
          >
            {base.label}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        <div className="bg-gray-700 text-gray-300 text-right p-4 rounded-lg text-lg font-mono min-h-[60px]">
          {language === 'zh' ? '输入数值' : 'Enter Value'}
        </div>
        <div className="bg-gray-900 text-white text-right p-6 rounded-lg text-2xl font-mono">
          <input
            type="text"
            value={programmerValue}
            onChange={(e) => handleProgrammerChange(e.target.value)}
            className="bg-transparent w-full text-right outline-none"
            placeholder="0"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {[
          { key: 'dec', label: 'DEC' },
          { key: 'hex', label: 'HEX' },
          { key: 'oct', label: 'OCT' },
          { key: 'bin', label: 'BIN' },
        ].map((base) => (
          <div key={base.key} className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600 mb-2">{base.label}</div>
            <div className="text-lg font-mono text-gray-800 break-all">
              {programmerValues[base.key as keyof typeof programmerValues] || '0'}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-4 gap-2 mt-4">
        {['7', '8', '9', 'A', '4', '5', '6', 'B', '1', '2', '3', 'C', '0', 'D', 'E', 'F'].map((btn) => (
          <button
            key={btn}
            onClick={() => {
              const currentValue = programmerValue || '0';
              if (programmerBase === 'bin' && !['0', '1'].includes(btn)) return;
              if (programmerBase === 'oct' && !['0', '1', '2', '3', '4', '5', '6', '7'].includes(btn)) return;
              
              if (currentValue === '0') {
                setProgrammerValue(btn);
              } else {
                setProgrammerValue(currentValue + btn);
              }
            }}
            disabled={
              (programmerBase === 'bin' && !['0', '1'].includes(btn)) ||
              (programmerBase === 'oct' && !['0', '1', '2', '3', '4', '5', '6', '7'].includes(btn))
            }
            className={`p-4 text-xl font-semibold rounded-lg transition-all ${
              ['A', 'B', 'C', 'D', 'E', 'F'].includes(btn) ? 'bg-blue-500 hover:bg-blue-600 text-white' :
              'bg-gray-100 hover:bg-gray-200 text-gray-800'
            } ${(
              (programmerBase === 'bin' && !['0', '1'].includes(btn)) ||
              (programmerBase === 'oct' && !['0', '1', '2', '3', '4', '5', '6', '7'].includes(btn))
            ) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {btn}
          </button>
        ))}
        <button
          onClick={() => setProgrammerValue('')}
          className="p-4 text-xl font-semibold rounded-lg transition-all bg-red-500 hover:bg-red-600 text-white"
        >
          C
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50">
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7-7m-7 0l-2 2m2-2l7-7 7-7" />
              </svg>
              <span className="text-xl font-bold text-gray-900">
                {language === 'zh' ? '在线工具箱' : 'Online Tools'}
              </span>
            </Link>
            <LanguageSwitcher language={language} onLanguageChange={setLanguage} />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {language === 'zh' ? '计算器' : 'Calculator'}
          </h1>
          <p className="text-xl text-gray-600">
            {language === 'zh' ? '日常计算、科学计算、程序员计算' : 'Basic, Scientific, and Programmer Calculator'}
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-white rounded-lg shadow-md p-1">
            <button
              onClick={() => {
                setMode('basic');
                setDisplay('0');
                setExpression('');
                setPreviousValue(null);
                setOperation(null);
                setWaitingForOperand(false);
              }}
              className={`px-6 py-3 rounded-md font-medium transition-all ${
                mode === 'basic'
                  ? 'bg-primary text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {language === 'zh' ? '日常计算' : 'Basic'}
            </button>
            <button
              onClick={() => {
                setMode('scientific');
                setDisplay('0');
                setExpression('');
                setPreviousValue(null);
                setOperation(null);
                setWaitingForOperand(false);
              }}
              className={`px-6 py-3 rounded-md font-medium transition-all ${
                mode === 'scientific'
                  ? 'bg-primary text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {language === 'zh' ? '科学计算' : 'Scientific'}
            </button>
            <button
              onClick={() => {
                setMode('programmer');
                setProgrammerValue('');
              }}
              className={`px-6 py-3 rounded-md font-medium transition-all ${
                mode === 'programmer'
                  ? 'bg-primary text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {language === 'zh' ? '程序员计算' : 'Programmer'}
            </button>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          {mode === 'basic' && <BasicCalculator />}
          {mode === 'scientific' && <ScientificCalculator />}
          {mode === 'programmer' && <ProgrammerCalculator />}
        </div>
      </main>
    </div>
  );
}
