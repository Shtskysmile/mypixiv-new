<template>
  <div class="search-filters anime-box">
    <!-- Title Section -->
    <div class="title-wrapper">
      <div class="title-icon-wrapper">
        <span class="title-icon">🔍</span>
        <div class="icon-glow"></div>
      </div>
      <div class="title-content">
        <h1 class="page-title">
          <span class="title-text">搜索</span>
          <span class="title-badge">Search</span>
        </h1>
        <p class="page-subtitle">
          <span class="subtitle-icon">✨</span>
          探索你想要的内容
          <span class="subtitle-icon">✨</span>
        </p>
      </div>
    </div>

    <!-- Search Input -->
    <div class="search-box-wrapper">
      <div class="search-input-group">
        <span class="search-icon">🔎</span>
        <input
          type="text"
          class="search-input anime-input"
          :value="keyword"
          @input="$emit('update:keyword', $event.target.value)"
          @keyup.enter="$emit('search')"
          placeholder="输入关键词搜索..."
        />
        <BaseButton
          variant="primary"
          icon="🔍"
          @click="$emit('search')"
        >
          搜索
        </BaseButton>
      </div>
    </div>

    <!-- Search Type Tabs -->
    <div class="search-type-tabs">
      <button
        v-for="type in searchTypes"
        :key="type.value"
        :class="['tab-button', { active: searchType === type.value }]"
        @click="$emit('update:searchType', type.value)"
      >
        <span class="tab-icon">{{ type.icon }}</span>
        {{ type.label }}
      </button>
    </div>

    <!-- Current Keyword Display -->
    <div v-if="currentKeyword" class="current-keyword">
      <span class="keyword-label">当前搜索：</span>
      <span class="keyword-value">{{ currentKeyword }}</span>
      <span class="keyword-type">({{ searchTypeLabel }})</span>
    </div>
  </div>
</template>

<script>
import BaseButton from '@/components/base/BaseButton.vue';

/**
 * SearchFilters - 搜索过滤器组件
 * Search filters including input and type selection
 *
 * Props:
 * - keyword: 输入框的值 (v-model)
 * - searchType: 搜索类型 ('id', 'name', 'tag')
 * - currentKeyword: 当前正在搜索的关键词
 *
 * Events:
 * - update:keyword - 输入框值变化
 * - update:searchType - 搜索类型变化
 * - search - 执行搜索
 */
export default {
  name: 'SearchFilters',
  components: {
    BaseButton
  },
  props: {
    keyword: {
      type: String,
      default: ''
    },
    searchType: {
      type: String,
      default: 'name',
      validator: value => ['id', 'name', 'tag'].includes(value)
    },
    currentKeyword: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      searchTypes: [
        { value: 'id', icon: '🆔', label: 'ID搜索' },
        { value: 'name', icon: '👤', label: '名称搜索' },
        { value: 'tag', icon: '🏷️', label: '标签搜索' }
      ]
    };
  },
  computed: {
    searchTypeLabel() {
      const type = this.searchTypes.find(t => t.value === this.searchType);
      return type ? type.label : '名称搜索';
    }
  }
};
</script>

<style scoped>
.search-filters {
  padding: var(--spacing-2xl);
  margin-bottom: var(--spacing-xl);
}

/* Title Section */
.title-wrapper {
  display: flex;
  align-items: center;
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-2xl);
}

.title-icon-wrapper {
  position: relative;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.title-icon {
  font-size: 48px;
  position: relative;
  z-index: 1;
  animation: icon-float 3s ease-in-out infinite;
}

@keyframes icon-float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-10px) rotate(5deg);
  }
}

.icon-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  background: var(--gradient-primary);
  border-radius: 50%;
  opacity: 0.2;
  filter: blur(20px);
  animation: glow-pulse 2s ease-in-out infinite;
}

@keyframes glow-pulse {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.2;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 0.3;
  }
}

.title-content {
  flex: 1;
}

.page-title {
  font-size: 36px;
  font-weight: 700;
  margin: 0 0 var(--spacing-sm) 0;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.title-badge {
  font-size: 14px;
  padding: var(--spacing-xs) var(--spacing-md);
  background: var(--gradient-primary);
  color: white;
  border-radius: var(--radius-round);
  font-weight: 600;
}

.page-subtitle {
  font-size: 16px;
  color: var(--color-text-light);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.subtitle-icon {
  animation: sparkle 2s ease-in-out infinite;
}

/* Search Input */
.search-box-wrapper {
  margin-bottom: var(--spacing-xl);
}

.search-input-group {
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.search-icon {
  position: absolute;
  left: var(--spacing-lg);
  font-size: 20px;
  z-index: 1;
  opacity: 0.5;
}

.search-input {
  flex: 1;
  padding: var(--spacing-lg) var(--spacing-lg) var(--spacing-lg) 50px;
  font-size: 16px;
  border: 2px solid var(--border-color);
  border-radius: var(--radius-md);
  transition: var(--transition-base);
}

.search-input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
  outline: none;
}

/* Search Type Tabs */
.search-type-tabs {
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.tab-button {
  flex: 1;
  padding: var(--spacing-md) var(--spacing-lg);
  border: 2px solid var(--border-color);
  border-radius: var(--radius-md);
  background: white;
  color: var(--color-text);
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition-base);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
}

.tab-button:hover {
  border-color: var(--color-primary);
  background: rgba(102, 126, 234, 0.05);
}

.tab-button.active {
  background: var(--gradient-primary);
  color: white;
  border-color: transparent;
  transform: translateY(-2px);
  box-shadow: var(--shadow-button);
}

.tab-icon {
  font-size: 18px;
}

/* Current Keyword */
.current-keyword {
  padding: var(--spacing-md);
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  border-radius: var(--radius-md);
  border: 2px solid var(--border-color);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.keyword-label {
  font-weight: 600;
  color: var(--color-text-light);
}

.keyword-value {
  font-weight: 700;
  color: var(--color-primary);
  font-size: 16px;
}

.keyword-type {
  font-size: 12px;
  color: var(--color-text-lighter);
}

@media (max-width: 768px) {
  .title-wrapper {
    flex-direction: column;
    text-align: center;
  }

  .page-title {
    font-size: 28px;
    justify-content: center;
  }

  .search-type-tabs {
    flex-direction: column;
  }
}
</style>
