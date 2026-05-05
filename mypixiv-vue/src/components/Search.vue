<template>
  <div class="search-page-root">
    <!-- Background -->
    <div class="page-bg" :style="bgStyle"></div>
    <div class="page-overlay"></div>

    <!-- Decorations -->
    <SearchDecorations />

    <!-- Content -->
    <div class="container">
      <Navbar />

      <div class="columns">
        <div class="column is-one-fifth">
          <Sidebar />
        </div>

        <div class="column">
          <!-- Search Filters -->
          <SearchFilters
            :keyword.sync="searchInput"
            :search-type.sync="searchType"
            :current-keyword="keyword"
            @search="performSearch"
          />

          <!-- Search Results -->
          <SearchResults
            :loading="loading"
            :users="users"
            :illustrations="illustrations"
            :mangas="mangas"
            :result-filter.sync="resultFilter"
            :search-type="searchType"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import Navbar from './Navbar.vue';
import Sidebar from './Sidebar.vue';
import SearchDecorations from './search/SearchDecorations.vue';
import SearchFilters from './search/SearchFilters.vue';
import SearchResults from './search/SearchResults.vue';
import request from '@/utils/request';
import { API_ENDPOINTS } from '@/constants/api';

/**
 * Search - 搜索页面主组件
 * Main search page component (refactored from 1637 lines)
 */
export default {
  name: 'Search',
  components: {
    Navbar,
    Sidebar,
    SearchDecorations,
    SearchFilters,
    SearchResults
  },
  data() {
    return {
      keyword: '',
      searchInput: '',
      searchType: 'name',
      resultFilter: 'all',
      loading: false,
      users: [],
      illustrations: [],
      mangas: [],
      bgStyle: {
        backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }
    };
  },
  mounted() {
    window.addEventListener('refresh-search', this.handleRefreshSearch);
  },
  beforeDestroy() {
    window.removeEventListener('refresh-search', this.handleRefreshSearch);
  },
  watch: {
    '$route.query': {
      handler() {
        this.initSearch();
      },
      immediate: true
    }
  },
  methods: {
    ...mapActions('ui', ['showError']),

    /**
     * Handle refresh search event from navbar
     */
    handleRefreshSearch() {
      if (this.keyword) {
        this.executeSearch();
      }
    },

    /**
     * Initialize search from route query
     */
    initSearch() {
      const query = this.$route.query;
      this.keyword = query.keyword || query.search || '';
      this.searchInput = this.keyword;
      this.searchType = query.type || 'name';

      if (this.keyword) {
        this.executeSearch();
      }
    },

    /**
     * Perform search from input
     */
    performSearch() {
      const keyword = (this.searchInput || '').trim();

      if (!keyword) {
        return;
      }

      // Check if same search
      const isSameSearch =
        this.$route.path === '/search' &&
        this.$route.query.keyword === keyword &&
        this.$route.query.type === this.searchType;

      if (isSameSearch) {
        // Refresh search data
        this.keyword = keyword;
        this.executeSearch();
      } else {
        // Update URL and trigger search
        this.$router
          .push({
            path: '/search',
            query: {
              keyword: keyword,
              type: this.searchType
            }
          })
          .catch(err => err);
      }
    },

    /**
     * Execute search API call
     */
    async executeSearch() {
      if (!this.keyword.trim()) {
        this.users = [];
        this.illustrations = [];
        this.mangas = [];
        return;
      }

      this.loading = true;
      this.users = [];
      this.illustrations = [];
      this.mangas = [];

      try {
        // Determine endpoint based on search type
        const endpointMap = {
          id: API_ENDPOINTS.SEARCH_BY_ID,
          name: API_ENDPOINTS.SEARCH_BY_NAME,
          tag: API_ENDPOINTS.SEARCH_BY_TAG
        };
        const endpoint = endpointMap[this.searchType] || API_ENDPOINTS.SEARCH_BY_NAME;

        // Prepare params
        const params = new URLSearchParams();
        params.append('keyword', this.keyword.trim());

        // Make request
        const response = await request.post(endpoint, params);

        if (response.data?.code === 0) {
          const data = response.data.data || {};
          this.users = data.users || [];
          this.illustrations = data.illustrations || [];
          this.mangas = data.mangas || [];

          console.log(
            `✨ 搜索结果: ${this.users.length} 个用户, ${this.illustrations.length} 个插画, ${this.mangas.length} 个漫画`
          );
        } else {
          console.warn('搜索失败:', response.data?.message);
          this.showError(response.data?.message || '搜索失败');
        }
      } catch (err) {
        console.error('❌ 搜索出错:', err);
        this.showError('搜索失败，请稍后重试');
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.search-page-root {
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
}

.page-bg {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -2;
}

.page-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.95) 0%,
    rgba(247, 250, 252, 0.98) 100%
  );
  z-index: -1;
}

.container {
  position: relative;
  z-index: 1;
}
</style>
