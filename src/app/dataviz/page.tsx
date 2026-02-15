'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useApp } from '@/contexts/AppContext';
import { Chart as ChartJS, CategoryScale, LinearScale, RadialLinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, BarController, LineController, PieController, DoughnutController, ScatterController, RadarController } from 'chart.js';

ChartJS.register(
  CategoryScale, 
  LinearScale, 
  RadialLinearScale,
  PointElement, 
  LineElement, 
  BarElement, 
  ArcElement, 
  Title, 
  Tooltip, 
  Legend,
  BarController,
  LineController,
  PieController,
  DoughnutController,
  ScatterController,
  RadarController
);

type ChartType = 'bar' | 'line' | 'pie' | 'doughnut' | 'scatter' | 'radar';
type ColorScheme = 'default' | 'warm' | 'cool' | 'pastel' | 'vibrant';

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[] | { x: number; y: number; }[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
  }[];
}

export default function DataVisualizationPage() {
  const { language, setLanguage } = useApp();
  const [csvData, setCsvData] = useState('');
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [colorScheme, setColorScheme] = useState<ColorScheme>('default');
  const [chartTitle, setChartTitle] = useState('');
  const [xAxisLabel, setXAxisLabel] = useState('');
  const [yAxisLabel, setYAxisLabel] = useState('');
  const [showLegend, setShowLegend] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<any>(null);

  const colorSchemes: Record<ColorScheme, string[]> = {
    default: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'],
    warm: ['#FF6B6B', '#FFA07A', '#FFD93D', '#FF8C42', '#FF6347', '#FF7F50', '#FFB6C1', '#FFA500'],
    cool: ['#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', '#D4A5A5', '#9B59B6', '#3498DB', '#1ABC9C'],
    pastel: ['#FFB3BA', '#FFDFBA', '#FFFFBA', '#BAFFC9', '#BAE1FF', '#E0BBE4', '#957DAD', '#D291BC'],
    vibrant: ['#FF006E', '#8338EC', '#3A86FF', '#06FFA5', '#FFBE0B', '#FB5607', '#FF006E', '#8338EC']
  };

  const parseCSV = (csv: string) => {
    try {
      if (typeof window === 'undefined') return [];
      const Papa = require('papaparse');
      const result = Papa.parse(csv, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
      });
      
      if (result.errors.length > 0) {
        throw new Error(result.errors[0].message);
      }
      
      return result.data;
    } catch (e: any) {
      throw new Error(e.message || (language === 'zh' ? 'CSV 解析失败' : 'CSV parsing failed'));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setCsvData(content);
        handleParseCSV(content);
      };
      reader.readAsText(file);
    }
  };

  const handleParseCSV = (csv: string) => {
    setError('');
    try {
      const data = parseCSV(csv);
      setParsedData(data);
      generateChartData(data);
      setSuccess(language === 'zh' ? 'CSV 解析成功！' : 'CSV parsed successfully!');
    } catch (e: any) {
      setError(e.message || (language === 'zh' ? 'CSV 解析失败' : 'CSV parsing failed'));
    }
  };

  const generateChartData = (data: any[]) => {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]);
    const labelColumn = headers[0];
    const valueColumns = headers.slice(1);

    const labels = data.map((row) => row[labelColumn]);
    const datasets = valueColumns.map((column, index) => {
      const colors = colorSchemes[colorScheme];
      const color = colors[index % colors.length];
      
      let chartData;
      if (chartType === 'scatter') {
        // 散点图需要特殊的数据格式：[{x, y}, {x, y}, ...]
        chartData = data.map((row) => ({
          x: parseFloat(row[labelColumn]) || 0,
          y: parseFloat(row[column]) || 0
        }));
      } else {
        // 其他图表类型使用常规数据格式
        chartData = data.map((row) => parseFloat(row[column]) || 0);
      }
      
      return {
        label: column,
        data: chartData,
        backgroundColor: chartType === 'pie' || chartType === 'doughnut' 
          ? colors.map((c, i) => c)
          : color + '80',
        borderColor: color,
        borderWidth: 2,
      };
    });

    setChartData({
      labels: chartType === 'scatter' ? [] : labels, // 散点图不需要labels
      datasets,
    });
  };

  useEffect(() => {
    if (parsedData.length > 0) {
      generateChartData(parsedData);
    }
  }, [colorScheme, chartType]);

  useEffect(() => {
    if (chartRef.current && chartData) {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');
      if (!ctx) return;

      const config: any = {
        type: chartType,
        data: chartData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: showLegend,
              position: 'top',
            },
            title: {
              display: !!chartTitle,
              text: chartTitle,
              font: {
                size: 18,
                weight: 'bold',
              },
            },
            tooltip: {
              enabled: true,
            },
          },
          scales: chartType === 'pie' || chartType === 'doughnut' || chartType === 'radar' ? {} : {
            x: {
              display: true,
              title: {
                display: !!xAxisLabel,
                text: xAxisLabel,
              },
              grid: {
                display: showGrid,
              },
            },
            y: {
              display: true,
              title: {
                display: !!yAxisLabel,
                text: yAxisLabel,
              },
              grid: {
                display: showGrid,
              },
            },
          },
        },
      };

      chartInstanceRef.current = new ChartJS(ctx, config);
    }

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [chartData, chartType, chartTitle, xAxisLabel, yAxisLabel, showLegend, showGrid]);

  const handleExportPNG = async () => {
    if (!chartRef.current) return;
    
    setIsExporting(true);
    try {
      const link = document.createElement('a');
      link.download = `chart-${Date.now()}.png`;
      link.href = chartRef.current.toDataURL('image/png', 1.0);
      link.click();
      setSuccess(language === 'zh' ? 'PNG 导出成功！' : 'PNG exported successfully!');
    } catch (e) {
      setError(language === 'zh' ? 'PNG 导出失败' : 'PNG export failed');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportSVG = async () => {
    if (!chartInstanceRef.current) return;
    
    setIsExporting(true);
    try {
      const canvas = chartRef.current;
      if (!canvas) return;

      const svgString = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}">
          <foreignObject width="100%" height="100%">
            <div xmlns="http://www.w3.org/1999/xhtml">
              <img src="${canvas.toDataURL('image/png')}" width="${canvas.width}" height="${canvas.height}" />
            </div>
          </foreignObject>
        </svg>
      `;

      const blob = new Blob([svgString], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `chart-${Date.now()}.svg`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
      setSuccess(language === 'zh' ? 'SVG 导出成功！' : 'SVG exported successfully!');
    } catch (e) {
      setError(language === 'zh' ? 'SVG 导出失败' : 'SVG export failed');
    } finally {
      setIsExporting(false);
    }
  };

  const handleClear = () => {
    setCsvData('');
    setParsedData([]);
    setChartData(null);
    setChartTitle('');
    setXAxisLabel('');
    setYAxisLabel('');
    setError('');
    setSuccess('');
  };

  const handleLoadSampleData = () => {
    const sampleCSV = `月份,销售额,利润,成本
1月,12000,3000,9000
2月,15000,4000,11000
3月,18000,5000,13000
4月,14000,3500,10500
5月,16000,4200,11800
6月,19000,5500,13500
7月,17000,4800,12200
8月,20000,6000,14000
9月,18000,5200,12800
10月,21000,6500,14500
11月,23000,7000,16000
12月,25000,7500,17500`;

    setCsvData(sampleCSV);
    handleParseCSV(sampleCSV);
    setChartTitle(language === 'zh' ? '年度销售数据' : 'Annual Sales Data');
    setXAxisLabel(language === 'zh' ? '月份' : 'Month');
    setYAxisLabel(language === 'zh' ? '金额（元）' : 'Amount (CNY)');
  };

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
            {language === 'zh' ? '数据可视化生成器' : 'Data Visualization Generator'}
          </h1>
          <p className="text-xl text-gray-600">
            {language === 'zh' ? '上传 CSV 数据，生成精美图表，导出 PNG/SVG' : 'Upload CSV data, generate beautiful charts, export PNG/SVG'}
          </p>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {language === 'zh' ? '数据输入' : 'Data Input'}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'zh' ? '上传 CSV 文件' : 'Upload CSV File'}
                  </label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary hover:bg-gray-50 transition-colors"
                  >
                    <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-gray-600 mb-2">
                      {language === 'zh' ? '点击上传 CSV 文件' : 'Click to upload CSV file'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {language === 'zh' ? '支持 .csv 格式' : 'Supports .csv format'}
                    </p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleLoadSampleData}
                    className="btn btn-secondary flex-1"
                  >
                    {language === 'zh' ? '加载示例数据' : 'Load Sample Data'}
                  </button>
                  <button
                    onClick={handleClear}
                    className="btn btn-secondary"
                  >
                    {language === 'zh' ? '清除' : 'Clear'}
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'zh' ? 'CSV 数据预览' : 'CSV Data Preview'}
                  </label>
                  <textarea
                    value={csvData}
                    onChange={(e) => {
                      setCsvData(e.target.value);
                      if (e.target.value.trim()) {
                        handleParseCSV(e.target.value);
                      }
                    }}
                    placeholder={language === 'zh' ? '输入或粘贴 CSV 数据...' : 'Enter or paste CSV data...'}
                    className="w-full h-48 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="card">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {language === 'zh' ? '图表设置' : 'Chart Settings'}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'zh' ? '图表类型' : 'Chart Type'}
                  </label>
                  <select
                    value={chartType}
                    onChange={(e) => setChartType(e.target.value as ChartType)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="bar">{language === 'zh' ? '柱状图' : 'Bar Chart'}</option>
                    <option value="line">{language === 'zh' ? '折线图' : 'Line Chart'}</option>
                    <option value="pie">{language === 'zh' ? '饼图' : 'Pie Chart'}</option>
                    <option value="doughnut">{language === 'zh' ? '环形图' : 'Doughnut Chart'}</option>
                    <option value="scatter">{language === 'zh' ? '散点图' : 'Scatter Plot'}</option>
                    <option value="radar">{language === 'zh' ? '雷达图' : 'Radar Chart'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'zh' ? '配色方案' : 'Color Scheme'}
                  </label>
                  <select
                    value={colorScheme}
                    onChange={(e) => setColorScheme(e.target.value as ColorScheme)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="default">{language === 'zh' ? '默认' : 'Default'}</option>
                    <option value="warm">{language === 'zh' ? '暖色' : 'Warm'}</option>
                    <option value="cool">{language === 'zh' ? '冷色' : 'Cool'}</option>
                    <option value="pastel">{language === 'zh' ? '柔和' : 'Pastel'}</option>
                    <option value="vibrant">{language === 'zh' ? '鲜艳' : 'Vibrant'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'zh' ? '图表标题' : 'Chart Title'}
                  </label>
                  <input
                    type="text"
                    value={chartTitle}
                    onChange={(e) => setChartTitle(e.target.value)}
                    placeholder={language === 'zh' ? '输入图表标题...' : 'Enter chart title...'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'zh' ? 'X 轴标签' : 'X Axis Label'}
                  </label>
                  <input
                    type="text"
                    value={xAxisLabel}
                    onChange={(e) => setXAxisLabel(e.target.value)}
                    placeholder={language === 'zh' ? '输入 X 轴标签...' : 'Enter X axis label...'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'zh' ? 'Y 轴标签' : 'Y Axis Label'}
                  </label>
                  <input
                    type="text"
                    value={yAxisLabel}
                    onChange={(e) => setYAxisLabel(e.target.value)}
                    placeholder={language === 'zh' ? '输入 Y 轴标签...' : 'Enter Y axis label...'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div className="flex gap-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={showLegend}
                      onChange={(e) => setShowLegend(e.target.checked)}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-gray-700">
                      {language === 'zh' ? '显示图例' : 'Show Legend'}
                    </span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={showGrid}
                      onChange={(e) => setShowGrid(e.target.checked)}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-gray-700">
                      {language === 'zh' ? '显示网格' : 'Show Grid'}
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {language === 'zh' ? '图表预览' : 'Chart Preview'}
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={handleExportPNG}
                    disabled={isExporting || !chartData}
                    className="btn btn-primary text-sm"
                  >
                    {isExporting
                      ? (language === 'zh' ? '导出中...' : 'Exporting...')
                      : (language === 'zh' ? '导出 PNG' : 'Export PNG')}
                  </button>
                  <button
                    onClick={handleExportSVG}
                    disabled={isExporting || !chartData}
                    className="btn btn-secondary text-sm"
                  >
                    {isExporting
                      ? (language === 'zh' ? '导出中...' : 'Exporting...')
                      : (language === 'zh' ? '导出 SVG' : 'Export SVG')}
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4" style={{ height: '500px' }}>
                {chartData ? (
                  <canvas ref={chartRef}></canvas>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <div className="text-center">
                      <svg className="mx-auto h-16 w-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      <p>{language === 'zh' ? '请上传 CSV 数据或加载示例数据' : 'Please upload CSV data or load sample data'}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                {language === 'zh' ? '使用技巧' : 'Usage Tips'}
              </h3>
              <div className="text-sm text-gray-600 space-y-2">
                <p>
                  {language === 'zh' ? '• CSV 第一列为标签，其余列为数据值' : '• First column of CSV is labels, remaining columns are data values'}
                </p>
                <p>
                  {language === 'zh' ? '• 支持多种图表类型：柱状图、折线图、饼图等' : '• Supports multiple chart types: bar, line, pie, etc.'}
                </p>
                <p>
                  {language === 'zh' ? '• 提供多种配色方案供选择' : '• Provides multiple color schemes to choose from'}
                </p>
                <p>
                  {language === 'zh' ? '• 可自定义图表标题和轴标签' : '• Can customize chart title and axis labels'}
                </p>
                <p>
                  {language === 'zh' ? '• 支持导出为 PNG 和 SVG 格式' : '• Supports export to PNG and SVG formats'}
                </p>
                <p>
                  {language === 'zh' ? '• 所有操作在本地完成，数据安全' : '• All operations are completed locally, data is secure'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
