<template>
  <div :class="['modal', { 'is-active': visible }]">
    <div class="modal-background" @click="$emit('close')"></div>
    <div class="modal-card anime-modal">
      <header class="modal-card-head">
        <p class="modal-card-title">
          <span class="title-icon">✏️</span>
          编辑资料
        </p>
        <button class="delete" aria-label="close" @click="$emit('close')"></button>
      </header>

      <section class="modal-card-body">
        <!-- Name Field -->
        <BaseInput
          v-model="formData.name"
          label="姓名"
          placeholder="请输入姓名"
          :required="true"
        />

        <!-- Gender Field -->
        <div class="field">
          <label class="label">性别</label>
          <div class="control">
            <div class="select is-fullwidth anime-input">
              <select v-model="formData.gender">
                <option :value="0">未设置</option>
                <option :value="1">男</option>
                <option :value="2">女</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Avatar Upload -->
        <div class="field">
          <label class="label">
            <span class="icon">📸</span>
            头像（可选）
          </label>
          <div class="file has-name is-fullwidth anime-file">
            <label class="file-label">
              <input
                class="file-input"
                type="file"
                accept="image/*"
                @change="handleAvatarChange"
              />
              <span class="file-cta">
                <span class="file-icon">📁</span>
                <span class="file-label">选择图片</span>
              </span>
              <span class="file-name">
                {{ avatarFileName || '未选择文件' }}
              </span>
            </label>
          </div>

          <!-- Avatar Preview -->
          <div v-if="avatarPreview" class="avatar-preview">
            <img :src="avatarPreview" alt="头像预览" />
          </div>

          <p class="help">不上传则保持原头像不变</p>
        </div>
      </section>

      <footer class="modal-card-foot">
        <BaseButton
          variant="success"
          :loading="submitting"
          @click="handleSubmit"
        >
          保存
        </BaseButton>
        <BaseButton variant="ghost" @click="$emit('close')">
          取消
        </BaseButton>
      </footer>
    </div>
  </div>
</template>

<script>
import BaseInput from '@/components/base/BaseInput.vue';
import BaseButton from '@/components/base/BaseButton.vue';

/**
 * UserEditModal - 用户编辑模态框
 * Modal for editing user profile
 *
 * Props:
 * - visible: 是否显示模态框
 * - user: 用户对象
 *
 * Events:
 * - close: 关闭模态框
 * - submit: 提交表单 (formData)
 */
export default {
  name: 'UserEditModal',
  components: {
    BaseInput,
    BaseButton
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    user: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      formData: {
        name: '',
        gender: 0
      },
      avatarFile: null,
      avatarFileName: '',
      avatarPreview: '',
      submitting: false
    };
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        // Reset form when modal opens
        this.formData.name = this.user.username || '';
        this.formData.gender = this.user.gender || 0;
        this.avatarFile = null;
        this.avatarFileName = '';
        this.avatarPreview = '';
      }
    }
  },
  methods: {
    handleAvatarChange(event) {
      const file = event.target.files[0];
      if (!file) {
        this.avatarFile = null;
        this.avatarFileName = '';
        this.avatarPreview = '';
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('请选择图片文件');
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('图片大小不能超过 5MB');
        return;
      }

      this.avatarFile = file;
      this.avatarFileName = file.name;

      // Create preview
      const reader = new FileReader();
      reader.onload = e => {
        this.avatarPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    },

    async handleSubmit() {
      // Validate
      if (!this.formData.name.trim()) {
        alert('请输入姓名');
        return;
      }

      this.submitting = true;

      try {
        // Create FormData
        const formData = new FormData();
        formData.append('username', this.formData.name.trim());
        formData.append('gender', this.formData.gender);

        if (this.avatarFile) {
          formData.append('avatar', this.avatarFile);
        }

        // Emit to parent
        this.$emit('submit', formData);
      } catch (error) {
        console.error('表单提交错误:', error);
        alert('提交失败，请重试');
      } finally {
        this.submitting = false;
      }
    }
  }
};
</script>

<style scoped>
.anime-modal {
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
  max-width: 600px;
  width: 90%;
}

.modal-card-head {
  background: var(--gradient-primary);
  color: white;
  border: none;
  padding: var(--spacing-xl);
}

.modal-card-title {
  font-size: 20px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  color: white;
}

.title-icon {
  font-size: 24px;
}

.modal-card-body {
  padding: var(--spacing-2xl);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.field {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.label {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text);
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.select select {
  width: 100%;
  padding: var(--spacing-md);
  border: 2px solid var(--border-color);
  border-radius: var(--radius-md);
  font-size: 14px;
  transition: var(--transition-base);
}

.select select:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
  outline: none;
}

.anime-file {
  border: 2px dashed var(--border-color);
  border-radius: var(--radius-md);
  transition: var(--transition-base);
}

.anime-file:hover {
  border-color: var(--color-primary);
  background: rgba(102, 126, 234, 0.05);
}

.file-cta {
  padding: var(--spacing-md) var(--spacing-lg);
  background: var(--gradient-primary);
  color: white;
  border-radius: var(--radius-md) 0 0 var(--radius-md);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.file-name {
  padding: var(--spacing-md) var(--spacing-lg);
  border-left: 2px solid var(--border-color);
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.avatar-preview {
  margin-top: var(--spacing-md);
  display: flex;
  justify-content: center;
}

.avatar-preview img {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid var(--border-color);
  box-shadow: var(--shadow-md);
}

.help {
  font-size: 12px;
  color: var(--color-text-light);
}

.modal-card-foot {
  padding: var(--spacing-xl);
  background: rgba(247, 250, 252, 0.5);
  border: none;
  display: flex;
  gap: var(--spacing-md);
  justify-content: flex-end;
}
</style>
