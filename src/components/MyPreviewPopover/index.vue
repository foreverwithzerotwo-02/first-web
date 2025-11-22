<template>
    <div class="my-preview-popover">
        <!-- 预览内容容器 -->
        <div class="my-preview-popover__content-container">
            <!-- 顶部栏 -->
            <div class="my-preview-popover__content-container__top-container" v-if="title">
                <span>{{ title }}</span>
            </div>

            <!-- 主要内容展示 -->
            <div class="my-preview-popover__content-container__main-container">
                <slot></slot>
            </div>

            <!-- 关闭按钮 -->
            <div class="my-preview-popover__content-container__close-btn" @click="clickClose">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path
                        d="M11.9997 10.5865L16.9495 5.63672L18.3637 7.05093L13.4139 12.0007L18.3637 16.9504L16.9495 18.3646L11.9997 13.4149L7.04996 18.3646L5.63574 16.9504L10.5855 12.0007L5.63574 7.05093L7.04996 5.63672L11.9997 10.5865Z">
                    </path>
                </svg>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts" name="MyPreviewPopover">
defineProps<{
    // 是否显示
    show: false | true
    // 显示的标题
    title?: ''
}>()

const emit = defineEmits(['update:show'])

// 关闭自身 
const clickClose = () => {
    emit('update:show', false)
}
</script>

<style scoped lang="scss">
.my-preview-popover {
    width: 100dvw;
    height: 100dvh;
    background-color: var(--background-color-gray-transparent);
    backdrop-filter: blur(2px);
    z-index: 9999;
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;

    // 预览内容的容器
    .my-preview-popover__content-container {
        min-width: 600px;
        height: 85%;
        max-width: 90dvw;
        background-color: antiquewhite;
        border-radius: 5px;
        box-shadow: 0 0 17px rgba(43, 43, 43, 0.39);
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        padding: 15px;
        position: relative;

        // 顶部容器
        .my-preview-popover__content-container__top-container {
            display: flex;
            justify-content: center;
            align-items: center;
            border-bottom: 2px solid black;
            font-size: 20px;
            font-weight: bold;
            height: 35px;
            padding: 0px 8px 5px;
            margin-bottom: 10px;
            flex-shrink: 0;
            user-select: none;
        }

        // 主要内容展示
        .my-preview-popover__content-container__main-container {
            height: 100%;
            overflow-y: auto;
        }

        // 关闭按钮
        .my-preview-popover__content-container__close-btn {
            width: 30px;
            height: 30px;
            position: absolute;
            right: 0;
            top: 0;
            transform: translate(50%, -50%);
            border-radius: 50%;
            background-color: rgb(231, 231, 231);
            box-shadow: 0 0 10px rgba(45, 45, 45, 0.284);
            box-sizing: border-box;
            cursor: pointer;
            transition: all .3s;

            &:hover {
                box-shadow: 0 0 10px rgba(45, 45, 45, 0.422);
                background-color: rgb(109, 109, 109);
                transform: scale(.92) translate(50%, -50%);

                svg {
                    color: var(--text-color-primary);
                }
            }

            &:active {
                transform: scale(1) translate(50%, -50%);
            }

            svg {
                width: 100%;
                height: 100%;
                color: rgb(50, 50, 50);
            }
        }
    }
}
</style>