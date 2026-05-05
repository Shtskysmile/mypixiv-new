<template>
  <nav class="navbar sticky-navbar" role="navigation" aria-label="main navigation">
    <component :is="wrapperComponent" :class="wrapperClass">
      <!-- Brand -->
      <div class="navbar-brand">
        <router-link class="navbar-item logo-item" to="/index">
          <img
            class="site-logo"
            src="@/assets/images/Pixiv_Icon.svg"
            alt="logo"
          />
          <span class="logo-text">PCOI</span>
        </router-link>

        <!-- Mobile Menu Toggle -->
        <a
          role="button"
          class="navbar-burger"
          :class="{ 'is-active': isBurgerActive }"
          aria-label="menu"
          :aria-expanded="isBurgerActive"
          @click="toggleBurger"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <!-- Menu -->
      <div class="navbar-menu" :class="{ 'is-active': isBurgerActive }">
        <div class="navbar-start"></div>

        <!-- Search Bar -->
        <div class="navbar-center">
          <div class="navbar-item nav-search">
            <form class="search-form" @submit.prevent="handleSearch">
              <div class="search-input-wrapper">
                <span class="search-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                  </svg>
                </span>
                <input
                  v-model="searchKeyword"
                  class="search-input"
                  type="text"
                  placeholder="搜索插画、作者..."
                  @keyup.enter="handleSearch"
                />
                <button class="search-button" type="submit">搜索</button>
              </div>
            </form>
          </div>
        </div>

        <!-- User Menu -->
        <div class="navbar-end">
          <div class="navbar-item">
            <!-- Logged In State -->
            <div v-if="isLoggedIn" class="user-menu">
              <router-link :to="`/user/${userId}`" class="user-profile-link">
                <BaseAvatar
                  :src="userAvatar"
                  :alt="username"
                  size="xs"
                  class="navbar-avatar"
                />
                <span class="username">{{ username }}</span>
              </router-link>
              <BaseButton
                variant="ghost"
                size="small"
                class="btn-logout"
                @click="handleLogout"
              >
                注销
              </BaseButton>
            </div>

            <!-- Not Logged In State -->
            <div v-else class="buttons">
              <router-link class="button btn-register" to="/register">
                <strong>注册</strong>
              </router-link>
              <router-link class="button btn-login" to="/login">登录</router-link>
            </div>
          </div>
        </div>
      </div>
    </component>
  </nav>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import BaseAvatar from './base/BaseAvatar.vue';
import BaseButton from './base/BaseButton.vue';
import imageUrlMixin from '@/mixins/imageUrl';

/**
 * Navbar - 导航栏组件
 * Refactored to use Vuex and eliminate template duplication
 *
 * Props:
 * - noContainer: 是否不使用 container 包裹（用于已有 container 的页面）
 */
export default {
  name: 'AppNavbar',
  components: {
    BaseAvatar,
    BaseButton
  },
  mixins: [imageUrlMixin],
  props: {
    noContainer: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      searchKeyword: '',
      isBurgerActive: false
    };
  },
  computed: {
    ...mapState('user', ['userId', 'username', 'userAvatar']),
    ...mapGetters('user', ['isLoggedIn']),

    // Dynamic wrapper component (div or div.container)
    wrapperComponent() {
      return 'div';
    },

    wrapperClass() {
      return this.noContainer ? 'navbar-inner' : 'container';
    }
  },
  mounted() {
    // Listen for search refresh events
    window.addEventListener('refresh-search', this.handleSearchRefresh);
  },
  beforeDestroy() {
    window.removeEventListener('refresh-search', this.handleSearchRefresh);
  },
  methods: {
    ...mapActions('user', ['logout']),

    handleLogout() {
      this.logout();
      this.$router.push('/').catch(err => err);
      this.isBurgerActive = false;
    },

    toggleBurger() {
      this.isBurgerActive = !this.isBurgerActive;
    },

    handleSearch() {
      const keyword = (this.searchKeyword || '').trim();

      if (keyword) {
        const target = {
          path: '/search',
          query: {
            keyword: String(keyword),
            type: 'name'
          }
        };

        // Check if already on the same search
        const isSameSearch =
          this.$route.path === target.path &&
          this.$route.query.keyword === target.query.keyword &&
          this.$route.query.type === target.query.type;

        if (isSameSearch) {
          // Trigger refresh event for search page
          window.dispatchEvent(new CustomEvent('refresh-search'));
        } else {
          // Navigate to search page
          this.$router.push(target).catch(err => err);
        }
      } else {
        // No keyword, go to index
        const target = { path: '/index', query: { page: '1' } };

        if (
          this.$route.path === target.path &&
          this.$route.query.page === '1' &&
          !this.$route.query.search
        ) {
          return;
        }

        this.$router.push(target).catch(err => err);
      }

      this.isBurgerActive = false;
    },

    handleSearchRefresh() {
      // Handler for search refresh events
      console.log('🔄 Search refresh triggered');
    }
  }
};
</script>

