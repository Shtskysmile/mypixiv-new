/**
 * Artwork Vuex Module
 * 作品状态管理模块
 */

import { API_ENDPOINTS } from '@/constants';
import request from '@/utils/request';

const state = {
  // 作品列表
  artworkList: [],

  // 当前作品详情
  currentArtwork: null,

  // 搜索结果
  searchResults: [],

  // 插画列表
  illustrations: [],

  // 漫画列表
  mangas: [],

  // 分页信息
  pagination: {
    page: 1,
    pageSize: 35,
    total: 0
  },

  // 加载状态
  loading: false
};

const getters = {
  // 获取所有作品
  allArtworks: state => state.artworkList,

  // 获取当前作品
  currentArtwork: state => state.currentArtwork,

  // 获取搜索结果
  searchResults: state => state.searchResults,

  // 获取插画列表
  illustrations: state => state.illustrations,

  // 获取漫画列表
  mangas: state => state.mangas,

  // 获取分页信息
  pagination: state => state.pagination,

  // 是否正在加载
  isLoading: state => state.loading
};

const mutations = {
  /**
   * 设置作品列表
   */
  SET_ARTWORK_LIST(state, list) {
    state.artworkList = list;
  },

  /**
   * 设置当前作品详情
   */
  SET_CURRENT_ARTWORK(state, artwork) {
    state.currentArtwork = artwork;
  },

  /**
   * 设置搜索结果
   */
  SET_SEARCH_RESULTS(state, results) {
    state.searchResults = results;
  },

  /**
   * 设置插画列表
   */
  SET_ILLUSTRATIONS(state, illustrations) {
    state.illustrations = illustrations;
  },

  /**
   * 设置漫画列表
   */
  SET_MANGAS(state, mangas) {
    state.mangas = mangas;
  },

  /**
   * 设置分页信息
   */
  SET_PAGINATION(state, pagination) {
    state.pagination = { ...state.pagination, ...pagination };
  },

  /**
   * 设置加载状态
   */
  SET_LOADING(state, loading) {
    state.loading = loading;
  },

  /**
   * 清除当前作品
   */
  CLEAR_CURRENT_ARTWORK(state) {
    state.currentArtwork = null;
  },

  /**
   * 清除搜索结果
   */
  CLEAR_SEARCH_RESULTS(state) {
    state.searchResults = [];
  }
};

