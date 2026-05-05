<template>
  <div class="image-view-root">
    <Navbar />

    <section class="section main-content">
      <div class="container">
        <!-- Back Button -->
        <BaseButton
          variant="ghost"
          icon="◀️"
          class="back-button"
          @click="goBack"
        >
          返回
        </BaseButton>

        <!-- Loading State -->
        <div v-if="loading" class="loading-container">
          <div class="loading-spinner animate-spin"></div>
          <p class="loading-text">加载中...</p>
        </div>

        <!-- Content -->
        <div v-else-if="currentArtwork" class="columns is-variable is-6">
          <!-- Left: Image + Details -->
          <div class="column is-two-thirds">
            <!-- Image Display -->
            <ImageDisplay
              :current-image="currentImage"
              :images="currentArtwork.images || []"
              :current-image-index="currentImageIndex"
              :loaded-images="loadedImages"
              @open-modal="openModal"
              @prev-page="prevPage"
              @next-page="nextPage"
              @go-to-page="goToPage"
            />

            <!-- Artwork Details -->
            <ArtworkDetails
              :contribution="currentArtwork"
              :avatar-url="avatarUrl"
              @go-to-author="goToAuthorProfile"
              @copy-id="copyIdToClipboard"
            >
              <template #interaction-buttons>
                <InteractionButtons
                  :is-liked="isLiked"
                  :is-favorite="isFavorite"
                  :like-loading="likeLoading"
                  :favorite-loading="favoriteLoading"
                  :disabled="isAdmin || isPendingWork"
                  @toggle-like="handleToggleLike"
                  @toggle-favorite="handleToggleFavorite"
                />
              </template>
            </ArtworkDetails>

            <!-- Admin Panel -->
            <AdminPanel
              v-if="isCommunityAdmin"
              :contribution="currentArtwork"
              :is-community-admin="isCommunityAdmin"
              :audit-loading="auditLoading"
              :block-loading="blockLoading"
              @approve-work="handleApproveWork"
              @show-dismiss-modal="showDismissReasonModal = true"
              @block-work="handleBlockWork"
              @unblock-work="handleUnblockWork"
            />
          </div>

          <!-- Right: Comments -->
          <div class="column">
            <CommentSection
              :comments="comments"
              :is-community-admin="isCommunityAdmin"
              :is-system-admin="isSystemAdmin"
              :is-pending="isPendingWork"
              @submit-comment="handleSubmitComment"
              @delete-comment="handleDeleteComment"
            />
          </div>
        </div>

        <!-- Error State -->
        <div v-else class="error-container anime-box">
          <div class="error-icon">😢</div>
          <h3 class="error-title">作品不存在或已被删除</h3>
          <BaseButton variant="primary" @click="goBack">返回</BaseButton>
        </div>
      </div>
    </section>

    <!-- Image Modal -->
    <div
      v-if="showModal"
      class="image-modal"
      @click.self="closeModal"
      @wheel="handleWheel"
    >
      <BaseButton variant="danger" class="close-btn" @click="closeModal">
        ✕ 关闭
      </BaseButton>
      <BaseButton variant="primary" class="reset-btn" @click="resetZoom">
        🔄 重置
      </BaseButton>
      <div class="zoom-indicator">{{ Math.round(zoomLevel * 100) }}%</div>
      <div
        class="modal-content"
        @mousedown="startDrag"
        @mousemove="onDrag"
        @mouseup="endDrag"
        @mouseleave="endDrag"
        :style="{ cursor: isDragging ? 'grabbing' : zoomLevel > 1 ? 'grab' : 'default' }"
      >
        <img
          :src="modalImageSrc"
          alt="modal-image"
          :style="imageTransformStyle"
          @dragstart.prevent
        />
      </div>
    </div>

    <!-- Dismiss Reason Modal -->
    <div class="modal" :class="{ 'is-active': showDismissReasonModal }">
      <div class="modal-background" @click="closeDismissModal"></div>
      <div class="modal-card anime-modal">
        <header class="modal-card-head">
          <p class="modal-card-title">
            <span class="icon">❌</span>
            驳回作品
          </p>
          <button class="delete" aria-label="close" @click="closeDismissModal"></button>
        </header>
        <section class="modal-card-body">
          <BaseInput
            v-model="dismissalReason"
            label="驳回理由"
            :required="true"
            placeholder="请详细说明驳回的原因，帮助作者改进..."
            :maxlength="500"
          />
          <p class="help">{{ dismissalReason.length }} / 500 字符</p>
        </section>
        <footer class="modal-card-foot">
          <BaseButton
            variant="danger"
            icon="❌"
            :loading="auditLoading"
            :disabled="!dismissalReason.trim()"
            @click="handleDismissWork"
          >
            确认驳回
          </BaseButton>
          <BaseButton variant="ghost" @click="closeDismissModal">
            取消
          </BaseButton>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import Navbar from './Navbar.vue';
