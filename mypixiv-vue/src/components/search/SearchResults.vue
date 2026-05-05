<template>
  <div class="search-results">
    <!-- Loading State -->
    <div v-if="loading" class="loading-container anime-box">
      <div class="loading-spinner">
        <div class="spinner-ring animate-spin"></div>
        <div class="spinner-ring animate-spin"></div>
        <div class="spinner-ring animate-spin"></div>
        <span class="loading-text">搜索中...</span>
      </div>
    </div>

    <!-- Results -->
    <div v-else>
      <!-- Result Filter Navigation -->
      <div v-if="hasResults" class="result-filter-nav anime-box">
        <div class="filter-tabs">
          <button
            v-for="filter in availableFilters"
            :key="filter.value"
            :class="['filter-tab', { active: resultFilter === filter.value }]"
            @click="$emit('update:resultFilter', filter.value)"
          >
            <span class="filter-icon">{{ filter.icon }}</span>
            <span class="filter-text">{{ filter.label }}</span>
            <span class="filter-count">{{ filter.count }}</span>
          </button>
        </div>
      </div>

      <!-- User Results -->
      <div v-if="shouldShowUsers && users.length > 0" class="results-section anime-box">
        <h2 class="section-title">
          <span class="section-icon">👥</span>
          用户 ({{ users.length }})
        </h2>
        <div class="users-grid">
          <UserCard
            v-for="(user, index) in users"
            :key="user.userId"
            :user="user"
            :show-stats="false"
            :show-role="true"
            :style="{ animationDelay: `${index * 0.05}s` }"
            class="animate-fadeInUp"
          />
        </div>
      </div>

      <!-- User Empty State -->
      <div v-if="shouldShowUsers && users.length === 0 && resultFilter === 'user'" class="empty-results anime-box">
        <div class="empty-icon">👥</div>
        <h3 class="empty-title">未找到相关用户</h3>
        <p class="empty-text">
          {{ searchType === 'tag' ? '标签搜索不支持用户搜索' : '没有搜索到符合条件的用户' }}
        </p>
      </div>

      <!-- Illustration Results -->
      <div v-if="shouldShowIllustrations && illustrations.length > 0" class="results-section anime-box">
        <h2 class="section-title">
          <span class="section-icon">🖼️</span>
          插画 ({{ illustrations.length }})
        </h2>
        <div class="artwork-grid">
          <ArtworkCard
            v-for="(artwork, index) in illustrations"
            :key="artwork.contributionId"
            :artwork="artwork"
            :style="{ animationDelay: `${index * 0.05}s` }"
            class="animate-fadeInUp"
          />
        </div>
      </div>

      <!-- Illustration Empty State -->
      <div v-if="shouldShowIllustrations && illustrations.length === 0 && resultFilter === 'illustration'" class="empty-results anime-box">
        <div class="empty-icon">🖼️</div>
        <h3 class="empty-title">未找到相关插画</h3>
        <p class="empty-text">没有搜索到符合条件的插画作品</p>
      </div>

      <!-- Manga Results -->
      <div v-if="shouldShowMangas && mangas.length > 0" class="results-section anime-box">
        <h2 class="section-title">
          <span class="section-icon">📚</span>
          漫画 ({{ mangas.length }})
        </h2>
        <div class="artwork-grid">
          <ArtworkCard
            v-for="(artwork, index) in mangas"
            :key="artwork.contributionId"
            :artwork="artwork"
            :style="{ animationDelay: `${index * 0.05}s` }"
            class="animate-fadeInUp"
          />
        </div>
      </div>

      <!-- Manga Empty State -->
      <div v-if="shouldShowMangas && mangas.length === 0 && resultFilter === 'manga'" class="empty-results anime-box">
        <div class="empty-icon">📚</div>
        <h3 class="empty-title">未找到相关漫画</h3>
        <p class="empty-text">没有搜索到符合条件的漫画作品</p>
      </div>

      <!-- No Results State -->
      <div v-if="!loading && !hasResults" class="empty-results anime-box">
        <div class="empty-icon">🔍</div>
        <h3 class="empty-title">未找到相关结果</h3>
        <p class="empty-text">尝试使用不同的关键词或切换搜索类型</p>
      </div>
    </div>
  </div>
</template>

<script>
import ArtworkCard from '@/components/common/ArtworkCard.vue';
import UserCard from '@/components/common/UserCard.vue';

