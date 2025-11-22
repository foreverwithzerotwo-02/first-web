<template>
    <span class="icon" :style="style" v-html="icons[name]"></span>
</template>

<script setup lang="ts">
import { computed } from "vue";

// 引入图标字典
import icons from './index'

const props = defineProps<{
    name: string; // 图标名称
    size?: string | number; // 可选，支持大小
    color?: string; // 可选，支持颜色
}>();

// 给 SVG 加上样式（宽高、颜色）
const style = computed(() => ({
    width: typeof props.size === "number" ? `${props.size}px` : props.size || "1em",
    height: typeof props.size === "number" ? `${props.size}px` : props.size || "1em",
    color: props.color || "currentColor",
}));
</script>

<style scoped>
.icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

.icon svg {
    width: 100%;
    height: 100%;
}
</style>
