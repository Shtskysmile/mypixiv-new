/**
 * API Services Index
 * 统一导出所有 API 服务
 */

import userApi from './api/user';
import artworkApi from './api/artwork';
import commentApi from './api/comment';
import adminApi from './api/admin';

export default {
  user: userApi,
  artwork: artworkApi,
  comment: commentApi,
  admin: adminApi
};

// 也可以分别导出
export { userApi, artworkApi, commentApi, adminApi };
