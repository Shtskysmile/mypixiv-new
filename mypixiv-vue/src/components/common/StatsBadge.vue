<template>
  <span :class="badgeClasses">
    <span v-if="icon" class="badge-icon">{{ icon }}</span>
    <span class="badge-value">{{ formattedValue }}</span>
  </span>
</template>

<script>
import formattersMixin from '@/mixins/formatters';

/**
 * StatsBadge - 统计徽章组件
 * 用于显示统计数据（浏览量、点赞数、收藏数等）
 *
 * Props:
 * - value: 数值
 * - icon: 图标（emoji）
 * - variant: 变体 ('default', 'primary', 'success', 'warning', 'danger')
 * - size: 尺寸 ('small', 'medium', 'large')
 */
export default {
  name: 'StatsBadge',
  mixins: [formattersMixin],
  props: {
    value: {
      type: [Number, String],
      required: true
    },
    icon: {
      type: String,
      default: null
    },
    variant: {
      type: String,
      default: 'default',
      validator: value => ['default', 'primary', 'success', 'warning', 'danger'].includes(value)
    },
    size: {
      type: String,
      default: 'medium',
      validator: value => ['small', 'medium', 'large'].includes(value)
    }
  },
  computed: {
    badgeClasses() {
      return [
        'stats-badge',
        `badge-${this.variant}`,
        `badge-${this.size}`
      ];
    },
    formattedValue() {
      return this.formatCount(this.value);
    }
  }
};
</script>

<style scoped>
.stats-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-round);
  font-weight: 700;
  white-space: nowrap;
  transition: var(--transition-fast);
}

/* Variants */
.badge-default {
  background: rgba(255, 255, 255, 0.95);
  color: var(--color-text);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.badge-primary {
  background: var(--gradient-primary);
  color: white;
}

.badge-success {
  background: var(--gradient-success);
  color: white;
}

.badge-warning {
  background: var(--gradient-warning);
  color: white;
}

.badge-danger {
  background: var(--gradient-danger);
  color: white;
}

/* Sizes */
.badge-small {
  font-size: 11px;
  padding: 2px var(--spacing-sm);
}

.badge-small .badge-icon {
  font-size: 12px;
}

.badge-medium {
  font-size: 13px;
  padding: var(--spacing-xs) var(--spacing-md);
}

.badge-medium .badge-icon {
  font-size: 14px;
}

.badge-large {
  font-size: 15px;
  padding: var(--spacing-sm) var(--spacing-lg);
}

.badge-large .badge-icon {
  font-size: 16px;
}

/* Icon */
.badge-icon {
  line-height: 1;
}

.badge-value {
  line-height: 1;
}

/* Hover effect for clickable badges */
.stats-badge:hover {
  transform: scale(1.05);
}
</style>
