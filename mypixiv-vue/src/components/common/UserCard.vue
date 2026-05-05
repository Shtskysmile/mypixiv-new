<template>
  <BaseCard :hoverable="true" :clickable="clickable" padding="md" @click="handleClick">
    <div class="user-card-content">
      <!-- Avatar -->
      <BaseAvatar
        :src="user.avatar || user.uploaderAvatarPath"
        :alt="user.username || user.userId"
        :size="avatarSize"
        :clickable="false"
        :status="showStatus ? userStatus : null"
      />

      <!-- User Info -->
      <div class="user-info">
        <div class="user-name">{{ user.username || user.userId || '匿名用户' }}</div>
        <div class="user-id">ID: {{ formatUserId(user.userId) }}</div>

        <!-- Role Badge -->
        <div v-if="showRole && userRole" class="user-role">
          <span :class="['role-badge', `role-${userRole}`]">
            {{ roleText }}
          </span>
        </div>

        <!-- Stats -->
        <div v-if="showStats" class="user-stats">
          <StatsBadge
            v-if="user.followingCount !== undefined"
            icon="👥"
            :value="user.followingCount"
            variant="default"
            size="small"
          />
          <StatsBadge
            v-if="user.followerCount !== undefined"
            icon="💖"
            :value="user.followerCount"
            variant="default"
            size="small"
          />
          <StatsBadge
            v-if="user.contributionCount !== undefined"
            icon="🎨"
            :value="user.contributionCount"
            variant="default"
            size="small"
          />
        </div>
      </div>

      <!-- Actions Slot -->
      <div v-if="$slots.actions" class="user-actions">
        <slot name="actions" />
      </div>
    </div>
  </BaseCard>
</template>

<script>
import BaseCard from '@/components/base/BaseCard.vue';
import BaseAvatar from '@/components/base/BaseAvatar.vue';
import StatsBadge from './StatsBadge.vue';
import formattersMixin from '@/mixins/formatters';
import { USER_ROLES } from '@/constants';

/**
 * UserCard - 用户卡片组件
 * 用于显示用户信息卡片
 *
 * Props:
 * - user: 用户对象 (必需)
 * - clickable: 是否可点击
 * - showStats: 是否显示统计数据
 * - showRole: 是否显示角色标签
 * - showStatus: 是否显示在线状态
 * - avatarSize: 头像尺寸
 */
export default {
  name: 'UserCard',
  components: {
    BaseCard,
    BaseAvatar,
    StatsBadge
  },
  mixins: [formattersMixin],
  props: {
    user: {
      type: Object,
      required: true
    },
    clickable: {
      type: Boolean,
      default: true
    },
    showStats: {
      type: Boolean,
      default: true
    },
    showRole: {
      type: Boolean,
      default: false
    },
    showStatus: {
      type: Boolean,
      default: false
    },
    avatarSize: {
      type: String,
      default: 'lg'
    }
  },
  computed: {
    userRole() {
      const role = this.user.role || this.user.userRole || 0;
      if (role === USER_ROLES.SYSTEM_ADMIN) return 'system-admin';
      if (role === USER_ROLES.COMMUNITY_ADMIN) return 'community-admin';
      return null;
    },
    roleText() {
      if (this.userRole === 'system-admin') return '系统管理员';
      if (this.userRole === 'community-admin') return '社区管理员';
      return '';
    },
    userStatus() {
      // Can be extended to check actual online status
      return this.user.isOnline ? 'online' : 'offline';
    }
  },
  methods: {
    handleClick() {
      if (this.clickable) {
        this.$emit('click', this.user);
        // Optionally navigate to user profile
        if (this.user.userId) {
          this.$router.push(`/user/${this.user.userId}`);
        }
      }
    }
  }
};
</script>

<style scoped>
.user-card-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
  text-align: center;
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
  width: 100%;
}

.user-name {
  font-size: 16px;
  font-weight: 700;
  color: var(--color-text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}

.user-id {
  font-size: 12px;
  color: var(--color-text-lighter);
  font-weight: 500;
}

.user-role {
  margin-top: var(--spacing-xs);
}

.role-badge {
  display: inline-block;
  padding: var(--spacing-xs) var(--spacing-md);
  border-radius: var(--radius-round);
  font-size: 11px;
  font-weight: 700;
  color: white;
}

.role-system-admin {
  background: var(--gradient-danger);
}

.role-community-admin {
  background: var(--gradient-warning);
}

.user-stats {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  justify-content: center;
  margin-top: var(--spacing-sm);
}

.user-actions {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-sm);
}
</style>
