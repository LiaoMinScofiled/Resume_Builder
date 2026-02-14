# 部署指南 - Vercel + Supabase

## 问题说明

之前的文件存储方案在 Vercel 上无法工作，因为 Vercel 的无服务器环境是只读的。现在已改为使用 Supabase 数据库，完全支持 Vercel 部署。

## 部署步骤

### 1. 创建 Supabase 项目

1. 访问 [https://supabase.com](https://supabase.com) 并注册账号
2. 点击 "New Project" 创建新项目
3. 填写项目信息：
   - Name: `resume-builder` (或任意名称)
   - Database Password: 设置一个强密码
   - Region: 选择离你最近的区域
4. 等待项目创建完成（通常需要 1-2 分钟）

### 2. 设置数据库表

1. 在 Supabase Dashboard 中，进入 SQL Editor
2. 点击 "New Query"
3. 复制项目根目录下的 `supabase-schema.sql` 文件内容
4. 粘贴到 SQL Editor 中
5. 点击 "Run" 执行 SQL 语句

### 3. 获取 Supabase 凭证

1. 在 Supabase Dashboard 中，进入 Settings > API
2. 复制以下信息：
   - Project URL
   - anon public key

### 4. 配置环境变量

#### 本地开发：
1. 复制 `.env.example` 为 `.env`
2. 编辑 `.env` 文件，填入 Supabase 凭证：
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

#### Vercel 部署：
1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 进入你的项目设置
3. 进入 Environment Variables
4. 添加以下环境变量：
   - `NEXT_PUBLIC_SUPABASE_URL`: 你的 Supabase 项目 URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: 你的 Supabase anon key

### 5. 部署到 Vercel

#### 方法一：通过 Vercel CLI
```bash
npm install -g vercel
vercel
```

#### 方法二：通过 Vercel Dashboard
1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击 "Add New Project"
3. 导入你的 GitHub 仓库
4. 配置构建设置：
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
5. 添加环境变量（见步骤 4）
6. 点击 "Deploy"

### 6. 验证部署

1. 部署完成后，访问提供的 URL
2. 尝试注册新账号
3. 退出登录
4. 使用相同凭据重新登录
5. 确认功能正常

## 数据库表结构

`users` 表包含以下字段：
- `id`: 用户唯一标识符
- `email`: 用户邮箱（唯一）
- `password`: 加密后的密码
- `name`: 用户名称
- `created_at`: 创建时间

## 安全性说明

### 认证系统

本项目使用自定义的登录/注册系统：
- 密码使用 bcrypt 加密存储
- 用户会话存储在 HttpOnly Cookie 中
- 不使用 Supabase Auth 系统

### 数据安全策略

由于本项目使用自定义认证系统，推荐以下两种安全策略：

#### 方案1：应用层权限控制（推荐）

**适用场景**：当前应用架构

**优点**：
- ✅ 简单易实现
- ✅ 灵活性高
- ✅ 易于调试
- ✅ 不需要修改现有架构

**实施方法**：
1. 在所有API端点添加权限检查
2. 从Cookie获取当前用户
3. 验证用户只能访问自己的数据

**示例代码**：
```typescript
// 从cookie获取当前用户
const cookieUser = request.cookies.get('user');
if (!cookieUser) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

const currentUser = JSON.parse(cookieUser.value);

// 权限检查：只能访问自己的简历
if (currentUser.id !== userId) {
  return NextResponse.json(
    { error: 'Forbidden: You can only access your own resume' },
    { status: 403 }
  );
}
```

#### 方案2：数据库层RLS（可选）

**适用场景**：需要使用Supabase Auth系统

**注意**：由于本项目不使用Supabase Auth，直接启用RLS会导致所有数据库操作被拒绝。

**如果需要使用RLS**，需要：
1. 迁移到Supabase Auth系统
2. 重构整个认证流程
3. 更新所有API端点

**详细说明**：请参阅 [RLS_GUIDE.md](./RLS_GUIDE.md)

### 生产环境安全检查清单

部署到生产环境前，请确保：

- [ ] 已配置环境变量（不使用默认值）
- [ ] 已实现权限控制（应用层或RLS）
- [ ] 已测试用户隔离功能
- [ ] 已移除调试日志
- [ ] 已配置HTTPS
- [ ] 已设置适当的CORS策略
- [ ] 已检查日志输出不包含敏感信息

### 详细文档

关于RLS的完整指南，包括：
- RLS的作用和工作原理
- 如何开启和禁用RLS
- 生产环境部署指南
- 常见问题和解决方案

请参阅：[RLS_GUIDE.md](./RLS_GUIDE.md)

## 故障排除

### 问题：注册时出现 "Supabase credentials not found"
**解决**：检查环境变量是否正确设置

### 问题：无法连接到数据库
**解决**：
1. 检查 Supabase 项目是否正常运行
2. 确认 URL 和 key 是否正确
3. 检查网络连接

### 问题：注册成功但无法登录
**解决**：
1. 检查数据库中是否创建了用户记录
2. 确认密码加密功能正常
3. 查看 Vercel 函数日志

## 成本说明

- Supabase 免费套餐包含：
  - 500MB 数据库存储
  - 1GB 文件存储
  - 2GB 带宽/月
  - 50,000 API 请求/月

- Vercel 免费套餐包含：
  - 无限项目
  - 100GB 带宽/月
  - 每月 6,000 分钟构建时间

对于个人简历生成器项目，免费套餐完全够用！