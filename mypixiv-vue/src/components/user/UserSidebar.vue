<template>
  <aside class="menu user-menu anime-menu">
    <p class="menu-label anime-label">
      <span class="icon">👤</span>
      {{ isOwnProfile ? '个人中心' : '用户主页' }}
    </p>

    <ul class="menu-list">
      <li v-for="item in menuItems" :key="item.view">
        <a
          :class="{ 'is-active': currentView === item.view }"
          @click.prevent="$emit('change-view', item.view)"
        >
          <span class="icon">{{ item.icon }}</span>
          {{ item.label }}
        </a>
      </li>
    </ul>
  </aside>
</template>

<script>
import userRoleMixin from '@/mixins/userRole';

/**
 * UserSidebar - 用户中心侧边栏
 * User center sidebar navigation
 *
 * Props:
 * - currentView: 当前视图
 * - isOwnProfile: 是否是自己的主页
 * - isCommunityAdmin: 被查看用户是否是社区管理员
 * - isSystemAdmin: 被查看用户是否是系统管理员
 *
 * Events:
 * - change-view: 切换视图
 */
export default {
  name: 'UserSidebar',
  mixins: [userRoleMixin],
  props: {
    currentView: {
      type: String,
      default: 'info'
    },
    isOwnProfile: {
      type: Boolean,
      default: false
    },
    isCommunityAdmin: {
      type: Boolean,
      default: false
    },
    isSystemAdmin: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    menuItems() {
      const items = [];

      // Personal Info (always visible)
      items.push({ view: 'info', icon: '📋', label: '个人信息' });

      // Regular user menu items (not for admins)
      if (!this.isCommunityAdmin && !this.isSystemAdmin) {
        items.push(
          { view: 'favorites', icon: '⭐', label: '收藏的画作' },
          { view: 'likes', icon: '❤️', label: '点赞的画作' },
          {
            view: 'works',
            icon: '🎨',
            label: this.isOwnProfile ? '我的画作' : 'TA的画作'
          },
          {
            view: 'followers',
            icon: '👥',
            label: this.isOwnProfile ? '我的关注' : 'TA的关注'
          },
          {
            view: 'comments',
            icon: '💬',
            label: this.isOwnProfile ? '我的评论' : 'TA的评论'
          }
        );

        // Submit artwork (only for own profile)
        if (this.isOwnProfile) {
          items.push({ view: 'submit', icon: '📤', label: '提交作品' });
        }
      }

      // Account security (only for own profile)
      if (this.isOwnProfile) {
        items.push(
          { view: 'changePassword', icon: '🔑', label: '修改密码' },
          { view: 'changeSecurityIssues', icon: '🛡️', label: '修改密保' }
        );
      }

      // Community admin menu (for logged-in community admins)
      if (this.isCurrentUserCommunityAdmin) {
        items.push(
          { view: 'audit', icon: '🔨', label: '审核作品' },
          { view: 'blockedWorks', icon: '🚫', label: '已封禁作品' },
          { view: 'blockedUsers', icon: '🔒', label: '被封禁用户' }
        );
      }

      // System admin menu (for logged-in system admins)
      if (this.isCurrentUserSystemAdmin) {
        items.push(
          { view: 'userManagement', icon: '👥', label: '用户管理' },
          { view: 'systemLogs', icon: '📋', label: '系统日志' }
        );
      }

      return items;
    }
  }
};
</script>

<style scoped>
.user-menu {
  background: rgba(255, 255, 255, 0.98);
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-md);
  border: 2px solid var(--border-color);
  position: sticky;
  top: var(--spacing-xl);
}

.menu-label {
  font-size: 16px;
  font-weight: 700;
  color: var(--color-text);
  padding: var(--spacing-md) 0;
  margin-bottom: var(--spacing-md);
  border-bottom: 2px solid var(--border-color);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.menu-label .icon {
  font-size: 20px;
}

.menu-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.menu-list li {
  margin-bottom: var(--spacing-xs);
}

.menu-list a {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: var(--radius-md);
  color: var(--color-text);
  text-decoration: none;
  transition: var(--transition-base);
  font-weight: 600;
  border: 2px solid transparent;
}

.menu-list a:hover {
  background: rgba(102, 126, 234, 0.1);
  border-color: var(--border-color-hover);
}

.menu-list a.is-active {
  background: var(--gradient-primary);
  color: white;
  box-shadow: var(--shadow-md);
  transform: translateX(4px);
}

.menu-list .icon {
  font-size: 16px;
  width: 20px;
  text-align: center;
}
</style>
