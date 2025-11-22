<template>
    <form class="my-form" @submit.prevent="props.onSubmit">
        <slot></slot>
    </form>
</template>

<script setup lang="ts" name="MyForm">
import { provide, reactive } from 'vue'

import type { FormRuleMap } from './type'

const props = withDefaults(defineProps<{
    // 表单验证
    form: Record<string, any>,
    // 表单验证规则
    rules?: FormRuleMap,
    // 表单的提交事件
    onSubmit?: () => void,
    // 内部label对齐方式
    labelAlign?: 'right' | 'left'
}>(), {
    labelAlign: 'right',
})

// 存放全部子组件
const formItems = reactive(new Map)

// 子组件注册
// 子组件名称，验证的函数
const registerFormItem = (name: string, validateFn: () => Promise<boolean>) => {
    formItems.set(name, validateFn)
}
// 删除子组件
const deleteRegisterFormItem = (name: string) => {
    formItems.delete(name)
}

// 提供 labelAlign 给子组件
provide('labelAlign', props.labelAlign)

// 将表单内容与表单验证规则传给子元素
provide('form', props.form)
provide('rules', props.rules)

// 将子组件注册传给子组件
provide('formContext', {
    registerFormItem,
    deleteRegisterFormItem
})

// ======================== 暴露功能 ============================

// 验证表单
const validate = async () => {
    const results = await Promise.all(
        Array.from(formItems.values()).map(fn => fn())
    )

    return results.every(res => res)
}

// ------------------- 重置表单数据 -------------------
// 先拷贝一份初始值
const defaultForm = JSON.parse(JSON.stringify(props.form))
// 创建函数重置
const resetForm = () => {
    // 重置为默认的初始值
    Object.keys(props.form).forEach(key => {
        props.form[key] = defaultForm[key]
    })
}

defineExpose({ validate, resetForm })

// ======================== 暴露功能 ============================
</script>

<style scoped lang="scss">
.my-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 100%;
    max-width: 600px;
    box-sizing: border-box;
}
</style>