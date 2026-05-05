/**
 * 用户角色检查 Mixin
 * 为组件提供用户角色判断的计算属性
 */

import { USER_ROLES } from '@/constants';

export default {
  computed: {
    /**
     * 当前登录用户的角色值
     * @returns {number} 角色值（0:普通用户, 1:社区管理员, 2:系统管理员）
     */
    currentUserRole() {
      return parseInt(localStorage.getItem('userRole') || '0');
    },

    /**
     * 当前登录用户ID
     * @returns {string|null} 用户ID
     */
    currentUserId() {
      return localStorage.getItem('userId');
    },

    /**
     * 当前登录用户名
     * @returns {string|null} 用户名
     */
    currentUsername() {
      return localStorage.getItem('username');
    },

    /**
     * 当前登录用户头像
     * @returns {string|null} 头像路径
     */
    currentUserAvatar() {
      return localStorage.getItem('userAvatar');
    },

    /**
     * 当前登录用户token
     * @returns {string|null} token
     */
    currentUserToken() {
      return localStorage.getItem('token');
    },

    /**
     * 当前登录用户是否是普通用户
     * @returns {boolean}
     */
    isCurrentUserNormal() {
      return this.currentUserRole === USER_ROLES.NORMAL;
    },

    /**
     * 当前登录用户是否是社区管理员
     * @returns {boolean}
     */
    isCurrentUserCommunityAdmin() {
      return this.currentUserRole === USER_ROLES.COMMUNITY_ADMIN;
    },

    /**
     * 当前登录用户是否是系统管理员
     * @returns {boolean}
     */
    isCurrentUserSystemAdmin() {
      return this.currentUserRole === USER_ROLES.SYSTEM_ADMIN;
    },

    /**
     * 当前登录用户是否是任意管理员（社区管理员或系统管理员）
     * @returns {boolean}
     */
    isCurrentUserAdmin() {
      return this.isCurrentUserCommunityAdmin || this.isCurrentUserSystemAdmin;
    },

    /**
     * 当前用户是否已登录
     * @returns {boolean}
     */
    isUserLoggedIn() {
      return !!this.currentUserToken;
    }
  },

  methods: {
    /**
     * 检查用户是否具有指定角色
     * @param {number} role - 要检查的角色值
     * @returns {boolean}
     */
    hasRole(role) {
      return this.currentUserRole === role;
    },

    /**
     * 检查用户是否具有指定角色或更高权限
     * @param {number} role - 最低要求的角色值
     * @returns {boolean}
     */
    hasRoleOrHigher(role) {
      return this.currentUserRole >= role;
    },

    /**
     * 需要登录时检查并跳转
     * @param {string} redirectPath - 未登录时重定向路径，默认'/login'
     * @returns {boolean} 是否已登录
     */
    requireLogin(redirectPath = '/login') {
      if (!this.isUserLoggedIn) {
        alert('请先登录');
        this.$router.push(redirectPath);
        return false;
      }
      return true;
    },

    /**
     * 需要指定角色时检查
     * @param {number} requiredRole - 要求的角色值
     * @param {string} message - 权限不足时的提示信息
     * @returns {boolean} 是否具有权限
     */
    requireRole(requiredRole, message = '权限不足') {
      if (this.currentUserRole !== requiredRole) {
        alert(message);
        return false;
      }
      return true;
    },

    /**
     * 需要管理员权限时检查
     * @param {string} message - 权限不足时的提示信息
     * @returns {boolean} 是否是管理员
     */
    requireAdmin(message = '需要管理员权限') {
      if (!this.isCurrentUserAdmin) {
        alert(message);
        return false;
      }
      return true;
    }
  }
};
