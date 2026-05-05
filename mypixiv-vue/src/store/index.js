/**
 * Vuex Store 入口文件
 * 统一管理应用的全局状态
 */

import Vue from 'vue';
import Vuex from 'vuex';

// 导入模块
import user from './modules/user';
import artwork from './modules/artwork';
import ui from './modules/ui';
import admin from './modules/admin';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    user,
    artwork,
    ui,
    admin
  },

  // 开发环境启用严格模式
  strict: process.env.NODE_ENV !== 'production'
});

export default store;
