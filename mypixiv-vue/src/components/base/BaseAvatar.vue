<template>
  <div :class="avatarClasses" :style="avatarStyle" @click="handleClick">
    <img
      v-if="src && !imageError"
      :src="computedSrc"
      :alt="alt"
      class="avatar-image"
      @error="handleImageError"
    />
    <div v-else class="avatar-fallback">
      <span v-if="fallbackIcon" class="fallback-icon">{{ fallbackIcon }}</span>
      <span v-else-if="fallbackText" class="fallback-text">{{ fallbackText }}</span>
      <span v-else class="fallback-icon">👤</span>
    </div>

    <div v-if="badge" class="avatar-badge" :class="`badge-${badgeType}`">
      {{ badge }}
    </div>

    <div v-if="status" class="avatar-status" :class="`status-${status}`"></div>
  </div>
</template>

<script>
import { getAvatarUrl, getDefaultAvatar } from '@/utils/helpers';

/**
 * BaseAvatar - 基础头像组件
 *
 * Props:
 * - src: 头像图片 URL
 * - alt: 图片 alt 文本
 * - size: 头像尺寸 ('xs', 'sm', 'md', 'lg', 'xl', 或自定义数字)
 * - shape: 头像形状 ('circle', 'square')
 * - fallbackIcon: 加载失败时显示的图标
 * - fallbackText: 加载失败时显示的文本
 * - badge: 徽章文本
 * - badgeType: 徽章类型 ('primary', 'success', 'warning', 'danger')
 * - status: 在线状态 ('online', 'offline', 'busy', 'away')
 * - clickable: 是否可点击
 */
export default {
  name: 'BaseAvatar',
  props: {
    src: {
      type: String,
      default: null
    },
    alt: {
      type: String,
      default: 'avatar'
    },
    size: {
      type: [String, Number],
      default: 'md'
    },
    shape: {
      type: String,
      default: 'circle',
      validator: value => ['circle', 'square'].includes(value)
    },
    fallbackIcon: {
      type: String,
      default: null
    },
    fallbackText: {
      type: String,
      default: null
    },
    badge: {
      type: [String, Number],
      default: null
    },
    badgeType: {
      type: String,
      default: 'primary',
      validator: value => ['primary', 'success', 'warning', 'danger'].includes(value)
    },
    status: {
      type: String,
      default: null,
      validator: value => !value || ['online', 'offline', 'busy', 'away'].includes(value)
    },
    clickable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      imageError: false
    };
  },
  computed: {
    avatarClasses() {
      return [
        'base-avatar',
        `avatar-${this.shape}`,
        `avatar-size-${this.size}`,
        {
          'avatar-clickable': this.clickable
        }
      ];
    },
    avatarStyle() {
      if (typeof this.size === 'number') {
        return {
          width: `${this.size}px`,
          height: `${this.size}px`,
          fontSize: `${this.size / 2.5}px`
        };
      }
      return {};
    },
    computedSrc() {
      return this.src ? getAvatarUrl(this.src, true) : getDefaultAvatar();
    }
  },
  watch: {
    src() {
      this.imageError = false;
    }
  },
  methods: {
    handleImageError() {
      this.imageError = true;
    },
    handleClick(event) {
      if (this.clickable) {
        this.$emit('click', event);
      }
    }
  }
};
</script>

<style scoped>
.base-avatar {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: 3px solid rgba(102, 126, 234, 0.2);
  transition: var(--transition-base);
}

/* Shapes */
.avatar-circle {
  border-radius: 50%;
}

.avatar-square {
  border-radius: var(--radius-md);
}

/* Sizes */
.avatar-size-xs {
  width: 32px;
  height: 32px;
  font-size: 14px;
  border-width: 2px;
}

.avatar-size-sm {
  width: 48px;
  height: 48px;
  font-size: 20px;
}

.avatar-size-md {
  width: 64px;
  height: 64px;
  font-size: 28px;
}

.avatar-size-lg {
  width: 80px;
  height: 80px;
  font-size: 36px;
}

.avatar-size-xl {
  width: 120px;
  height: 120px;
  font-size: 52px;
  border-width: 4px;
}

/* States */
.avatar-clickable {
  cursor: pointer;
}

.avatar-clickable:hover {
  transform: scale(1.1);
  border-color: var(--color-primary);
  box-shadow: var(--shadow-md);
}

/* Image */
.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Fallback */
.avatar-fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: white;
  font-weight: 700;
}

.fallback-text {
  text-transform: uppercase;
}

/* Badge */
.avatar-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  font-size: 10px;
  font-weight: 700;
  color: white;
  border: 2px solid white;
}

.badge-primary {
  background: var(--color-primary);
}

.badge-success {
  background: #52c41a;
}

.badge-warning {
  background: #fbbf24;
}

.badge-danger {
  background: #f43f5e;
}

/* Status */
.avatar-status {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid white;
}

.status-online {
  background: #52c41a;
}

.status-offline {
  background: #9ca3af;
}

.status-busy {
  background: #f43f5e;
}

.status-away {
  background: #fbbf24;
}
</style>
