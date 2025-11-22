<template>
    <div class="my-menu">
        <div class="my-menu__title" v-if="title">
            {{ title }}
        </div>
        <slot></slot>
    </div>
</template>

<script setup lang="ts">
import { nextTick, provide, ref, watch } from 'vue';
import { useRoute } from 'vue-router'
const route = useRoute()

const props = withDefaults(defineProps<{
    // 默认选中
    defaultActive?: string
    // 菜单标题
    title?: string
}>(), {
    defaultActive: '1'
})

// ==================================== 处理当前选中 =======================================

// 存放当前选中的索引
const activeIndex = ref(props.defaultActive)
// 当前选中，供子组件判断
provide('activeIndex', activeIndex)
// 让子组件修改当前选中
const switchIndex = (i: string) => {
    activeIndex.value = i
}
provide('switchIndex', switchIndex)

// 全部子组件
const childrenList: Record<string, string> = {}

// 供子组件注册
const registerChildren = (index: string, to: string) => {
    childrenList[index] = to
}
provide('registerChildren', registerChildren)

watch(() => route.path, async (newValue) => {
    await nextTick()

    if (newValue !== childrenList[activeIndex.value]) {
        // 反查：找到对应 newPath 的 index
        const matchedIndex = Object.entries(childrenList).find(
            ([_, to]) => to === newValue
        )?.[0]

        if (matchedIndex) {
            activeIndex.value = matchedIndex
        }
    }
}, { immediate: true })

// ==================================== 处理当前选中 =======================================


// ================== 判断当前层级 ====================

provide('level', 1)

// ================== 判断当前层级 ====================
</script>

<style scoped lang="scss">
.my-menu {
    height: 100%;
    overflow: hidden;
    width: 240px;
    max-width: 100%;
    user-select: none;
    overflow-y: auto;

    // 介绍标题
    .my-menu__title {
        font-weight: bold;
        font-size: 20px;
        padding: 5px 0;
        margin-bottom: 10px;
    }
}
</style>