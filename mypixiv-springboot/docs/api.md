# MyPixiv SpringBoot API 文档

> 版本：v1（兼容旧接口） / v2（RESTful 新接口）
>
> 本文档为“手写 Markdown”版本，用于在不依赖 OpenAPI 导出能力的情况下，提供稳定的接口说明。

---

## 1. 基本约定

### 1.1 Base URL
- v1（兼容旧接口）：`/api/v1`
- v2（RESTful 新接口）：`/api/v2`

> 说明：当前代码中旧接口仍以根路径形式存在（例如 `/login`、`/register`）。后续重构将逐步把旧接口“搬迁/映射”为 `/api/v1/**`，同时新增 `/api/v2/**`。

### 1.2 认证（Authorization）
- Header：`Authorization`
- Token 格式（建议统一）：
  - `Bearer <token>`

> 备注：当前项目部分接口直接读取 `Authorization` 并解析 token；拦截器 `JwtInterceptor` 也支持 `Bearer ` 前缀。后续重构会统一 token 处理方式。

### 1.3 统一响应结构
项目统一返回：`Result<T>`

```json
{
  "code": 0,
  "message": "操作成功",
  "data": {}
}
```

- `code = 0`：成功
- `code = 1`：失败（业务失败/校验失败等）

### 1.4 常见 HTTP 状态码
- `200`：接口正常返回（注意：即使业务失败也可能返回 200，并在 body 中用 `code=1` 表示）
- `401`：未认证/Token 无效（由 JWT 拦截器返回）

### 1.5 角色与权限（现状）
当前通过 JWT 拦截器按路径进行权限划分：
- 普通用户接口：`/user/**`
- 系统管理员接口：`/systemAdmin/**`
- 社区管理员接口：`/communityAdmin/**`

> v2 会将这些接口迁移为 `/api/v2/admin/**` 体系，并按“资源 + 动作”重新组织。

---

## 2. v2 RESTful 接口（规划稿）

> 本节是 v2 的目标 RESTful 设计稿。后续落地时将以此为准逐个实现 Controller。

### 2.1 Auth（认证）

#### 2.1.1 注册
- **POST** `/api/v2/auth/register`
- Content-Type：`multipart/form-data`

表单字段：
- `username` (string) 必填
- `password` (string) 必填
- `gender` (int) 必填
- `SecurityIssues` (json array，可选) 说明：与现有接口保持一致
- `avatar` (file，可选)

响应：
```json
{ "code": 0, "message": "操作成功", "data": "注册成功" }
```

#### 2.1.2 登录
- **POST** `/api/v2/auth/login`
- Content-Type：`application/x-www-form-urlencoded` 或 `application/json`（实现时建议统一为 JSON）

参数：
- `username`
- `password`

响应（示例，字段以现有 `R_LoginDTO` 为准）：
```json
{
  "code": 0,
  "message": "操作成功",
  "data": {
    "token": "...",
    "user": { }
  }
}
```

#### 2.1.3 找回密码：获取密保题目
- **GET** `/api/v2/users/security-issues?username={username}`

响应：
```json
{ "code": 0, "message": "操作成功", "data": ["问题1", "问题2"] }
```

#### 2.1.4 找回密码：验证密保
- **POST** `/api/v2/users/security-issues/verify`
- Content-Type：`multipart/form-data`

参数：
- `username` (string)
- `SecurityIssues` (json array) - 回答列表

响应（`R_VerifySecurityIssuesDTO`）：
```json
{
  "code": 0,
  "message": "操作成功",
  "data": {
    "verified": true,
    "tempToken": "..."
  }
}
```

#### 2.1.5 找回密码：重置密码
- **PUT** `/api/v2/users/password`
- Header：`Authorization: Bearer <tempToken>`

参数：
- `username` (string)
- `newPassword` (string)

响应：
```json
{ "code": 0, "message": "操作成功", "data": "密码修改成功" }
```

#### 2.1.6 登录态：修改密码
- **PUT** `/api/v2/users/me/password`
- Header：`Authorization: Bearer <token>`

参数：
- `oldPassword` (string)
- `newPassword` (string)

响应：
```json
{ "code": 0, "message": "操作成功", "data": "密码修改成功" }
```

---

### 2.2 Users（用户）

#### 2.2.1 获取用户信息
- **GET** `/api/v2/users/{userId}`
- Header：`Authorization: Bearer <token>`（用于计算关注状态、权限等）

响应：`R_UserInfoDTO`

#### 2.2.2 获取用户作品列表
- **GET** `/api/v2/users/{userId}/contributions`

响应：`List<R_OverviewContribution>`

#### 2.2.3 获取用户点赞列表
- **GET** `/api/v2/users/{userId}/likes`

响应：`List<R_OverviewContribution>`

#### 2.2.4 获取用户收藏列表
- **GET** `/api/v2/users/{userId}/favorites`

响应：`List<R_OverviewContribution>`

#### 2.2.5 获取用户关注列表（following）
- **GET** `/api/v2/users/{userId}/following`

响应：`List<R_User>`

#### 2.2.6 获取用户评论列表
- **GET** `/api/v2/users/{userId}/comments`

响应：`List<R_UserComment>`

#### 2.2.7 登录用户：我的投稿（按审核状态聚合）
- **GET** `/api/v2/users/me/contributions`
- Header：`Authorization: Bearer <token>`

响应：`R_Audit_My_ContributionsDTO`

#### 2.2.8 登录用户：更新个人信息
- **PUT** `/api/v2/users/me`
- Content-Type：`multipart/form-data`

表单字段：
- `newUsername` (string)
- `newGender` (int)
- `newAvatar` (file，可选)

响应：
```json
{ "code": 0, "message": "操作成功", "data": "更新成功" }
```

#### 2.2.9 登录用户：修改密保
- **PUT** `/api/v2/users/me/security-issues`
- Header：`Authorization: Bearer <token>`
- Content-Type：`multipart/form-data`

表单字段：
- `SecurityIssues` (json array)

响应：
```json
{ "code": 0, "message": "操作成功", "data": "密保问题修改成功" }
```

#### 2.2.10 登录用户：关注/取关
- **POST** `/api/v2/users/me/following?concernedUserId={targetUserId}`
- **DELETE** `/api/v2/users/me/following/{targetUserId}`
- Header：`Authorization: Bearer <token>`

响应：
```json
{ "code": 0, "message": "操作成功", "data": "关注成功" }
```

#### 2.2.11 登录用户：删除我的评论
- **DELETE** `/api/v2/users/me/comments/{commentId}`
- Header：`Authorization: Bearer <token>`

响应：
```json
{ "code": 0, "message": "操作成功", "data": "删除评论成功" }
```

#### 2.2.12 登录用户：删除我的作品
- **DELETE** `/api/v2/users/me/contributions/{contributionId}`
- Header：`Authorization: Bearer <token>`

响应：
```json
{ "code": 0, "message": "操作成功", "data": "删除作品成功" }
```

#### 2.2.13 登录用户：删除我待审核的作品
- **DELETE** `/api/v2/users/me/contributions/{contributionId}/pending`
- Header：`Authorization: Bearer <token>`

响应：
```json
{ "code": 0, "message": "操作成功", "data": "删除待审核作品成功" }
```

#### 2.2.14 登录用户：删除我被驳回的作品
- **DELETE** `/api/v2/users/me/contributions/{contributionId}/dismissed`
- Header：`Authorization: Bearer <token>`

响应：
```json
{ "code": 0, "message": "操作成功", "data": "删除被驳回作品成功" }
```

---

### 2.3 Contributions（作品）

#### 2.3.1 插画列表
- **GET** `/api/v2/illustrations`

响应：`List<R_OverviewContribution>`

#### 2.3.2 漫画列表
- **GET** `/api/v2/mangas`

响应：`List<R_OverviewContribution>`

#### 2.3.3 所有作品列表
- **GET** `/api/v2/contributions`

