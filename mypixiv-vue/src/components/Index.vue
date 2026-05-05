<template>
  <div class="index-page-root">
    <!-- Background -->
    <div class="page-bg" :style="bgStyle"></div>
    <div class="page-overlay"></div>

    <!-- Decorative Elements -->
    <div class="particles">
      <div
        v-for="i in 20"
        :key="i"
        class="particle"
        :style="getParticleStyle(i)"
      ></div>
    </div>

    <div class="floating-decorations">
      <div class="float-star star-1 animate-float">✨</div>
      <div class="float-star star-2 animate-sparkle">⭐</div>
      <div class="float-star star-3 animate-float">💫</div>
      <div class="float-heart heart-1 animate-heartbeat">💖</div>
      <div class="float-heart heart-2 animate-heartbeat">💗</div>
    </div>

    <!-- Content -->
    <div class="container">
      <Navbar />

      <div class="columns">
        <div class="column is-one-fifth">
          <Sidebar />
        </div>

        <div class="column">
          <!-- Header Section -->
          <div class="header-section anime-box">
            <div class="title-wrapper">
              <div class="title-icon-wrapper">
                <span class="title-icon">🎨</span>
                <div class="icon-glow"></div>
              </div>
              <div class="title-content">
                <h1 class="page-title">
                  <span class="title-text">全部作品</span>
                  <span class="title-badge">Gallery</span>
                </h1>
                <p class="page-subtitle">
                  <span class="subtitle-icon">✨</span>
                  发现精彩的插画与漫画作品
                  <span class="subtitle-icon">✨</span>
                </p>
              </div>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="loading" class="loading-container anime-box">
            <div class="loading-spinner">
              <div class="spinner-ring animate-spin"></div>
              <div class="spinner-ring animate-spin"></div>
              <div class="spinner-ring animate-spin"></div>
              <span class="loading-text">加载中...</span>
            </div>
          </div>

          <!-- Gallery Section -->
          <div v-else class="gallery-section anime-box">
            <div v-if="artworkList.length > 0" class="artwork-grid">
              <ArtworkCard
                v-for="(artwork, index) in paginatedArtworks"
                :key="artwork.contributionId"
                :artwork="artwork"
                :style="{ animationDelay: `${index * 0.05}s` }"
                class="animate-fadeInUp"
              />
            </div>

            <!-- Empty State -->
            <div v-else class="empty-state">
              <div class="empty-icon-wrapper">
                <span class="empty-icon">🎨</span>
                <div class="empty-icon-bg"></div>
              </div>
              <p class="empty-title">暂无作品</p>
              <p class="empty-desc">快来上传你的第一幅作品吧！</p>
              <BaseButton
                v-if="isLoggedIn"
                variant="primary"
                icon="📤"
                @click="$router.push('/user')"
              >
                上传作品
              </BaseButton>
            </div>
          </div>

          <!-- Pagination -->
          <div v-if="totalPage > 1 && !loading" class="pagination-section anime-box">
            <Pagination :page="page" :total-page="totalPage" @update:page="handlePageChange" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import Navbar from './Navbar.vue';
import Sidebar from './Sidebar.vue';
import ArtworkCard from './common/ArtworkCard.vue';
import Pagination from './Pagination.vue';
import BaseButton from './base/BaseButton.vue';

/**
 * Index - 首页/作品列表页面
 * Homepage with artwork gallery (refactored with Vuex)
 */
