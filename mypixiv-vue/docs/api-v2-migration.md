# API v2 迁移完成说明

## 迁移概览

已成功将前端代码从 v1 API 迁移到 v2 RESTful API。本次迁移遵循 REST 规范，提供更清晰的 API 结构。

## 已完成的更改

### 1. API 常量文件 (`src/constants/api.js`)

**主要变化：**
- 所有 API 路径添加 `/api/v2` 前缀
- 使用函数形式的端点，支持路径参数（如：`USER_INFO: (userId) => \`/api/v2/users/${userId}\``）
- 采用 RESTful 命名规范（如：`/api/v2/users/:id`, `/api/v2/contributions/:id`）

**示例对比：**
```javascript
// v1
USER_INFO: '/userInfo'

// v2
USER_INFO: (userId) => `/api/v2/users/${userId}`
```

### 2. 用户 API 服务 (`src/services/api/user.js`)

**主要变化：**
- `getUserInfo()` - 从 POST 改为 GET，使用路径参数
- `updateUserInfo()` - 从 POST 改为 PUT
- `concernUser()`/`unconcernUser()` - 使用 POST/DELETE
- 新增密保问题相关方法：`getSecurityIssues()`, `verifySecurityIssues()`, `resetPassword()`, `changePassword()`

### 3. 作品 API 服务 (`src/services/api/artwork.js`)

**主要变化：**
- `getArtworkDetail()` - 从 POST 改为 GET，使用路径参数
- `searchArtworks()` - 拆分为三个独立端点（by-id, by-name, by-tag）
- `likeArtwork()`/`unlikeArtwork()` - 使用 POST/DELETE
- `favoriteArtwork()`/`unfavoriteArtwork()` - 使用 POST/DELETE
- `deleteArtwork()` - 从 POST 改为 DELETE

### 4. 评论 API 服务 (`src/services/api/comment.js`)

**主要变化：**
- `createComment()` - 参数从 URLSearchParams 改为 JSON body
- `deleteComment()` - 从 POST 改为 DELETE
- `getUserComments()` - 从 POST 改为 GET
- `getArtworkComments()` - 从 POST 改为 GET

### 5. 管理员 API 服务 (`src/services/api/admin.js`)

**主要变化：**
- 所有审核操作使用路径参数（如：`/api/v2/admin/community/contributions/:id/approve`）
- `unblockArtwork()`/`unblockUser()` - 从 POST 改为 DELETE
- `deleteComment()` - 从 POST 改为 DELETE

### 6. 请求拦截器 (`src/utils/request.js`)

**主要变化：**
- 更新白名单路径匹配逻辑，支持 v2 格式路径
- 支持前缀匹配（如：`/api/v2/search/` 可匹配所有搜索接口）

## HTTP 方法变更总结

| 操作类型 | v1 方法 | v2 方法 | 说明 |
|---------|---------|---------|------|
| 获取数据 | POST | **GET** | 遵循 REST 规范 |
| 更新数据 | POST | **PUT** | 遵循 REST 规范 |
| 删除数据 | POST | **DELETE** | 遵循 REST 规范 |
| 创建数据 | POST | POST | 保持不变 |

## 参数传递变更

| 场景 | v1 方式 | v2 方式 |
|------|---------|---------|
| ID 参数 | POST body (URLSearchParams) | **路径参数或查询参数** |
| JSON 数据 | URLSearchParams | **JSON body** |
| 文件上传 | FormData (POST) | FormData (POST) - 保持不变 |

## 后续步骤

### 1. 后端 API 开发
确保后端已实现所有 v2 API 端点，参考 `docs/api.md` 文档。

### 2. 测试建议

运行以下测试确保迁移成功：

#### a. 认证测试
- [ ] 用户登录
- [ ] 用户注册
- [ ] 密码重置

#### b. 用户功能测试
- [ ] 获取用户信息
- [ ] 更新用户信息
- [ ] 关注/取消关注用户
- [ ] 查看用户作品/点赞/收藏列表

#### c. 作品功能测试
- [ ] 浏览作品列表
- [ ] 查看作品详情
- [ ] 搜索作品（按 ID/名称/标签）
- [ ] 点赞/取消点赞作品
- [ ] 收藏/取消收藏作品
- [ ] 上传作品
- [ ] 删除作品

#### d. 评论功能测试
- [ ] 发表评论
- [ ] 删除评论
- [ ] 查看作品评论列表

#### e. 管理员功能测试
- [ ] 审核作品
- [ ] 封禁/解封作品
- [ ] 封禁/解封用户
- [ ] 删除评论

### 3. Mock 数据更新

如果使用 Mock 模式开发，需要更新 Mock 数据以匹配 v2 API 格式：
- 更新 Mock 路径匹配规则
- 更新响应数据结构

### 4. 环境配置

确保 `vue.config.js` 中的代理配置正确：

```javascript
proxy: {
  '/api': {
    target: 'http://localhost:8080', // 后端服务地址
    changeOrigin: true
  }
}
```

## 兼容性说明

- **系统管理员 API** 暂时保留 v1 格式（`/systemAdmin/*`），待后端实现 v2 版本后再迁移
- 白名单已配置为同时支持 v1 和 v2 路径

## 回滚方案

如果需要回滚到 v1 API，可以通过 Git 恢复以下文件：
```bash
git checkout HEAD~1 src/constants/api.js
git checkout HEAD~1 src/services/api/
git checkout HEAD~1 src/utils/request.js
```

## 注意事项

1. **URL 参数编码**：用户名等特殊字符已使用 `encodeURIComponent()` 进行编码
2. **Content-Type**：
   - JSON 数据：`application/json`（axios 默认）
   - FormData：自动设置 `multipart/form-data`
   - URLSearchParams：`application/x-www-form-urlencoded`（登录/注册）
3. **认证 Token**：所有需要认证的接口继续使用 `Authorization: Bearer <token>` 头

## 联系方式

如有问题，请查看：
- API 文档：`docs/api.md`
- 后端代码仓库
- 开发团队沟通渠道

---

**迁移完成时间**：2026-01-02
**迁移版本**：v1 → v2
