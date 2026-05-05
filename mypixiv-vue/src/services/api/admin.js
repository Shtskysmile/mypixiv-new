/**
 * Admin API Service (v2)
 * 管理员相关的 API 接口封装
 */

import request from '@/utils/request';
import { API_ENDPOINTS } from '@/constants';

export default {
  /**
   * 获取待审核作品列表（社区管理员）
   */
  getPendingArtworks() {
    return request.get(API_ENDPOINTS.AUDIT_CONTRIBUTIONS);
  },

  /**
   * 审核通过作品（社区管理员）
   * @param {string} contributionId - 作品ID
   */
  approveArtwork(contributionId) {
    return request.post(API_ENDPOINTS.APPROVE_CONTRIBUTION(contributionId));
  },

  /**
   * 驳回作品（社区管理员）
   * @param {string} contributionId - 作品ID
   * @param {string} dismissalReason - 驳回原因
   */
  dismissArtwork(contributionId, dismissalReason) {
    return request.post(API_ENDPOINTS.DISMISS_CONTRIBUTION(contributionId), {
      dismissalReason
    });
  },

  /**
   * 封禁作品（社区管理员）
   * @param {string} contributionId - 作品ID
   */
  blockArtwork(contributionId) {
    return request.post(API_ENDPOINTS.BLOCK_CONTRIBUTION(contributionId));
  },

  /**
   * 解封作品（社区管理员）
   * @param {string} contributionId - 作品ID
   */
  unblockArtwork(contributionId) {
    return request.delete(API_ENDPOINTS.UNBLOCK_CONTRIBUTION(contributionId));
  },

  /**
   * 封禁用户（社区管理员）
   * @param {string} userId - 用户ID
   */
  blockUser(userId) {
    return request.post(API_ENDPOINTS.BLOCK_USER(userId));
  },

  /**
   * 解封用户（社区管理员）
   * @param {string} userId - 用户ID
   */
  unblockUser(userId) {
    return request.delete(API_ENDPOINTS.UNBLOCK_USER(userId));
  },

  /**
   * 删除评论（管理员）
   * @param {string} commentId - 评论ID
   */
  deleteComment(commentId) {
    return request.delete(API_ENDPOINTS.DELETE_COMMENT_ADMIN(commentId));
  },

  /**
   * 获取已封禁作品列表（社区管理员）
   */
  getBlockedArtworks() {
    return request.get(API_ENDPOINTS.BLOCKED_CONTRIBUTIONS);
  },

  /**
   * 获取已封禁用户列表（社区管理员）
   */
  getBlockedUsers() {
    return request.get(API_ENDPOINTS.BLOCKED_USERS);
  },

  /**
   * 获取所有用户列表（系统管理员）
   */
  getAllUsers() {
    return request.get(API_ENDPOINTS.GET_ALL_USERS);
  },

  /**
   * 设置用户角色（系统管理员）
   * @param {string} userId - 用户ID
   * @param {number} role - 角色 (0: 普通用户, 1: 社区管理员, 2: 系统管理员)
   */
  setUserRole(userId, role) {
    const params = new URLSearchParams();
    params.append('userId', userId);
    params.append('role', role);
    return request.post(API_ENDPOINTS.SET_USER_ROLE, params);
  }
};