<style scoped>
@import "../assets/css/sticky-navbar.css";

.sticky-navbar {
  background: linear-gradient(135deg, #0096ff 0%, #1e6fff 50%, #0052d4 100%);
  color: #ffffff;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
  transition: var(--transition-base);
}

.sticky-navbar:hover {
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.15);
}

.sticky-navbar .navbar-item,
.sticky-navbar .navbar-link,
.sticky-navbar .navbar-burger span {
  color: #ffffff;
}

/* navbar-inner for noContainer mode */
.navbar-inner {
  max-width: 1344px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: stretch;
  min-height: 3.25rem;
  width: 100%;
}

@media screen and (min-width: 1024px) {
  .navbar-inner {
    padding: 0 32px;
  }
}

@media screen and (min-width: 1216px) {
  .navbar-inner {
    max-width: 1152px;
  }
}

@media screen and (min-width: 1408px) {
  .navbar-inner {
    max-width: 1344px;
  }
}

/* Logo */
.logo-item {
  padding: 8px 14px;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: transform 0.3s ease;
}

.logo-item:hover {
  transform: scale(1.05);
}

.logo-item .site-logo {
  height: 48px;
  width: auto;
  display: block;
}

.logo-text {
  font-size: 24px;
  font-weight: 900;
  letter-spacing: 2px;
  background: linear-gradient(135deg, #ffffff 0%, #e0f2ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Search */
.navbar-center {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.nav-search {
  width: 100%;
  max-width: 500px;
}

.search-form {
  width: 100%;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.15);
  border-radius: var(--radius-round);
  padding: 4px;
  transition: var(--transition-base);
  backdrop-filter: blur(10px);
}

.search-input-wrapper:focus-within {
  background: rgba(255, 255, 255, 0.25);
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.2);
}

.search-icon {
  position: absolute;
  left: 16px;
  color: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  color: white;
  padding: 10px 16px 10px 48px;
  font-size: 14px;
  outline: none;
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.search-button {
  background: rgba(255, 255, 255, 0.95);
  color: #1e6fff;
  border: none;
  padding: 8px 20px;
  border-radius: var(--radius-round);
  font-weight: 700;
  cursor: pointer;
  transition: var(--transition-base);
  white-space: nowrap;
}

.search-button:hover {
  background: white;
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* User Menu */
.user-menu {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.user-profile-link {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-xs) var(--spacing-md);
  border-radius: var(--radius-round);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  text-decoration: none;
  transition: var(--transition-base);
}

.user-profile-link:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.navbar-avatar {
  border-color: rgba(255, 255, 255, 0.3) !important;
}

.username {
  font-weight: 600;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.btn-logout {
  color: white !important;
  border-color: rgba(255, 255, 255, 0.3) !important;
}

.btn-logout:hover {
  background: rgba(255, 255, 255, 0.1) !important;
  border-color: white !important;
}

/* Buttons */
.buttons {
  display: flex;
  gap: var(--spacing-sm);
}

.btn-register,
.btn-login {
  border-radius: var(--radius-md);
  font-weight: 600;
  transition: var(--transition-base);
}

.btn-register {
  background: white;
  color: #1e6fff;
  border: none;
}

.btn-register:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.3);
}

.btn-login {
  background: transparent;
  color: white;
  border: 2px solid white;
}

.btn-login:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

/* Mobile */
@media screen and (max-width: 1023px) {
  .navbar-center {
    max-width: 100%;
  }

  .nav-search {
    max-width: 100%;
  }

  .navbar-menu {
    background: linear-gradient(135deg, #0096ff 0%, #1e6fff 50%, #0052d4 100%);
  }

  .username {
    max-width: 80px;
  }
}
</style>
