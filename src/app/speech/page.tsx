'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useApp } from '@/contexts/AppContext';

export default function SpeechPage() {
  const { language, setLanguage } = useApp();
  const [mode, setMode] = useState<'tts' | 'stt'>('tts');
  const [text, setText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [recordedAudio, setRecordedAudio] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      if (availableVoices.length > 0) {
        const defaultVoice = availableVoices.find(voice => voice.lang.startsWith(language === 'zh' ? 'zh' : 'en')) || availableVoices[0];
        setSelectedVoice(defaultVoice);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, [language]);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = language === 'zh' ? 'zh-CN' : 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        setTranscript(prev => prev + finalTranscript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        if (isListening) {
          recognitionRef.current.start();
        }
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [language, isListening]);

  const speak = () => {
    if (!text.trim()) {
      alert(language === 'zh' ? '请输入要朗读的文本' : 'Please enter text to speak');
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.lang = language === 'zh' ? 'zh-CN' : 'en-US';

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const startListening = async () => {
    if (!recognitionRef.current) {
      alert(language === 'zh' ? '您的浏览器不支持语音识别' : 'Your browser does not support speech recognition');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setRecordedAudio(audioUrl);
        
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsListening(true);
      setTranscript('');
      recognitionRef.current.start();
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert(language === 'zh' ? '无法访问麦克风，请检查权限设置' : 'Unable to access microphone, please check permission settings');
    }
  };

  const stopListening = () => {
    setIsListening(false);
    
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const clearTranscript = () => {
    setTranscript('');
    setRecordedAudio(null);
  };

  const copyTranscript = () => {
    if (!transcript) return;
    navigator.clipboard.writeText(transcript);
    alert(language === 'zh' ? '已复制到剪贴板' : 'Copied to clipboard');
  };

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
            {language === 'zh' ? '语音工具' : 'Speech Tools'}
          </h1>
          <p className="text-xl text-gray-600">
            {language === 'zh' ? '文字转语音、语音转文字' : 'Text to Speech, Speech to Text'}
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-white rounded-lg shadow-md p-1">
            <button
              onClick={() => setMode('tts')}
              className={`px-6 py-3 rounded-md font-medium transition-all ${
                mode === 'tts'
                  ? 'bg-primary text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {language === 'zh' ? '文字转语音' : 'Text to Speech'}
            </button>
            <button
              onClick={() => setMode('stt')}
              className={`px-6 py-3 rounded-md font-medium transition-all ${
                mode === 'stt'
                  ? 'bg-primary text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {language === 'zh' ? '语音转文字' : 'Speech to Text'}
            </button>
          </div>
        </div>

        {mode === 'tts' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="card">
                <h2 className="text-xl font-bold text-gray-800 mb-6">
                  {language === 'zh' ? '输入文本' : 'Input Text'}
                </h2>
                <div className="space-y-4">
                  <div className="form-group">
                    <label className="form-label">{language === 'zh' ? '要朗读的文本' : 'Text to speak'}</label>
                    <textarea
                      className="form-textarea"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder={language === 'zh' ? '请输入要朗读的文本...' : 'Enter text to speak...'}
                      rows={8}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">{language === 'zh' ? '选择语音' : 'Select Voice'}</label>
                    <select
                      className="form-input"
                      value={selectedVoice?.name || ''}
                      onChange={(e) => {
                        const voice = voices.find(v => v.name === e.target.value);
                        setSelectedVoice(voice || null);
                      }}
                    >
                      {voices.map((voice, index) => (
                        <option key={index} value={voice.name}>
                          {voice.name} ({voice.lang})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-group">
                      <label className="form-label">{language === 'zh' ? '语速' : 'Rate'}: {rate}</label>
                      <input
                        type="range"
                        min="0.5"
                        max="2"
                        step="0.1"
                        value={rate}
                        onChange={(e) => setRate(parseFloat(e.target.value))}
                        className="w-full"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">{language === 'zh' ? '音调' : 'Pitch'}: {pitch}</label>
                      <input
                        type="range"
                        min="0.5"
                        max="2"
                        step="0.1"
                        value={pitch}
                        onChange={(e) => setPitch(parseFloat(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={speak}
                      disabled={isSpeaking}
                      className="btn btn-primary flex-1"
                    >
                      {isSpeaking ? (language === 'zh' ? '朗读中...' : 'Speaking...') : (language === 'zh' ? '开始朗读' : 'Start Speaking')}
                    </button>
                    <button
                      onClick={stopSpeaking}
                      disabled={!isSpeaking}
                      className="btn btn-secondary"
                    >
                      {language === 'zh' ? '停止' : 'Stop'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="card">
                <h2 className="text-xl font-bold text-gray-800 mb-6">
                  {language === 'zh' ? '状态' : 'Status'}
                </h2>
                <div className="flex flex-col items-center justify-center h-64">
                  {isSpeaking ? (
                    <div className="text-center">
                      <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                        </svg>
                      </div>
                      <p className="text-lg font-medium text-gray-800">
                        {language === 'zh' ? '正在朗读...' : 'Speaking...'}
                      </p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                        </svg>
                      </div>
                      <p className="text-gray-500">
                        {language === 'zh' ? '输入文本并点击开始朗读' : 'Enter text and click start speaking'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="card">
                <h2 className="text-xl font-bold text-gray-800 mb-6">
                  {language === 'zh' ? '语音识别' : 'Speech Recognition'}
                </h2>
                <div className="space-y-6">
                  <div className="flex justify-center">
                    <button
                      onClick={isListening ? stopListening : startListening}
                      className={`w-32 h-32 rounded-full flex items-center justify-center transition-all ${
                        isListening
                          ? 'bg-gradient-to-br from-red-500 to-pink-500 shadow-lg animate-pulse'
                          : 'bg-gradient-to-br from-orange-500 to-amber-500 shadow-md hover:shadow-lg'
                      }`}
                    >
                      <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-center text-gray-600">
                    {isListening
                      ? (language === 'zh' ? '正在聆听...' : 'Listening...')
                      : (language === 'zh' ? '点击按钮开始录音' : 'Click button to start recording')}
                  </p>
                  <p className="text-center text-sm text-gray-500">
                    {language === 'zh' ? '请允许浏览器使用麦克风' : 'Please allow browser to use microphone'}
                  </p>

                  {isListening && (
                    <div className="flex justify-center">
                      <button
                        onClick={stopListening}
                        className="btn btn-secondary"
                      >
                        {language === 'zh' ? '停止录音' : 'Stop Recording'}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {recordedAudio && (
                <div className="card">
                  <h2 className="text-xl font-bold text-gray-800 mb-6">
                    {language === 'zh' ? '播放录音' : 'Play Recording'}
                  </h2>
                  <div className="space-y-4">
                    <audio
                      controls
                      className="w-full"
                      src={recordedAudio}
                    >
                      {language === 'zh' ? '您的浏览器不支持音频播放' : 'Your browser does not support audio playback'}
                    </audio>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = recordedAudio;
                          link.download = `recording-${Date.now()}.wav`;
                          link.click();
                        }}
                        className="btn btn-secondary flex-1"
                      >
                        {language === 'zh' ? '下载录音' : 'Download Recording'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="card">
                <h2 className="text-xl font-bold text-gray-800 mb-6">
                  {language === 'zh' ? '识别结果' : 'Recognition Result'}
                </h2>
                <div className="space-y-4">
                  {transcript ? (
                    <>
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <pre className="whitespace-pre-wrap break-words text-gray-800 font-sans">
                          {transcript}
                        </pre>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={copyTranscript}
                          className="btn btn-secondary flex-1"
                        >
                          {language === 'zh' ? '复制结果' : 'Copy Result'}
                        </button>
                        <button
                          onClick={clearTranscript}
                          className="btn btn-secondary"
                        >
                          {language === 'zh' ? '清空' : 'Clear'}
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                      <p className="text-gray-500">
                        {language === 'zh' ? '开始录音后显示识别结果' : 'Start recording to see recognition result'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
