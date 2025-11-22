<template>
    <div class="my-menu-item"
        :style="{ paddingLeft: 20 * level + 'px', fontSize: level > 1 ? '15px' : '17px', height: level > 1 ? '40px' : '50px', }"
        :class="{ 'my-sub-item--active': isActive }" @click="handleClick">
        <!-- 图标 -->
        <div class="my-menu-item--svg" v-if="slots.icon" :style="{ width: level > 1 ? '16px' : '20px', }">
            <slot name="icon"></slot>
        </div>

        <!-- 标题 -->
        <div class="my-menu-item--title">
            <span>
                <slot></slot>
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, inject, onMounted, type Ref, useSlots } from 'vue';
import { useRouter } from 'vue-router'
const router = useRouter()

const slots = useSlots()

const props = defineProps<{
    // 索引
    index: string
    // 跳转路径
    to: string
}>()

// 当前层级
const level = inject('level') as number

// 当前索引
const parentActiveIndex = inject('activeIndex') as Ref<string>
// 切换当前索引
const switchIndex = inject('switchIndex') as (i: string) => void

// 当前是否被选中
const isActive = computed(() => {
  return parentActiveIndex.value === props.index  // 严格相等！！！
})

// 点击
const handleClick = () => {
    // 切换当前索引
    switchIndex(props.index)

    // 跳转
    if (props.to) {
        router.push(props.to)
    }
}

// 注册自身
const registerChildren = inject<(index: string, to: string) => void>('registerChildren')

onMounted(() => {
    if (registerChildren) registerChildren(props.index, props.to)
})
</script>

<style scoped lang="scss">
.my-menu-item {
    border-radius: 10px;
    // padding: 10px 5px 10px 0;
    padding-right: 7px;
    display: flex;
    align-items: center;
    transition: all var(--transition-duration-default);
    cursor: pointer;
    overflow: hidden;

    &:hover {
        color: var(--text-color-primary-deep);
    }

    // 图标
    .my-menu-item--svg {
        display: flex;
        align-items: center;
        aspect-ratio: 1/1;
        margin-right: 8px;

        svg {
            width: 100%;
            height: 100%;
        }
    }

    // 标题
    .my-menu-item--title {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
}

// 被点击
.my-sub-item--active {
    color: var(--text-color-primary-deep);
    background-color: var(--primary-color-300);
}
</style>