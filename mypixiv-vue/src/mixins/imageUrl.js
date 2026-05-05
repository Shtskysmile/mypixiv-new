/**
 * 图片URL处理 Mixin
 * 为组件提供图片URL获取和错误处理方法
 */

import { getImageUrl, getAvatarUrl, getDefaultAvatar, getDefaultArtworkImage } from '@/utils/helpers';

export default {
  methods: {
    /**
     * 获取图片完整URL
     * @param {string} imagePath - 图片路径
     * @returns {string} 完整的图片URL
     */
    getImageUrl,

    /**
     * 获取头像URL（带时间戳防缓存）
     * @param {string} avatarPath - 头像路径
     * @param {boolean} preventCache - 是否防缓存，默认true
     * @returns {string} 完整的头像URL
     */
    getAvatarUrl,

    /**
     * 获取默认头像
     * @returns {string} 默认头像data URI
     */
    getDefaultAvatar,

    /**
     * 获取默认作品图片
     * @param {number} width - 宽度
     * @param {number} height - 高度
     * @returns {string} 默认作品图片data URI
     */
    getDefaultArtworkImage,

    /**
     * 图片加载错误处理
     * @param {Event} e - 错误事件
     */
    onImageError(e) {
      e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999"%3E加载失败%3C/text%3E%3C/svg%3E';
    },

    /**
     * 头像加载错误处理
     * @param {Event} e - 错误事件
     */
    onAvatarError(e) {
      e.target.src = this.getDefaultAvatar();
    },

    /**
     * 作品图片加载错误处理
     * @param {Event} e - 错误事件
     */
    onArtworkImageError(e) {
      e.target.src = this.getDefaultArtworkImage();
    }
  }
};
