'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useApp } from '@/contexts/AppContext';

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
}

export default function PasswordPage() {
  const { language, setLanguage } = useApp();
  const [password, setPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    score: 0,
    label: language === 'zh' ? '请输入密码' : 'Please enter password',
    color: 'bg-gray-300'
  });
  const [passwordDetails, setPasswordDetails] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });

  const [generatedPassword, setGeneratedPassword] = useState('');
  const [passwordLength, setPasswordLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSpecial, setIncludeSpecial] = useState(true);

  const checkPasswordStrength = (pwd: string) => {
    if (!pwd) {
      return {
        score: 0,
        label: language === 'zh' ? '请输入密码' : 'Please enter password',
        color: 'bg-gray-300'
      };
    }

    let score = 0;
    const details = {
      length: pwd.length >= 8,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      number: /[0-9]/.test(pwd),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd)
    };

    if (details.length) score += 1;
    if (details.uppercase) score += 1;
    if (details.lowercase) score += 1;
    if (details.number) score += 1;
    if (details.special) score += 1;

    if (pwd.length >= 12) score += 1;
    if (pwd.length >= 16) score += 1;

    setPasswordDetails(details);

    if (score <= 2) {
      return {
        score,
        label: language === 'zh' ? '弱' : 'Weak',
        color: 'bg-red-500'
      };
    } else if (score <= 4) {
      return {
        score,
        label: language === 'zh' ? '中等' : 'Medium',
        color: 'bg-yellow-500'
      };
    } else if (score <= 6) {
      return {
        score,
        label: language === 'zh' ? '强' : 'Strong',
        color: 'bg-green-500'
      };
    } else {
      return {
        score,
        label: language === 'zh' ? '非常强' : 'Very Strong',
        color: 'bg-blue-500'
      };
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordStrength(checkPasswordStrength(value));
  };

  const generatePassword = () => {
    let charset = '';
    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) charset += '0123456789';
    if (includeSpecial) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (!charset) {
      alert(language === 'zh' ? '请至少选择一种字符类型' : 'Please select at least one character type');
      return;
    }

    let password = '';
    const array = new Uint32Array(passwordLength);
    crypto.getRandomValues(array);

    for (let i = 0; i < passwordLength; i++) {
      password += charset[array[i] % charset.length];
    }

    setGeneratedPassword(password);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert(language === 'zh' ? '已复制到剪贴板' : 'Copied to clipboard');
  };

  const getStrengthPercentage = () => {
    return (passwordStrength.score / 7) * 100;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
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
            {language === 'zh' ? '密码工具' : 'Password Tools'}
          </h1>
          <p className="text-xl text-gray-600">
            {language === 'zh' ? '密码强度检测和安全密码生成' : 'Password Strength Checker and Secure Password Generator'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {language === 'zh' ? '密码强度检测' : 'Password Strength Checker'}
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'zh' ? '输入密码' : 'Enter Password'}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder={language === 'zh' ? '请输入密码' : 'Enter your password'}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    {language === 'zh' ? '密码强度' : 'Password Strength'}
                  </span>
                  <span className={`text-sm font-semibold ${passwordStrength.color.replace('bg-', 'text-')}`}>
                    {passwordStrength.label}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                    style={{ width: `${getStrengthPercentage()}%` }}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-700">
                  {language === 'zh' ? '密码要求' : 'Password Requirements'}
                </h3>
                <div className="space-y-2">
                  <div className={`flex items-center gap-2 ${passwordDetails.length ? 'text-green-600' : 'text-gray-400'}`}>
                    <svg className={`w-5 h-5 ${passwordDetails.length ? 'text-green-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {passwordDetails.length ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      )}
                    </svg>
                    <span className="text-sm">
                      {language === 'zh' ? '至少 8 个字符' : 'At least 8 characters'}
                    </span>
                  </div>
                  <div className={`flex items-center gap-2 ${passwordDetails.uppercase ? 'text-green-600' : 'text-gray-400'}`}>
                    <svg className={`w-5 h-5 ${passwordDetails.uppercase ? 'text-green-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {passwordDetails.uppercase ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      )}
                    </svg>
                    <span className="text-sm">
                      {language === 'zh' ? '包含大写字母' : 'Contains uppercase letters'}
                    </span>
                  </div>
                  <div className={`flex items-center gap-2 ${passwordDetails.lowercase ? 'text-green-600' : 'text-gray-400'}`}>
                    <svg className={`w-5 h-5 ${passwordDetails.lowercase ? 'text-green-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {passwordDetails.lowercase ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      )}
                    </svg>
                    <span className="text-sm">
                      {language === 'zh' ? '包含小写字母' : 'Contains lowercase letters'}
                    </span>
                  </div>
                  <div className={`flex items-center gap-2 ${passwordDetails.number ? 'text-green-600' : 'text-gray-400'}`}>
                    <svg className={`w-5 h-5 ${passwordDetails.number ? 'text-green-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {passwordDetails.number ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      )}
                    </svg>
                    <span className="text-sm">
                      {language === 'zh' ? '包含数字' : 'Contains numbers'}
                    </span>
                  </div>
                  <div className={`flex items-center gap-2 ${passwordDetails.special ? 'text-green-600' : 'text-gray-400'}`}>
                    <svg className={`w-5 h-5 ${passwordDetails.special ? 'text-green-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {passwordDetails.special ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      )}
                    </svg>
                    <span className="text-sm">
                      {language === 'zh' ? '包含特殊字符' : 'Contains special characters'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {language === 'zh' ? '安全密码生成器' : 'Secure Password Generator'}
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'zh' ? '密码长度' : 'Password Length'}: {passwordLength}
                </label>
                <input
                  type="range"
                  min="8"
                  max="32"
                  value={passwordLength}
                  onChange={(e) => setPasswordLength(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-700">
                  {language === 'zh' ? '字符类型' : 'Character Types'}
                </h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeUppercase}
                      onChange={(e) => setIncludeUppercase(e.target.checked)}
                      className="w-5 h-5 text-primary rounded focus:ring-primary"
                    />
                    <span className="text-sm text-gray-700">
                      {language === 'zh' ? '大写字母 (A-Z)' : 'Uppercase (A-Z)'}
                    </span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeLowercase}
                      onChange={(e) => setIncludeLowercase(e.target.checked)}
                      className="w-5 h-5 text-primary rounded focus:ring-primary"
                    />
                    <span className="text-sm text-gray-700">
                      {language === 'zh' ? '小写字母 (a-z)' : 'Lowercase (a-z)'}
                    </span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeNumbers}
                      onChange={(e) => setIncludeNumbers(e.target.checked)}
                      className="w-5 h-5 text-primary rounded focus:ring-primary"
                    />
                    <span className="text-sm text-gray-700">
                      {language === 'zh' ? '数字 (0-9)' : 'Numbers (0-9)'}
                    </span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeSpecial}
                      onChange={(e) => setIncludeSpecial(e.target.checked)}
                      className="w-5 h-5 text-primary rounded focus:ring-primary"
                    />
                    <span className="text-sm text-gray-700">
                      {language === 'zh' ? '特殊字符 (!@#$%)' : 'Special Characters (!@#$%)'}
                    </span>
                  </label>
                </div>
              </div>

              <button
                onClick={generatePassword}
                className="btn btn-primary w-full"
              >
                {language === 'zh' ? '生成密码' : 'Generate Password'}
              </button>

              {generatedPassword && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'zh' ? '生成的密码' : 'Generated Password'}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={generatedPassword}
                      readOnly
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 font-mono text-lg"
                    />
                    <button
                      onClick={() => copyToClipboard(generatedPassword)}
                      className="absolute top-2 right-2 px-3 py-1 bg-primary text-white text-sm rounded hover:bg-primary/90 transition-colors"
                    >
                      {language === 'zh' ? '复制' : 'Copy'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="card">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              {language === 'zh' ? '密码安全建议' : 'Password Security Tips'}
            </h3>
            <div className="text-sm text-gray-600 space-y-2">
              <p>
                {language === 'zh' ? '• 使用至少 12 个字符的密码' : '• Use at least 12 characters'}
              </p>
              <p>
                {language === 'zh' ? '• 包含大写字母、小写字母、数字和特殊字符' : '• Include uppercase, lowercase, numbers, and special characters'}
              </p>
              <p>
                {language === 'zh' ? '• 避免使用个人信息（生日、名字等）' : '• Avoid personal information (birthdays, names, etc.)'}
              </p>
              <p>
                {language === 'zh' ? '• 不要在不同网站使用相同密码' : '• Don\'t use the same password on different sites'}
              </p>
              <p>
                {language === 'zh' ? '• 定期更换密码' : '• Change passwords regularly'}
              </p>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              {language === 'zh' ? '为什么需要强密码' : 'Why Strong Passwords Matter'}
            </h3>
            <div className="text-sm text-gray-600 space-y-2">
              <p>
                {language === 'zh' ? '• 强密码可以防止暴力破解攻击' : '• Strong passwords prevent brute force attacks'}
              </p>
              <p>
                {language === 'zh' ? '• 保护您的个人信息和财务安全' : '• Protect your personal and financial information'}
              </p>
              <p>
                {language === 'zh' ? '• 降低账户被盗的风险' : '• Reduce the risk of account compromise'}
              </p>
              <p>
                {language === 'zh' ? '• 防止身份盗窃' : '• Prevent identity theft'}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
