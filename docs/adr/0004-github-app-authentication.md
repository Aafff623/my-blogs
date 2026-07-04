# ADR-0004: 使用 GitHub App 认证

## 状态

已接受

## 背景

前端需要通过 GitHub API 写入内容仓库。需要一种安全、可撤销、权限可控的认证方式。

## 决策

使用 **GitHub App** 进行认证：

- 用户创建并安装一个 GitHub App，只授予目标仓库的 **write** 权限。
- 用户在前端导入 GitHub App 的 **Private Key（PEM）**。
- 前端使用 `jsrsasign` 在浏览器端用 Private Key 和 App ID 签发 JWT。
- 用 JWT 换取 installation token，再通过 token 调用 GitHub API 读写仓库。
- Private Key 可选择加密后缓存在 `sessionStorage`（通过 `AES-GCM`，密钥来自 `GITHUB_CONFIG.ENCRYPT_KEY`）。
- Installation token 缓存在 `sessionStorage` 以减少重复签发。

## 后果

### 正面

- 权限最小化：GitHub App 可以只授予单个仓库的写入权限。
- 可撤销：用户随时可以卸载 App 或删除 Private Key。
- 不暴露个人 access token：认证发生在用户浏览器中，服务器不持有密钥。

### 负面

- 用户体验复杂：非程序员用户需要按照 README 创建 GitHub App、下载 Private Key、导入。
- 私钥在前端运行：虽然只在浏览器内存/加密缓存中存在，但本质上私钥离开了 GitHub 服务器。
- 默认加密密钥风险：`GITHUB_CONFIG.ENCRYPT_KEY` 存在默认回退字符串，未覆盖环境变量时安全性下降。
- 依赖 `jsrsasign`：体积较大，且需要在浏览器中做 JWT 签名。

## 替代方案

- **GitHub Personal Access Token（PAT）**：实现简单，但权限通常更宽泛，且 token 泄露风险更高。
- **OAuth App**：适合多用户授权场景，但需要后端回调服务。
- **后端代理**：把 Private Key 放在服务器，前端只发请求；更安全，但需要维护后端服务。

## 相关文件

- `src/lib/auth.ts`
- `src/lib/github-client.ts`
- `src/lib/aes256-util.ts`
- `src/hooks/use-auth.ts`
- `src/consts.ts`
