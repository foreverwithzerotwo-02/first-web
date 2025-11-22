<template>
    <div class="my-select" ref="selectContainer">
        <!-- 显示当前所选内容 -->
        <div class="my-select__select-display" @click="toggleOptionsVisible"
            :class="{ 'my-select__select-display--focused': isOptionsVisible }" @mouseenter="handleMouseEnter"
            @mouseleave="handleMouseLeave">
            <span class="my-select__select-display--label">{{ displayLabel }}</span>

            <!-- 清除按钮 -->
            <svg class="my-select__select-display--clean" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                @click="clickClear" v-if="showIcon && showClear && isClearVisible" fill="currentColor">
                <path
                    d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM12 10.5858L14.8284 7.75736L16.2426 9.17157L13.4142 12L16.2426 14.8284L14.8284 16.2426L12 13.4142L9.17157 16.2426L7.75736 14.8284L10.5858 12L7.75736 9.17157L9.17157 7.75736L12 10.5858Z">
                </path>
            </svg>

            <!-- 箭头 -->
            <svg class="my-select__select-display--arrow" v-if="showIcon && (!showClear || !isClearVisible)"
                :class="{ 'my-select__select-display--arrow--top': isOptionsVisible }"
                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path
                    d="M11.9999 13.1714L16.9497 8.22168L18.3639 9.63589L11.9999 15.9999L5.63599 9.63589L7.0502 8.22168L11.9999 13.1714Z">
                </path>
            </svg>
        </div>

        <!-- 展示选项 -->
        <ul class="my-select__select-options-container" :class="{ 'my-select__select-options-container--top': isTop }"
            v-show="isOptionsVisible" ref="selectOptionsContainer">
            <li class="my-select__select-options-container__option"
                :class="{ 'my-select__select-options-container__option--selected': o.value === modelValue }"
                v-for="o in options" :key="o.label" @click="clickSelectValue(o.value)" v-if="options.length > 0">{{
                    o.label }}
            </li>

            <li class="my-select__select-options-container__null" v-else>暂无选项</li>
        </ul>

        <slot></slot>
    </div>
</template>

<script setup lang="ts" name="MySelect">
import { ref, onMounted, onBeforeUnmount, provide, watch, computed } from 'vue';

const props = withDefaults(defineProps<{
    modelValue?: string; // 绑定值
    placeholder?: string; // 占位符
    toggle?: boolean; // 点击相同值为取消
    showClear?: boolean; // 是否显示清除按钮，默认为 false
    showIcon?: boolean  // 是否显示左侧箭头
}>(), {
    modelValue: '',
    placeholder: '请选择',
    toggle: false,
    showClear: false, // 默认不显示清除按钮
    showIcon: true,
})

// 清除按钮是否显示
const isClearVisible = ref(false);

// 移入时显示清除按钮
const handleMouseEnter = () => {
    if (modelValue.value) {
        isClearVisible.value = true;
    }
};

// 移出时隐藏清除按钮
const handleMouseLeave = () => {
    isClearVisible.value = false;
};

// 点击清除按钮
const clickClear = () => {
    modelValue.value = '';

    isClearVisible.value = false; // 清除后隐藏清除按钮
};

// ================================================== 处理选项 =================================================

// 选择内容值
const modelValue = ref(props.modelValue);

// 当前选择内容值
const displayLabel = computed(() => {
    // 如果有选择内容，显示选择内容，否则显示占位符

    if (modelValue.value) {
        const selectedOption = options.value.find(option => option.value === modelValue.value);
        return selectedOption ? selectedOption.label : props.placeholder;
    }

    return modelValue.value || props.placeholder;
})

// 点击选择内容
const clickSelectValue = (value: string) => {
    // 执行函数
    const selectedOption = options.value.find(option => option.value === value);
    if (selectedOption && selectedOption.onClick) {
        selectedOption.onClick();
    }

    // 如果选择的值与当前值相同，则不做任何操作
    if (value === modelValue.value && props.toggle) {
        modelValue.value = '';
        isOptionsVisible.value = false; // 选择后隐藏选项

        return;
    }

    modelValue.value = value;
    isOptionsVisible.value = false; // 选择后隐藏选项
};

// 注册更新父组件
const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void;
}>();

// 监听 modelValue 的变化
watch(() => modelValue.value, (newValue) => {
    emit('update:modelValue', newValue);
});
watch(() => props.modelValue, (newValue) => {
    modelValue.value = newValue
})

// ================================================== 处理选项 =================================================

// =============================== 处理容器显示 ===============================

// 选择容器
const selectContainer = ref<HTMLElement | null>(null);
// 选项容器
const selectOptionsContainer = ref<HTMLElement | null>(null);
// 是否显示选项
const isOptionsVisible = ref(false);
// 是否是顶部显示
const isTop = ref(false);

// 切换选项显示状态
const toggleOptionsVisible = () => {
    isOptionsVisible.value = !isOptionsVisible.value;

    // 如果打开选项容器，判断展示位置
    if (isOptionsVisible.value) {
        setOptionsVisible()
    }
}

