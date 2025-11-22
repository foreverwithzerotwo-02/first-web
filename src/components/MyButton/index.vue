<template>
    <button class="my-button" @click="handleClick" :type="props.type" :disabled="props.disabled"
        :style="{ fontSize: size }">
        <slot></slot>
    </button>
</template>

<script setup lang="ts" name="MyButton">
const props = withDefaults(defineProps<
    {
        onClick?: Function,
        type?: 'button' | 'submit' | 'reset',
        disabled?: boolean
        size?: number
    }
>(), {
    type: 'button',
    disabled: false,
    size: 16
})

const handleClick = (event: MouseEvent) => {
    if (props.onClick) {
        props.onClick(event)
    }
}
</script>

<style scoped lang="scss">
.my-button {
    border-radius: 5px;
    padding: 10px 20px;
    cursor: pointer;
    background-color: var(--primary-color-300);
    border: 1px solid var(--primary-color-200);
    transition: all .3s;

    &:hover {
        background-color: var(--primary-color-200);
        border: 1px solid var(--primary-color-100);
        color: var(--text-color-primary-deep);
        transform: scale(1.05);
    }

    &:active {
        background-color: var(--primary-color-200);
        transform: scale(1);
    }
}
</style>