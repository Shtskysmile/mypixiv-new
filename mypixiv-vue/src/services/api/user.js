/**
 * User API Service (v2)
 * 用户相关的 API 接口封装
 */

import request from '@/utils/request';
import { API_ENDPOINTS } from '@/constants';

export default {
  /**
   * 用户登录
   * @param {string} username - 用户名
   * @param {string} password - 密码
   */
  login(username, password) {
    const params = new URLSearchParams();
    params.append('username', username);
    params.append('password', password);
    return request.post(API_ENDPOINTS.LOGIN, params);
  },

  /**
   * 用户注册
   * @param {FormData} formData - 包含注册信息的表单数据
   */
  register(formData) {
    return request.post(API_ENDPOINTS.REGISTER, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  /**
   * 获取用户信息
   * @param {string} userId - 用户ID
   */
  getUserInfo(userId) {
    return request.get(API_ENDPOINTS.USER_INFO(userId));
  },

  /**
   * 更新用户信息
   * @param {FormData} formData - 包含更新信息的表单数据
   */
  updateUserInfo(formData) {
    return request.put(API_ENDPOINTS.UPDATE_USER_INFO, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  /**
   * 关注用户
   * @param {string} concernedUserId - 被关注用户的ID
   */
  concernUser(concernedUserId) {
    return request.post(API_ENDPOINTS.FOLLOW_USER(concernedUserId));
  },

  /**
   * 取消关注用户
   * @param {string} concernedUserId - 取消关注用户的ID
   */
  unconcernUser(concernedUserId) {
    return request.delete(API_ENDPOINTS.UNFOLLOW_USER(concernedUserId));
  },

  /**
   * 获取用户的关注列表
   * @param {string} userId - 用户ID
   */
  getUserFollowing(userId) {
    return request.get(API_ENDPOINTS.USER_FOLLOWING(userId));
  },

  /**
   * 获取用户的粉丝列表
   * @param {string} userId - 用户ID
   */
  getUserFollowers(userId) {
    return request.get(API_ENDPOINTS.USER_FOLLOWERS(userId));
  },

  /**
   * 获取用户的作品列表
   * @param {string} userId - 用户ID
   * @param {string} status - 作品状态 (可选: 'pending', 'approved', 'dismissed')
   */
  getUserContributions(userId, status = null) {
    const url = API_ENDPOINTS.USER_CONTRIBUTIONS(userId);
    return request.get(url, {
      params: status ? { status } : {}
    });
  },

  /**
   * 获取我的作品列表（按审核状态）
   * @param {string} status - 作品状态 ('pending', 'approved', 'dismissed')
   */
  getMyContributions(status = null) {
    return request.get(API_ENDPOINTS.MY_CONTRIBUTIONS, {
      params: status ? { status } : {}
    });
  },

  /**
   * 获取用户点赞的作品列表
   * @param {string} userId - 用户ID
   */
  getUserLikes(userId) {
    return request.get(API_ENDPOINTS.USER_LIKES(userId));
  },

  /**
   * 获取用户收藏的作品列表
   * @param {string} userId - 用户ID
   */
  getUserFavorites(userId) {
    return request.get(API_ENDPOINTS.USER_FAVORITES(userId));
  },

  /**
   * 获取用户评论列表
   * @param {string} userId - 用户ID
   */
  getUserComments(userId) {
    return request.get(API_ENDPOINTS.USER_COMMENTS(userId));
  },

  /**
   * 获取用户密保问题
   * @param {string} username - 用户名
   */
  getSecurityIssues(username) {
    return request.get(API_ENDPOINTS.MY_SECURITY_ISSUES(username));
  },

  /**
   * 验证密保问题
   * @param {string} username - 用户名
   * @param {Object} answers - 密保问题答案 {question1: answer1, question2: answer2, question3: answer3}
   */
  verifySecurityIssues(username, answers) {
    return request.post(API_ENDPOINTS.VERIFY_SECURITY_ISSUES, {
      username,
      ...answers
    });
  },

  /**
   * 重置密码（找回密码）
   * @param {string} username - 用户名
   * @param {string} newPassword - 新密码
   */
  resetPassword(username, newPassword) {
    return request.put(API_ENDPOINTS.RESET_PASSWORD, {
      username,
      newPassword
    });
  },

  /**
   * 修改密码（登录态）
   * @param {string} oldPassword - 旧密码
   * @param {string} newPassword - 新密码
   */
  changePassword(oldPassword, newPassword) {
    return request.put(API_ENDPOINTS.CHANGE_PASSWORD, {
      oldPassword,
      newPassword
    });
  },

  /**
   * 修改密保问题
   * @param {Object} securityData - 密保问题数据
   */
  updateSecurityIssues(securityData) {
    return request.put(API_ENDPOINTS.UPDATE_SECURITY_ISSUES, securityData);
  }
};
