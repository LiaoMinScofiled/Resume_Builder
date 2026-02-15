# 在线工具箱 / Online Tools

一个功能丰富的在线工具集合，提供简历生成、二维码生成解析、繁简转换、语音工具和计算器等多种实用工具。

A comprehensive collection of online tools including resume builder, QR code generator/scanner, Traditional/Simplified Chinese converter, speech tools, and calculator.

## 项目简介 / Project Overview

在线工具箱是一个基于 Next.js 的现代化 Web 应用，集成了多种常用工具，帮助用户提高工作效率。所有工具都支持中英文界面，部分功能需要用户登录后使用。

Online Tools is a modern web application built with Next.js that integrates various useful tools to help users improve productivity. All tools support bilingual interfaces (Chinese/English), and some features require user login.

## 工具列表 / Tools List

### 1. 简历生成器 / Resume Builder
创建专业美观的简历，支持多种风格、中英文切换、照片上传和 PDF 导出。

Create professional and beautiful resumes with multiple styles, bilingual support, photo upload, and PDF export.

**功能特性 / Features:**
- 个人信息管理（姓名、邮箱、电话、性别、年龄、照片）
- 教育背景和工作经历管理
- 技能管理
- 三种简历风格：现代简约、专业商务、创意设计
- 实时预览
- PDF 导出（无水印）

### 2. 二维码生成解析器 / QR Code Generator & Scanner
生成自定义二维码，支持自定义颜色、大小和样式，同时支持二维码解析。

Generate custom QR codes with custom colors, sizes, and styles, also supports QR code scanning.

**功能特性 / Features:**
- 生成二维码（文本、链接等）
- 自定义颜色和大小
- 扫描二维码（上传图片）
- 解析二维码内容
- 下载功能（需登录）

### 3. 繁简转换 / Traditional/Simplified Converter
中文繁体和简体相互转换，支持大段文本处理，快速准确。

Convert between Traditional and Simplified Chinese, supports large text processing, fast and accurate.

**功能特性 / Features:**
- 繁体转简体
- 简体转繁体
- 实时转换
- 一键复制结果
- 访问限制（需登录 + 中文模式）

### 4. 语音工具 / Speech Tools
文字转语音、语音转文字，支持多种语音和语言，实时转换。

Text to Speech, Speech to Text, supports multiple voices and languages, real-time conversion.

**功能特性 / Features:**
- 文字转语音（TTS）
- 语音转文字（STT）
- 多种语音选择
- 录音功能
- 音频播放和下载

### 5. 计算器 / Calculator
日常计算、科学计算、程序员计算，支持多种进制转换。

Basic, Scientific, and Programmer Calculator with multiple base conversions.

**功能特性 / Features:**
- 日常计算（加、减、乘、除）
- 科学计算（三角函数、对数、阶乘等）
- 程序员计算（多进制转换）
- 计算过程和结果双显示
- 实时计算

### 6. 编码/解码 / Encoder/Decoder
URL 编码/解码、Base64 编码/解码，快速转换。

URL Encode/Decode, Base64 Encode/Decode, fast conversion.

**功能特性 / Features:**
- URL 编码和解码
- Base64 编码和解码
- 实时转换
- 一键复制结果
- 错误处理

### 7. 密码工具 / Password Tools
密码强度检测、安全密码生成，保护账户安全。

Password strength checker, secure password generator, protect your accounts.

**功能特性 / Features:**
- 密码强度实时检测
- 多维度密码评估（长度、大小写、数字、特殊字符）
- 安全密码生成
- 自定义密码长度和字符类型
- 密码安全建议

### 8. 网名/ID生成器 / Nickname/ID Generator
古风、游戏、英文、情侣等多种风格，个性化网名生成。

Ancient, game, English, couple and other styles, personalized nickname generation.

**功能特性 / Features:**
- 四种风格：古风、游戏、英文、情侣
- 支持输入文字转化
- 随机生成网名
- 一键复制结果
- 每次生成多个选项

### 9. 配色方案生成器 / Color Palette Generator
提取图片配色、生成调色板、配色可视化预览。

Extract colors from images, generate palettes, visualize color schemes.

**功能特性 / Features:**
- 图片上传和颜色提取
- 主色调自动识别
- 5色调色板生成
- 4种可视化预览（网站、按钮、卡片、输入框）
- 一键复制颜色代码
- 智能对比度计算

### 10. 图片压缩与格式转换器 / Image Compressor & Format Converter
批量压缩图片、调整尺寸、转换格式、去除EXIF信息。

Batch compress images, resize, convert formats, remove EXIF data.

