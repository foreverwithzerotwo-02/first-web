<template>
    <div class="my-sub-menu">
        <!-- 主标题容器 -->
        <div class="my-sub-menu__container"
            :style="{ paddingLeft: 20 * level + 'px', fontSize: level > 1 ? '15px' : '17px', height: level > 1 ? '40px' : '50px', }"
            @click="toggleListOpen()" :class="{ 'my-sub-menu__container--active': isActive }">
            <!-- 左侧容器 -->
            <div class="my-sub-menu__container__left">
                <!-- 导航图标 -->
                <div class="my-sub-menu__container__left__icon-container" v-if="slots.icon"
                    :style="{ width: level > 1 ? '16px' : '20px', }">
                    <slot name="icon"></slot>
                </div>

                <!-- 文字 -->
                <div class="my-sub-menu__container__left__span">
                    <span>{{ props.titel }}</span>
                </div>
            </div>

            <!-- 箭头 -->
            <div class="my-sub-menu__container--arrow"
                :style="{ width: level > 1 ? '16px' : '20px', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path
                        d="M11.9999 13.1714L16.9497 8.22168L18.3639 9.63589L11.9999 15.9999L5.63599 9.63589L7.0502 8.22168L11.9999 13.1714Z">
                    </path>
                </svg>
            </div>
        </div>

        <!-- 多级列表容器 -->
        <transition @enter="enter" @leave="leave">
            <div class="my-sub-menu__list-container" ref="listRef" v-show="isOpen" :style="listStyle">
                <slot></slot>
            </div>
        </transition>
    </div>
</template>

<script setup lang="ts">
import { useSlots, computed, inject, nextTick, provide, ref, watch, type Ref } from 'vue';
const slots = useSlots()

const props = defineProps<{
    index: string,
    titel: string,  // 标题
}>()

// =================== 处理当前是否选中状态 ====================

// 当前选中的索引
const parentActiveIndex = inject('activeIndex') as Ref<string>

// 切换当前选中的索引
// const switchIndex = inject('switchIndex') as (i: string) => void

// 当前选中索引
const isActive = computed(() => {
    return parentActiveIndex.value === props.index ||
        parentActiveIndex.value.startsWith(props.index + '-')
})
// =================== 处理当前是否选中状态 ====================

// ===================================== 是否折叠 ================================================

// 判断是否折叠列表
const isOpen = ref(false)

const listHeight = ref(0)

// 容器
const listRef = ref() as Ref

// 容器样式
const listStyle = computed(() => ({
    height: isOpen.value ? listHeight.value + 'px' : '0px',
    overflow: 'hidden',
    transition: 'all 0.5s',
}))

const enter = async () => {
    await nextTick()

    listHeight.value = listRef.value.scrollHeight

    if (parentRigisterHeight) {
        parentRigisterHeight(listRef.value.scrollHeight)
    }

    listRef.value.style.opacity = 1
}

const leave = async () => {

    if (parentCancelHeightHeight) {
        parentCancelHeightHeight(listRef.value.scrollHeight)
    }

    listRef.value.style.opacity = 0.5
    listHeight.value = 0
}

// 切换列表展开
const toggleListOpen = async () => {
    isOpen.value = !isOpen.value
}

// 让子折叠列表注册高度
const rigisterHeight = (h: number) => {
    listHeight.value += h
}
// 让子折叠列表注销高度
const cancelHeight = (h: number) => {
    listHeight.value -= h
}
provide('rigisterHeight', rigisterHeight)
provide('cancelHeight', cancelHeight)
const parentRigisterHeight = inject<((h: number) => void) | null>('rigisterHeight', null)
const parentCancelHeightHeight = inject<((h: number) => void) | null>('cancelHeight', null)

// =================== 是否自动展开 ====================
const shouldOpen = computed(() => {
    const active = parentActiveIndex.value
    if (!active) return false
    return active === props.index || active.startsWith(props.index + '-')
})

// 父组件折叠子组件也折叠
provide('open', isOpen.value)
const parentOpen = inject('open', null) as Ref | null
// 监听激活变化，自动展开正确的父级菜单
watch(shouldOpen, (val) => {
    if (val) {
        isOpen.value = true
    }
}, { immediate: true })

// ===================================== 是否折叠 ================================================


// ================================= 当前嵌套层级 ===================================

// 当前层级
const level = Number(inject('level'))

// 接力
provide('level', level + 1)

// ================================= 当前嵌套层级 ===================================
</script>

<style scoped lang="scss">
.my-sub-menu {
    transition: all .5s;

    // 主标题容器
    .my-sub-menu__container {
        border-radius: 10px;
        // padding: 10px 5px 10px 0;
        padding-right: 7px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        transition: all var(--transition-duration-default);
        cursor: pointer;

        &:hover {
            color: var(--text-color-primary-deep);
        }

        // 左侧容器
        .my-sub-menu__container__left {
            height: 100%;
            display: flex;
            align-items: center;
            overflow: hidden;

            // 导航图标
            .my-sub-menu__container__left__icon-container {
                display: flex;
                align-items: center;
                aspect-ratio: 1/1;
                margin-right: 8px;

                svg {
                    width: 100%;
                    height: 100%;
                }
            }

            .my-sub-menu__container__left__span {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }

        // 箭头
        .my-sub-menu__container--arrow {
            display: flex;
            align-items: center;
            margin-left: 5px;
            aspect-ratio: 1/1;
            transition: all .3s;

            svg {
                width: 100%;
                height: 100%;
            }
        }
    }

    // 多级列表容器
    // .my-sub-menu__list-container {}

    // 被点击
    .my-sub-menu__container--active {
        color: var(--text-color-primary-deep);
    }
}
</style>