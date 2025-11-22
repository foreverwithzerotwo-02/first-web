<template>
    <div class="my-form-item">
        <!-- 描述 -->
        <div v-if="props.label" class="my-form-item__label" :class="[`my-form-item__label--${labelAlign}`]">
            <label for="my-form-item__content" :class="{ 'my-form-item__label--required': props.required }">{{
                props.label
                }}</label>
        </div>

        <!-- 内容 -->
        <div class="my-form-item__content" :class="[`my-form-item__content--${props.align}`]">
            <slot></slot>
            <!-- 错误提示占位 -->
            <transition name="fade-sliden-down">
                <div v-if="errorMessage" class="my-form-item__content__error-message">
                    <span>{{ errorMessage }}</span>
                </div>
            </transition>
        </div>
    </div>
</template>

<script setup lang="ts" name="MyFormItem">
import { inject, onMounted, onUnmounted, ref } from 'vue';

import type { FormRuleMap, FormContext } from '../type'

const props = defineProps({
    // 描述
    label: {
        type: String,
        default: '',
    },
    // 描述贴边方向
    align: {
        type: String,
        default: 'right', // 可选值：'left' | 'right' | 'center'
    },
    // 是否必填
    required: {
        type: Boolean,
        default: false,
    },
    // 当前在表单中的名称
    prop: {
        type: String,
        default: '',
    },
})

// 获取父组件提供的 labelAlign
const labelAlign = inject('labelAlign');

// 获取父组件传的表单值和验证规则
const form = inject<Record<string, any>>('form', {})
const rules = inject<FormRuleMap>('rules')

// 获取父组件传的注册函数
const formContext = inject<FormContext>('formContext')!

// 存放错误信息
const errorMessage = ref('')

// 规则验证函数
const validate = async () => {
    if (rules) {
        const rule = rules[props.prop]
        const va = form[props.prop]

        if (Array.isArray(rule)) {
            for (const ru of rule) {
                // 判断是否必选
                if (ru.required && !va) {
                    errorMessage.value = ru.message || '请勿遗漏我哦'

                    // 返回失败
                    return false
                }

                // 判断大小
                if ((typeof ru.max === 'number' && va > ru.max)
                    || (typeof ru.min === 'number' && va > ru.min)) {
                    if (typeof ru.max === 'number' && typeof ru.min === 'number') {
                        errorMessage.value = ru.message || `最大值为'${ru.max}'，最小值为'${ru.min}'`
                    } else if (typeof ru.min === 'number') {
                        errorMessage.value = ru.message || `最小值为'${ru.min}'`
                    } else {
                        errorMessage.value = ru.message || `最大值为'${ru.max}'`
                    }

                    return false
                }
            }
        }
    }

    // 重置错误信息
    errorMessage.value = ''

    return true
}

onMounted(() => {
    // 注册自己给父元素
    formContext.registerFormItem(props.prop, validate)
})

onUnmounted(() => {
    // 删除注册
    formContext.deleteRegisterFormItem(props.prop)
})
</script>

<style scoped lang="scss">
.my-form-item {
    display: flex;
    align-items: center;
    width: 100%;
    box-sizing: border-box;
    user-select: none;

    // 描述
    .my-form-item__label {
        position: relative;
        width: 100px;
        font-size: 17px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        flex-shrink: 0;
        margin-right: 10px;

        &--left {
            text-align: left;
        }

        &--right {
            text-align: right;
        }

        &--required {
            &::before {
                content: '*';
                color: red;
                margin-right: 2px;
            }
        }
    }

    // 内容
    .my-form-item__content {
        width: calc(100% - 110px);
        min-height: 30px;
        display: flex;
        align-items: center;
        position: relative;

        // 居中
        &--center {
            width: 100%;
            justify-content: center;
        }

        // 错误提示
        .my-form-item__content__error-message {
            position: absolute;
            bottom: 0;
            left: 0;
            max-width: 100%;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            font-size: 12px;
            color: red;
            transform: translateY(100%);
            line-height: 20px;
        }
    }
}
</style>