/**
 * 作品和审核状态常量
 */

/**
 * 审核状态枚举
 * @readonly
 * @enum {number}
 */
export const AUDIT_STATUS = {
  /** 待审核 */
  PENDING: 0,
  /** 已通过/已批准 */
  APPROVED: 1,
  /** 已驳回 */
  REJECTED: 2
};

/**
 * 作品类型枚举
 * @readonly
 * @enum {number}
 */
export const ARTWORK_TYPE = {
  /** 插画 */
  ILLUSTRATION: 0,
  /** 漫画 */
  MANGA: 1
};

/**
 * 作品状态枚举
 * @readonly
 * @enum {number}
 */
export const ARTWORK_STATUS = {
  /** 正常状态 */
  NORMAL: 0,
  /** 已封禁 */
  BLOCKED: 1
};

/**
 * 根据审核状态值获取状态名称
 * @param {number} status - 审核状态值
 * @returns {string} 审核状态名称
 */
export function getAuditStatusName(status) {
  const statusNames = {
    [AUDIT_STATUS.PENDING]: '待审核',
    [AUDIT_STATUS.APPROVED]: '已通过',
    [AUDIT_STATUS.REJECTED]: '已驳回'
  };
  return statusNames[status] || '未知状态';
}

/**
 * 根据审核状态值获取状态图标
 * @param {number} status - 审核状态值
 * @returns {string} 审核状态图标
 */
export function getAuditStatusIcon(status) {
  const iconMap = {
    [AUDIT_STATUS.PENDING]: '⏳',
    [AUDIT_STATUS.APPROVED]: '✅',
    [AUDIT_STATUS.REJECTED]: '❌'
  };
  return iconMap[status] || '❓';
}

/**
 * 根据作品类型值获取类型名称
 * @param {number} type - 作品类型值
 * @returns {string} 作品类型名称
 */
export function getArtworkTypeName(type) {
  const typeNames = {
    [ARTWORK_TYPE.ILLUSTRATION]: '插画',
    [ARTWORK_TYPE.MANGA]: '漫画'
  };
  return typeNames[type] || '未知类型';
}

/**
 * 根据作品类型值获取类型图标
 * @param {number} type - 作品类型值
 * @returns {string} 作品类型图标
 */
export function getArtworkTypeIcon(type) {
  const iconMap = {
    [ARTWORK_TYPE.ILLUSTRATION]: '🖼️',
    [ARTWORK_TYPE.MANGA]: '📚'
  };
  return iconMap[type] || '❓';
}

/**
 * 根据作品状态值获取状态名称
 * @param {number} status - 作品状态值
 * @returns {string} 作品状态名称
 */
export function getArtworkStatusName(status) {
  const statusNames = {
    [ARTWORK_STATUS.NORMAL]: '正常',
    [ARTWORK_STATUS.BLOCKED]: '已封禁'
  };
  return statusNames[status] || '未知状态';
}
