/**
 * Comment API Service (v2)
 * 评论相关的 API 接口封装
 */

import request from '@/utils/request';
import { API_ENDPOINTS } from '@/constants';

export default {
  /**
   * 发表评论
   * @param {string} contributionId - 作品ID
   * @param {string} content - 评论内容
   */
  createComment(contributionId, content) {
    return request.post(API_ENDPOINTS.COMMENT_CONTRIBUTION(contributionId), {
      content
    });
  },

  /**
   * 删除评论（用户删除自己的评论）
   * @param {string} commentId - 评论ID
   */
  deleteComment(commentId) {
    return request.delete(API_ENDPOINTS.DELETE_MY_COMMENT(commentId));
  },

  /**
   * 获取用户的评论列表
   * @param {string} userId - 用户ID
   */
  getUserComments(userId) {
    return request.get(API_ENDPOINTS.USER_COMMENTS(userId));
  },

  /**
   * 获取作品的评论列表
   * @param {string} contributionId - 作品ID
   */
  getArtworkComments(contributionId) {
    return request.get(API_ENDPOINTS.COMMENT_CONTRIBUTION(contributionId));
  }
};
