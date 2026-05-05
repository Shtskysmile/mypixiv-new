<template>
  <div class="user-page-root">
    <!-- Background -->
    <div class="user-bg" :style="bgStyle"></div>
    <div class="user-overlay"></div>

    <!-- Content -->
    <div class="user-container">
      <Navbar :no-container="true" />

      <div class="columns is-gapless" style="width: 100%">
        <!-- Sidebar -->
        <div class="column is-one-quarter">
          <UserSidebar
            :current-view="currentView"
            :is-own-profile="isOwnProfile"
            :is-community-admin="isCommunityAdmin"
            :is-system-admin="isSystemAdmin"
            @change-view="handleViewChange"
          />
        </div>

        <!-- Main Content -->
        <div class="column">
          <component
            :is="currentComponent"
            v-bind="currentComponentProps"
            @edit="openEditModal"
            @back="$router.push('/index')"
            @toggle-concern="handleToggleConcern"
            @toggle-block-user="handleToggleBlockUser"
            @unfavorite="handleUnfavorite"
            @unlike="handleUnlike"
            @page-change="handlePageChange"
            @edit-work="handleEditWork"
            @delete-work="handleDeleteWork"
            @delete-comment="handleDeleteComment"
            @remove-follower="handleRemoveFollower"
            @submitted="handleArtworkSubmitted"
            @cancel-edit="cancelEditWork"
          />
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <UserEditModal
      :visible="editModalVisible"
      :user="user"
      @close="closeEditModal"
      @submit="handleEditSubmit"
    />
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import Navbar from '../Navbar.vue';
import UserSidebar from './UserSidebar.vue';
import UserEditModal from './UserEditModal.vue';

// Lazy load view components
const Profile = () => import('./Profile.vue');
const FavoritesList = () => import('./FavoritesList.vue');
const LikesList = () => import('./LikesList.vue');
const WorksList = () => import('./WorksList.vue');
const FollowersList = () => import('./FollowersList.vue');
const CommentsList = () => import('./CommentsList.vue');
const SubmitArtwork = () => import('./SubmitArtwork.vue');
const ChangePassword = () => import('./ChangePassword.vue');
const ChangeSecurityIssues = () => import('./ChangeSecurityIssues.vue');
const AuditWorksList = () => import('./AuditWorksList.vue');
const BlockedWorksList = () => import('./BlockedWorksList.vue');
const BlockedUsersList = () => import('./BlockedUsersList.vue');
const UserManagement = () => import('./UserManagement.vue');
const SystemLogs = () => import('./SystemLogs.vue');

/**
 * User - 用户中心主页面
 * Main user center page (refactored from 1574 lines)
 */
