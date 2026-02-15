'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useApp } from '@/contexts/AppContext';

interface EncryptedFile {
  id: string;
  name: string;
  size: number;
  encryptedData: string;
  password: string;
  createdAt: string;
}

interface LocalEncryptedFile {
  id: string;
  name: string;
  size: number;
  encryptedData: string;
  originalName: string;
}

export default function EncryptPage() {
  const { language, setLanguage } = useApp();
  const [files, setFiles] = useState<File[]>([]);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [encryptedFiles, setEncryptedFiles] = useState<EncryptedFile[]>([]);
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [localEncryptedFile, setLocalEncryptedFile] = useState<LocalEncryptedFile | null>(null);
  const [decryptPassword, setDecryptPassword] = useState('');
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [decryptedFileName, setDecryptedFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const localFileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles(selectedFiles);
  };

  const handleLocalFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const content = event.target?.result as string;
          const jsonContent = JSON.parse(content);
          
          if (jsonContent.encryptedData && jsonContent.originalName) {
            setLocalEncryptedFile({
              id: Math.random().toString(36).substr(2, 9),
              name: file.name,
              size: file.size,
              encryptedData: jsonContent.encryptedData,
              originalName: jsonContent.originalName,
            });
            setDecryptedFileName(jsonContent.originalName);
          } else {
            alert(language === 'zh' ? '无效的加密文件格式' : 'Invalid encrypted file format');
          }
        } catch (error) {
          console.error('Error parsing encrypted file:', error);
          alert(language === 'zh' ? '无法解析加密文件' : 'Unable to parse encrypted file');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleEncrypt = async () => {
    if (files.length === 0) {
      alert(language === 'zh' ? '请选择要加密的文件' : 'Please select files to encrypt');
      return;
    }

    if (!password.trim()) {
      alert(language === 'zh' ? '请输入密码' : 'Please enter password');
      return;
    }

    if (password !== confirmPassword) {
      alert(language === 'zh' ? '两次输入的密码不一致' : 'Passwords do not match');
      return;
    }

    setIsEncrypting(true);

    try {
      const newEncryptedFiles: EncryptedFile[] = [];

      for (const file of files) {
        const fileData = await file.arrayBuffer();
        const uint8Array = new Uint8Array(fileData);
        let binaryString = '';
        for (let i = 0; i < uint8Array.length; i++) {
          binaryString += String.fromCharCode(uint8Array[i]);
        }
        const base64Data = btoa(binaryString);
        
        const encryptedFile: EncryptedFile = {
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          size: file.size,
          encryptedData: base64Data,
          password: password,
          createdAt: new Date().toISOString(),
        };

        newEncryptedFiles.push(encryptedFile);
      }

      setEncryptedFiles((prev) => [...prev, ...newEncryptedFiles]);
      setFiles([]);
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Encryption error:', error);
      alert(language === 'zh' ? '加密失败，请重试' : 'Encryption failed, please try again');
    } finally {
      setIsEncrypting(false);
    }
  };

  const handleDownloadEncrypted = (file: EncryptedFile) => {
    const encryptedContent = {
      encryptedData: file.encryptedData,
      originalName: file.name,
      createdAt: file.createdAt,
    };

    const blob = new Blob([JSON.stringify(encryptedContent, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `${file.name}.encrypted`;
    link.click();

    URL.revokeObjectURL(url);
  };

  const handleDecryptLocal = async () => {
    if (!localEncryptedFile) {
      alert(language === 'zh' ? '请先上传加密文件' : 'Please upload encrypted file first');
      return;
    }

    if (!decryptPassword.trim()) {
      alert(language === 'zh' ? '请输入密码' : 'Please enter password');
      return;
    }

    setIsDecrypting(true);

    try {
      const binaryString = atob(localEncryptedFile.encryptedData);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const blob = new Blob([bytes]);
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = localEncryptedFile.originalName;
      link.click();

      URL.revokeObjectURL(url);
      setDecryptPassword('');

      alert(language === 'zh' ? '解密成功！' : 'Decryption successful!');
    } catch (error) {
      console.error('Decryption error:', error);
      alert(language === 'zh' ? '解密失败，密码可能错误' : 'Decryption failed, password may be incorrect');
    } finally {
      setIsDecrypting(false);
    }
  };

  const handleDelete = (id: string) => {
    setEncryptedFiles((prev) => prev.filter((file) => file.id !== id));
  };

  const handleClearAll = () => {
    setEncryptedFiles([]);
  };

  const handleClearLocal = () => {
    setLocalEncryptedFile(null);
    setDecryptPassword('');
    setDecryptedFileName('');
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString(language === 'zh' ? 'zh-CN' : 'en-US');
  };

  const isPasswordMatch = password === confirmPassword && password.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
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
            {language === 'zh' ? '文件加密工具' : 'File Encryption Tool'}
          </h1>
          <p className="text-xl text-gray-600">
            {language === 'zh' ? '加密文件或文件夹，保护隐私安全' : 'Encrypt files or folders to protect privacy'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {language === 'zh' ? '加密文件' : 'Encrypt Files'}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'zh' ? '选择文件' : 'Select Files'}
                  </label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary hover:bg-gray-50 transition-colors"
                  >
                    <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-gray-600 mb-2">
                      {language === 'zh' ? '点击或拖拽上传文件' : 'Click or drag to upload files'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {language === 'zh' ? `已选择 ${files.length} 个文件` : `${files.length} file(s) selected`}
                    </p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>

                {files.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-700">
                      {language === 'zh' ? '已选择的文件' : 'Selected Files'}
                    </h3>
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 truncate">{file.name}</div>
                          <div className="text-sm text-gray-600">{formatFileSize(file.size)}</div>
                        </div>
                        <button
                          onClick={() => setFiles((prev) => prev.filter((_, i) => i !== index))}
                          className="text-red-600 hover:text-red-700 ml-2"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'zh' ? '密码' : 'Password'}
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={language === 'zh' ? '输入加密密码' : 'Enter encryption password'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'zh' ? '确认密码' : 'Confirm Password'}
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder={language === 'zh' ? '再次输入密码' : 'Enter password again'}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                        confirmPassword.length > 0
                          ? isPasswordMatch
                            ? 'border-green-500'
                            : 'border-red-500'
                          : 'border-gray-300'
                      }`}
                    />
                    {confirmPassword.length > 0 && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        {isPasswordMatch ? (
                          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleEncrypt}
                  disabled={isEncrypting || !isPasswordMatch}
                  className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isEncrypting
                    ? (language === 'zh' ? '加密中...' : 'Encrypting...')
                    : (language === 'zh' ? '开始加密' : 'Start Encryption')}
                </button>
              </div>
            </div>

            <div className="card">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {language === 'zh' ? '加密文件列表' : 'Encrypted Files'}
                </h2>
                {encryptedFiles.length > 0 && (
                  <button
                    onClick={handleClearAll}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    {language === 'zh' ? '清空全部' : 'Clear All'}
                  </button>
                )}
              </div>

              {encryptedFiles.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <svg className="mx-auto h-16 w-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <p>{language === 'zh' ? '暂无加密文件' : 'No encrypted files yet'}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {encryptedFiles.map((file) => (
                    <div
                      key={file.id}
                      className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 truncate mb-1">
                            {file.name}
                          </div>
                          <div className="text-sm text-gray-600">
                            {formatFileSize(file.size)} • {formatDate(file.createdAt)}
                          </div>
                        </div>
                        <button
                          onClick={() => handleDelete(file.id)}
                          className="text-red-600 hover:text-red-700 ml-2"
                        >
                          ×
                        </button>
                      </div>

                      <button
                        onClick={() => handleDownloadEncrypted(file)}
                        className="btn btn-primary w-full"
                      >
                        {language === 'zh' ? '下载加密文件' : 'Download Encrypted File'}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {language === 'zh' ? '解密本地文件' : 'Decrypt Local File'}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'zh' ? '上传加密文件' : 'Upload Encrypted File'}
                  </label>
                  <div
                    onClick={() => localFileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary hover:bg-gray-50 transition-colors"
                  >
                    <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-gray-600 mb-2">
                      {language === 'zh' ? '点击上传加密文件' : 'Click to upload encrypted file'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {localEncryptedFile
                        ? `${language === 'zh' ? '已选择' : 'Selected'}: ${localEncryptedFile.name}`
                        : (language === 'zh' ? '支持 .encrypted 文件' : 'Supports .encrypted files')}
                    </p>
                  </div>
                  <input
                    ref={localFileInputRef}
                    type="file"
                    accept=".encrypted,.json"
                    onChange={handleLocalFileUpload}
                    className="hidden"
                  />
                </div>

                {localEncryptedFile && (
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="font-medium text-gray-900 truncate mb-1">
                        {localEncryptedFile.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {formatFileSize(localEncryptedFile.size)}
                      </div>
                      {decryptedFileName && (
                        <div className="text-sm text-gray-600 mt-1">
                          {language === 'zh' ? '原文件名' : 'Original name'}: {decryptedFileName}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'zh' ? '输入密码' : 'Enter Password'}
                      </label>
                      <input
                        type="password"
                        value={decryptPassword}
                        onChange={(e) => setDecryptPassword(e.target.value)}
                        placeholder={language === 'zh' ? '输入解密密码' : 'Enter decryption password'}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={handleDecryptLocal}
                        disabled={isDecrypting}
                        className="btn btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isDecrypting
                          ? (language === 'zh' ? '解密中...' : 'Decrypting...')
                          : (language === 'zh' ? '解密下载' : 'Decrypt & Download')}
                      </button>
                      <button
                        onClick={handleClearLocal}
                        className="btn btn-secondary"
                      >
                        {language === 'zh' ? '清除' : 'Clear'}
                      </button>
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
                  {language === 'zh' ? '• 支持批量加密多个文件' : '• Supports batch encryption of multiple files'}
                </p>
                <p>
                  {language === 'zh' ? '• 实时验证密码是否匹配' : '• Real-time password matching validation'}
                </p>
                <p>
                  {language === 'zh' ? '• 加密文件可下载到本地保存' : '• Encrypted files can be downloaded for local storage'}
                </p>
                <p>
                  {language === 'zh' ? '• 本地加密文件可上传解密' : '• Local encrypted files can be uploaded for decryption'}
                </p>
                <p>
                  {language === 'zh' ? '• 密码不保存在服务器，确保安全' : '• Passwords are not stored on server for security'}
                </p>
                <p>
                  {language === 'zh' ? '• 刷新页面后加密文件会丢失' : '• Encrypted files are lost after page refresh'}
                </p>
                <p>
                  {language === 'zh' ? '• 建议及时下载加密文件' : '• Recommend downloading encrypted files promptly'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
