/**
 * 格式化函数 Mixin
 * 为组件提供常用的格式化方法
 */

import {
  formatCount,
  formatTime,
  formatRelativeTime,
  formatUserId,
  formatAuthorId,
  formatFileSize,
  formatPercentage,
  formatCurrency,
  formatPhone,
  formatEmail
} from '@/utils/formatters';

export default {
  methods: {
    /**
     * 格式化数字（超过1000显示k，超过10000显示w）
     */
    formatCount,

    /**
     * 格式化时间为友好显示
     */
    formatTime,

    /**
     * 格式化相对时间（刚刚、X分钟前等）
     */
    formatRelativeTime,

    /**
     * 格式化用户ID
     */
    formatUserId,

    /**
     * 格式化作者ID
     */
    formatAuthorId,

    /**
     * 格式化文件大小
     */
    formatFileSize,

    /**
     * 格式化百分比
     */
    formatPercentage,

    /**
     * 格式化货币
     */
    formatCurrency,

    /**
     * 格式化手机号
     */
    formatPhone,

    /**
     * 格式化邮箱
     */
    formatEmail
  }
};
