<template>
    <div class="drawer-contaienr" @click="clickCloseDrawer" v-if="props.modelValue" :class="{
        'drawer-contaienr--fadeOut': isClose,
    }">
        <div class="drawer" :style="drawerStyle" :class="{
            'drawer--InLeft': props.placement === 'left', 'drawer--InRight': props.placement === 'right',
            'drawer--OutLeft': props.placement === 'left' && isClose,
            'drawer--OutRight': props.placement === 'right' && isClose
        }" @animationend="handleAnimationEnd">
            <!-- 头部 -->
            <header class="drawer__header">
                <!-- 标题 -->
                <span class="drawer__header__title">{{ props.title }}</span>

                <!-- 关闭按钮 -->
                <span @click="closeDrawer">
                    <!-- 关闭按钮图标 -->
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path
                            d="M10.5859 12L2.79297 4.20706L4.20718 2.79285L12.0001 10.5857L19.793 2.79285L21.2072 4.20706L13.4143 12L21.2072 19.7928L19.793 21.2071L12.0001 13.4142L4.20718 21.2071L2.79297 19.7928L10.5859 12Z">
                        </path>
                    </svg>
                </span>
            </header>

            <!-- 内容 -->
            <div class="drawer__main">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts" name="Drawer">
import { computed, ref, onUnmounted, watch } from 'vue'

// =================================== 全部变量 ==================================

const props = defineProps({
    // 侧边栏是否打开
    modelValue: {
        type: Boolean,
        default: false,
    },
    // 侧边栏宽度
    width: {
        type: String,
        default: '200px',
    },
    // 侧边栏高度
    height: {
        type: String,
        default: '100%',
    },
    // 侧边栏打开位置
    placement: {
        type: String,
        default: 'left',
    },
    // 侧边栏标题
    title: {
        type: String,
        default: '',
    },
})

// =================================== 全部变量 ==================================

// ================= 初始化 ================

watch(() => props.modelValue, (newVal) => {
    // 打开时禁用滚动
    if (newVal) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
})

onUnmounted(() => {
    // 组件卸载时移除禁用滚动
    document.body.style.overflow = '';
})

// 定义组件函数
const emits = defineEmits(['update:modelValue'])

// 抽屉样式
const drawerStyle = computed(() => {
    const style: Record<string, string> = {}

    // 宽度
    style.width = props.width
    // 高度
    style.height = props.height
    // 判断左右
    if (props.placement === 'left') {
        style.left = '0'
        style.top = '0'
        // style.animation = 'drawerInLeft 0.5s forwards'
    } else if (props.placement === 'right') {
        style.right = '0'
        style.top = '0'
        // style.animation = 'drawerInRight 0.5s forwards'
    }

    return style
})
// ================= 初始化 ================


// ===================================== 关闭自身 =================================

// 是否打开关闭动画
const isClose = ref(false)

// 关闭侧边栏
function closeDrawer() {
    isClose.value = true
}

// 动画结束时关闭侧边栏
function handleAnimationEnd() {
    // 关闭侧边栏
    if (isClose.value) {
        isClose.value = false
        // 关闭侧边栏
        emits('update:modelValue', false)
    }
}

// 点击最外层容器关闭侧边栏
function clickCloseDrawer(event: MouseEvent) {
    // 判断点击的是否是最外层容器
    const target = event.target as HTMLElement
    if (target.classList.contains('drawer-contaienr')) {
        closeDrawer()
    }
}

// ===================================== 关闭自身 =================================
</script>

<style scoped lang="scss">
// =============== 动画 ===============
// 动画时长
$animation-duration: 0.5s;

/* 打开时的动画 */
@keyframes fadeIn {
    0% {
        background-color: rgba(53, 53, 53, 0);
        backdrop-filter: blur(0px);
    }

    100% {
        background-color: rgba(53, 53, 53, 0.346);
        backdrop-filter: blur(1px);
    }
}

/* 关闭时的动画 */
@keyframes fadeOut {
    0% {
        background-color: rgba(53, 53, 53, 0.346);
        backdrop-filter: blur(1px);
    }

    100% {
        background-color: rgba(53, 53, 53, 0);
        backdrop-filter: blur(0px);
    }
}

// 右侧打开抽屉动画
@keyframes drawerInRight {
    0% {}

    100% {
        transform: translateX(0);
    }
}

// 左侧打开抽屉动画
@keyframes drawerInLeft {
    0% {}

    100% {
        transform: translateX(0);
    }
}

// 右侧关闭抽屉动画
@keyframes drawerOutRight {
    0% {
        transform: translateX(0);
    }

    100% {
        transform: translateX(100%);
    }
}

// 左侧关闭抽屉动画
@keyframes drawerOutLeft {
    0% {
        transform: translateX(0);
    }

    100% {
        transform: translateX(-100%);
    }
}

// =============== 动画 ===============

/* 最外层容器 */
.drawer-contaienr {
    width: 100dvw;
    height: 100dvh;
    display: flex;
    flex-direction: column;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 9999;
    /* forwards 保持最终状态 */
    animation: fadeIn $animation-duration forwards;

    /* 关闭时的动画 */
    &--fadeOut {
        animation: fadeOut $animation-duration forwards;
    }

    /* 抽屉 */
    .drawer {
        position: absolute;
        transition: all $animation-duration 1s;
        background-color: var(--background-color-white);
        box-sizing: border-box;
        padding: 20px;
        display: flex;
        flex-direction: column;
        max-width: 100%;

        // 抽屉打开时的动画
        &--InLeft {
            transform: translateX(-100%);
            animation: drawerInLeft $animation-duration forwards;
        }

        &--InRight {
            transform: translateX(100%);
            animation: drawerInRight $animation-duration forwards;
        }

        // 抽屉关闭时的动画
        &--OutLeft {
            animation: drawerOutLeft $animation-duration forwards;
        }

        &--OutRight {
            animation: drawerOutRight $animation-duration forwards;
        }

        // 头部
        .drawer__header {
            margin-bottom: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            user-select: none;
            flex-shrink: 0;

            // 标题
            &__title {
                font-size: 18px;
                font-weight: bold;
                color: var(--text-color-gray-default);
            }

            svg {
                width: 20px;
                height: 20px;
                cursor: pointer;
                transition: all .3s;
                color: var(--text-color-gray-default);

                &:hover {
                    transform: scale(1.2);
                    color: var(--primary-color-100);
                }

                &:active {
                    transform: scale(1);
                }
            }
        }

        // 内容
        .drawer__main {
            flex: 1;
            overflow-y: auto;
            overflow-x: hidden;
        }
    }
}
</style>