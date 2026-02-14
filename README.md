# 简历生成器

一个基于 Next.js + React 的现代简历生成器，支持用户创建、预览和下载专业美观的PDF简历。

## 技术框架

### 前端技术栈
- **Next.js 14**：React 框架，支持服务端渲染和静态站点生成
- **React 18**：前端UI库
- **TypeScript**：类型安全的JavaScript超集
- **Tailwind CSS**：实用优先的CSS框架
- **HTML2Canvas + jsPDF**：PDF生成和下载

### 后端技术栈
- **Next.js API Routes**：处理登录和注册请求
- **Supabase**：PostgreSQL数据库（用户数据持久化）
- **bcryptjs**：密码哈希加密
- **ip-api.com**：IP地理位置检测（自动语言切换）

## 实现原理

### 1. 项目架构
- **客户端**：使用React组件构建用户界面，处理用户输入和表单验证
- **服务端**：使用Next.js API Routes处理用户认证请求
- **数据流程**：用户输入 → 状态管理 → 实时预览 → PDF生成 → 下载
- **数据库**：Supabase PostgreSQL存储用户数据

### 2. 核心功能实现

#### 简历数据管理
- 使用React useState管理简历数据状态
- 支持添加、编辑、删除教育背景、工作经历和技能
- 实时更新预览内容

#### 多风格支持
- 三种预设简历风格：现代简约、专业商务、创意设计
- 使用Tailwind CSS实现不同风格的样式
- 风格切换实时生效

#### PDF生成
- 使用HTML2Canvas将简历预览转换为图片
- 使用jsPDF将图片转换为PDF文件
- 支持多页自动分页
- 无水印导出

#### 用户认证
- 邮箱和密码登录/注册
- 邮箱唯一性验证
- 密码哈希加密存储
- Session Cookie保持登录状态
- Supabase数据库持久化存储

#### 国际化支持
- 中英文语言切换
- 界面元素和简历内容双语支持
- **IP地址自动检测**：根据用户所在国家自动设置语言
  - 中国IP地址 → 自动设置为中文
  - 其他国家IP地址 → 自动设置为英文

#### 现代化UI设计
- 渐变背景和按钮
- 毛玻璃效果（backdrop-blur）
- 卡片悬停动画
- 优化的阴影和间距
- 响应式布局适配移动端

## 功能特性

### 1. 个人信息管理
- 姓名、邮箱、电话、地址输入
- 个人简介编辑（支持换行）

### 2. 教育背景
- 添加多个教育经历
- 学校、学位、专业、起止日期、描述
- 支持多行描述

### 3. 工作经历
- 添加多个工作经历
- 公司、职位、起止日期、描述
- 支持多行描述

### 4. 技能管理
- 添加多个技能
- 技能描述（支持多行）

### 5. 简历风格
- 现代简约风格：极简设计，干净整洁
- 专业商务风格：传统格式，专业稳重
- 创意设计风格：彩色渐变，图形化设计

### 6. 语言支持
- 中文界面
- 英文界面
- 简历内容双语切换
- **IP地址自动语言检测**

### 7. 用户认证
- 邮箱注册（自动提取用户名）
- 邮箱登录
- 登录状态保持
- **数据持久化存储**

### 8. PDF导出
- 生成格式美观的PDF简历
- 支持多页自动分页
- 无水印下载

### 9. 现代化设计
- 渐变色彩方案
- 毛玻璃导航栏和页脚
- 卡片悬停效果
- 优化的按钮和输入框样式
- 自定义滚动条样式

## 快速开始

### 开发环境

1. **克隆仓库**
   ```bash
   git clone <repository-url>
   cd resume-builder
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **配置环境变量**
   复制 `.env.example` 为 `.env` 并填入 Supabase 凭证：
   ```bash
   cp .env.example .env
   # 编辑 .env 文件
   ```

4. **设置数据库**
   1. 访问 [Supabase](https://supabase.com) 创建项目
   2. 在 SQL Editor 中执行 `supabase-schema.sql`
   3. 复制项目 URL 和 anon key 到 `.env` 文件

5. **启动开发服务器**
   ```bash
   npm run dev
   ```

6. **访问应用**
   打开浏览器访问 http://localhost:3000

### 生产环境部署

推荐使用 Vercel 部署（Next.js 官方部署平台）：

详细步骤请参考 [DEPLOYMENT.md](./DEPLOYMENT.md)

1. **准备 Supabase 数据库**
   - 创建 Supabase 项目
   - 执行 `supabase-schema.sql` 创建用户表
   - 获取项目 URL 和 anon key

2. **部署到 Vercel**
   - 登录 [Vercel](https://vercel.com)
   - 导入 GitHub 仓库
   - 配置环境变量：
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - 部署应用

3. **验证部署**
   - 访问部署的 URL
   - 测试用户注册和登录
   - 验证 IP 语言检测功能

## 项目结构

```
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/             # API路由
│   │   │   ├── auth/        # 认证相关API
│   │   │   └── detect-language/  # IP检测API
│   │   ├── components/      # 组件
│   │   ├── globals.css      # 全局样式
│   │   └── page.tsx        # 主页面
│   ├── components/           # 可复用组件
│   ├── lib/                # 工具函数
│   │   └── db.ts          # 数据库连接
│   └── types/              # TypeScript类型定义
├── public/                # 静态文件
├── supabase-schema.sql    # 数据库表结构
├── .env.example           # 环境变量模板
├── DEPLOYMENT.md          # 部署详细指南
├── IP_LANGUAGE_DETECTION.md  # IP语言检测说明
├── package.json           # 项目配置
└── README.md             # 项目说明
```

## 核心组件

- **ResumeForm**：简历信息输入表单
- **ResumePreview**：简历实时预览
- **LoginForm**：用户登录和注册
- **LanguageSwitcher**：语言切换
- **StyleSelector**：简历风格选择

## 技术亮点

1. **实时预览**：用户输入时实时更新简历预览
2. **响应式设计**：适配不同屏幕尺寸
3. **模块化组件**：代码结构清晰，易于维护
4. **类型安全**：使用TypeScript确保代码质量
5. **优化的PDF生成**：支持多页自动分页，无水印
6. **流畅的用户体验**：动画效果和交互反馈
7. **数据持久化**：Supabase数据库存储，应用重启不丢失
8. **智能语言检测**：根据IP地址自动设置用户语言
9. **现代化UI**：渐变、毛玻璃、动画效果
10. **生产就绪**：完全支持Vercel等无服务器平台部署

## 环境变量

```bash
# Supabase 配置（必需）
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 数据库表结构

### users 表
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## 未来扩展

- [ ] 更多简历模板
- [ ] 自定义颜色主题
- [ ] 导出为其他格式（Word、HTML）
- [ ] 简历分享功能
- [ ] 用户简历保存和管理
- [ ] 更多国家语言支持
- [ ] 简历模板市场

## 相关文档

- [DEPLOYMENT.md](./DEPLOYMENT.md) - 详细的部署指南
- [IP_LANGUAGE_DETECTION.md](./IP_LANGUAGE_DETECTION.md) - IP语言检测说明

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目！

## 技术支持

- Next.js: https://nextjs.org/docs
- Supabase: https://supabase.com/docs
- Tailwind CSS: https://tailwindcss.com/docs
- React: https://react.dev