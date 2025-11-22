<template>
    <transition name="fade-show">
        <div v-show="isShow" class="popover_container">
            <slot v-if="isLogin"></slot>

            <!-- 未登录提示 -->
            <div class="need-login" v-else>
                <div class="login-text">登陆后查看更多内容</div>

                <button class="login-btn" @click="authStore.visible = true">登录</button>
            </div>
        </div>
    </transition>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/useAuthStore';
const authStore = useAuthStore()

const props = defineProps<{
    isShow: boolean
    isLogin: boolean
}>()
</script>

<style scoped lang="scss">
.fade-show-enter-from {
    opacity: 0;
    transform: translateY(90%);
}

.fade-show-enter-to {
    opacity: 1;
    transform: translateY(100%);
}

.fade-show-enter-active {
    transition: all 0.3s ease 0.3s;
}

.fade-show-leave-from {
    opacity: 1;
}

.fade-show-leave-to {
    opacity: 0;
}

.fade-show-leave-active {
    transition: opacity 0.2s ease;
}

.popover_container {
    position: absolute;
    bottom: 0;
    transform: translateY(100%);
    padding-top: 6px;

    // 需要登录
    .need-login {
        width: 320px;
        background-color: var(--background-color-white);
        box-shadow: 0 0 10px var(--background-color-black-transparent-dark);
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        gap: 10px;
        color: var(--text-color-gray-default);
        padding: 15px;

        .login-text {
            width: 100%;
            height: 100px;
            font-size: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid var(--primary-color-100);
            border-radius: 10px;
        }

        .login-btn {
            height: 34px;
            background-color: var(--primary-color-400);
            border: 1px solid var(--primary-color-100);
            border-radius: 4px;
            cursor: pointer;
            color: var(--text-color-gray-default);
            transition: all var(--transition-duration-default);

            &:hover {
                color: var(--text-color-primary-deep);
                background-color: var(--primary-color-300);
                transform: scale(1.03);
            }
        }
    }
}
</style>