/**
 * SearchResults - 搜索结果展示组件
 * Displays search results with filtering
 *
 * Props:
 * - loading: 是否正在加载
 * - users: 用户结果数组
 * - illustrations: 插画结果数组
 * - mangas: 漫画结果数组
 * - resultFilter: 结果过滤器 ('all', 'user', 'illustration', 'manga')
 * - searchType: 搜索类型 ('id', 'name', 'tag')
 *
 * Events:
 * - update:resultFilter - 结果过滤器变化
 */
export default {
  name: 'SearchResults',
  components: {
    ArtworkCard,
    UserCard
  },
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    users: {
      type: Array,
      default: () => []
    },
    illustrations: {
      type: Array,
      default: () => []
    },
    mangas: {
      type: Array,
      default: () => []
    },
    resultFilter: {
      type: String,
      default: 'all',
      validator: value => ['all', 'user', 'illustration', 'manga'].includes(value)
    },
    searchType: {
      type: String,
      default: 'name'
    }
  },
  computed: {
    hasResults() {
      return this.users.length > 0 || this.illustrations.length > 0 || this.mangas.length > 0;
    },
    totalResultsCount() {
      let count = this.illustrations.length + this.mangas.length;
      if (this.searchType !== 'tag') {
        count += this.users.length;
      }
      return count;
    },
    availableFilters() {
      return [
        { value: 'all', icon: '📋', label: '全部', count: this.totalResultsCount },
        { value: 'illustration', icon: '🖼️', label: '插画', count: this.illustrations.length },
        { value: 'manga', icon: '📚', label: '漫画', count: this.mangas.length },
        { value: 'user', icon: '👥', label: '用户', count: this.searchType === 'tag' ? 0 : this.users.length }
      ];
    },
    shouldShowUsers() {
      // Show users when filter is 'user' or 'all' (and not tag search)
      if (this.resultFilter === 'user') return true;
      return this.resultFilter === 'all' && this.searchType !== 'tag';
    },
    shouldShowIllustrations() {
      return this.resultFilter === 'all' || this.resultFilter === 'illustration';
    },
    shouldShowMangas() {
      return this.resultFilter === 'all' || this.resultFilter === 'manga';
    }
  }
};
</script>

<style scoped>
.search-results {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

/* Loading */
.loading-container {
  padding: var(--spacing-2xl);
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xl);
}

.spinner-ring {
  width: 60px;
  height: 60px;
  border: 4px solid rgba(102, 126, 234, 0.1);
  border-top-color: var(--color-primary);
  border-radius: 50%;
}

.loading-text {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-light);
}

/* Filter Navigation */
.result-filter-nav {
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
}

.filter-tabs {
  display: flex;
  gap: var(--spacing-md);
  flex-wrap: wrap;
}

.filter-tab {
  flex: 1;
  min-width: 120px;
  padding: var(--spacing-md) var(--spacing-lg);
  border: 2px solid var(--border-color);
  border-radius: var(--radius-md);
  background: white;
  cursor: pointer;
  transition: var(--transition-base);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
}

.filter-tab:hover {
  border-color: var(--color-primary);
  background: rgba(102, 126, 234, 0.05);
}

.filter-tab.active {
  background: var(--gradient-primary);
  color: white;
  border-color: transparent;
  transform: translateY(-2px);
  box-shadow: var(--shadow-button);
}

.filter-icon {
  font-size: 18px;
}

.filter-text {
  font-weight: 600;
}

.filter-count {
  padding: 2px var(--spacing-sm);
  background: rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-round);
  font-size: 12px;
  font-weight: 700;
}

.filter-tab.active .filter-count {
  background: rgba(255, 255, 255, 0.3);
}

/* Results Section */
.results-section {
  padding: var(--spacing-xl);
}

.section-title {
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 var(--spacing-xl) 0;
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.section-icon {
  font-size: 28px;
  filter: grayscale(1);
}

/* Users Grid */
.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: var(--spacing-xl);
}

/* Artwork Grid */
.artwork-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--spacing-xl);
}

/* Empty Results */
.empty-results {
  padding: var(--spacing-2xl);
  text-align: center;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-lg);
}

.empty-icon {
  font-size: 80px;
  opacity: 0.3;
  filter: grayscale(1);
}

.empty-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-text);
  margin: 0;
}

.empty-text {
  font-size: 16px;
  color: var(--color-text-light);
  margin: 0;
}

@media (max-width: 768px) {
  .users-grid,
  .artwork-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: var(--spacing-md);
  }

  .filter-tabs {
    flex-direction: column;
  }

  .filter-tab {
    min-width: 100%;
  }
}
</style>