const actions = {
  /**
   * 获取所有作品
   */
  async fetchAllArtworks({ commit }) {
    commit('SET_LOADING', true);

    try {
      const res = await request.get(API_ENDPOINTS.ALL_CONTRIBUTIONS);

      if (res.data && res.data.code === 0) {
        const artworks = res.data.data || [];
        commit('SET_ARTWORK_LIST', artworks);
        commit('SET_PAGINATION', { total: artworks.length });
        return artworks;
      }

      return [];
    } catch (error) {
      console.error('获取作品列表失败:', error);
      return [];
    } finally {
      commit('SET_LOADING', false);
    }
  },

  /**
   * 获取作品详情
   */
  async fetchArtworkDetail({ commit }, { contributionId, isPending = false, isBlocked = false }) {
    commit('SET_LOADING', true);

    try {
      const params = new URLSearchParams();
      params.append('contributionId', contributionId);

      let endpoint = API_ENDPOINTS.CONTRIBUTION;
      if (isPending) {
        endpoint = API_ENDPOINTS.PENDING_CONTRIBUTION;
      } else if (isBlocked) {
        endpoint = '/communityAdmin/bannedContribution';
      }

      const res = await request.post(endpoint, params);

      if (res.data && res.data.code === 0) {
        const artwork = res.data.data;
        commit('SET_CURRENT_ARTWORK', artwork);
        return artwork;
      }

      return null;
    } catch (error) {
      console.error('获取作品详情失败:', error);
      return null;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  /**
   * 搜索作品
   */
  async searchArtworks({ commit }, { keyword, type }) {
    commit('SET_LOADING', true);

    try {
      const params = new URLSearchParams();
      params.append('keyword', keyword);
      params.append('type', type);

      const res = await request.post(API_ENDPOINTS.SEARCH, params);

      if (res.data && res.data.code === 0) {
        const results = res.data.data || [];
        commit('SET_SEARCH_RESULTS', results);
        return results;
      }

      return [];
    } catch (error) {
      console.error('搜索失败:', error);
      return [];
    } finally {
      commit('SET_LOADING', false);
    }
  },

  /**
   * 获取插画列表
   */
  async fetchIllustrations({ commit }) {
    commit('SET_LOADING', true);

    try {
      const res = await request.get(API_ENDPOINTS.ILLUSTRATIONS);

      if (res.data && res.data.code === 0) {
        const illustrations = res.data.data || [];
        commit('SET_ILLUSTRATIONS', illustrations);
        return illustrations;
      }

      return [];
    } catch (error) {
      console.error('获取插画列表失败:', error);
      return [];
    } finally {
      commit('SET_LOADING', false);
    }
  },

  /**
   * 获取漫画列表
   */
  async fetchMangas({ commit }) {
    commit('SET_LOADING', true);

    try {
      const res = await request.get(API_ENDPOINTS.MANGAS);

      if (res.data && res.data.code === 0) {
        const mangas = res.data.data || [];
        commit('SET_MANGAS', mangas);
        return mangas;
      }

      return [];
    } catch (error) {
      console.error('获取漫画列表失败:', error);
      return [];
    } finally {
      commit('SET_LOADING', false);
    }
  },

  /**
   * 点赞作品
   */
  async likeArtwork({ commit }, contributionId) {
    try {
      const params = new URLSearchParams();
      params.append('contributionId', contributionId);

      const res = await request.post(API_ENDPOINTS.LIKE_CONTRIBUTION, params);

      if (res.data && res.data.code === 0) {
        return { success: true };
      }

      return { success: false, message: res.data?.message || '点赞失败' };
    } catch (error) {
      console.error('点赞失败:', error);
      return { success: false, message: error.message || '点赞失败，请稍后重试' };
    }
  },

  /**
   * 取消点赞
   */
  async unlikeArtwork({ commit }, contributionId) {
    try {
      const params = new URLSearchParams();
      params.append('contributionId', contributionId);

      const res = await request.post(API_ENDPOINTS.UNLIKE_CONTRIBUTION, params);

      if (res.data && res.data.code === 0) {
        return { success: true };
      }

      return { success: false, message: res.data?.message || '取消点赞失败' };
    } catch (error) {
      console.error('取消点赞失败:', error);
      return { success: false, message: error.message || '取消点赞失败，请稍后重试' };
    }
  },

  /**
   * 收藏作品
   */
  async favoriteArtwork({ commit }, contributionId) {
    try {
      const params = new URLSearchParams();
      params.append('contributionId', contributionId);

      const res = await request.post(API_ENDPOINTS.FAVORITE_CONTRIBUTION, params);

      if (res.data && res.data.code === 0) {
        return { success: true };
      }

      return { success: false, message: res.data?.message || '收藏失败' };
    } catch (error) {
      console.error('收藏失败:', error);
      return { success: false, message: error.message || '收藏失败，请稍后重试' };
    }
  },

  /**
   * 取消收藏
   */
  async unfavoriteArtwork({ commit }, contributionId) {
    try {
      const params = new URLSearchParams();
      params.append('contributionId', contributionId);

      const res = await request.post(API_ENDPOINTS.UNFAVORITE_CONTRIBUTION, params);

      if (res.data && res.data.code === 0) {
        return { success: true };
      }

      return { success: false, message: res.data?.message || '取消收藏失败' };
    } catch (error) {
      console.error('取消收藏失败:', error);
      return { success: false, message: error.message || '取消收藏失败，请稍后重试' };
    }
  },

  /**
   * 清除当前作品
   */
  clearCurrentArtwork({ commit }) {
    commit('CLEAR_CURRENT_ARTWORK');
  },

  /**
   * 清除搜索结果
   */
  clearSearchResults({ commit }) {
    commit('CLEAR_SEARCH_RESULTS');
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
