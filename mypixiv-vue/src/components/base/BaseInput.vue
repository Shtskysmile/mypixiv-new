<template>
  <div :class="['base-input-wrapper', { 'has-error': error, 'is-disabled': disabled }]">
    <label v-if="label" :for="inputId" class="input-label">
      {{ label }}
      <span v-if="required" class="required-mark">*</span>
    </label>

    <div class="input-container">
      <span v-if="prefixIcon" class="input-prefix">{{ prefixIcon }}</span>

      <input
        :id="inputId"
        ref="input"
        :class="inputClasses"
        :type="type"
        :value="value"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :maxlength="maxlength"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @keyup.enter="$emit('enter')"
      />

      <span v-if="suffixIcon" class="input-suffix">{{ suffixIcon }}</span>

      <span v-if="clearable && value && !disabled" class="input-clear" @click="handleClear">
        ✕
      </span>
    </div>

    <div v-if="error" class="input-error">{{ error }}</div>
    <div v-else-if="hint" class="input-hint">{{ hint }}</div>
  </div>
</template>

<script>
/**
 * BaseInput - 基础输入框组件
 *
 * Props:
 * - value: 输入值（支持 v-model）
 * - type: 输入类型 ('text', 'password', 'email', 'number', 'tel', 'url')
 * - label: 标签文本
 * - placeholder: 占位符
 * - disabled: 是否禁用
 * - readonly: 是否只读
 * - required: 是否必填
 * - error: 错误信息
 * - hint: 提示信息
 * - prefixIcon: 前缀图标
 * - suffixIcon: 后缀图标
 * - clearable: 是否可清除
 * - maxlength: 最大长度
 */
export default {
  name: 'BaseInput',
  props: {
    value: {
      type: [String, Number],
      default: ''
    },
    type: {
      type: String,
      default: 'text'
    },
    label: {
      type: String,
      default: null
    },
    placeholder: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    required: {
      type: Boolean,
      default: false
    },
    error: {
      type: String,
      default: null
    },
    hint: {
      type: String,
      default: null
    },
    prefixIcon: {
      type: String,
      default: null
    },
    suffixIcon: {
      type: String,
      default: null
    },
    clearable: {
      type: Boolean,
      default: false
    },
    maxlength: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      isFocused: false,
      inputId: `base-input-${Math.random().toString(36).substr(2, 9)}`
    };
  },
  computed: {
    inputClasses() {
      return [
        'anime-input',
        {
          'has-prefix': this.prefixIcon,
          'has-suffix': this.suffixIcon || this.clearable,
          'is-focused': this.isFocused
        }
      ];
    }
  },
  methods: {
    handleInput(event) {
      this.$emit('input', event.target.value);
    },
    handleFocus(event) {
      this.isFocused = true;
      this.$emit('focus', event);
    },
    handleBlur(event) {
      this.isFocused = false;
      this.$emit('blur', event);
    },
    handleClear() {
      this.$emit('input', '');
      this.$emit('clear');
      this.$refs.input.focus();
    },
    focus() {
      this.$refs.input.focus();
    },
    blur() {
      this.$refs.input.blur();
    }
  }
};
</script>

<style scoped>
.base-input-wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.input-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text);
}

.required-mark {
  color: #f43f5e;
  margin-left: 2px;
}

.input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.anime-input {
  width: 100%;
  padding: var(--spacing-md) var(--spacing-lg);
  border: 2px solid var(--border-color);
  border-radius: var(--radius-md);
  font-size: 14px;
  color: var(--color-text);
  background: white;
  transition: var(--transition-base);
}

.anime-input.has-prefix {
  padding-left: calc(var(--spacing-lg) + 30px);
}

.anime-input.has-suffix {
  padding-right: calc(var(--spacing-lg) + 30px);
}

.anime-input:focus {
  border-color: #a78bfa;
  box-shadow: 0 0 0 4px rgba(167, 139, 250, 0.1);
  outline: none;
}

.anime-input::placeholder {
  color: var(--color-text-lighter);
}

.anime-input:disabled {
  background: #f3f4f6;
  cursor: not-allowed;
  opacity: 0.6;
}

.input-prefix,
.input-suffix {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  font-size: 16px;
  color: var(--color-text-light);
}

.input-prefix {
  left: var(--spacing-md);
}

.input-suffix {
  right: var(--spacing-md);
}

.input-clear {
  position: absolute;
  right: var(--spacing-md);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--color-text-lighter);
  color: white;
  font-size: 12px;
  cursor: pointer;
  transition: var(--transition-fast);
}

.input-clear:hover {
  background: var(--color-text-light);
}

.input-error {
  font-size: 12px;
  color: #f43f5e;
}

.input-hint {
  font-size: 12px;
  color: var(--color-text-light);
}

.has-error .anime-input {
  border-color: #f43f5e;
}

.has-error .anime-input:focus {
  box-shadow: 0 0 0 4px rgba(244, 63, 94, 0.1);
}

.is-disabled {
  opacity: 0.6;
}
</style>
