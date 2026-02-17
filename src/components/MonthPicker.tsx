import React, { useState, useEffect } from 'react';

interface MonthPickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const MonthPicker: React.FC<MonthPickerProps> = ({ 
  value, 
  onChange, 
  placeholder = 'YYYY-MM',
  className = '' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  
  // 解析当前值
  useEffect(() => {
    if (value) {
      const [year, month] = value.split('-');
      setSelectedYear(year || '');
      setSelectedMonth(month || '');
    } else {
      setSelectedYear('');
      setSelectedMonth('');
    }
  }, [value]);
  
  // 生成年份选项（从1980年到当前年份）
  const generateYears = () => {
    const years: string[] = [];
    const currentYear = new Date().getFullYear();
    for (let i = currentYear; i >= 1980; i--) {
      years.push(i.toString());
    }
    return years;
  };
  
  // 生成月份选项
  const generateMonths = () => {
    const months: string[] = [];
    for (let i = 1; i <= 12; i++) {
      months.push(i.toString().padStart(2, '0'));
    }
    return months;
  };
  
  // 处理选择变化
  const handleSelectChange = () => {
    if (selectedYear && selectedMonth) {
      onChange(`${selectedYear}-${selectedMonth}`);
    } else if (selectedYear) {
      // 只选择了年份，暂时不更新，等待选择月份
    } else if (selectedMonth) {
      // 只选择了月份，暂时不更新，等待选择年份
    } else {
      onChange('');
    }
  };
  
  // 处理点击外部关闭
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.month-picker-container')) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <div className={`month-picker-container relative ${className}`}>
      {/* 输入框显示 */}
      <div 
        className="form-input cursor-pointer flex items-center justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>
          {selectedYear && selectedMonth ? `${selectedYear}-${selectedMonth}` : 
           selectedYear ? `${selectedYear}-` : 
           value !== '' ? value : placeholder}
        </span>
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      
      {/* 选择器弹窗 */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
          <div className="p-3">
            {/* 年份选择 */}
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">年份</label>
              <select
                className="form-input w-full"
                value={selectedYear}
                onChange={(e) => {
                  setSelectedYear(e.target.value);
                  handleSelectChange();
                }}
              >
                <option value="">选择年份</option>
                {generateYears().map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            
            {/* 月份选择 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">月份</label>
              <select
                className="form-input w-full"
                value={selectedMonth}
                onChange={(e) => {
                  setSelectedMonth(e.target.value);
                  handleSelectChange();
                }}
              >
                <option value="">选择月份</option>
                {generateMonths().map(month => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthPicker;