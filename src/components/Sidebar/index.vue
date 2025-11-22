<template>
    <!-- 遮罩 -->
    <transition name="fade-mark">
        <div class="sidebar--mark" @click="close" v-show="modelValue"></div>
    </transition>

    <transition name="fade-sidebar">
        <div class="sidebar" v-show="!isMobile || modelValue">
            <slot></slot>
        </div>
    </transition>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const props = defineProps<{
    modelValue: boolean
}>()

const emit = defineEmits(['update:modelValue'])

const close = () => {
    emit('update:modelValue', false)
}

// 是否要启用隐藏
const isMobile = ref(window.innerWidth < 768)

onMounted(() => {
    const update = () => (isMobile.value = window.innerWidth < 768)
    window.addEventListener('resize', update)
    update()
    onUnmounted(() => window.removeEventListener('resize', update))
})
</script>

<style scoped lang="scss">
.fade-mark-enter-from,
.fade-mark-leave-to {
    opacity: 0;
}

.fade-mark-enter-to,
.fade-mark-leave-from {
    opacity: 1;
}

.fade-mark-enter-active,
.fade-mark-leave-active {
    transition: all 0.5s;
}

.fade-sidebar-enter-from,
.fade-sidebar-leave-to {
    transform: translateX(-100%);
}

.fade-sidebar-enter-to,
.fade-sidebar-leave-from {
    transform: translateX(0);
}

.fade-sidebar-enter-active,
.fade-sidebar-leave-active {
    transition: all 0.5s ease;
}

// 内容
.sidebar {
    height: 100%;
    z-index: 100;
    background-color: var(--background-color-white);
}

// 遮罩
.sidebar--mark {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100dvw;
    height: 100dvh;
    background-color: rgba(83, 83, 83, 0.303);
    backdrop-filter: blur(1px);
    z-index: 99;
}

@media (max-width: 768px) {

    // 内容
    .sidebar {
        position: fixed;
        top: 0;
        left: 0;
    }

    // 遮罩
    .sidebar--mark {
        display: block;
    }
}
</style>