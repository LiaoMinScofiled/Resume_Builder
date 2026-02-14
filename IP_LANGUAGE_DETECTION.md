# IP地址自动语言检测功能

## 功能说明

网站现在会根据用户的IP地址自动检测其所在国家，并设置相应的语言：
- **中国IP地址** → 自动设置为中文
- **其他国家IP地址** → 自动设置为英文

## 工作原理

### 1. IP检测API
创建了 `/api/detect-language` 端点，功能如下：

- 获取用户的真实IP地址（考虑代理和负载均衡器）
- 使用免费的 `ip-api.com` 服务查询IP地理位置
- 根据国家代码判断语言
- 返回语言、国家代码、国家名称和IP地址

### 2. 前端自动设置语言
在首页加载时：
- 调用 `/api/detect-language` API
- 根据返回的语言自动设置界面语言
- 用户仍然可以手动切换语言
- 一旦用户手动切换，就不再自动检测

## 技术实现

### API端点 (`/api/detect-language`)

```typescript
GET /api/detect-language
```

**响应示例**：
```json
{
  "language": "zh",
  "country": "CN",
  "countryName": "China",
  "ip": "1.2.3.4"
}
```

### 前端集成

在 `src/app/page.tsx` 中：
- 添加了 `isLanguageDetected` 状态
- 使用 `useEffect` 在页面加载时检测语言
- 用户手动切换语言后，停止自动检测

## 支持的国家

### 中文语言
- 中国大陆 (CN)

### 英文语言
- 所有其他国家（默认）

## 隐私说明

- IP地址仅用于语言检测
- 不存储用户的IP地址
- 不追踪用户的地理位置
- 使用免费的第三方服务（ip-api.com）

## 错误处理

如果IP检测失败：
- 默认使用英文
- 在控制台输出错误信息
- 不影响用户正常使用

## 限制

### IP-API服务限制
- 免费版：45次/分钟
- 超出限制时默认使用英文

### 代理和VPN
- 如果用户使用代理或VPN，检测到的可能是代理服务器的国家
- 用户可以手动切换语言覆盖自动检测

## 测试

### 本地测试
由于本地开发环境的IP地址通常是 `localhost` 或 `127.0.0.1`，API会返回默认语言（英文）。

### 生产环境测试
部署到Vercel后：
- 中国用户访问 → 自动显示中文
- 其他国家用户访问 → 自动显示英文

## 自定义配置

如需添加更多国家的语言支持，修改 `/api/detect-language/route.ts`：

```typescript
const isChina = data.countryCode === 'CN';
const isJapan = data.countryCode === 'JP';
const isKorea = data.countryCode === 'KR';

const language = isChina ? 'zh' : (isJapan ? 'ja' : (isKorea ? 'ko' : 'en'));
```

## 性能考虑

- IP检测仅在首次访问时执行
- 结果不会存储，每次访问都会重新检测
- API响应时间通常 < 100ms
- 不影响页面加载速度