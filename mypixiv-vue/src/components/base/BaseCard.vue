<template>
  <div :class="cardClasses" @click="handleClick">
    <div v-if="$slots.header || title" class="card-header">
      <slot name="header">
        <h3 class="card-title">{{ title }}</h3>
      </slot>
      <div v-if="$slots.actions" class="card-actions">
        <slot name="actions" />
      </div>
    </div>

    <div v-if="$slots.image" class="card-image">
      <slot name="image" />
    </div>

    <div class="card-body" :style="bodyStyle">
      <slot />
    </div>

    <div v-if="$slots.footer" class="card-footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script>
/**
 * BaseCard - 基础卡片组件
 *
 * Props:
 * - title: 卡片标题
 * - shadow: 阴影级别 ('none', 'sm', 'md', 'lg')
 * - hoverable: 是否有悬停效果
 * - clickable: 是否可点击
 * - bordered: 是否显示边框
 * - padding: 内边距 ('none', 'sm', 'md', 'lg')
 *
 * Slots:
 * - header: 自定义头部
 * - actions: 头部操作按钮
 * - image: 卡片图片
 * - default: 卡片内容
 * - footer: 卡片底部
 */
export default {
  name: 'BaseCard',
  props: {
    title: {
      type: String,
      default: null
    },
    shadow: {
      type: String,
      default: 'md',
      validator: value => ['none', 'sm', 'md', 'lg'].includes(value)
    },
    hoverable: {
      type: Boolean,
      default: false
    },
    clickable: {
      type: Boolean,
      default: false
    },
    bordered: {
      type: Boolean,
      default: true
    },
    padding: {
      type: String,
      default: 'md',
      validator: value => ['none', 'sm', 'md', 'lg'].includes(value)
    }
  },
  computed: {
    cardClasses() {
      return [
        'base-card',
        `card-shadow-${this.shadow}`,
        {
          'card-hoverable': this.hoverable,
          'card-clickable': this.clickable,
          'card-bordered': this.bordered
        }
      ];
    },
    bodyStyle() {
      const paddingMap = {
        none: '0',
        sm: 'var(--spacing-md)',
        md: 'var(--spacing-xl)',
        lg: 'var(--spacing-2xl)'
      };
      return {
        padding: paddingMap[this.padding]
      };
    }
  },
  methods: {
    handleClick(event) {
      if (this.clickable) {
        this.$emit('click', event);
      }
    }
  }
};
</script>

<style scoped>
.base-card {
  background: rgba(255, 255, 255, 0.98);
  border-radius: var(--radius-xl);
  overflow: hidden;
  transition: var(--transition-base);
}

/* Shadows */
.card-shadow-none {
  box-shadow: none;
}

.card-shadow-sm {
  box-shadow: var(--shadow-sm);
}

.card-shadow-md {
  box-shadow: var(--shadow-md);
}

.card-shadow-lg {
  box-shadow: var(--shadow-lg);
}

/* States */
.card-bordered {
  border: 2px solid var(--border-color);
}

.card-hoverable:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.card-clickable {
  cursor: pointer;
}

.card-clickable:active {
  transform: translateY(-2px);
}

/* Header */
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-lg) var(--spacing-xl);
  border-bottom: 2px solid var(--border-color);
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
}

.card-title {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: var(--color-text);
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.card-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

/* Image */
.card-image {
  position: relative;
  width: 100%;
  overflow: hidden;
  background: #f3f4f6;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* Body */
.card-body {
  color: var(--color-text);
}

/* Footer */
.card-footer {
  padding: var(--spacing-lg) var(--spacing-xl);
  border-top: 2px solid var(--border-color);
  background: rgba(247, 250, 252, 0.5);
}
</style>