// 判断选项容器打开位置
const setOptionsVisible = () => {
    if (!selectContainer.value && !selectOptionsContainer.value) return;

    // 整体容器位置
    const containerRect = selectContainer.value?.getBoundingClientRect();
    // 选项容器高度
    const optionsHeight = selectOptionsContainer.value?.offsetHeight || 0;
    // 视口高度
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

    // 底部剩余空间
    const spaceBelow = viewportHeight - (containerRect?.bottom || 0);
    // 顶部剩余空间
    const spaceAbove = containerRect?.top || 0;

    // 判断显示位置
    isTop.value = spaceBelow < optionsHeight && spaceAbove > optionsHeight;
}

// 监听窗口大小变化
const handleResize = () => {
    if (isOptionsVisible.value) {
        setOptionsVisible();
    }
}

// 监听点击事件
const handleClickOutside = (event: MouseEvent) => {
    if (selectContainer.value && !selectContainer.value.contains(event.target as Node)) {
        isOptionsVisible.value = false;
    }
}

onMounted(() => {
    // 监听窗口大小变化
    window.addEventListener('resize', handleResize);
    // 监听点击事件
    window.addEventListener('click', handleClickOutside);
})

onBeforeUnmount(() => {
    // 移除事件监听
    window.removeEventListener('resize', handleResize);
    window.removeEventListener('click', handleClickOutside);
});

// =============================== 处理容器显示 ===============================

// ============= 处理子组件交互 =============

interface Option {
    label: string; // 选项标签
    value: string; // 选项值
    disabled?: boolean; // 是否禁用选项
    onClick?: () => void; // 点击选项时执行的函数
}

// 存放全部选项
const options = ref<Option[]>([]);

// 子组件注册
const registerChild = (child: Option) => {
    options.value.push(child);
};

// 子组件注销
const unregisterChild = (child: Option) => {
    options.value = options.value.filter(option => option.value !== child.value);
};
// 提供给子组件使用
provide('registerChild', registerChild);
provide('unregisterChild', unregisterChild);

// ============= 处理子组件交互 =============
</script>

<style scoped lang="scss">
.my-select {
    position: relative;
    width: 200px;
    font-size: 15px;
    user-select: none;

    // 当前选择内容展示
    .my-select__select-display {
        max-height: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border: 1px solid var(--border-color-gray-deep);
        padding: 7px 12px;
        cursor: pointer;
        box-sizing: border-box;
        border-radius: 5px;
        transition: all var(--transition-duration-default);

        &:hover {
            border: 1px solid var(--border-color-gray-deepest);
        }

        // 当在选择状态时
        &--focused {
            border: 1px solid var(--border-color-gray-deepest);
            background-color: var(--background-color-black-deep);
            color: var(--text-color-primary-light);
        }

        &--label {
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        // 清除按钮
        &--clean {
            width: 20px;
            height: 20px;
            margin-left: 7px;
            flex-shrink: 0;
            cursor: pointer;
            transition: color var(--transition-duration-default);

            &:hover {
                color: var(--warn-color-200);
            }
        }

        // 箭头按钮
        &--arrow {
            width: 20px;
            height: 20px;
            margin-left: 7px;
            flex-shrink: 0;
            transition: transform var(--transition-duration-default);

            &--top {
                transform: rotate(180deg);
            }
        }
    }

    // 全部选项容器
    .my-select__select-options-container {
        width: 100%;
        box-sizing: border-box;
        padding: 6px;
        list-style: none;
        margin: 0;
        position: absolute;
        bottom: -7px;
        left: 0;
        transform: translateY(100%);
        z-index: 1000;
        border-radius: 5px;
        background-color: var(--background-color-black-deep);
        display: flex;
        flex-direction: column;
        cursor: default;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.304);
        max-height: 300px;
        overflow-y: auto;

        /* 自定义滚动条样式 */
        &::-webkit-scrollbar {
            width: 8px;
        }

        &::-webkit-scrollbar-track {
            background: transparent;
            /* 滚动条轨道背景 */
        }

        &::-webkit-scrollbar-thumb {
            background-color: rgba(255, 255, 255, 0.3);
            /* 滚动条颜色 */
            border-radius: 4px;
            border: 2px solid transparent;
            /* 滚动条内边距 */
            background-clip: content-box;
        }

        &::-webkit-scrollbar-thumb:hover {
            background-color: rgba(255, 255, 255, 0.5);
        }

        // 像上显示
        &--top {
            top: -7px;
            bottom: auto;
            transform: translateY(-100%);
        }

        // 每个选项
        .my-select__select-options-container__option {
            width: 100%;
            padding: 8px;
            white-space: wrap;
            box-sizing: border-box;
            color: var(--text-color-white-dark);
            border-radius: 5px;
            cursor: pointer;
            margin: 0;

            &:hover {
                background-color: var(--background-color-black-deepest);
                color: var(--text-color-primary-light-more);
            }

            // 被选中样式
            &--selected {
                background-color: var(--background-color-black-deepest);
                color: var(--text-color-primary-light-more);
                cursor: default;
            }
        }

        // 没有内容
        .my-select__select-options-container__null {
            width: 100%;
            height: 60px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--text-color-primary-light);
        }
    }
}
</style>