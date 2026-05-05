/**
 * UI Vuex Module
 * UI状态管理模块（Toast、Modal、Loading等）
 */

const state = {
  // 全局加载状态
  loading: false,
  loadingText: '加载中...',

  // Toast 消息
  toast: {
    visible: false,
    message: '',
    type: 'success', // success, error, warning, info
    duration: 3000
  },

  // 侧边栏状态
  sidebarCollapsed: false,

  // 移动端菜单状态
  mobileMenuOpen: false,

  // 模态框状态
  modals: {}
};

const getters = {
  // 是否正在加载
  isLoading: state => state.loading,

  // 加载文本
  loadingText: state => state.loadingText,

  // Toast状态
  toast: state => state.toast,

  // 侧边栏是否折叠
  isSidebarCollapsed: state => state.sidebarCollapsed,

  // 移动端菜单是否打开
  isMobileMenuOpen: state => state.mobileMenuOpen,

  // 获取指定模态框状态
  isModalOpen: state => modalName => state.modals[modalName] || false
};

const mutations = {
  /**
   * 设置全局加载状态
   */
  SET_LOADING(state, { loading, text = '加载中...' }) {
    state.loading = loading;
    state.loadingText = text;
  },

  /**
   * 显示 Toast 消息
   */
  SHOW_TOAST(state, { message, type = 'success', duration = 3000 }) {
    state.toast = {
      visible: true,
      message,
      type,
      duration
    };
  },

  /**
   * 隐藏 Toast 消息
   */
  HIDE_TOAST(state) {
    state.toast.visible = false;
  },

  /**
   * 切换侧边栏状态
   */
  TOGGLE_SIDEBAR(state) {
    state.sidebarCollapsed = !state.sidebarCollapsed;
  },

  /**
   * 设置侧边栏状态
   */
  SET_SIDEBAR_COLLAPSED(state, collapsed) {
    state.sidebarCollapsed = collapsed;
  },

  /**
   * 切换移动端菜单
   */
  TOGGLE_MOBILE_MENU(state) {
    state.mobileMenuOpen = !state.mobileMenuOpen;
  },

  /**
   * 关闭移动端菜单
   */
  CLOSE_MOBILE_MENU(state) {
    state.mobileMenuOpen = false;
  },

  /**
   * 打开模态框
   */
  OPEN_MODAL(state, modalName) {
    state.modals = { ...state.modals, [modalName]: true };
  },

  /**
   * 关闭模态框
   */
  CLOSE_MODAL(state, modalName) {
    state.modals = { ...state.modals, [modalName]: false };
  },

  /**
   * 关闭所有模态框
   */
  CLOSE_ALL_MODALS(state) {
    state.modals = {};
  }
};

const actions = {
  /**
   * 显示全局加载
   */
  showLoading({ commit }, text = '加载中...') {
    commit('SET_LOADING', { loading: true, text });
  },

  /**
   * 隐藏全局加载
   */
  hideLoading({ commit }) {
    commit('SET_LOADING', { loading: false });
  },

  /**
   * 显示 Toast 消息
   */
  showToast({ commit }, { message, type = 'success', duration = 3000 }) {
    commit('SHOW_TOAST', { message, type, duration });

    // 自动隐藏
    setTimeout(() => {
      commit('HIDE_TOAST');
    }, duration);
  },

  /**
   * 显示成功提示
   */
  showSuccess({ dispatch }, message) {
    dispatch('showToast', { message, type: 'success' });
  },

  /**
   * 显示错误提示
   */
  showError({ dispatch }, message) {
    dispatch('showToast', { message, type: 'error' });
  },

  /**
   * 显示警告提示
   */
  showWarning({ dispatch }, message) {
    dispatch('showToast', { message, type: 'warning' });
  },

  /**
   * 显示信息提示
   */
  showInfo({ dispatch }, message) {
    dispatch('showToast', { message, type: 'info' });
  },

  /**
   * 切换侧边栏
   */
  toggleSidebar({ commit }) {
    commit('TOGGLE_SIDEBAR');
  },

  /**
   * 设置侧边栏状态
   */
  setSidebarCollapsed({ commit }, collapsed) {
    commit('SET_SIDEBAR_COLLAPSED', collapsed);
  },

  /**
   * 切换移动端菜单
   */
  toggleMobileMenu({ commit }) {
    commit('TOGGLE_MOBILE_MENU');
  },

  /**
   * 关闭移动端菜单
   */
  closeMobileMenu({ commit }) {
    commit('CLOSE_MOBILE_MENU');
  },

  /**
   * 打开模态框
   */
  openModal({ commit }, modalName) {
    commit('OPEN_MODAL', modalName);
  },

  /**
   * 关闭模态框
   */
  closeModal({ commit }, modalName) {
    commit('CLOSE_MODAL', modalName);
  },

  /**
   * 关闭所有模态框
   */
  closeAllModals({ commit }) {
    commit('CLOSE_ALL_MODALS');
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