**功能特性 / Features:**
- 批量上传和处理图片
- 质量滑块控制压缩程度
- 自定义最大宽高限制
- 多种输出格式（WebP、AVIF、JPEG、PNG）
- 自动去除EXIF信息
- 实时显示压缩比和文件大小
- 单个或批量下载

## 技术栈 / Tech Stack

### 前端 / Frontend
- **Next.js 14**：React 框架，支持服务端渲染和静态站点生成
- **React 18**：前端 UI 库
- **TypeScript**：类型安全的 JavaScript 超集
- **Tailwind CSS**：实用优先的 CSS 框架
- **HTML2Canvas + jsPDF**：PDF 生成和下载
- **qrcode**：二维码生成
- **jsQR**：二维码解析
- **opencc-js**：繁简转换
- **colorthief**：颜色提取
- **Web Speech API**：语音识别和合成

### 后端 / Backend
- **Next.js API Routes**：处理登录、注册和语言检测请求
- **Supabase**：PostgreSQL 数据库（用户数据持久化）
- **bcryptjs**：密码哈希加密
- **ip-api.com**：IP 地理位置检测（自动语言切换）

## 功能特性 / Features

### 通用功能 / Common Features
- **中英文双语界面**：支持中文和英文界面切换
- **IP 地址自动语言检测**：根据用户所在国家自动设置语言
  - 中国 IP 地址 → 自动设置为中文
  - 其他国家 IP 地址 → 自动设置为英文
- **用户认证**：邮箱注册和登录
- **数据持久化**：用户数据存储在 Supabase 数据库
- **响应式设计**：适配不同屏幕尺寸
- **现代化 UI**：渐变背景、毛玻璃效果、动画效果

### 访问控制 / Access Control
部分功能需要用户登录后才能使用：
- 二维码下载
- 繁简转换（还需选择中文模式）

## 快速开始 / Quick Start

### 开发环境 / Development Environment

1. **克隆仓库 / Clone Repository**
   ```bash
   git clone <repository-url>
   cd Resumer_Builder
   ```

2. **安装依赖 / Install Dependencies**
   ```bash
   npm install
   ```

3. **配置环境变量 / Configure Environment Variables**
   复制 `.env.example` 为 `.env` 并填入 Supabase 凭证：
   Copy `.env.example` to `.env` and fill in Supabase credentials:
   ```bash
   cp .env.example .env
   # 编辑 .env 文件 / Edit .env file
   ```

