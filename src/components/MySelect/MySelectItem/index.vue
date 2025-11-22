<template>
</template>

<script setup lang="ts" name="MySelectItem">
import { inject, onMounted } from 'vue'

interface MySelectItemProps {
    value: string;
    label: string;
    // 是否禁用选项
    disabled?: boolean;
    // 执行函数
    onClick?: () => void;
}

const props = defineProps<MySelectItemProps>()

const registerChild = inject<(child: MySelectItemProps) => void>('registerChild')
// const unregisterChild = inject<(child: MySelectItemProps) => void>('unregisterChild')

onMounted(() => {
    if (registerChild) {
        registerChild(props)
    }
})
</script>