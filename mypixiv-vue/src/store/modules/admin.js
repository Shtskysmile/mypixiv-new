/**
 * Admin Vuex Module
 * 管理员功能状态管理模块
 */

import { API_ENDPOINTS } from '@/constants';
import request from '@/utils/request';

const state = {
  // 待审核作品
  pendingArtworks: [],

  // 已封禁作品
  blockedArtworks: [],

  // 已封禁用户
  blockedUsers: [],

  // 所有用户（系统管理员）
  allUsers: [],

  // 加载状态
  loading: false
};

const getters = {
  // 获取待审核作品
  pendingArtworks: state => state.pendingArtworks,

  // 获取已封禁作品
  blockedArtworks: state => state.blockedArtworks,

  // 获取已封禁用户
  blockedUsers: state => state.blockedUsers,

  // 获取所有用户
  allUsers: state => state.allUsers,

  // 是否正在加载
  isLoading: state => state.loading
};

const mutations = {
  /**
   * 设置待审核作品
   */
  SET_PENDING_ARTWORKS(state, artworks) {
    state.pendingArtworks = artworks;
  },

  /**
   * 设置已封禁作品
   */
  SET_BLOCKED_ARTWORKS(state, artworks) {
    state.blockedArtworks = artworks;
  },

  /**
   * 设置已封禁用户
   */
  SET_BLOCKED_USERS(state, users) {
    state.blockedUsers = users;
  },

  /**
   * 设置所有用户
   */
  SET_ALL_USERS(state, users) {
    state.allUsers = users;
  },

  /**
   * 设置加载状态
   */
  SET_LOADING(state, loading) {
    state.loading = loading;
  }
};

const actions = {
  /**
   * 获取待审核作品
   */
  async fetchPendingArtworks({ commit }) {
    commit('SET_LOADING', true);

    try {
      const res = await request.get(API_ENDPOINTS.AUDIT_CONTRIBUTIONS);

      if (res.data && res.data.code === 0) {
        const artworks = res.data.data?.pendingContributions || [];
        commit('SET_PENDING_ARTWORKS', artworks);
        return artworks;
      }

      return [];
    } catch (error) {
      console.error('获取待审核作品失败:', error);
      return [];
    } finally {
      commit('SET_LOADING', false);
    }
  },

  /**
   * 审核通过作品
   */
  async approveArtwork({ dispatch }, contributionId) {
    try {
      const params = new URLSearchParams();
      params.append('contributionId', contributionId);

      const res = await request.post(API_ENDPOINTS.APPROVE_CONTRIBUTION, params);

      if (res.data && res.data.code === 0) {
        // 重新获取待审核列表
        await dispatch('fetchPendingArtworks');
        return { success: true };
      }

      return { success: false, message: res.data?.message || '审核通过失败' };
    } catch (error) {
      console.error('审核通过失败:', error);
      return { success: false, message: error.message || '审核通过失败，请稍后重试' };
    }
  },

  /**
   * 驳回作品
   */
  async dismissArtwork({ dispatch }, { contributionId, dismissalReason }) {
    try {
      const params = new URLSearchParams();
      params.append('contributionId', contributionId);
      params.append('dismissalReason', dismissalReason);

      const res = await request.post(API_ENDPOINTS.DISMISS_CONTRIBUTION, params);

      if (res.data && res.data.code === 0) {
        // 重新获取待审核列表
        await dispatch('fetchPendingArtworks');
        return { success: true };
      }

      return { success: false, message: res.data?.message || '驳回作品失败' };
    } catch (error) {
      console.error('驳回作品失败:', error);
      return { success: false, message: error.message || '驳回作品失败，请稍后重试' };
    }
  },

  /**
   * 封禁作品
   */
  async blockArtwork({ dispatch }, contributionId) {
    try {
      const params = new URLSearchParams();
      params.append('contributionId', contributionId);

      const res = await request.post(API_ENDPOINTS.BLOCK_CONTRIBUTION, params);

      if (res.data && res.data.code === 0) {
        return { success: true };
      }

      return { success: false, message: res.data?.message || '封禁作品失败' };
    } catch (error) {
      console.error('封禁作品失败:', error);
      return { success: false, message: error.message || '封禁作品失败，请稍后重试' };
    }
  },

  /**
   * 解封作品
   */
  async unblockArtwork({ dispatch }, contributionId) {
    try {
      const params = new URLSearchParams();
      params.append('contributionId', contributionId);

      const res = await request.post(API_ENDPOINTS.UNBLOCK_CONTRIBUTION, params);

      if (res.data && res.data.code === 0) {
        return { success: true };
      }

      return { success: false, message: res.data?.message || '解封作品失败' };
    } catch (error) {
      console.error('解封作品失败:', error);
      return { success: false, message: error.message || '解封作品失败，请稍后重试' };
    }
  },

  /**
   * 封禁用户
   */
  async blockUser({ dispatch }, userId) {
    try {
      const params = new URLSearchParams();
      params.append('userId', userId);

      const res = await request.post(API_ENDPOINTS.BLOCK_USER, params);

      if (res.data && res.data.code === 0) {
        return { success: true };
      }

      return { success: false, message: res.data?.message || '封禁用户失败' };
    } catch (error) {
      console.error('封禁用户失败:', error);
      return { success: false, message: error.message || '封禁用户失败，请稍后重试' };
    }
  },

  /**
   * 解封用户
   */
  async unblockUser({ dispatch }, userId) {
    try {
      const params = new URLSearchParams();
      params.append('userId', userId);

      const res = await request.post(API_ENDPOINTS.UNBLOCK_USER, params);

      if (res.data && res.data.code === 0) {
        return { success: true };
      }

      return { success: false, message: res.data?.message || '解封用户失败' };
    } catch (error) {
      console.error('解封用户失败:', error);
      return { success: false, message: error.message || '解封用户失败，请稍后重试' };
    }
  },

  /**
   * 获取所有用户（系统管理员）
   */
  async fetchAllUsers({ commit }) {
    commit('SET_LOADING', true);

    try {
      const res = await request.get(API_ENDPOINTS.GET_ALL_USERS);

      if (res.data && res.data.code === 0) {
        const users = res.data.data || [];
        commit('SET_ALL_USERS', users);
        return users;
      }

      return [];
    } catch (error) {
      console.error('获取所有用户失败:', error);
      return [];
    } finally {
      commit('SET_LOADING', false);
    }
  },

  /**
   * 设置用户角色（系统管理员）
   */
  async setUserRole({ dispatch }, { userId, role }) {
    try {
      const params = new URLSearchParams();
      params.append('userId', userId);
      params.append('role', role);

      const res = await request.post(API_ENDPOINTS.SET_USER_ROLE, params);

      if (res.data && res.data.code === 0) {
        // 重新获取用户列表
        await dispatch('fetchAllUsers');
        return { success: true };
      }

      return { success: false, message: res.data?.message || '设置用户角色失败' };
    } catch (error) {
      console.error('设置用户角色失败:', error);
      return { success: false, message: error.message || '设置用户角色失败，请稍后重试' };
    }
  },

  /**
   * 删除评论（管理员）
   */
  async deleteComment({ dispatch }, commentId) {
    try {
      const params = new URLSearchParams();
      params.append('commentId', commentId);

      const res = await request.post(API_ENDPOINTS.DELETE_COMMENT_ADMIN, params);

      if (res.data && res.data.code === 0) {
        return { success: true };
      }

      return { success: false, message: res.data?.message || '删除评论失败' };
    } catch (error) {
      console.error('删除评论失败:', error);
      return { success: false, message: error.message || '删除评论失败，请稍后重试' };
    }
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
