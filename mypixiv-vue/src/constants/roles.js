/**
 * 用户角色和状态常量
 */

/**
 * 用户角色枚举
 * @readonly
 * @enum {number}
 */
export const USER_ROLES = {
  /** 普通用户 */
  NORMAL: 0,
  /** 社区管理员 */
  COMMUNITY_ADMIN: 1,
  /** 系统管理员 */
  SYSTEM_ADMIN: 2
};

/**
 * 用户状态枚举
 * @readonly
 * @enum {number}
 */
export const USER_STATUS = {
  /** 正常状态 */
  NORMAL: 0,
  /** 已封禁 */
  BLOCKED: 1
};

/**
 * 根据角色值获取角色名称
 * @param {number} role - 角色值
 * @returns {string} 角色名称
 */
export function getRoleName(role) {
  const roleNames = {
    [USER_ROLES.NORMAL]: '普通用户',
    [USER_ROLES.COMMUNITY_ADMIN]: '社区管理员',
    [USER_ROLES.SYSTEM_ADMIN]: '系统管理员'
  };
  return roleNames[role] || '未知角色';
}

/**
 * 根据状态值获取状态名称
 * @param {number} status - 状态值
 * @returns {string} 状态名称
 */
export function getUserStatusName(status) {
  const statusNames = {
    [USER_STATUS.NORMAL]: '正常',
    [USER_STATUS.BLOCKED]: '已封禁'
  };
  return statusNames[status] || '未知状态';
}
