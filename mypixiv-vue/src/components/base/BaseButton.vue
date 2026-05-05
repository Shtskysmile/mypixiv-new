<template>
  <button
    :class="buttonClasses"
    :type="type"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <span v-if="loading" class="button-loader"></span>
    <span v-if="icon && !loading" class="button-icon">{{ icon }}</span>
    <span class="button-text"><slot /></span>
  </button>
</template>

<script>
/**
 * BaseButton - 基础按钮组件
 *
 * Props:
 * - variant: 按钮变体 ('primary', 'secondary', 'success', 'danger', 'warning', 'ghost')
 * - size: 按钮尺寸 ('small', 'medium', 'large')
 * - type: HTML 按钮类型 ('button', 'submit', 'reset')
 * - disabled: 是否禁用
 * - loading: 是否加载中
 * - icon: 图标（emoji 或 icon class）
 * - block: 是否块级按钮（占满宽度）
 */
export default {
  name: 'BaseButton',
  props: {
    variant: {
      type: String,
      default: 'primary',
      validator: value => ['primary', 'secondary', 'success', 'danger', 'warning', 'ghost'].includes(value)
    },
    size: {
      type: String,
      default: 'medium',
      validator: value => ['small', 'medium', 'large'].includes(value)
    },
    type: {
      type: String,
      default: 'button'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String,
      default: null
    },
    block: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    buttonClasses() {
      return [
        'anime-button',
        `anime-button-${this.variant}`,
        `anime-button-${this.size}`,
        {
          'anime-button-block': this.block,
          'anime-button-loading': this.loading,
          'anime-button-disabled': this.disabled
        }
      ];
    }
  },
  methods: {
    handleClick(event) {
      if (!this.disabled && !this.loading) {
        this.$emit('click', event);
      }
    }
  }
};
</script>

<style scoped>
.anime-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-xl);
  border: none;
  border-radius: var(--radius-md);
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  transition: var(--transition-base);
  white-space: nowrap;
  user-select: none;
}

/* Variants */
.anime-button-primary {
  background: var(--gradient-primary);
  color: white;
}

.anime-button-secondary {
  background: var(--gradient-secondary);
  color: white;
}

.anime-button-success {
  background: var(--gradient-success);
  color: white;
}

.anime-button-danger {
  background: var(--gradient-danger);
  color: white;
}

.anime-button-warning {
  background: var(--gradient-warning);
  color: white;
}

.anime-button-ghost {
  background: transparent;
  color: var(--color-primary);
  border: 2px solid var(--color-primary);
}

/* Sizes */
.anime-button-small {
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: 12px;
}

.anime-button-medium {
  padding: var(--spacing-md) var(--spacing-xl);
  font-size: 14px;
}

.anime-button-large {
  padding: var(--spacing-lg) var(--spacing-2xl);
  font-size: 16px;
}

/* States */
.anime-button:hover:not(.anime-button-disabled):not(.anime-button-loading) {
  transform: translateY(-2px);
  box-shadow: var(--shadow-button);
}

.anime-button:active:not(.anime-button-disabled):not(.anime-button-loading) {
  transform: translateY(0);
}

.anime-button-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.anime-button-loading {
  cursor: wait;
}

.anime-button-block {
  width: 100%;
}

/* Icon */
.button-icon {
  font-size: 1.2em;
}

/* Loader */
.button-loader {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
