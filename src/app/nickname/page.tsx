'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useApp } from '@/contexts/AppContext';

type NicknameStyle = 'ancient' | 'game' | 'english' | 'couple';

export default function NicknamePage() {
  const { language, setLanguage } = useApp();
  const [style, setStyle] = useState<NicknameStyle>('ancient');
  const [inputText, setInputText] = useState('');
  const [generatedNicknames, setGeneratedNicknames] = useState<string[]>([]);

  const ancientSuffixes = ['轩', '然', '逸', '涵', '泽', '宇', '辰', '阳', '霖', '浩', '博', '文', '杰', '睿', '墨', '风', '云', '星', '梦', '影'];
  const gameSymbols = ['★', '☆', '✦', '✧', '❋', '✺', '❂', '❃', '❄', '❅', '❆', '❇', '⚡', '⚔', '⚓', '⚙'];
  const englishSymbols = ['★', '☆', '✦', '✧', 'X', 'Z', 'V', '007', '99', '666', 'Pro', 'God', 'King', 'Boss'];
  const couplePrefixes1 = ['爱', '心', '情', '缘', '梦', '恋', '思', '念', '惜', '怜', '宠', '护', '守', '伴'];
  const couplePrefixes2 = ['暖', '甜', '蜜', '柔', '温', '雅', '静', '清', '纯', '美', '丽', '秀', '俊', '帅'];
  const coupleSymbols = ['❤', '♥', '♡', '💕', '💖', '💗', '💘', '💙', '💚', '💛', '💜', '🖤'];

  const generateAncientNickname = (text: string) => {
    const nicknames: string[] = [];
    const baseText = text || '';
    
    for (let i = 0; i < 10; i++) {
      const suffix = ancientSuffixes[Math.floor(Math.random() * ancientSuffixes.length)];
      
      if (baseText) {
        nicknames.push(`${baseText}${suffix}`);
      } else {
        const prefix = ancientSuffixes[Math.floor(Math.random() * ancientSuffixes.length)];
        nicknames.push(`${prefix}${suffix}`);
      }
    }
    
    return nicknames;
  };

  const generateGameNickname = (text: string) => {
    const nicknames: string[] = [];
    const baseText = text || '';
    
    for (let i = 0; i < 10; i++) {
      const symbol1 = gameSymbols[Math.floor(Math.random() * gameSymbols.length)];
      const symbol2 = gameSymbols[Math.floor(Math.random() * gameSymbols.length)];
      
      if (baseText) {
        nicknames.push(`${symbol1}${baseText}${symbol2}`);
      } else {
        const randomText = ['王者', '战神', '霸主', '至尊', '传奇', '神话', '魔神', '战将', '刺客', '法师', '射手'][Math.floor(Math.random() * 10)];
        nicknames.push(`${symbol1}${randomText}${symbol2}`);
      }
    }
    
    return nicknames;
  };

  const generateEnglishNickname = (text: string) => {
    const nicknames: string[] = [];
    const baseText = text || '';
    
    for (let i = 0; i < 10; i++) {
      const symbol = englishSymbols[Math.floor(Math.random() * englishSymbols.length)];
      
      if (baseText) {
        const englishText = baseText.replace(/[\u4e00-\u9fa5]/g, '');
        if (englishText) {
          nicknames.push(`${englishText}${symbol}`);
        } else {
          const randomText = ['Dark', 'Shadow', 'Night', 'Storm', 'Fire', 'Ice', 'Wind', 'Light', 'Moon', 'Star'][Math.floor(Math.random() * 10)];
          nicknames.push(`${randomText}${symbol}`);
        }
      } else {
        const randomText = ['Dark', 'Shadow', 'Night', 'Storm', 'Fire', 'Ice', 'Wind', 'Light', 'Moon', 'Star'][Math.floor(Math.random() * 10)];
        nicknames.push(`${randomText}${symbol}`);
      }
    }
    
    return nicknames;
  };

  const generateCoupleNickname = (text: string) => {
    const nicknames: string[] = [];
    const baseText = text || '';
    
    for (let i = 0; i < 5; i++) {
      const prefix1 = couplePrefixes1[Math.floor(Math.random() * couplePrefixes1.length)];
      const prefix2 = couplePrefixes2[Math.floor(Math.random() * couplePrefixes2.length)];
      const symbol = coupleSymbols[Math.floor(Math.random() * coupleSymbols.length)];
      
      if (baseText) {
        nicknames.push(`${prefix1}${baseText}${symbol}${prefix2}${baseText}`);
      } else {
        const randomText = ['轩', '然', '逸', '涵', '泽', '宇', '辰', '阳', '霖', '浩'][Math.floor(Math.random() * 10)];
        nicknames.push(`${prefix1}${randomText}${symbol}${prefix2}${randomText}`);
      }
    }
    
    return nicknames;
  };

  const handleGenerate = () => {
    let nicknames: string[] = [];
    
    switch (style) {
      case 'ancient':
        nicknames = generateAncientNickname(inputText);
        break;
      case 'game':
        nicknames = generateGameNickname(inputText);
        break;
      case 'english':
        nicknames = generateEnglishNickname(inputText);
        break;
      case 'couple':
        nicknames = generateCoupleNickname(inputText);
        break;
    }
    
    setGeneratedNicknames(nicknames);
  };

  const handleClear = () => {
    setInputText('');
    setGeneratedNicknames([]);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert(language === 'zh' ? '已复制到剪贴板' : 'Copied to clipboard');
  };

  const getStyleLabel = (s: NicknameStyle) => {
    switch (s) {
      case 'ancient':
        return language === 'zh' ? '古风' : 'Ancient Style';
      case 'game':
        return language === 'zh' ? '游戏' : 'Game Style';
      case 'english':
        return language === 'zh' ? '英文' : 'English Style';
      case 'couple':
        return language === 'zh' ? '情侣' : 'Couple Style';
    }
  };

  const getStyleDescription = (s: NicknameStyle) => {
    switch (s) {
      case 'ancient':
        return language === 'zh' ? '简洁优雅' : 'Simple and elegant';
      case 'game':
        return language === 'zh' ? '个性鲜明' : 'Distinctive personality';
      case 'english':
        return language === 'zh' ? '时尚潮流' : 'Fashionable and trendy';
      case 'couple':
        return language === 'zh' ? '甜蜜浪漫' : 'Sweet and romantic';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
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
            {language === 'zh' ? '网名/ID 生成器' : 'Nickname/ID Generator'}
          </h1>
          <p className="text-xl text-gray-600">
            {language === 'zh' ? '支持古风、游戏、英文、情侣等多种风格，简短精炼' : 'Supports ancient, game, English, couple and other styles, short and concise'}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="card mb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {(['ancient', 'game', 'english', 'couple'] as NicknameStyle[]).map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setStyle(s);
                    setGeneratedNicknames([]);
                  }}
                  className={`p-4 rounded-lg font-medium transition-all ${
                    style === s
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                  }`}
                >
                  <div className="text-lg font-bold mb-1">{getStyleLabel(s)}</div>
                  <div className="text-xs opacity-75">{getStyleDescription(s)}</div>
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'zh' ? '输入文字（可选）' : 'Enter Text (Optional)'}
                </label>
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={language === 'zh' ? '输入您的名字或关键词' : 'Enter your name or keywords'}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleGenerate}
                  className="btn btn-primary flex-1"
                >
                  {language === 'zh' ? '生成网名' : 'Generate Nicknames'}
                </button>
                <button
                  onClick={handleClear}
                  className="btn btn-secondary"
                >
                  {language === 'zh' ? '清空' : 'Clear'}
                </button>
              </div>
            </div>
          </div>

          {generatedNicknames.length > 0 && (
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {language === 'zh' ? '生成的网名' : 'Generated Nicknames'}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {generatedNicknames.map((nickname, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 p-4 rounded-lg flex justify-between items-center group hover:bg-gray-100 transition-colors"
                  >
                    <span className="font-mono text-lg text-gray-800 truncate">{nickname}</span>
                    <button
                      onClick={() => copyToClipboard(nickname)}
                      className="px-3 py-1 bg-primary text-white text-sm rounded hover:bg-primary/90 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      {language === 'zh' ? '复制' : 'Copy'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                {language === 'zh' ? '风格说明' : 'Style Description'}
              </h3>
              <div className="text-sm text-gray-600 space-y-3">
                <div>
                  <strong className="text-gray-800">{language === 'zh' ? '古风' : 'Ancient'}:</strong>
                  <p>{language === 'zh' ? '简洁优雅，诗意盎然，适合喜欢传统文化的用户' : 'Simple and elegant, full of poetry, suitable for users who love traditional culture'}</p>
                </div>
                <div>
                  <strong className="text-gray-800">{language === 'zh' ? '游戏' : 'Game'}:</strong>
                  <p>{language === 'zh' ? '个性鲜明，简洁有力，适合游戏玩家' : 'Distinctive personality, simple and powerful, suitable for gamers'}</p>
                </div>
                <div>
                  <strong className="text-gray-800">{language === 'zh' ? '英文' : 'English'}:</strong>
                  <p>{language === 'zh' ? '时尚潮流，国际化，适合喜欢英文名的用户' : 'Fashionable and international, suitable for users who prefer English names'}</p>
                </div>
                <div>
                  <strong className="text-gray-800">{language === 'zh' ? '情侣' : 'Couple'}:</strong>
                  <p>{language === 'zh' ? '甜蜜浪漫，成双成对，适合情侣使用' : 'Sweet and romantic, in pairs, suitable for couples'}</p>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                {language === 'zh' ? '使用技巧' : 'Usage Tips'}
              </h3>
              <div className="text-sm text-gray-600 space-y-2">
                <p>
                  {language === 'zh' ? '• 输入您的名字或关键词，生成个性化网名' : '• Enter your name or keywords to generate personalized nicknames'}
                </p>
                <p>
                  {language === 'zh' ? '• 不输入文字则生成随机网名' : '• Leave text empty to generate random nicknames'}
                </p>
                <p>
                  {language === 'zh' ? '• 生成的网名简短精炼，易于记忆' : '• Generated nicknames are short and concise, easy to remember'}
                </p>
                <p>
                  {language === 'zh' ? '• 点击复制按钮快速保存喜欢的网名' : '• Click the copy button to quickly save your favorite nickname'}
                </p>
                <p>
                  {language === 'zh' ? '• 尝试不同风格，找到最适合您的网名' : '• Try different styles to find the nickname that suits you best'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
