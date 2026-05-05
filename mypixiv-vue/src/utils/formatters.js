/**
 * 格式化工具函数
 * 统一管理各种数据格式化逻辑
 */

/**
 * 格式化数字（超过1000显示k，超过10000显示w）
 * @param {number} count - 要格式化的数字
 * @returns {string|number} 格式化后的字符串或原数字
 * @example
 * formatCount(999)     // 999
 * formatCount(1500)    // 1.5k
 * formatCount(15000)   // 1.5w
 */
export function formatCount(count) {
  if (!count || count === 0) return 0;

  if (count >= 10000) {
    return (count / 10000).toFixed(1) + 'w';
  } else if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'k';
  }

  return count;
}

/**
 * 格式化时间为友好显示（标准日期时间格式）
 * @param {string|Date} time - 要格式化的时间
 * @returns {string} 格式化后的时间字符串
 * @example
 * formatTime('2025-01-15 14:30:00')  // 2025-01-15 14:30
 */
export function formatTime(time) {
  if (!time) return '';

  const date = new Date(time);
  if (isNaN(date.getTime())) return time;

  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * 格式化相对时间（刚刚、X分钟前等）
 * @param {string|Date} time - 要格式化的时间
 * @returns {string} 格式化后的相对时间字符串
 * @example
 * formatRelativeTime(new Date())           // 刚刚
 * formatRelativeTime(Date.now() - 300000)  // 5分钟前
 */
export function formatRelativeTime(time) {
  if (!time) return '';

  const date = new Date(time);
  if (isNaN(date.getTime())) return time;

  const now = new Date();
  const diff = now - date;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}天前`;
  if (hours > 0) return `${hours}小时前`;
  if (minutes > 0) return `${minutes}分钟前`;
  return '刚刚';
}

/**
 * 格式化用户ID（超长截断）
 * @param {string} userId - 用户ID
 * @param {number} maxLength - 最大长度，默认12
 * @returns {string} 格式化后的用户ID
 * @example
 * formatUserId('abcd1234efgh5678ijkl', 12)  // abcd1234efgh...
 */
export function formatUserId(userId, maxLength = 12) {
  if (!userId) return '匿名';

  return userId.length > maxLength
    ? userId.substring(0, maxLength) + '...'
    : userId;
}

/**
 * 格式化作者ID（超长截断）
 * @param {string} authorId - 作者ID
 * @param {number} maxLength - 最大长度，默认12
 * @returns {string} 格式化后的作者ID
 */
export function formatAuthorId(authorId, maxLength = 12) {
  return formatUserId(authorId, maxLength);
}

/**
 * 格式化文件大小
 * @param {number} bytes - 字节数
 * @returns {string} 格式化后的文件大小
 * @example
 * formatFileSize(1024)      // 1.0 KB
 * formatFileSize(1048576)   // 1.0 MB
 */
export function formatFileSize(bytes) {
  if (!bytes || bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return (bytes / Math.pow(k, i)).toFixed(1) + ' ' + sizes[i];
}

/**
 * 格式化百分比
 * @param {number} value - 值
 * @param {number} total - 总数
 * @param {number} decimals - 小数位数，默认1
 * @returns {string} 格式化后的百分比
 * @example
 * formatPercentage(25, 100)  // 25.0%
 */
export function formatPercentage(value, total, decimals = 1) {
  if (!total || total === 0) return '0%';

  const percentage = (value / total) * 100;
  return percentage.toFixed(decimals) + '%';
}

/**
 * 格式化货币（人民币）
 * @param {number} amount - 金额
 * @returns {string} 格式化后的货币字符串
 * @example
 * formatCurrency(1234.56)  // ¥1,234.56
 */
export function formatCurrency(amount) {
  if (!amount || amount === 0) return '¥0.00';

  return '¥' + amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

/**
 * 格式化手机号（中间4位星号）
 * @param {string} phone - 手机号
 * @returns {string} 格式化后的手机号
 * @example
 * formatPhone('13812345678')  // 138****5678
 */
export function formatPhone(phone) {
  if (!phone || phone.length !== 11) return phone;

  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
}

/**
 * 格式化邮箱（前缀部分星号）
 * @param {string} email - 邮箱地址
 * @returns {string} 格式化后的邮箱
 * @example
 * formatEmail('example@gmail.com')  // e****e@gmail.com
 */
export function formatEmail(email) {
  if (!email) return email;

  const [prefix, domain] = email.split('@');
  if (!domain) return email;

  if (prefix.length <= 2) {
    return prefix + '@' + domain;
  }

  const maskedPrefix = prefix[0] + '****' + prefix[prefix.length - 1];
  return maskedPrefix + '@' + domain;
}
