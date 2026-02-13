'use client';

import React, { useState } from 'react';
import { User } from '@/types/resume';

interface LoginFormProps {
  onLogin: (user: User) => void;
  language: 'zh' | 'en';
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, language }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      let user;
      if (isRegistering) {
        // 注册新用户
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
            name: email.split('@')[0],
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || (language === 'zh' ? '注册失败' : 'Registration failed'));
        }

        user = await response.json();
      } else {
        // 用户登录
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || (language === 'zh' ? '登录失败' : 'Login failed'));
        }

        user = await response.json();
      }

      onLogin(user);
    } catch (err: any) {
      setError(err.message || (language === 'zh' ? '操作失败' : 'Operation failed'));
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    setError('');
  };

  return (
    <div className="space-y-2 w-full">
      <form onSubmit={handleSubmit} className="flex flex-col space-y-2">

        {isRegistering ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input
              type="email"
              placeholder={language === 'zh' ? '邮箱' : 'Email'}
              className="form-input text-sm min-w-[150px]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder={language === 'zh' ? '密码' : 'Password'}
              className="form-input text-sm min-w-[150px]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <input
              type="email"
              placeholder={language === 'zh' ? '邮箱' : 'Email'}
              className="form-input text-sm flex-1 min-w-[150px]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder={language === 'zh' ? '密码' : 'Password'}
              className="form-input text-sm flex-1 min-w-[150px]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="btn btn-primary text-sm whitespace-nowrap"
              disabled={isLoading}
            >
              {isLoading ? (language === 'zh' ? '登录中...' : 'Logging in...') : (language === 'zh' ? '登录' : 'Login')}
            </button>
          </div>
        )}
        {error && <p className="text-red-500 text-xs">{error}</p>}
        {isRegistering && (
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="btn btn-primary text-sm whitespace-nowrap"
              disabled={isLoading}
            >
              {isLoading ? (language === 'zh' ? '处理中...' : 'Processing...') : (language === 'zh' ? '注册' : 'Register')}
            </button>
            <button
              type="button"
              onClick={toggleMode}
              className="text-sm text-primary hover:underline whitespace-nowrap"
            >
              {language === 'zh' ? '已有账号？登录' : 'Have account? Login'}
            </button>
          </div>
        )}
        {!isRegistering && (
          <button
            type="button"
            onClick={toggleMode}
            className="text-sm text-primary hover:underline self-start whitespace-nowrap"
          >
            {language === 'zh' ? '没有账号？注册' : 'No account? Register'}
          </button>
        )}
      </form>
    </div>
  );
};

export default LoginForm;