响应：`List<R_OverviewContribution>`

#### 2.3.4 作品详情
- **GET** `/api/v2/contributions/{contributionId}`
- Header：`Authorization: Bearer <token>`（用于是否点赞/收藏等个性化字段）

响应：`R_ContributionDTO`

#### 2.3.5 待审核作品详情
- **GET** `/api/v2/contributions/{contributionId}/pending`
- Header：`Authorization: Bearer <token>`

响应：`R_Contribution`

> 说明：此接口用于查看待审核状态的作品详情，需要用户身份认证以验证权限。

#### 2.3.6 作品排行榜
- **GET** `/api/v2/contributions/ranking?type={type}&key={key}`

Query 参数：
- `type` (int) - 作品类型（0=插画, 1=漫画, 2=全部）
- `key` (int) - 排行榜类型（0=点赞数, 1=收藏数, 2=评论数）

响应：`List<R_OverviewContribution>`

#### 2.3.7 上传作品
- **POST** `/api/v2/users/me/contributions`
- Header：`Authorization: Bearer <token>`
- Content-Type：`multipart/form-data`

表单字段：
- `title` (string)
- `type` (int)
- `description` (string)
- `tags` (json array，可选)
- `images` (file list)

响应：
```json
{ "code": 0, "message": "操作成功", "data": "上传成功" }
```

#### 2.3.8 点赞/取消点赞
- **POST** `/api/v2/users/me/likes?contributionId={contributionId}`
- **DELETE** `/api/v2/users/me/likes/{contributionId}`
- Header：`Authorization: Bearer <token>`

响应：
```json
{ "code": 0, "message": "操作成功", "data": "点赞成功" }
```

#### 2.3.9 收藏/取消收藏
- **POST** `/api/v2/users/me/favorites?contributionId={contributionId}`
- **DELETE** `/api/v2/users/me/favorites/{contributionId}`
- Header：`Authorization: Bearer <token>`

响应：
```json
{ "code": 0, "message": "操作成功", "data": "收藏成功" }
```

#### 2.3.10 评论作品
- **POST** `/api/v2/contributions/{contributionId}/comments`
- Header：`Authorization: Bearer <token>`

参数：
- `comment` (string)

响应：
```json
{ "code": 0, "message": "操作成功", "data": "评论成功" }
```

---

### 2.4 Search（搜索）

#### 2.4.1 通过 ID 搜索
- **GET** `/api/v2/search/by-id?keyword={keyword}`

响应：`R_SearchDTO`

#### 2.4.2 通过名称搜索
- **GET** `/api/v2/search/by-name?keyword={keyword}`

响应：`R_SearchDTO`

#### 2.4.3 通过标签搜索
- **GET** `/api/v2/search/by-tag?keyword={keyword}`

响应：`R_SearchDTO`

> 说明：删除评论的功能已整合到用户模块（见 2.2.11）和管理员模块（见 2.5.2.8）。

---

### 2.5 Admin（后台管理：SystemAdmin / CommunityAdmin）

> 目标：将现有 `/systemAdmin/**` 与 `/communityAdmin/**` 迁移为 v2 的统一后台域：`/api/v2/admin/**`。
>
> 注意：这里的"系统管理员 / 社区管理员"是两类不同权限。

#### 2.5.1 系统管理员（System Admin）

> **重要提示：系统管理员的 v2 接口尚未实现。** 以下接口仍在规划中，目前请使用 v1 接口。
>
> 规划接口：

##### 2.5.1.1 更新任意用户信息
- **PUT** `/api/v2/admin/system/users/{userId}`（规划中）
- Content-Type：`multipart/form-data`

表单字段：
- `newUsername` (string)
- `newGender` (int)
- `newAvatar` (file，可选)

对应旧接口：`POST /systemAdmin/updateUserInfo`

##### 2.5.1.2 重置任意用户密码
- **POST** `/api/v2/admin/system/users/{userId}/password/reset`（规划中）