export default {
  name: 'IndexPage',
  components: {
    Navbar,
    Sidebar,
    ArtworkCard,
    Pagination,
    BaseButton
  },
  data() {
    return {
      page: 1,
      pageSize: 35,
      bgStyle: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -2
      }
    };
  },
  computed: {
    ...mapState('artwork', ['artworkList', 'loading']),
    ...mapGetters('user', ['isLoggedIn']),

    paginatedArtworks() {
      const start = (this.page - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.artworkList.slice(start, end);
    },

    totalPage() {
      return Math.ceil(this.artworkList.length / this.pageSize);
    }
  },
  mounted() {
    // Get page from URL
    this.page = this.getPageFromUrl();
    // Load artworks
    this.loadArtworks();
  },
  watch: {
    '$route.query.page'() {
      this.page = this.getPageFromUrl();
    }
  },
  methods: {
    ...mapActions('artwork', ['fetchAllArtworks']),
    ...mapActions('ui', ['showError']),

    async loadArtworks() {
      try {
        await this.fetchAllArtworks();
      } catch (error) {
        console.error('加载作品失败:', error);
        this.showError('加载作品失败');
      }
    },

    getPageFromUrl() {
      const pageParam = this.$route.query.page;
      const parsedPage = parseInt(pageParam);
      return !isNaN(parsedPage) && parsedPage > 0 ? parsedPage : 1;
    },

    handlePageChange(newPage) {
      this.page = newPage;
      this.$router
        .push({ path: '/index', query: { page: String(newPage) } })
        .catch(err => err);

      // Scroll to top smoothly
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    getParticleStyle() {
      const delay = Math.random() * 5;
      const duration = 5 + Math.random() * 10;
      const size = 2 + Math.random() * 4;
      const startX = Math.random() * 100;
      const endX = startX + (Math.random() - 0.5) * 30;
      const startY = 100 + Math.random() * 20;

      return {
        left: `${startX}%`,
        width: `${size}px`,
        height: `${size}px`,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
        '--end-x': `${endX}%`,
        '--start-y': `${startY}%`
      };
    }
  }
};
</script>

<style scoped>
.index-page-root {
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

/* Particles */
.particles {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
}

.particle {
  position: absolute;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.8) 0%,
    rgba(255, 255, 255, 0) 70%
  );
  border-radius: 50%;
  animation: particle-float linear infinite;
}

@keyframes particle-float {
  0% {
    transform: translateY(var(--start-y, 100%)) translateX(0);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-20%) translateX(var(--end-x, 0));
    opacity: 0;
  }
}

/* Floating Decorations */
.floating-decorations {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 0;
}

.float-star,
.float-heart {
  position: absolute;
  font-size: 48px;
  opacity: 0.2;
  filter: blur(1px);
}

.star-1 {
  top: 15%;
  left: 10%;
  animation-duration: 4s;
}

.star-2 {
  top: 60%;
  right: 15%;
  animation-duration: 3s;
  animation-delay: 1s;
}

.star-3 {
  bottom: 20%;
  left: 20%;
  animation-duration: 5s;
  animation-delay: 0.5s;
}

.heart-1 {
  top: 40%;
  right: 25%;
  animation-duration: 2.5s;
}

.heart-2 {
  bottom: 35%;
  right: 10%;
  animation-duration: 3s;
  animation-delay: 0.8s;
}

/* Header Section */
.header-section {
  padding: var(--spacing-2xl);
  margin-bottom: var(--spacing-xl);
}

.title-wrapper {
  display: flex;
  align-items: center;
  gap: var(--spacing-xl);
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
  0%,
  100% {
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
  0%,
  100% {
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

/* Loading */
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  padding: var(--spacing-2xl);
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

/* Gallery */
.gallery-section {
  padding: var(--spacing-xl);
  min-height: 400px;
}

.artwork-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--spacing-xl);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: var(--spacing-2xl);
  min-height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-lg);
}

.empty-icon-wrapper {
  position: relative;
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-icon {
  font-size: 80px;
  position: relative;
  z-index: 1;
  filter: grayscale(1);
  opacity: 0.5;
}

.empty-icon-bg {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  background: var(--gradient-primary);
  border-radius: 50%;
  opacity: 0.1;
  filter: blur(30px);
}

.empty-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-text);
  margin: 0;
}

.empty-desc {
  font-size: 16px;
  color: var(--color-text-light);
  margin: 0;
}

/* Pagination */
.pagination-section {
  padding: var(--spacing-xl);
  margin-top: var(--spacing-xl);
}

/* Responsive */
@media (max-width: 768px) {
  .title-wrapper {
    flex-direction: column;
    text-align: center;
  }

  .page-title {
    font-size: 28px;
    justify-content: center;
  }

  .artwork-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: var(--spacing-md);
  }
}
</style>
