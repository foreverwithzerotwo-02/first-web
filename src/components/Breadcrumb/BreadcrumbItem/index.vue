<template>
    <span class="breadcrumb-item" ref="self">
        <template v-if="props.disabled || isLast">
            <span class="lable disabled">
                <slot />
            </span>
        </template>
        <template v-else-if="!props.disabled">
            <router-link class="lable" :to="to">
                <slot />
            </router-link>
        </template>
        <template v-else="props.disabled">
            <span class="lable">
                <slot />
            </span>
        </template>

        <span v-if="!isLast && !isHome" class="separator">{{ separator }}</span>
    </span>
</template>

<script setup lang="ts" name="BreadcrumbItem">
import { computed, inject, ref, onMounted, watch, type Ref } from 'vue'
// import { useRoute } from 'vue-router'
// const route = useRoute()

const props = defineProps({
    // 要跳转的路径
    to: {
        type: String,
        default: '',
    },
    // 是否禁用
    disabled: {
        type: Boolean,
        default: false,
    },
    // 是否是首頁
    isHome: {
        type: Boolean,
        default: false,
    },
})

// 获取分隔符样式
const separator = inject('breadcrumb-separator')


// ==================== 处理判断子组件是否是最后一个 =======================

const self = ref<HTMLElement | null>(null)

// 获取注册子组件项的函数
const register = inject<(item: HTMLElement) => void>('registerBreadcrumbItem')
// 获取判断子组件是否是最后一个的函数
const isLastFn = inject<(item: HTMLElement) => boolean>('isLastBreadcrumbItem')

// 全部子组件，判断是否更新
const items = inject<Ref<HTMLElement[]>>('items')

// 判断自己是否是最后一个子组件
const isLast = computed(() => {
    return self.value && isLastFn ? isLastFn(self.value as HTMLElement) : false
})

// 将自己注册到父组件
onMounted(() => {
    if (self.value && register) {
        register(self.value)
    }
})

watch(items!, () => {
    if (self.value && register) {
        register(self.value)
    }
})

// ==================== 处理判断子组件是否是最后一个 =======================
</script>

<style scoped lang="scss">
.breadcrumb-item {
    font-size: 16px;

    // 全部文本
    .lable {
        color: var(--text-color-gray-dark);
        transition: all 0.3s;

        &:hover {
            color: var(--text-color-primary);
        }
    }

    // 禁用状态
    .disabled {
        color: var(--text-color-gray-light);
        cursor: not-allowed;


        &:hover {
            color: var(--text-color-gray-light);
        }
    }

    // 分隔符
    .separator {
        margin: 0 10px;
    }
}
</style>