对应旧接口：`POST /systemAdmin/resetPassword`

##### 2.5.1.3 查看系统日志
- **GET** `/api/v2/admin/system/logs`（规划中）

对应旧接口：`GET /systemAdmin/logs`

---

#### 2.5.2 社区管理员（Community Admin）

##### 2.5.2.1 封禁/解封用户
- **POST** `/api/v2/admin/community/users/{userId}/block`
- **DELETE** `/api/v2/admin/community/users/{userId}/block`

响应：
```json
{ "code": 0, "message": "操作成功", "data": "封禁用户成功" }
```

对应旧接口：
- `POST /communityAdmin/blockUser`
- `POST /communityAdmin/unblockUser`

##### 2.5.2.2 获取被封禁用户列表
- **GET** `/api/v2/admin/community/users/blocked`

响应：`List<R_User>`

对应旧接口：`GET /communityAdmin/blockedUsers`

##### 2.5.2.3 封禁/解封作品
- **POST** `/api/v2/admin/community/contributions/{contributionId}/block`
- **DELETE** `/api/v2/admin/community/contributions/{contributionId}/block`

响应：
```json
{ "code": 0, "message": "操作成功", "data": "封禁作品成功" }
```

对应旧接口：
- `POST /communityAdmin/blockContribution`
- `POST /communityAdmin/unblockContribution`

##### 2.5.2.4 获取被封禁作品列表
- **GET** `/api/v2/admin/community/contributions/blocked`

响应：`List<R_OverviewContribution>`

对应旧接口：`GET /communityAdmin/blockedContributions`

##### 2.5.2.5 查看被封禁作品详情
- **GET** `/api/v2/admin/community/contributions/{contributionId}/blocked`

响应：`R_Contribution`

对应旧接口：`POST /communityAdmin/bannedContribution`

##### 2.5.2.6 审核投稿列表
- **GET** `/api/v2/admin/community/contributions/audits`

响应：`R_Audit_My_ContributionsDTO`

对应旧接口：`GET /communityAdmin/auditContributions`

##### 2.5.2.7 审核通过/驳回作品
- **POST** `/api/v2/admin/community/contributions/{contributionId}/approve`
- **POST** `/api/v2/admin/community/contributions/{contributionId}/dismiss`

驳回请求参数：
- `dismissalReason` (string)

响应：
```json
{ "code": 0, "message": "操作成功", "data": "已通过审核" }
```

对应旧接口：
- `POST /communityAdmin/approveContribution`
- `POST /communityAdmin/dismissContribution`

##### 2.5.2.8 删除任意评论
- **DELETE** `/api/v2/admin/community/comments/{commentId}`

响应：
```json
{ "code": 0, "message": "操作成功", "data": "删除评论成功" }
```

对应旧接口：`POST /communityAdmin/deleteComment`

---

## 3. v1 兼容接口（现有接口对照表）

> 这里列出已存在的部分旧接口与 v2 的对应关系，便于迁移。

| 旧接口 | 方法 | v2 对应接口 |
|---|---:|---|
| `/register` | POST | `/api/v2/auth/register` |
| `/login` | POST | `/api/v2/auth/login` |
| `/mySecurityIssues` | POST | `/api/v2/users/security-issues` (GET) |
| `/verifySecurityIssues` | POST | `/api/v2/users/security-issues/verify` |
| `/updatePassword` | POST | `/api/v2/users/password` (PUT) |
| `/changePassword` | POST | `/api/v2/users/me/password` (PUT) |
| `/illustrations` | GET | `/api/v2/illustrations` |
| `/mangas` | GET | `/api/v2/mangas` |
| `/allContributions` | GET | `/api/v2/contributions` |
| `/contribution` | POST | `/api/v2/contributions/{id}` (GET) |
| `/contributionsRanking` | POST | `/api/v2/contributions/ranking` (GET) |
| `/searchById` | POST | `/api/v2/search/by-id` (GET) |
| `/searchByName` | POST | `/api/v2/search/by-name` (GET) |
| `/searchByTag` | POST | `/api/v2/search/by-tag` (GET) |

