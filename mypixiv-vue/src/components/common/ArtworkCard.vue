<template>
  <BaseCard :hoverable="true" :clickable="true" padding="none" @click="navigateToDetail">
    <template #image>
      <div class="artwork-image-container">
        <!-- Loading State -->
        <div v-if="imageLoading" class="image-loading">
          <div class="loading-spinner animate-spin"></div>
        </div>

        <!-- Artwork Image -->
        <img
          v-show="!imageLoading"
          :src="artworkImageUrl"
          :alt="artwork.title || '无标题'"
          class="artwork-image"
          @load="imageLoading = false"
          @error="onImageError"
        />

        <!-- Hover Overlay with Stats -->
        <div class="hover-overlay">
          <div class="stats-overlay">
            <StatsBadge v-if="artwork.viewCount !== undefined" icon="👁️" :value="artwork.viewCount" />
            <StatsBadge v-if="artwork.likeCount !== undefined" icon="❤️" :value="artwork.likeCount" />
            <StatsBadge v-if="artwork.favoriteCount !== undefined" icon="⭐" :value="artwork.favoriteCount" />
          </div>
        </div>
      </div>
    </template>

    <div class="artwork-meta">
      <!-- Title -->
      <router-link :to="detailLink" class="artwork-title" @click.native.stop>
        {{ artwork.title || '无标题' }}
      </router-link>

      <!-- Author Info -->
      <div class="artwork-author">
        <BaseAvatar
          :src="artwork.uploaderAvatarPath || artwork.avatar"
          :alt="artwork.authorName || artwork.authorId"
          size="xs"
          :clickable="false"
        />
        <div class="author-info">
          <span v-if="artwork.authorName" class="author-name">{{ artwork.authorName }}</span>
          <span class="author-id">ID: {{ formatAuthorId(artwork.authorId) }}</span>
        </div>
      </div>

      <!-- Tags -->
      <div v-if="artwork.tags && artwork.tags.length" class="artwork-tags">
        <span v-for="(tag, idx) in artwork.tags.slice(0, 3)" :key="idx" class="tag-badge">
          {{ tag }}
        </span>
      </div>
    </div>
  </BaseCard>
</template>

<script>
import BaseCard from '@/components/base/BaseCard.vue';
import BaseAvatar from '@/components/base/BaseAvatar.vue';
import StatsBadge from './StatsBadge.vue';
import { loadImage } from '@/utils/imageLoader';
import imageUrlMixin from '@/mixins/imageUrl';
import formattersMixin from '@/mixins/formatters';

/**
 * ArtworkCard - 作品卡片组件
 * 用于在网格中显示作品缩略图
 *
 * Props:
 * - artwork: 作品对象 (必需)
 */
export default {
  name: 'ArtworkCard',
  components: {
    BaseCard,
    BaseAvatar,
    StatsBadge
  },
  mixins: [imageUrlMixin, formattersMixin],
  props: {
    artwork: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      loadedImageUrl: null,
      imageLoading: true
    };
  },
  computed: {
    artworkImageUrl() {
      return this.loadedImageUrl || this.placeholderImage;
    },
    placeholderImage() {
      return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="200"%3E%3Crect fill="%23f5f7fa" width="400" height="200"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23c3cfe2" font-size="24"%3E加载中...%3C/text%3E%3C/svg%3E';
    },
    detailLink() {
      return `/image/${this.artwork.contributionId || this.artwork.id}`;
    }
  },
  mounted() {
    this.loadArtworkImage();
  },
  watch: {
    'artwork.image': 'loadArtworkImage',
    'artwork.url': 'loadArtworkImage'
  },
  methods: {
    async loadArtworkImage() {
      // Determine image path - prefer url field, fallback to image field
      let imagePath = this.artwork.url;

      if (!imagePath) {
        if (Array.isArray(this.artwork.image) && this.artwork.image.length > 0) {
          // Use first image from array as thumbnail
          imagePath = this.artwork.image[0];
        } else if (typeof this.artwork.image === 'string') {
          imagePath = this.artwork.image;
        }
      }

      if (!imagePath) {
        console.warn('⚠️ No image path found for artwork:', this.artwork);
        this.imageLoading = false;
        return;
      }

      try {
        const url = await loadImage(imagePath);
        this.loadedImageUrl = url || imagePath;
      } catch (error) {
        console.error('❌ Failed to load artwork image:', error);
        this.loadedImageUrl = imagePath;
      }
    },
    navigateToDetail() {
      this.$router.push(this.detailLink);
    }
  }
};
</script>

<style scoped>
.artwork-image-container {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.image-loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(147, 51, 234, 0.1);
  border-top-color: var(--color-primary);
  border-radius: 50%;
}

.artwork-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.base-card:hover .artwork-image {
  transform: scale(1.1);
}

.hover-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, transparent 50%);
  opacity: 0;
  transition: opacity 0.3s ease;
  display: flex;
  align-items: flex-end;
  padding: var(--spacing-md);
}

.artwork-image-container:hover .hover-overlay {
  opacity: 1;
}

.stats-overlay {
  display: flex;
  gap: var(--spacing-lg);
}

.artwork-meta {
  padding: var(--spacing-md);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.artwork-title {
  display: block;
  color: var(--color-primary);
  font-weight: 700;
  font-size: 14px;
  text-decoration: none;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color 0.2s ease;
}

.artwork-title:hover {
  color: var(--color-primary-dark);
  text-decoration: underline;
}

.artwork-author {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.author-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow: hidden;
  min-width: 0;
  flex: 1;
}

.author-name {
  font-weight: 600;
  color: var(--color-primary);
  font-size: 13px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.author-id {
  font-weight: 500;
  font-size: 11px;
  color: var(--color-text-lighter);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.artwork-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.tag-badge {
  display: inline-block;
  padding: 2px var(--spacing-sm);
  background: var(--gradient-primary);
  color: white;
  font-size: 10px;
  border-radius: var(--radius-round);
  font-weight: 600;
}

@media (max-width: 768px) {
  .artwork-image-container {
    height: 160px;
  }

  .artwork-title {
    font-size: 13px;
  }
}
</style>