import BaseButton from './base/BaseButton.vue';
import BaseInput from './base/BaseInput.vue';
import ImageDisplay from './imageview/ImageDisplay.vue';
import ArtworkDetails from './imageview/ArtworkDetails.vue';
import InteractionButtons from './imageview/InteractionButtons.vue';
import CommentSection from './imageview/CommentSection.vue';
import AdminPanel from './imageview/AdminPanel.vue';
import { loadImage, loadAvatar } from '@/utils/imageLoader';
import copyIdMixin from '@/mixins/copyId';
import imageUrlMixin from '@/mixins/imageUrl';

/**
 * ImageView - 作品详情页面
 * Artwork detail page (optimized with Vuex)
 */
export default {
  name: 'ImageView',
  mixins: [copyIdMixin, imageUrlMixin],
  components: {
    Navbar,
    BaseButton,
    BaseInput,
    ImageDisplay,
    ArtworkDetails,
    InteractionButtons,
    CommentSection,
    AdminPanel
  },
  props: {
    id: {
      type: [String, Number],
      default: null
    }
  },
  data() {
    return {
      currentImageIndex: 0,
      loadedImages: {},
      avatarUrl: '',
      isLiked: false,
      isFavorite: false,
      likeLoading: false,
      favoriteLoading: false,
      auditLoading: false,
      blockLoading: false,
      comments: [],
      showModal: false,
      zoomLevel: 1,
      translateX: 0,
      translateY: 0,
      isDragging: false,
      dragStartX: 0,
      dragStartY: 0,
      showDismissReasonModal: false,
      dismissalReason: ''
    };
  },
  computed: {
    ...mapState('artwork', ['currentArtwork', 'loading']),
    ...mapGetters('user', ['isLoggedIn', 'isCommunityAdmin', 'isSystemAdmin']),

    isAdmin() {
      return this.isCommunityAdmin || this.isSystemAdmin;
    },

    isPendingWork() {
      return this.currentArtwork?.auditStatus === 0;
    },

    currentImage() {
      if (!this.currentArtwork?.images?.length) return '';
      return this.currentArtwork.images[this.currentImageIndex];
    },

    modalImageSrc() {
      return this.getImageUrl(this.currentImage);
    },

    imageTransformStyle() {
      return {
        transform: `scale(${this.zoomLevel}) translate(${this.translateX}px, ${this.translateY}px)`,
        transition: this.isDragging ? 'none' : 'transform 0.3s ease'
      };
    }
  },
  mounted() {
    this.loadArtworkData();
  },
  watch: {
    '$route.params.id'() {
      this.loadArtworkData();
    }
  },
  methods: {
    ...mapActions('artwork', [
      'fetchArtworkDetail',
      'likeArtwork',
      'unlikeArtwork',
      'favoriteArtwork',
      'unfavoriteArtwork',
      'clearCurrentArtwork'
    ]),
    ...mapActions('admin', [
      'approveArtwork',
      'dismissArtwork',
      'blockArtwork',
      'unblockArtwork',
      'deleteComment'
    ]),
    ...mapActions('ui', ['showSuccess', 'showError']),

    async loadArtworkData() {
      const contributionId = this.id || this.$route.params.id;
      if (!contributionId) return;

      try {
        const artwork = await this.fetchArtworkDetail({
          contributionId,
          isPending: this.$route.query.pending === 'true',
          isBlocked: this.$route.query.blocked === 'true'
        });

        if (artwork) {
          // Load avatar
          if (artwork.uploaderAvatarPath) {
            this.avatarUrl = await loadAvatar(artwork.uploaderAvatarPath);
          }

          // Load interaction status
          this.loadInteractionStatus();

          // Load comments
          this.loadComments();
        }
      } catch (error) {
        console.error('加载作品失败:', error);
        this.showError('加载作品失败');
      }
    },

    async loadInteractionStatus() {
      // TODO: Load like/favorite status from API
      this.isLiked = false;
      this.isFavorite = false;
    },

    async loadComments() {
      // TODO: Load comments from API
      this.comments = [];
    },

    // Interaction handlers
    async handleToggleLike() {
      if (!this.isLoggedIn) {
        this.showError('请先登录');
        return;
      }

      this.likeLoading = true;
      try {
        const action = this.isLiked ? this.unlikeArtwork : this.likeArtwork;
        const result = await action(this.currentArtwork.contributionId);

        if (result.success) {
          this.isLiked = !this.isLiked;
          this.showSuccess(this.isLiked ? '点赞成功' : '取消点赞');
          await this.loadArtworkData();
        } else {
          this.showError(result.message);
        }
      } finally {
        this.likeLoading = false;
      }
    },

    async handleToggleFavorite() {
      if (!this.isLoggedIn) {
        this.showError('请先登录');
        return;
      }

      this.favoriteLoading = true;
      try {
        const action = this.isFavorite ? this.unfavoriteArtwork : this.favoriteArtwork;
        const result = await action(this.currentArtwork.contributionId);

        if (result.success) {
          this.isFavorite = !this.isFavorite;
          this.showSuccess(this.isFavorite ? '收藏成功' : '取消收藏');
          await this.loadArtworkData();
        } else {
          this.showError(result.message);
        }
      } finally {
        this.favoriteLoading = false;
      }
    },

    // Admin actions
    async handleApproveWork() {
      this.auditLoading = true;
      try {
        const result = await this.approveArtwork(this.currentArtwork.contributionId);
        if (result.success) {
          this.showSuccess('审核通过');
          this.goBack();
        } else {
          this.showError(result.message);
        }
      } finally {
        this.auditLoading = false;
      }
    },

    async handleDismissWork() {
      if (!this.dismissalReason.trim()) return;

      this.auditLoading = true;
      try {
        const result = await this.dismissArtwork({
          contributionId: this.currentArtwork.contributionId,
          dismissalReason: this.dismissalReason
        });

        if (result.success) {
          this.showSuccess('已驳回');
          this.closeDismissModal();
          this.goBack();
        } else {
          this.showError(result.message);
        }
      } finally {
        this.auditLoading = false;
      }
    },

    async handleBlockWork() {
      this.blockLoading = true;
      try {
        const result = await this.blockArtwork(this.currentArtwork.contributionId);
        if (result.success) {
          this.showSuccess('已封禁');
          await this.loadArtworkData();
        } else {
          this.showError(result.message);
        }
      } finally {
        this.blockLoading = false;
      }
    },

    async handleUnblockWork() {
      this.blockLoading = true;
      try {
        const result = await this.unblockArtwork(this.currentArtwork.contributionId);
        if (result.success) {
          this.showSuccess('已解封');
          await this.loadArtworkData();
        } else {
          this.showError(result.message);
        }
      } finally {
        this.blockLoading = false;
      }
    },

    async handleSubmitComment(content) {
      // TODO: Implement comment submission
      console.log('Submit comment:', content);
    },

    async handleDeleteComment(commentId) {
      const result = await this.deleteComment(commentId);
      if (result.success) {
        this.showSuccess('删除成功');
        this.loadComments();
      } else {
        this.showError(result.message);
      }
    },

    // Navigation
    goBack() {
      this.$router.back();
    },

    goToAuthorProfile(authorId) {
      this.$router.push(`/user/${authorId}`);
    },

    // Image pagination
    prevPage() {
      if (this.currentImageIndex > 0) {
        this.currentImageIndex--;
      }
    },

    nextPage() {
      if (this.currentImageIndex < (this.currentArtwork?.images?.length || 0) - 1) {
        this.currentImageIndex++;
      }
    },

    goToPage(index) {
      this.currentImageIndex = index;
    },

    // Modal handlers
    openModal(imageSrc) {
      this.showModal = true;
      this.resetZoom();
    },

    closeModal() {
      this.showModal = false;
    },

    closeDismissModal() {
      this.showDismissReasonModal = false;
      this.dismissalReason = '';
    },

    // Zoom and pan
    handleWheel(e) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      this.zoomLevel = Math.max(0.5, Math.min(5, this.zoomLevel + delta));
    },

    resetZoom() {
      this.zoomLevel = 1;
      this.translateX = 0;
      this.translateY = 0;
    },

    startDrag(e) {
      if (this.zoomLevel > 1) {
        this.isDragging = true;
        this.dragStartX = e.clientX - this.translateX;
        this.dragStartY = e.clientY - this.translateY;
      }
    },

    onDrag(e) {
      if (this.isDragging) {
        this.translateX = e.clientX - this.dragStartX;
        this.translateY = e.clientY - this.dragStartY;
      }
    },

    endDrag() {
      this.isDragging = false;
    }
  },

  beforeDestroy() {
    this.clearCurrentArtwork();
  }
};
</script>

<style scoped>
.image-view-root {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.main-content {
  padding-top: var(--spacing-2xl);
}

.back-button {
  margin-bottom: var(--spacing-xl);
}

/* Loading */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: var(--spacing-xl);
}

.loading-spinner {
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

/* Error */
.error-container {
  text-align: center;
  padding: var(--spacing-2xl);
  min-height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xl);
}

.error-icon {
  font-size: 80px;
}

.error-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-text);
}

/* Image Modal */
.image-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn,
.reset-btn {
  position: fixed;
  top: var(--spacing-xl);
  z-index: 10000;
}

.close-btn {
  right: var(--spacing-xl);
}

.reset-btn {
  right: calc(var(--spacing-xl) * 2 + 100px);
}

.zoom-indicator {
  position: fixed;
  bottom: var(--spacing-xl);
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--radius-round);
  font-weight: 700;
  z-index: 10000;
}

.modal-content {
  max-width: 90%;
  max-height: 90%;
  overflow: hidden;
}

.modal-content img {
  max-width: 100%;
  max-height: 90vh;
  object-fit: contain;
}
</style>