4. **设置数据库 / Setup Database**
   1. 访问 [Supabase](https://supabase.com) 创建项目
   2. 在 SQL Editor 中执行 `supabase-schema.sql`
   3. 复制项目 URL 和 anon key 到 `.env` 文件

5. **启动开发服务器 / Start Development Server**
   ```bash
   npm run dev
   ```

6. **访问应用 / Access Application**
   打开浏览器访问 http://localhost:3000
   Open browser and visit http://localhost:3000

### 生产环境部署 / Production Deployment

推荐使用 Vercel 部署（Next.js 官方部署平台）：
Recommended to deploy using Vercel (official Next.js deployment platform):

1. **准备 Supabase 数据库 / Prepare Supabase Database**
   - 创建 Supabase 项目 / Create Supabase project
   - 执行 `supabase-schema.sql` 创建用户表 / Execute `supabase-schema.sql` to create user table
   - 获取项目 URL 和 anon key / Get project URL and anon key

2. **部署到 Vercel / Deploy to Vercel**
   - 登录 [Vercel](https://vercel.com) / Login to [Vercel](https://vercel.com)
   - 导入 GitHub 仓库 / Import GitHub repository
   - 配置环境变量 / Configure environment variables:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - 部署应用 / Deploy application

3. **验证部署 / Verify Deployment**
   - 访问部署的 URL / Visit deployed URL
   - 测试用户注册和登录 / Test user registration and login
   - 验证 IP 语言检测功能 / Verify IP language detection

## 项目结构 / Project Structure

```
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/             # API 路由 / API Routes
│   │   │   ├── auth/        # 认证相关 API / Auth APIs
│   │   │   └── detect-language/  # IP 检测 API / IP Detection API
│   │   ├── calculator/      # 计算器页面 / Calculator Page
│   │   ├── colorpalette/    # 配色方案生成器页面 / Color Palette Generator Page
│   │   ├── convert/         # 繁简转换页面 / Converter Page
│   │   ├── encoder/         # 编码/解码页面 / Encoder/Decoder Page
│   │   ├── imagecompressor/ # 图片压缩器页面 / Image Compressor Page
│   │   ├── nickname/        # 网名/ID生成器页面 / Nickname/ID Generator Page
│   │   ├── password/        # 密码工具页面 / Password Tools Page
│   │   ├── qrcode/          # 二维码页面 / QR Code Page
│   │   ├── resume/          # 简历生成器页面 / Resume Builder Page
│   │   ├── speech/          # 语音工具页面 / Speech Tools Page
│   │   ├── components/      # 页面组件 / Page Components
│   │   ├── globals.css      # 全局样式 / Global Styles
│   │   └── page.tsx        # 主页面 / Main Page
│   ├── components/           # 可复用组件 / Reusable Components
│   │   ├── LoginForm.tsx    # 登录表单 / Login Form
│   │   ├── LanguageSwitcher.tsx  # 语言切换器 / Language Switcher
│   │   └── ToolCard.tsx     # 工具卡片 / Tool Card
│   ├── contexts/            # React Context
│   │   └── AppContext.tsx   # 应用全局状态 / App Global State
│   ├── lib/                # 工具函数 / Utility Functions
│   │   └── db.ts          # 数据库连接 / Database Connection
│   └── types/              # TypeScript 类型定义 / TypeScript Type Definitions
├── public/                # 静态文件 / Static Files
├── supabase-schema.sql    # 数据库表结构 / Database Schema
├── .env.example           # 环境变量模板 / Environment Variables Template
├── package.json           # 项目配置 / Project Configuration
└── README.md             # 项目说明 / Project Documentation
```

## 核心组件 / Core Components

- **ResumeForm**：简历信息输入表单 / Resume Information Input Form
- **ResumePreview**：简历实时预览 / Resume Real-time Preview
- **LoginForm**：用户登录和注册 / User Login and Registration
- **LanguageSwitcher**：语言切换 / Language Switching
- **ToolCard**：工具卡片组件 / Tool Card Component
- **AppContext**：应用全局状态管理 / App Global State Management

## 技术亮点 / Technical Highlights

1. **实时预览 / Real-time Preview**：用户输入时实时更新预览
2. **响应式设计 / Responsive Design**：适配不同屏幕尺寸
3. **模块化组件 / Modular Components**：代码结构清晰，易于维护
4. **类型安全 / Type Safety**：使用 TypeScript 确保代码质量
5. **优化的 PDF 生成 / Optimized PDF Generation**：支持多页自动分页，无水印
6. **流畅的用户体验 / Smooth User Experience**：动画效果和交互反馈
7. **数据持久化 / Data Persistence**：Supabase 数据库存储，应用重启不丢失
8. **智能语言检测 / Smart Language Detection**：根据 IP 地址自动设置用户语言
9. **现代化 UI / Modern UI**：渐变、毛玻璃、动画效果
10. **生产就绪 / Production Ready**：完全支持 Vercel 等无服务器平台部署

## 环境变量 / Environment Variables

```bash
# Supabase 配置（必需） / Supabase Configuration (Required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 数据库表结构 / Database Schema

### users 表 / users Table
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## 安全性 / Security

### 数据安全 / Data Security

本项目采用多层安全机制保护用户数据：
This project uses multiple security mechanisms to protect user data:

1. **密码加密 / Password Encryption**：使用 bcryptjs 进行密码哈希加密
2. **Session 管理 / Session Management**：使用 HttpOnly Cookie 存储用户会话
3. **数据隔离 / Data Isolation**：确保用户只能访问自己的数据
4. **环境变量 / Environment Variables**：敏感凭证存储在环境变量中

### 生产环境部署安全检查 / Production Deployment Security Checklist

部署到生产环境前，请确保：
Before deploying to production, ensure:

- [ ] 已配置环境变量（不使用默认值）/ Environment variables configured (no default values)
- [ ] 已实现权限控制 / Access control implemented
- [ ] 已测试用户隔离功能 / User isolation tested
- [ ] 已移除调试日志 / Debug logs removed
- [ ] 已配置 HTTPS / HTTPS configured
- [ ] 已设置适当的 CORS 策略 / Proper CORS policy set

## 未来扩展 / Future Enhancements

- [ ] 更多工具类型 / More tool types
- [ ] 自定义主题 / Custom themes
- [ ] 更多语言支持 / More language support
- [ ] 工具收藏功能 / Tool favorites
- [ ] 用户使用统计 / User usage statistics
- [ ] API 接口 / API endpoints
- [ ] 移动端应用 / Mobile application

## 许可证 / License

MIT License

## 贡献 / Contributing

欢迎提交 Issue 和 Pull Request 来改进这个项目！
Welcome to submit Issues and Pull Requests to improve this project!

## 技术支持 / Technical Support

- Next.js: https://nextjs.org/docs
- Supabase: https://supabase.com/docs
- Tailwind CSS: https://tailwindcss.com/docs
- React: https://react.dev
