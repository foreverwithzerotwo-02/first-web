<template>
    <div class="popup-wrapper">
        <!-- 内容容器 -->
        <div class="content-container">
            <!-- 关闭按钮 -->
            <div class="close-btn" @click="closeModal">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path
                        d="M10.5859 12L2.79297 4.20706L4.20718 2.79285L12.0001 10.5857L19.793 2.79285L21.2072 4.20706L13.4143 12L21.2072 19.7928L19.793 21.2071L12.0001 13.4142L4.20718 21.2071L2.79297 19.7928L10.5859 12Z">
                    </path>
                </svg>
            </div>

            <slot></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
import { watch, onBeforeUnmount } from 'vue';
import { lockScroll, unlockScroll } from '@/utils/scrollLock';

interface Props {
    modelValue: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
}>();

watch(
    () => props.modelValue,
    (newVal) => {
        if (newVal) lockScroll();
        else unlockScroll();
    },
    { immediate: true }
);

onBeforeUnmount(() => unlockScroll());

// 子组件内部调用这个函数来更新
function closeModal() {
    emit('update:modelValue', false);
}
</script>

<style scoped lang="scss">
.popup-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: var(--background-color-gray-transparent);
    backdrop-filter: blur(1px);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;

    .content-container {
        position: relative;
        background-color: var(--background-color-white);
        min-width: 100px;
        min-height: 100px;
        padding: 20px;
        border-radius: 10px;
        user-select: none;

        // 关闭按钮
        .close-btn {
            position: absolute;
            top: 12px;
            right: 15px;
            color: black;
            cursor: pointer;
            transition: all var(--transition-duration-default);

            &:hover {
                color: var(--text-color-primary);
            }

            svg {
                width: 20px;
                height: 20px;
            }
        }
    }
}
</style>