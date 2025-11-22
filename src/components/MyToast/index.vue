<template>
  <div class="toast-container">
    <transition-group name="toast" tag="div">
      <div v-for="t in toasts" :key="t.id" class="toast" :class="t.type || 'default'" @mouseenter="t.pause?.()"
        @mouseleave="t.resume?.()">
        <div class="top-message-tip">
          <!-- 信息 -->
          <div class="toast-content">
            <div class="toast-icon">
              <span v-if="t.type === 'success'">✅</span>
              <span v-else-if="t.type === 'error'">❌</span>
              <span v-else-if="t.type === 'warning'">⚠️</span>
              <span v-else>ℹ️</span>
            </div>
            <div class="toast-message">{{ t.message }}</div>
          </div>

          <!-- 关闭按钮 -->
          <div class="close-toast" @click="t.close()">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="close-toast-svg">
              <path
                d="M11.9997 10.5865L16.9495 5.63672L18.3637 7.05093L13.4139 12.0007L18.3637 16.9504L16.9495 18.3646L11.9997 13.4149L7.04996 18.3646L5.63574 16.9504L10.5855 12.0007L5.63574 7.05093L7.04996 5.63672L11.9997 10.5865Z">
              </path>
            </svg>
          </div>
        </div>
        <div class="progress" :style="{
          animationDuration: `${t.duration}ms`,
          animationPlayState: t.isPaused ? 'paused' : 'running'
        }"></div>
      </div>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { type Toast } from './toast';

defineProps<{ toasts: Toast[] }>()
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 10000;
}

.toast {
  position: relative;
  color: var(--color-white);
  padding: 12px 16px;
  border-radius: 10px;
  min-width: 260px;
  max-width: 360px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-size: 14px;
  transition: all 0.3s ease;
  margin-bottom: 10px;
  box-shadow: 0px 4px 10px rgba(33, 33, 33, 0.461);
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(1px);
  user-select: none;
}

/* .toast.success {
  background-color: #2e7d32;
}

.toast.error {
  background-color: #c62828;
}

.toast.warning {
  background-color: #ed6c02;
}

.toast.info {
  background-color: #0288d1;
} */

.top-message-tip {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 25px;
}

.toast-content {
  height: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
}

.close-toast {
  height: 100%;
  aspect-ratio: 1/1;
  cursor: pointer;
}

.close-toast:hover .close-toast-svg {
  color: var(--text-color-primary);
}

.close-toast-svg {
  width: 100%;
  height: 100%;
  color: var(--text-color-gray-dark);
  transition: all var(--transition-duration-default);
}

.toast-icon {
  font-size: 18px;
  flex-shrink: 0;
}

.toast-message {
  flex-grow: 1;
  word-break: break-word;
}

.progress {
  height: 4px;
  background-color: rgba(88, 88, 88, 0.6);
  width: 100%;
  margin-top: 8px;
  animation-name: shrink;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
}

@keyframes shrink {
  from {
    width: 100%;
  }

  to {
    width: 0%;
  }
}

.toast-enter-active,
.toast-leave-active {
  transition:
    transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1),
    opacity 0.5s ease,
    filter 0.5s ease;
}

.toast-enter-from {
  transform: translateX(-100%);
  opacity: 0;
  filter: blur(10px);
}

.toast-enter-to {
  transform: translateX(0);
  opacity: 1;
  filter: blur(0);
}

.toast-leave-from {
  transform: translateX(0);
  opacity: 1;
  filter: blur(0);
}

.toast-leave-to {
  transform: translateX(100%);
  opacity: 0;
  filter: blur(10px);
  position: relative;
  overflow: visible;
}

/* 撕裂左半部分 */
.toast-leave-to::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 50%;
  height: 100%;
  background: inherit;
  filter: inherit;
  clip-path: inset(0 50% 0 0);
  transform: translateX(10px) rotate(-5deg);
  opacity: 0.6;
  transition: transform 0.5s ease;
}

/* 撕裂右半部分 */
.toast-leave-to::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 50%;
  height: 100%;
  background: inherit;
  filter: inherit;
  clip-path: inset(0 0 0 50%);
  transform: translateX(-10px) rotate(5deg);
  opacity: 0.6;
  transition: transform 0.5s ease;
}
</style>