### 3.1 管理员接口对照

| 旧接口 | 方法 | v2 对应接口 | 状态 |
|---|---:|---|:---:|
| `/systemAdmin/updateUserInfo` | POST | `PUT /api/v2/admin/system/users/{userId}` | ⚠️ 未实现 |
| `/systemAdmin/resetPassword` | POST | `POST /api/v2/admin/system/users/{userId}/password/reset` | ⚠️ 未实现 |
| `/systemAdmin/logs` | GET | `GET /api/v2/admin/system/logs` | ⚠️ 未实现 |
| `/communityAdmin/blockUser` | POST | `POST /api/v2/admin/community/users/{userId}/block` | ✅ 已实现 |
| `/communityAdmin/unblockUser` | POST | `DELETE /api/v2/admin/community/users/{userId}/block` | ✅ 已实现 |
| `/communityAdmin/blockedUsers` | GET | `GET /api/v2/admin/community/users/blocked` | ✅ 已实现 |
| `/communityAdmin/blockContribution` | POST | `POST /api/v2/admin/community/contributions/{contributionId}/block` | ✅ 已实现 |
| `/communityAdmin/unblockContribution` | POST | `DELETE /api/v2/admin/community/contributions/{contributionId}/block` | ✅ 已实现 |
| `/communityAdmin/blockedContributions` | GET | `GET /api/v2/admin/community/contributions/blocked` | ✅ 已实现 |
| `/communityAdmin/bannedContribution` | POST | `GET /api/v2/admin/community/contributions/{contributionId}/blocked` | ✅ 已实现 |
| `/communityAdmin/auditContributions` | GET | `GET /api/v2/admin/community/contributions/audits` | ✅ 已实现 |
| `/communityAdmin/approveContribution` | POST | `POST /api/v2/admin/community/contributions/{contributionId}/approve` | ✅ 已实现 |
| `/communityAdmin/dismissContribution` | POST | `POST /api/v2/admin/community/contributions/{contributionId}/dismiss` | ✅ 已实现 |
| `/communityAdmin/deleteComment` | POST | `DELETE /api/v2/admin/community/comments/{commentId}` | ✅ 已实现 |

---

## 4. 备注

### 4.1 实现状态
- ✅ **v2 认证模块**：已实现（路径为 `/api/v2/auth` 和 `/api/v2/users`）
- ✅ **v2 用户模块**：已实现（路径为 `/api/v2/users`）
- ✅ **v2 作品模块**：已实现（路径为 `/api/v2/contributions` 和 `/api/v2/illustrations` 等）
- ✅ **v2 搜索模块**：已实现（路径为 `/api/v2/search`）
- ✅ **v2 社区管理员模块**：已实现（路径为 `/api/v2/admin/community`）
- ⚠️ **v2 系统管理员模块**：尚未实现，请继续使用 v1 接口

### 4.2 路径设计说明
v2 实际实现采用了以下路径设计原则：
1. **用户相关操作统一前缀**：所有需要当前登录用户身份的操作（如点赞、收藏、上传作品等）统一使用 `/api/v2/users/me` 作为路径前缀
2. **独立资源路径**：插画和漫画使用独立路径 `/api/v2/illustrations` 和 `/api/v2/mangas`，而非通过 query 参数区分
3. **搜索接口分离**：搜索接口使用 `/api/v2/search/by-{type}` 的独立路径，而非统一的 query 参数方式
4. **密保相关接口归属**：密保相关接口归属于用户模块 `/api/v2/users/security-issues`，而非认证模块

### 4.3 后续工作
- v2 的实现会优先"新建 Controller（v2）+ 复用 Service"，v1 旧接口保留一段时间用于兼容。
- 当前响应结构仍使用 `Result<T>`，后续如要更标准化（HTTP status + problem details），需要统一异常处理与返回策略。
- 待实现：系统管理员 v2 接口（`/api/v2/admin/system/**`）
