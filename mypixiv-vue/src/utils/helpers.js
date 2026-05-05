/**
 * 辅助函数工具库
 * 包含图片URL处理、验证、复制等通用辅助功能
 */

/**
 * 获取图片完整URL
 * @param {string} imagePath - 图片路径
 * @returns {string} 完整的图片URL或占位符
 */
export function getImageUrl(imagePath) {
  // 无图片时返回SVG占位符
  if (!imagePath) {
    return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999"%3E暂无图片%3C/text%3E%3C/svg%3E';
  }

  // 已经是完整URL直接返回
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // 拼接基础URL
  const baseURL = process.env.VUE_APP_API_BASE_URL || 'http://localhost:8080';
  const fullPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${baseURL}${fullPath}`;
}

/**
 * 获取头像URL（带时间戳防缓存）
 * @param {string} avatarPath - 头像路径
 * @param {boolean} preventCache - 是否防缓存，默认true
 * @returns {string} 完整的头像URL
 */
export function getAvatarUrl(avatarPath, preventCache = true) {
  const url = getImageUrl(avatarPath);

  // 非data URI时添加时间戳防缓存
  if (preventCache && url && !url.startsWith('data:')) {
    const timestamp = new Date().getTime();
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}t=${timestamp}`;
  }

  return url;
}

/**
 * 获取默认头像SVG
 * @returns {string} 默认头像data URI
 */
export function getDefaultAvatar() {
  return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="64" height="64"%3E%3Crect fill="%23ddd" width="64" height="64"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="32"%3EU%3C/text%3E%3C/svg%3E';
}

/**
 * 获取默认作品图片
 * @param {number} width - 宽度，默认400
 * @param {number} height - 高度，默认300
 * @returns {string} 默认作品图片data URI
 */
export function getDefaultArtworkImage(width = 400, height = 300) {
  return `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"%3E%3Crect fill="%23ddd" width="${width}" height="${height}"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999"%3E暂无图片%3C/text%3E%3C/svg%3E`;
}

/**
 * 复制文本到剪贴板
 * @param {string} text - 要复制的文本
 * @returns {Promise<boolean>} 是否复制成功
 */
export async function copyToClipboard(text) {
  try {
    // 优先使用 Clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    // 降级方案：使用 execCommand
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.width = '1px';
    textArea.style.height = '1px';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);

    return successful;
  } catch (err) {
    console.error('复制失败:', err);
    return false;
  }
}

/**
 * 防抖函数
 * @param {Function} func - 要防抖的函数
 * @param {number} wait - 等待时间（毫秒）
 * @returns {Function} 防抖后的函数
 */
export function debounce(func, wait = 300) {
  let timeout;
  return function (...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

/**
 * 节流函数
 * @param {Function} func - 要节流的函数
 * @param {number} limit - 限制时间（毫秒）
 * @returns {Function} 节流后的函数
 */
export function throttle(func, limit = 300) {
  let inThrottle;
  return function (...args) {
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * 深度克隆对象
 * @param {any} obj - 要克隆的对象
 * @returns {any} 克隆后的对象
 */
export function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;

  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));

  if (obj instanceof Object) {
    const clonedObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
}

/**
 * 生成随机ID
 * @param {number} length - ID长度，默认16
 * @returns {string} 随机ID
 */
export function generateRandomId(length = 16) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * 判断是否为移动设备
 * @returns {boolean} 是否为移动设备
 */
export function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

/**
 * 获取URL参数
 * @param {string} name - 参数名
 * @returns {string|null} 参数值
 */
export function getUrlParam(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

/**
 * 滚动到页面顶部
 * @param {boolean} smooth - 是否平滑滚动，默认true
 */
export function scrollToTop(smooth = true) {
  if (smooth) {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  } else {
    window.scrollTo(0, 0);
  }
}

/**
 * 滚动到指定元素
 * @param {string|Element} element - 元素选择器或元素对象
 * @param {number} offset - 偏移量，默认0
 */
export function scrollToElement(element, offset = 0) {
  const el = typeof element === 'string' ? document.querySelector(element) : element;

  if (el) {
    const top = el.getBoundingClientRect().top + window.pageYOffset + offset;
    window.scrollTo({
      top,
      behavior: 'smooth'
    });
  }
}

/**
 * 延迟执行
 * @param {number} ms - 延迟毫秒数
 * @returns {Promise} Promise对象
 */
export function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 检查对象是否为空
 * @param {Object} obj - 要检查的对象
 * @returns {boolean} 是否为空
 */
export function isEmptyObject(obj) {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
}

/**
 * 数组去重
 * @param {Array} arr - 要去重的数组
 * @param {string} key - 对象数组的唯一键
 * @returns {Array} 去重后的数组
 */
export function uniqueArray(arr, key = null) {
  if (!key) {
    return [...new Set(arr)];
  }

  const seen = new Set();
  return arr.filter(item => {
    const k = item[key];
    return seen.has(k) ? false : seen.add(k);
  });
}
