/**
 * User Vuex Module
 * 用户状态管理模块
 */

import { API_ENDPOINTS } from '@/constants';
import request from '@/utils/request';

const state = {
  // 用户基本信息
  userInfo: null,
  token: localStorage.getItem('token') || null,
  userId: localStorage.getItem('userId') || null,
  username: localStorage.getItem('username') || null,
  userRole: parseInt(localStorage.getItem('userRole') || '0'),
  userAvatar: localStorage.getItem('userAvatar') || null,

  // 用户统计数据
  userStats: {
    following: 0,    // 关注数
    followers: 0,    // 粉丝数
    works: 0,        // 作品数
    favorites: 0     // 收藏数
  },

  // 登录状态
  isLoggedIn: !!localStorage.getItem('token')
};

const getters = {
  // 是否已登录
  isLoggedIn: state => state.isLoggedIn,

  // 是否是社区管理员
  isCommunityAdmin: state => state.userRole === 1,

  // 是否是系统管理员
  isSystemAdmin: state => state.userRole === 2,

  // 是否是任意管理员
  isAdmin: state => state.userRole === 1 || state.userRole === 2,

  // 获取完整用户信息
  fullUserInfo: state => state.userInfo,

  // 获取用户统计数据
  stats: state => state.userStats
};

const mutations = {
  /**
   * 设置用户信息
   */
  SET_USER_INFO(state, userInfo) {
    state.userInfo = userInfo;

    if (userInfo) {
      state.userId = userInfo.userId;
      state.username = userInfo.username;
      state.userRole = userInfo.role;
      state.userAvatar = userInfo.avatar;

      // 同步到 localStorage
      localStorage.setItem('userId', userInfo.userId);
      localStorage.setItem('username', userInfo.username);
      localStorage.setItem('userRole', userInfo.role);
      localStorage.setItem('userAvatar', userInfo.avatar || '');
    }
  },

  /**
   * 设置 Token
   */
  SET_TOKEN(state, token) {
    state.token = token;
    state.isLoggedIn = !!token;

    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  },

  /**
   * 设置用户统计数据
   */
  SET_USER_STATS(state, stats) {
    state.userStats = { ...state.userStats, ...stats };
  },

  /**
   * 更新用户头像
   */
  UPDATE_AVATAR(state, avatar) {
    state.userAvatar = avatar;
    if (state.userInfo) {
      state.userInfo.avatar = avatar;
    }
    localStorage.setItem('userAvatar', avatar);
  },

  /**
   * 更新用户名
   */
  UPDATE_USERNAME(state, username) {
    state.username = username;
    if (state.userInfo) {
      state.userInfo.username = username;
    }
    localStorage.setItem('username', username);
  },

  /**
   * 登出（清除所有用户数据）
   */
  LOGOUT(state) {
    state.userInfo = null;
    state.token = null;
    state.userId = null;
    state.username = null;
    state.userRole = 0;
    state.userAvatar = null;
    state.isLoggedIn = false;
    state.userStats = {
      following: 0,
      followers: 0,
      works: 0,
      favorites: 0
    };

    // 清除 localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userAvatar');
  }
};

const actions = {
  /**
   * 用户登录
   */
  async login({ commit }, { username, password }) {
    try {
      const params = new URLSearchParams();
      params.append('username', username);
      params.append('password', password);

      const res = await request.post(API_ENDPOINTS.LOGIN, params);

      if (res.data && res.data.code === 0 && res.data.data) {
        const { user, token } = res.data.data;

        // 提交 mutations
        commit('SET_TOKEN', token);
        commit('SET_USER_INFO', user);

        return { success: true, user };
      }

      return { success: false, message: res.data?.message || '登录失败' };
    } catch (error) {
      console.error('登录失败:', error);
      return { success: false, message: error.message || '登录失败，请稍后重试' };
    }
  },

  /**
   * 用户登出
   */
  logout({ commit }) {
    commit('LOGOUT');
  },

  /**
   * 获取用户信息
   */
  async fetchUserInfo({ commit }, userId) {
    try {
      const params = new URLSearchParams();
      params.append('userId', userId);

      const res = await request.post(API_ENDPOINTS.USER_INFO, params);

      if (res.data && res.data.code === 0) {
        const { user } = res.data.data;
        commit('SET_USER_INFO', user);
        return user;
      }

      return null;
    } catch (error) {
      console.error('获取用户信息失败:', error);
      return null;
    }
  },

  /**
   * 更新用户信息
   */
  async updateUserInfo({ commit }, formData) {
    try {
      const res = await request.post(API_ENDPOINTS.UPDATE_USER_INFO, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data && res.data.code === 0) {
        // 如果后端返回了新的用户信息，更新状态
        if (res.data.data && res.data.data.user) {
          commit('SET_USER_INFO', res.data.data.user);
        }
        return { success: true };
      }

      return { success: false, message: res.data?.message || '更新失败' };
    } catch (error) {
      console.error('更新用户信息失败:', error);
      return { success: false, message: error.message || '更新失败，请稍后重试' };
    }
  },

  /**
   * 更新用户统计数据
   */
  updateUserStats({ commit }, stats) {
    commit('SET_USER_STATS', stats);
  },

  /**
   * 更新头像
   */
  updateAvatar({ commit }, avatar) {
    commit('UPDATE_AVATAR', avatar);
  },

  /**
   * 更新用户名
   */
  updateUsername({ commit }, username) {
    commit('UPDATE_USERNAME', username);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
