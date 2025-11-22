<template>
    <nav class="breadcrumb">
        <slot></slot>
    </nav>
</template>

<script setup lang="ts" name="Breadcrumb">
import { provide, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()

const porps = defineProps({
    // 分隔符样式
    separator: {
        type: String,
        default: '/',
    },
    // 高度
    height: {
        type: String,
        default: '50px',
    },
})

// 提供分隔符样式给子组件
provide('breadcrumb-separator', porps.separator)

// =================== 处理判断子组件是否是最后一个 =======================

// 存放全部子组件项
const items = ref<HTMLElement[]>([])

// 注册子组件项
const registerItems = (item: HTMLElement) => {
    items.value.push(item)
}
// 判断子组件是否是最后一个
const isLastItem = (item: HTMLElement) => {
    return items.value[items.value.length - 1] === item
}

// 上传子组件项
provide('registerBreadcrumbItem', registerItems)
provide('isLastBreadcrumbItem', isLastItem)

// 返回全部子组件
provide('items', items)

watch(() => route.fullPath, () => {
    items.value = []
})

// =================== 处理判断子组件是否是最后一个 =======================
</script>

<style scoped lang="scss">
.breadcrumb {
    display: flex;
    align-items: center;
    box-sizing: border-box;
}
</style>