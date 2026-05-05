/**
 * Artwork API Service (v2)
 * 作品相关的 API 接口封装
 */

import request from '@/utils/request';
import { API_ENDPOINTS } from '@/constants';

export default {
  /**
   * 获取所有作品
   */
  getAllArtworks() {
    return request.get(API_ENDPOINTS.ALL_CONTRIBUTIONS);
  },

  /**
   * 获取作品详情
   * @param {string} contributionId - 作品ID
   * @param {boolean} isPending - 是否是待审核作品
   * @param {boolean} isBlocked - 是否是已封禁作品
   */
  getArtworkDetail(contributionId, isPending = false, isBlocked = false) {
    if (isPending) {
      return request.get(API_ENDPOINTS.PENDING_CONTRIBUTION(contributionId));
    } else if (isBlocked) {
      return request.get(API_ENDPOINTS.BLOCKED_CONTRIBUTION_DETAIL(contributionId));
    } else {
      return request.get(API_ENDPOINTS.CONTRIBUTION_DETAIL(contributionId));
    }
  },

  /**
   * 搜索作品
   * @param {string} keyword - 搜索关键词
   * @param {string} type - 搜索类型 (id/name/tag)
   */
  searchArtworks(keyword, type) {
    let endpoint;
    switch (type) {
      case 'id':
        endpoint = API_ENDPOINTS.SEARCH_BY_ID;
        break;
      case 'name':
        endpoint = API_ENDPOINTS.SEARCH_BY_NAME;
        break;
      case 'tag':
        endpoint = API_ENDPOINTS.SEARCH_BY_TAG;
        break;
      default:
        endpoint = API_ENDPOINTS.SEARCH_BY_NAME;
    }
    return request.get(endpoint, {
      params: { keyword }
    });
  },

  /**
   * 获取插画列表
   */
  getIllustrations() {
    return request.get(API_ENDPOINTS.ILLUSTRATIONS);
  },

  /**
   * 获取漫画列表
   */
  getMangas() {
    return request.get(API_ENDPOINTS.MANGAS);
  },

  /**
   * 获取作品排行榜
   */
  getRanking() {
    return request.get(API_ENDPOINTS.CONTRIBUTION_RANKING);
  },

  /**
   * 点赞作品
   * @param {string} contributionId - 作品ID
   */
  likeArtwork(contributionId) {
    return request.post(API_ENDPOINTS.LIKE_CONTRIBUTION(contributionId));
  },

  /**
   * 取消点赞作品
   * @param {string} contributionId - 作品ID
   */
  unlikeArtwork(contributionId) {
    return request.delete(API_ENDPOINTS.UNLIKE_CONTRIBUTION(contributionId));
  },

  /**
   * 收藏作品
   * @param {string} contributionId - 作品ID
   */
  favoriteArtwork(contributionId) {
    return request.post(API_ENDPOINTS.FAVORITE_CONTRIBUTION(contributionId));
  },

  /**
   * 取消收藏作品
   * @param {string} contributionId - 作品ID
   */
  unfavoriteArtwork(contributionId) {
    return request.delete(API_ENDPOINTS.UNFAVORITE_CONTRIBUTION(contributionId));
  },

  /**
   * 上传作品
   * @param {FormData} formData - 包含作品信息的表单数据
   */
  uploadArtwork(formData) {
    return request.post(API_ENDPOINTS.UPLOAD_CONTRIBUTION, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  /**
   * 删除作品
   * @param {string} contributionId - 作品ID
   * @param {string} status - 作品状态 ('approved', 'pending', 'dismissed')
   */
  deleteArtwork(contributionId, status = 'approved') {
    let endpoint;
    switch (status) {
      case 'pending':
        endpoint = API_ENDPOINTS.DELETE_PENDING_CONTRIBUTION(contributionId);
        break;
      case 'dismissed':
        endpoint = API_ENDPOINTS.DELETE_DISMISSED_CONTRIBUTION(contributionId);
        break;
      default:
        endpoint = API_ENDPOINTS.DELETE_CONTRIBUTION(contributionId);
    }
    return request.delete(endpoint);
  }
};
