'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useApp } from '@/contexts/AppContext';

type FormatType = 'json' | 'yaml' | 'csv';
type TabType = 'convert' | 'validate' | 'example' | 'diff';

export default function DataConverterPage() {
  const { language, setLanguage } = useApp();
  const [inputFormat, setInputFormat] = useState<FormatType>('json');
  const [outputFormat, setOutputFormat] = useState<FormatType>('yaml');
  const [inputData, setInputData] = useState('');
  const [outputData, setOutputData] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('convert');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [diffData1, setDiffData1] = useState('');
  const [diffData2, setDiffData2] = useState('');
  const [diffResult, setDiffResult] = useState('');
  const [schema, setSchema] = useState('');
  const [validationResult, setValidationResult] = useState('');
  const [exampleType, setExampleType] = useState<FormatType>('json');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parseJSON = (data: string) => {
    try {
      return JSON.parse(data);
    } catch (e) {
      throw new Error(language === 'zh' ? 'JSON 格式错误' : 'Invalid JSON format');
    }
  };

  const parseYAML = (data: string) => {
    try {
      if (typeof window === 'undefined') return null;
      const yaml = require('js-yaml');
      return yaml.load(data);
    } catch (e) {
      throw new Error(language === 'zh' ? 'YAML 格式错误' : 'Invalid YAML format');
    }
  };

  const parseCSV = (data: string) => {
    try {
      if (typeof window === 'undefined') return null;
      const Papa = require('papaparse');
      const result = Papa.parse(data, {
        header: true,
        skipEmptyLines: true,
      });
      if (result.errors.length > 0) {
        throw new Error(result.errors[0].message);
      }
      return result.data;
    } catch (e) {
      throw new Error(language === 'zh' ? 'CSV 格式错误' : 'Invalid CSV format');
    }
  };

  const toJSON = (data: any) => {
    return JSON.stringify(data, null, 2);
  };

  const toYAML = (data: any) => {
    try {
      if (typeof window === 'undefined') return '';
      const yaml = require('js-yaml');
      return yaml.dump(data, { indent: 2, lineWidth: -1 });
    } catch (e) {
      throw new Error(language === 'zh' ? '转换为 YAML 失败' : 'Failed to convert to YAML');
    }
  };

  const toCSV = (data: any) => {
    try {
      if (typeof window === 'undefined') return '';
      const Papa = require('papaparse');
      const result = Papa.unparse(data, { quotes: true });
      return result;
    } catch (e) {
      throw new Error(language === 'zh' ? '转换为 CSV 失败' : 'Failed to convert to CSV');
    }
  };

  const handleConvert = () => {
    setError('');
    setSuccess('');
    setOutputData('');

    try {
      let parsedData: any;

      switch (inputFormat) {
        case 'json':
          parsedData = parseJSON(inputData);
          break;
        case 'yaml':
          parsedData = parseYAML(inputData);
          break;
        case 'csv':
          parsedData = parseCSV(inputData);
          break;
      }

      let result = '';
      switch (outputFormat) {
        case 'json':
          result = toJSON(parsedData);
          break;
        case 'yaml':
          result = toYAML(parsedData);
          break;
        case 'csv':
          result = toCSV(parsedData);
          break;
      }

      setOutputData(result);
      setSuccess(language === 'zh' ? '转换成功！' : 'Conversion successful!');
    } catch (e: any) {
      setError(e.message || (language === 'zh' ? '转换失败' : 'Conversion failed'));
    }
  };

  const handleValidate = () => {
    setError('');
    setSuccess('');
    setValidationResult('');

    try {
      let parsedData: any;

      switch (inputFormat) {
        case 'json':
          parsedData = parseJSON(inputData);
          break;
        case 'yaml':
          parsedData = parseYAML(inputData);
          break;
        case 'csv':
          parsedData = parseCSV(inputData);
          break;
      }

      if (schema.trim()) {
        const schemaObj = parseJSON(schema);
        const ajv = require('ajv');
        const validate = new ajv().compile(schemaObj);
        const valid = validate(parsedData);

        if (!valid) {
          setValidationResult(
            language === 'zh' 
              ? `校验失败：\n${JSON.stringify(validate.errors, null, 2)}`
              : `Validation failed:\n${JSON.stringify(validate.errors, null, 2)}`
          );
          return;
        }
      }

      setValidationResult(
        language === 'zh' 
          ? '✓ 校验通过！数据格式正确。' 
          : '✓ Validation passed! Data format is correct.'
      );
      setSuccess(language === 'zh' ? '校验成功！' : 'Validation successful!');
    } catch (e: any) {
      setError(e.message || (language === 'zh' ? '校验失败' : 'Validation failed'));
    }
  };

  const handleGenerateExample = () => {
    setError('');
    setSuccess('');

    try {
      const exampleData = {
        name: 'John Doe',
        age: 30,
        email: 'john.doe@example.com',
        address: {
          street: '123 Main St',
          city: 'New York',
          country: 'USA'
        },
        hobbies: ['reading', 'swimming', 'coding'],
        active: true
      };

      let result = '';
      switch (exampleType) {
        case 'json':
          result = toJSON(exampleData);
          break;
        case 'yaml':
          result = toYAML(exampleData);
          break;
        case 'csv':
          result = toCSV([exampleData]);
          break;
      }

      setInputData(result);
      setSuccess(language === 'zh' ? '示例生成成功！' : 'Example generated successfully!');
    } catch (e: any) {
      setError(e.message || (language === 'zh' ? '生成示例失败' : 'Failed to generate example'));
    }
  };

  const handleDiff = () => {
    setError('');
    setSuccess('');
    setDiffResult('');

    try {
      const data1 = parseJSON(diffData1);
      const data2 = parseJSON(diffData2);

      const diff = require('diff').diffJson(data1, data2);

      if (diff.length === 0) {
        setDiffResult(
          language === 'zh' 
            ? '两个数据完全相同' 
            : 'The two data are identical'
        );
        setSuccess(language === 'zh' ? '比较完成！' : 'Comparison completed!');
        return;
      }

      let result = '';
      diff.forEach((part: any) => {
        const color = part.added ? 'green' : part.removed ? 'red' : 'grey';
        const prefix = part.added ? '+' : part.removed ? '-' : ' ';
        const value = JSON.stringify(part.value, null, 2);
        result += `[${color}] ${prefix}\n${value}\n\n`;
      });

      setDiffResult(result);
      setSuccess(language === 'zh' ? '比较完成！' : 'Comparison completed!');
    } catch (e: any) {
      setError(e.message || (language === 'zh' ? '比较失败' : 'Comparison failed'));
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setSuccess(language === 'zh' ? '已复制到剪贴板' : 'Copied to clipboard');
    setTimeout(() => setSuccess(''), 2000);
  };

  const handleClear = () => {
    setInputData('');
    setOutputData('');
    setError('');
    setSuccess('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setInputData(content);
        
        const ext = file.name.split('.').pop()?.toLowerCase();
        if (ext === 'json') setInputFormat('json');
        else if (ext === 'yaml' || ext === 'yml') setInputFormat('yaml');
        else if (ext === 'csv') setInputFormat('csv');
      };
      reader.readAsText(file);
    }
  };

  const handleDownload = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
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
            {language === 'zh' ? '数据转换与校验器' : 'Data Converter & Validator'}
          </h1>
          <p className="text-xl text-gray-600">
            {language === 'zh' ? 'JSON/YAML/CSV 格式互转、Schema 校验、示例生成、Diff 比较' : 'JSON/YAML/CSV format conversion, Schema validation, example generation, Diff comparison'}
          </p>
        </div>

        <div className="card mb-6">
          <div className="flex flex-wrap gap-2">
            {(['convert', 'validate', 'example', 'diff'] as TabType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  activeTab === tab
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                }`}
              >
                {tab === 'convert' && (language === 'zh' ? '格式转换' : 'Convert')}
                {tab === 'validate' && (language === 'zh' ? 'Schema 校验' : 'Validate')}
                {tab === 'example' && (language === 'zh' ? '示例生成' : 'Example')}
                {tab === 'diff' && (language === 'zh' ? 'Diff 比较' : 'Diff')}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
            {success}
          </div>
        )}

        {activeTab === 'convert' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  {language === 'zh' ? '输入数据' : 'Input Data'}
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="btn btn-secondary text-sm"
                  >
                    {language === 'zh' ? '上传文件' : 'Upload File'}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json,.yaml,.yml,.csv"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    onClick={handleClear}
                    className="btn btn-secondary text-sm"
                  >
                    {language === 'zh' ? '清除' : 'Clear'}
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'zh' ? '输入格式' : 'Input Format'}
                </label>
                <select
                  value={inputFormat}
                  onChange={(e) => setInputFormat(e.target.value as FormatType)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="json">JSON</option>
                  <option value="yaml">YAML</option>
                  <option value="csv">CSV</option>
                </select>
              </div>

              <textarea
                value={inputData}
                onChange={(e) => setInputData(e.target.value)}
                placeholder={language === 'zh' ? '输入数据...' : 'Enter data...'}
                className="w-full h-64 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
              />

              <div className="mt-4 flex gap-2">
                <button
                  onClick={handleConvert}
                  className="btn btn-primary flex-1"
                >
                  {language === 'zh' ? '转换' : 'Convert'}
                </button>
                <button
                  onClick={() => handleCopy(inputData)}
                  className="btn btn-secondary"
                >
                  {language === 'zh' ? '复制' : 'Copy'}
                </button>
              </div>
            </div>

            <div className="card">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  {language === 'zh' ? '输出数据' : 'Output Data'}
                </h2>
                <button
                  onClick={() => handleDownload(outputData, `output.${outputFormat}`)}
                  className="btn btn-secondary text-sm"
                  disabled={!outputData}
                >
                  {language === 'zh' ? '下载' : 'Download'}
                </button>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'zh' ? '输出格式' : 'Output Format'}
                </label>
                <select
                  value={outputFormat}
                  onChange={(e) => setOutputFormat(e.target.value as FormatType)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="json">JSON</option>
                  <option value="yaml">YAML</option>
                  <option value="csv">CSV</option>
                </select>
              </div>

              <textarea
                value={outputData}
                readOnly
                placeholder={language === 'zh' ? '转换结果将显示在这里...' : 'Conversion result will appear here...'}
                className="w-full h-64 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm"
              />

              <div className="mt-4">
                <button
                  onClick={() => handleCopy(outputData)}
                  className="btn btn-primary w-full"
                  disabled={!outputData}
                >
                  {language === 'zh' ? '复制结果' : 'Copy Result'}
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'validate' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                {language === 'zh' ? '数据校验' : 'Data Validation'}
              </h2>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'zh' ? '数据格式' : 'Data Format'}
                </label>
                <select
                  value={inputFormat}
                  onChange={(e) => setInputFormat(e.target.value as FormatType)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="json">JSON</option>
                  <option value="yaml">YAML</option>
                  <option value="csv">CSV</option>
                </select>
              </div>

              <textarea
                value={inputData}
                onChange={(e) => setInputData(e.target.value)}
                placeholder={language === 'zh' ? '输入要校验的数据...' : 'Enter data to validate...'}
                className="w-full h-48 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm mb-4"
              />

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'zh' ? 'JSON Schema（可选）' : 'JSON Schema (Optional)'}
                </label>
                <textarea
                  value={schema}
                  onChange={(e) => setSchema(e.target.value)}
                  placeholder={language === 'zh' ? '输入 JSON Schema 进行校验...' : 'Enter JSON Schema for validation...'}
                  className="w-full h-48 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
                />
              </div>

              <button
                onClick={handleValidate}
                className="btn btn-primary w-full"
              >
                {language === 'zh' ? '校验' : 'Validate'}
              </button>
            </div>

            <div className="card">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                {language === 'zh' ? '校验结果' : 'Validation Result'}
              </h2>
              <textarea
                value={validationResult}
                readOnly
                placeholder={language === 'zh' ? '校验结果将显示在这里...' : 'Validation result will appear here...'}
                className="w-full h-96 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm"
              />
            </div>
          </div>
        )}

        {activeTab === 'example' && (
          <div className="card">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {language === 'zh' ? '示例生成' : 'Example Generation'}
            </h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'zh' ? '示例格式' : 'Example Format'}
              </label>
              <select
                value={exampleType}
                onChange={(e) => setExampleType(e.target.value as FormatType)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="json">JSON</option>
                <option value="yaml">YAML</option>
                <option value="csv">CSV</option>
              </select>
            </div>

            <button
              onClick={handleGenerateExample}
              className="btn btn-primary w-full mb-4"
            >
              {language === 'zh' ? '生成示例' : 'Generate Example'}
            </button>

            <textarea
              value={inputData}
              readOnly
              placeholder={language === 'zh' ? '生成的示例将显示在这里...' : 'Generated example will appear here...'}
              className="w-full h-96 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm"
            />

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => handleCopy(inputData)}
                className="btn btn-primary flex-1"
                disabled={!inputData}
              >
                {language === 'zh' ? '复制' : 'Copy'}
              </button>
              <button
                onClick={() => handleDownload(inputData, `example.${exampleType}`)}
                className="btn btn-secondary"
                disabled={!inputData}
              >
                {language === 'zh' ? '下载' : 'Download'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'diff' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                {language === 'zh' ? '数据 1' : 'Data 1'}
              </h2>
              <textarea
                value={diffData1}
                onChange={(e) => setDiffData1(e.target.value)}
                placeholder={language === 'zh' ? '输入第一个 JSON 数据...' : 'Enter first JSON data...'}
                className="w-full h-64 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
              />
            </div>

            <div className="card">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                {language === 'zh' ? '数据 2' : 'Data 2'}
              </h2>
              <textarea
                value={diffData2}
                onChange={(e) => setDiffData2(e.target.value)}
                placeholder={language === 'zh' ? '输入第二个 JSON 数据...' : 'Enter second JSON data...'}
                className="w-full h-64 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
              />
            </div>

            <div className="lg:col-span-2">
              <button
                onClick={handleDiff}
                className="btn btn-primary w-full mb-4"
              >
                {language === 'zh' ? '比较差异' : 'Compare Diff'}
              </button>

              <div className="card">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  {language === 'zh' ? '比较结果' : 'Comparison Result'}
                </h2>
                <textarea
                  value={diffResult}
                  readOnly
                  placeholder={language === 'zh' ? '比较结果将显示在这里...' : 'Comparison result will appear here...'}
                  className="w-full h-64 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm"
                />
              </div>
            </div>
          </div>
        )}

        <div className="card mt-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            {language === 'zh' ? '使用技巧' : 'Usage Tips'}
          </h3>
          <div className="text-sm text-gray-600 space-y-2">
            <p>
              {language === 'zh' ? '• 支持 JSON、YAML、CSV 三种格式的相互转换' : '• Supports conversion between JSON, YAML, and CSV formats'}
            </p>
            <p>
              {language === 'zh' ? '• 使用 JSON Schema 进行数据校验' : '• Use JSON Schema for data validation'}
            </p>
            <p>
              {language === 'zh' ? '• 生成示例数据快速上手' : '• Generate example data to get started quickly'}
            </p>
            <p>
              {language === 'zh' ? '• 比较两个 JSON 数据的差异' : '• Compare differences between two JSON data'}
            </p>
            <p>
              {language === 'zh' ? '• 支持文件上传和下载' : '• Supports file upload and download'}
            </p>
            <p>
              {language === 'zh' ? '• 所有操作在本地完成，数据安全' : '• All operations are completed locally, data is secure'}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
