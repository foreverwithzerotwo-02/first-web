<template>
    <div class="my-input" :class="[`my-input--${props.size}`, { 'my-input--disabled': props.disabled }]">
        <component :is="props.type === 'textarea' ? 'textarea' : 'input'" :value="props.modelValue" @input="handleInput"
            :placeholder="props.placeholder" :disabled="props.disabled" class="my-input__inner" type="text" />
    </div>
</template>

<script setup lang="ts" name="MyInput">
const props = defineProps({
    // 输入框的值
    modelValue: {
        type: String,
        default: '',
    },
    // 输入框的占位符
    placeholder: {
        type: String,
        default: '请输入内容',
    },
    // 大小
    size: {
        type: String,
        default: 'medium', // 可选值：'small' | 'medium' | 'large'
    },
    // 是否禁用
    disabled: {
        type: Boolean,
        default: false,
    },
    // 输入框的类型
    type: {
        type: String,
        default: 'input', // 可选值：'input' | 'password' | 'textarea' 等
    },
})

// 定义事件
const emits = defineEmits(['update:modelValue'])

// input输入事件，将内容返回给父元素
const handleInput = (event: Event) => {
    const value = (event.target as HTMLInputElement).value
    emits('update:modelValue', value)
}

</script>

<style scoped lang="scss">
.my-input {
    width: 100%;

    // 大小
    &--small {
        .my-input__inner {
            height: 30px;
            /* 默认适用于 input */
        }

        textarea.my-input__inner {
            height: 40px;
            /* 专门为 textarea 定义 */
        }
    }

    &--medium {
        .my-input__inner {
            height: 35px;
            /* 默认适用于 input */
        }

        textarea.my-input__inner {
            height: 60px;
            /* 专门为 textarea 定义 */
        }
    }

    &--large {
        .my-input__inner {
            height: 40px;
            /* 默认适用于 input */
        }

        textarea.my-input__inner {
            height: 80px;
            /* 专门为 textarea 定义 */
        }
    }

    // 是否禁用
    &--disabled {
        .my-input__inner {
            background-color: var(--background-color-gray-default) !important;
            cursor: not-allowed;
        }
    }

    // input
    .my-input__inner {
        width: 100%;
        max-width: 100%;
        padding: 10px;
        border: 1px solid var(--border-color-gray-dark);
        border-radius: 4px;
        font-size: 14px;
        box-sizing: border-box;
        background-color: transparent;
        transition: border all var(--transition-duration-slow);

        &:focus {
            outline: none;
            border: 1px solid var(--primary-color-100);
        }

        &:hover {
            border: 1px solid var(--primary-color-100);
        }
    }
}
</style>