/**
 * API 接口路径常量 (v2 版本)
 * 基于 RESTful 设计规范
 *
 * 注意：
 * - request.js 的 baseURL 在开发环境下已经是 '/api'
 * - 所以这里的路径不需要 '/api' 前缀，只需要 '/v2/...'
 */

/**
 * API 版本前缀
 */
const API_V2_PREFIX = '/v2';

/**
 * API 端点常量
 * @readonly
 * @enum {string}
 */
export const API_ENDPOINTS = {
  // ========== 认证相关 (Auth) ==========
  /** 登录 */
  LOGIN: `${API_V2_PREFIX}/auth/login`,
  /** 注册 */
  REGISTER: `${API_V2_PREFIX}/auth/register`,

  // ========== 用户相关 (Users) ==========
  /** 获取用户信息 */
  USER_INFO: (userId) => `${API_V2_PREFIX}/users/${userId}`,
  /** 更新当前用户信息 */
  UPDATE_USER_INFO: `${API_V2_PREFIX}/users/me`,
  /** 获取用户作品列表 */
  USER_CONTRIBUTIONS: (userId) => `${API_V2_PREFIX}/users/${userId}/contributions`,
  /** 获取用户点赞列表 */
  USER_LIKES: (userId) => `${API_V2_PREFIX}/users/${userId}/likes`,
  /** 获取用户收藏列表 */
  USER_FAVORITES: (userId) => `${API_V2_PREFIX}/users/${userId}/favorites`,
  /** 获取用户关注列表 */
  USER_FOLLOWING: (userId) => `${API_V2_PREFIX}/users/${userId}/following`,
  /** 获取用户粉丝列表 */
  USER_FOLLOWERS: (userId) => `${API_V2_PREFIX}/users/${userId}/followers`,
  /** 获取用户评论列表 */
  USER_COMMENTS: (userId) => `${API_V2_PREFIX}/users/${userId}/comments`,
  /** 获取我的作品（按审核状态） */
  MY_CONTRIBUTIONS: `${API_V2_PREFIX}/users/me/contributions`,

  // ========== 密码和安全 ==========
  /** 获取用户密保问题 */
  MY_SECURITY_ISSUES: (username) => `${API_V2_PREFIX}/users/security-issues?username=${encodeURIComponent(username)}`,
  /** 验证密保问题 */
  VERIFY_SECURITY_ISSUES: `${API_V2_PREFIX}/users/security-issues/verify`,
  /** 重置密码（找回密码） */
  RESET_PASSWORD: `${API_V2_PREFIX}/users/password`,
  /** 修改密码（登录态） */
  CHANGE_PASSWORD: `${API_V2_PREFIX}/users/me/password`,
  /** 修改密保问题 */
  UPDATE_SECURITY_ISSUES: `${API_V2_PREFIX}/users/me/security-issues`,

  // ========== 关注相关 ==========
  /** 关注用户 */
  FOLLOW_USER: (targetUserId) => `${API_V2_PREFIX}/users/me/following?concernedUserId=${targetUserId}`,
  /** 取消关注用户 */
  UNFOLLOW_USER: (targetUserId) => `${API_V2_PREFIX}/users/me/following/${targetUserId}`,

  // ========== 作品相关 (Contributions) ==========
  /** 获取所有作品列表 */
  ALL_CONTRIBUTIONS: `${API_V2_PREFIX}/contributions`,
  /** 获取插画列表 */
  ILLUSTRATIONS: `${API_V2_PREFIX}/illustrations`,
  /** 获取漫画列表 */
  MANGAS: `${API_V2_PREFIX}/mangas`,
  /** 获取作品详情 */
  CONTRIBUTION_DETAIL: (contributionId) => `${API_V2_PREFIX}/contributions/${contributionId}`,
  /** 获取待审核作品详情 */
  PENDING_CONTRIBUTION: (contributionId) => `${API_V2_PREFIX}/contributions/${contributionId}/pending`,
  /** 获取作品排行榜 */
  CONTRIBUTION_RANKING: `${API_V2_PREFIX}/contributions/ranking`,

  // ========== 上传作品 ==========
  /** 上传作品 */
  UPLOAD_CONTRIBUTION: `${API_V2_PREFIX}/users/me/contributions`,

  // ========== 删除作品 ==========
  /** 删除我的作品 */
  DELETE_CONTRIBUTION: (contributionId) => `${API_V2_PREFIX}/users/me/contributions/${contributionId}`,
  /** 删除待审核作品 */
  DELETE_PENDING_CONTRIBUTION: (contributionId) => `${API_V2_PREFIX}/users/me/contributions/${contributionId}/pending`,
  /** 删除被驳回作品 */
  DELETE_DISMISSED_CONTRIBUTION: (contributionId) => `${API_V2_PREFIX}/users/me/contributions/${contributionId}/dismissed`,

  // ========== 点赞和收藏 ==========
  /** 点赞作品 */
  LIKE_CONTRIBUTION: (contributionId) => `${API_V2_PREFIX}/users/me/likes?contributionId=${contributionId}`,
  /** 取消点赞作品 */
  UNLIKE_CONTRIBUTION: (contributionId) => `${API_V2_PREFIX}/users/me/likes/${contributionId}`,
  /** 收藏作品 */
  FAVORITE_CONTRIBUTION: (contributionId) => `${API_V2_PREFIX}/users/me/favorites?contributionId=${contributionId}`,
  /** 取消收藏作品 */
  UNFAVORITE_CONTRIBUTION: (contributionId) => `${API_V2_PREFIX}/users/me/favorites/${contributionId}`,

  // ========== 评论相关 ==========
  /** 评论作品 */
  COMMENT_CONTRIBUTION: (contributionId) => `${API_V2_PREFIX}/contributions/${contributionId}/comments`,
  /** 删除我的评论 */
  DELETE_MY_COMMENT: (commentId) => `${API_V2_PREFIX}/users/me/comments/${commentId}`,

  // ========== 搜索 ==========
  /** 通过 ID 搜索 */
  SEARCH_BY_ID: `${API_V2_PREFIX}/search/by-id`,
  /** 通过名称搜索 */
  SEARCH_BY_NAME: `${API_V2_PREFIX}/search/by-name`,
  /** 通过标签搜索 */
  SEARCH_BY_TAG: `${API_V2_PREFIX}/search/by-tag`,

  // ========== 社区管理员相关 ==========
  /** 获取待审核作品列表 */
  AUDIT_CONTRIBUTIONS: `${API_V2_PREFIX}/admin/community/contributions/audits`,
  /** 审核通过作品 */
  APPROVE_CONTRIBUTION: (contributionId) => `${API_V2_PREFIX}/admin/community/contributions/${contributionId}/approve`,
  /** 驳回作品 */
  DISMISS_CONTRIBUTION: (contributionId) => `${API_V2_PREFIX}/admin/community/contributions/${contributionId}/dismiss`,
  /** 封禁作品 */
  BLOCK_CONTRIBUTION: (contributionId) => `${API_V2_PREFIX}/admin/community/contributions/${contributionId}/block`,
  /** 解封作品 */
  UNBLOCK_CONTRIBUTION: (contributionId) => `${API_V2_PREFIX}/admin/community/contributions/${contributionId}/block`,
  /** 获取已封禁作品列表 */
  BLOCKED_CONTRIBUTIONS: `${API_V2_PREFIX}/admin/community/contributions/blocked`,
  /** 获取已封禁作品详情 */
  BLOCKED_CONTRIBUTION_DETAIL: (contributionId) => `${API_V2_PREFIX}/admin/community/contributions/${contributionId}/blocked`,
  /** 封禁用户 */
  BLOCK_USER: (userId) => `${API_V2_PREFIX}/admin/community/users/${userId}/block`,
  /** 解封用户 */
  UNBLOCK_USER: (userId) => `${API_V2_PREFIX}/admin/community/users/${userId}/block`,
  /** 获取已封禁用户列表 */
  BLOCKED_USERS: `${API_V2_PREFIX}/admin/community/users/blocked`,
  /** 删除评论（管理员） */
  DELETE_COMMENT_ADMIN: (commentId) => `${API_V2_PREFIX}/admin/community/comments/${commentId}`,

  // ========== 系统管理员相关（暂未实现 v2，保留 v1） ==========
  /** 获取所有用户 */
  GET_ALL_USERS: '/systemAdmin/getAllUsers',
  /** 设置用户角色 */
  SET_USER_ROLE: '/systemAdmin/setUserRole',
  /** 更新任意用户信息 */
  ADMIN_UPDATE_USER_INFO: '/systemAdmin/updateUserInfo',
  /** 重置任意用户密码 */
  ADMIN_RESET_PASSWORD: '/systemAdmin/resetPassword',
  /** 查看系统日志 */
  ADMIN_SYSTEM_LOGS: '/systemAdmin/logs'
};

/**
 * 不需要认证的 API 白名单
 * @type {string[]}
 */
export const NO_AUTH_APIS = [
  API_ENDPOINTS.LOGIN,
  API_ENDPOINTS.REGISTER,
  // 密保问题接口（需要username参数，但不需要认证）
  `${API_V2_PREFIX}/users/security-issues`,
  API_ENDPOINTS.VERIFY_SECURITY_ISSUES,
  API_ENDPOINTS.RESET_PASSWORD,
  API_ENDPOINTS.ILLUSTRATIONS,
  API_ENDPOINTS.MANGAS,
  API_ENDPOINTS.ALL_CONTRIBUTIONS,
  // 搜索接口
  API_ENDPOINTS.SEARCH_BY_ID,
  API_ENDPOINTS.SEARCH_BY_NAME,
  API_ENDPOINTS.SEARCH_BY_TAG,
  // 作品排行榜
  API_ENDPOINTS.CONTRIBUTION_RANKING
];
