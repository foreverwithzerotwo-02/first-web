<template>
    <transition name="fade" appear @after-leave="$emit('after-leave')">
        <div class="my-confirm-dialog__mask" v-if="visable.value">
            <!-- 容器盒子 -->
            <div class="my-confirm-dialog__mask__box">
                <!-- 文字标题 -->
                <h2 class="my-confirm-dialog__mask__box__title">{{ title }}</h2>

                <!-- 信息 -->
                <p class="my-confirm-dialog__mask__box__message" v-if="message">{{ message }}</p>

                <!-- 按钮 -->
                <div class="my-confirm-dialog__mask__box__button">
                    <button @click="$emit('confirm')" class="my-confirm-dialog__mask__box__button__item
                my-confirm-dialog__mask__box__button__item--red">{{ confirmText }}</button>
                    <button v-if="dicision" @click="$emit('cancel')"
                        class="my-confirm-dialog__mask__box__button__item">{{ cancelText
                        }}</button>
                </div>
            </div>
        </div>
    </transition>
</template>

<script setup lang="ts" name="MyConfirmDialog">
import type { ComfirmType } from './index'

defineProps<ComfirmType>()

defineEmits<{
    (e: 'confirm'): void
    (e: 'cancel'): void
    (e: 'after-leave'): void
}>()
</script>

<style scoped lang="scss">
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: scale(0.95);
}

.fade-enter-to,
.fade-leave-from {
    opacity: 1;
    transform: scale(1);
}

.my-confirm-dialog__mask {
    width: 100dvw;
    height: 100dvh;
    position: fixed;
    top: 0;
    left: 0;
    background-color: var(--background-color-gray-transparent);
    backdrop-filter: blur(2px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;

    // 容器盒子
    .my-confirm-dialog__mask__box {
        min-width: 400px;
        max-width: 90%;
        min-height: 150px;
        /* 3D 浮起阴影 */
        box-shadow:
            0 8px 16px rgba(229, 229, 229, 0.2),
            0 4px 8px rgba(255, 255, 255, 0.295),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
        border-radius: 10px;
        padding: 50px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        transition: all var(--transition-duration-slow);
        background-color: rgba(255, 255, 255, 0.52);
        border: 1px solid rgba(255, 255, 255, 0.3);

        &:has(.my-confirm-dialog__mask__box__button__item:hover) {
            background-color: rgba(220, 253, 255, 0.475);
            border: 1px solid rgba(201, 253, 255, 0.3);
            box-shadow:
                6px 8px 20px rgba(224, 248, 255, 0.2),
                6px 4px 12px rgba(217, 255, 252, 0.295),
                inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }

        &:has(.my-confirm-dialog__mask__box__button__item--red:hover) {
            background-color: rgba(255, 197, 197, 0.518);
            border: 1px solid rgba(255, 201, 201, 0.3);
            box-shadow:
                -6px 8px 20px rgba(255, 173, 167, 0.2),
                -6px 4px 12px rgba(255, 208, 208, 0.295),
                inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }

        // 标题
        .my-confirm-dialog__mask__box__title {
            font-size: 30px;
            margin: 0 0 40px;
        }

        // 标题
        .my-confirm-dialog__mask__box__message {
            font-size: 14px;
            margin: 0 0 20px;
        }

        // 处理按钮
        .my-confirm-dialog__mask__box__button {
            display: flex;
            gap: 20px;

            // 按钮项
            .my-confirm-dialog__mask__box__button__item {
                min-width: 100px;
                height: 35px;
                display: inline-block;
                padding: 0.5rem 30px;
                border: none;
                border-radius: 7px;
                background: #c6f8f632;
                color: rgb(6, 150, 150);
                cursor: pointer;
                box-shadow: 0 0 5px rgba(32, 32, 32, 0.325);

                @keyframes jelly-smooth {
                    0% {
                        transform: scale(1);
                    }

                    8% {
                        transform: scale(0.8);
                    }

                    20% {
                        transform: scale(1.17);
                    }

                    30% {
                        transform: scale(0.9, 1);
                    }

                    45% {
                        transform: scale(1.05, 0.95);
                    }

                    60% {
                        transform: scale(0.95, 1.04);
                    }

                    75% {
                        transform: scale(1, 0.98);
                    }

                    100% {
                        transform: scale(1);
                    }
                }

                @keyframes click-squish {
                    0% {
                        transform: scale(1);
                    }

                    50% {
                        transform: scale(0.95);
                    }

                    100% {
                        transform: scale(1);
                    }
                }

                &:hover {
                    // 更柔和的弹性缓动曲线
                    animation: jelly-smooth 1s cubic-bezier(.23, 1, .32, 1) forwards;
                }

                &:active {
                    animation: click-squish 0.3s ease-out forwards;
                }

                // 警惕型红色
                &--red {
                    background: #ff000034;
                    color: rgb(203, 10, 10);
                }
            }
        }
    }
}
</style>