export default {
  name: 'UserPage',
  components: {
    Navbar,
    UserSidebar,
    UserEditModal
  },
  props: {
    id: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      currentView: 'info',
      user: {},
      favorites: [],
      likes: [],
      userWorks: [],
      followers: [],
      comments: [],
      auditData: null,
      editingWork: null,
      isConcerned: false,
      worksPage: 1,
      worksTotal: 0,
      followersPage: 1,
      followersTotal: 0,
      editModalVisible: false,
      bgStyle: {
        backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }
    };
  },
  computed: {
    ...mapState('user', ['userId', 'userRole']),
    ...mapGetters('user', ['isLoggedIn', 'isCommunityAdmin', 'isSystemAdmin']),

    // Is viewing own profile
    isOwnProfile() {
      const viewingUserId = this.id || this.$route.params.id;
      return !viewingUserId || viewingUserId === this.userId;
    },

    // Viewed user's role
    isCommunityAdmin() {
      return this.user.role === 1;
    },

    isSystemAdmin() {
      return this.user.role === 2;
    },

    // Current component to display
    currentComponent() {
      const componentMap = {
        info: Profile,
        favorites: FavoritesList,
        likes: LikesList,
        works: WorksList,
        followers: FollowersList,
        comments: CommentsList,
        submit: SubmitArtwork,
        changePassword: ChangePassword,
        changeSecurityIssues: ChangeSecurityIssues,
        audit: AuditWorksList,
        blockedWorks: BlockedWorksList,
        blockedUsers: BlockedUsersList,
        userManagement: UserManagement,
        systemLogs: SystemLogs
      };
      return componentMap[this.currentView] || Profile;
    },

    // Props to pass to current component
    currentComponentProps() {
      const baseProps = {
        user: this.user,
        isOwnProfile: this.isOwnProfile
      };

      switch (this.currentView) {
        case 'info':
          return {
            ...baseProps,
            isConcerned: this.isConcerned,
            isCommunityAdmin: this.isCommunityAdmin,
            isSystemAdmin: this.isSystemAdmin,
            stats: this.userStats
          };
        case 'favorites':
          return { favorites: this.favorites, isOwnProfile: this.isOwnProfile };
        case 'likes':
          return { likes: this.likes, isOwnProfile: this.isOwnProfile };
        case 'works':
          return {
            works: this.userWorks,
            page: this.worksPage,
            pageSize: 12,
            total: this.worksTotal,
            isOwnProfile: this.isOwnProfile
          };
        case 'followers':
          return {
            followers: this.followers,
            page: this.followersPage,
            pageSize: 10,
            total: this.followersTotal,
            isOwnProfile: this.isOwnProfile
          };
        case 'comments':
          return { comments: this.comments, isOwnProfile: this.isOwnProfile };
        case 'submit':
          return { user: this.user, editWork: this.editingWork };
        case 'audit':
          return { auditData: this.auditData };
        default:
          return baseProps;
      }
    },

    userStats() {
      return {
        following: this.user.followingCount || 0,
        followers: this.user.followerCount || 0,
        works: this.user.contributionCount || 0
      };
    }
  },
  mounted() {
    this.loadUserData();
  },
  watch: {
    '$route.params.id'() {
      this.loadUserData();
    }
  },
  methods: {
    ...mapActions('user', ['fetchUserInfo', 'updateUserInfo']),
    ...mapActions('ui', ['showSuccess', 'showError']),

    async loadUserData() {
      const viewingUserId = this.id || this.$route.params.id || this.userId;

      try {
        const user = await this.fetchUserInfo(viewingUserId);
        if (user) {
          this.user = user;
        }
      } catch (error) {
        console.error('加载用户信息失败:', error);
        this.showError('加载用户信息失败');
      }
    },

    handleViewChange(view) {
      this.currentView = view;

      // Load data for specific views
      switch (view) {
        case 'favorites':
          this.loadFavorites();
          break;
        case 'likes':
          this.loadLikes();
          break;
        case 'works':
          this.loadWorks(1);
          break;
        case 'followers':
          this.loadFollowers(1);
          break;
        case 'comments':
          this.loadComments();
          break;
        case 'audit':
          this.loadAuditData();
          break;
      }
    },

    // Modal handlers
    openEditModal() {
      this.editModalVisible = true;
    },

    closeEditModal() {
      this.editModalVisible = false;
    },

    async handleEditSubmit(formData) {
      try {
        const result = await this.updateUserInfo(formData);
        if (result.success) {
          this.showSuccess('更新成功');
          this.closeEditModal();
          await this.loadUserData();
        } else {
          this.showError(result.message || '更新失败');
        }
      } catch (error) {
        console.error('更新用户信息失败:', error);
        this.showError('更新失败');
      }
    },

    // Placeholder methods for child component events
    async handleToggleConcern() {
      // TODO: Implement concern/unconcern logic
      console.log('Toggle concern');
    },

    async handleToggleBlockUser() {
      // TODO: Implement block/unblock user logic
      console.log('Toggle block user');
    },

    async handleUnfavorite(contributionId) {
      // TODO: Implement unfavorite logic
      console.log('Unfavorite:', contributionId);
    },

    async handleUnlike(contributionId) {
      // TODO: Implement unlike logic
      console.log('Unlike:', contributionId);
    },

    handlePageChange(page) {
      if (this.currentView === 'works') {
        this.loadWorks(page);
      } else if (this.currentView === 'followers') {
        this.loadFollowers(page);
      }
    },

    handleEditWork(work) {
      this.editingWork = work;
      this.currentView = 'submit';
    },

    async handleDeleteWork(contributionId) {
      // TODO: Implement delete work logic
      console.log('Delete work:', contributionId);
    },

    async handleDeleteComment(commentId) {
      // TODO: Implement delete comment logic
      console.log('Delete comment:', commentId);
    },

    async handleRemoveFollower(userId) {
      // TODO: Implement remove follower logic
      console.log('Remove follower:', userId);
    },

    handleArtworkSubmitted() {
      this.editingWork = null;
      this.currentView = 'works';
      this.loadWorks(1);
    },

    cancelEditWork() {
      this.editingWork = null;
    },

    // Data loading methods (placeholders - implement with actual API calls)
    async loadFavorites() {
      // TODO: Implement
      this.favorites = [];
    },

    async loadLikes() {
      // TODO: Implement
      this.likes = [];
    },

    async loadWorks(page = 1) {
      // TODO: Implement
      this.worksPage = page;
      this.userWorks = [];
      this.worksTotal = 0;
    },

    async loadFollowers(page = 1) {
      // TODO: Implement
      this.followersPage = page;
      this.followers = [];
      this.followersTotal = 0;
    },

    async loadComments() {
      // TODO: Implement
      this.comments = [];
    },

    async loadAuditData() {
      // TODO: Implement
      this.auditData = null;
    }
  }
};
</script>

<style scoped>
.user-page-root {
  min-height: 100vh;
  position: relative;
}

.user-bg {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -2;
}

.user-overlay {
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

.user-container {
  position: relative;
  z-index: 1;
}

.columns {
  margin: 0 !important;
}
</style>
