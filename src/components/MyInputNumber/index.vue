<script setup lang="ts">
import { ref, watch } from "vue";

interface Props {
  modelValue: number;
  min?: number;
  max?: number;
  step?: number;
}

const props = withDefaults(defineProps<Props>(), {
  min: -Infinity,
  max: Infinity,
  step: 1,
});

const emit = defineEmits<{
  (e: "update:modelValue", value: number): void;
  (e: "change", value: number, oldI: number, type: number): void;   // 值改变时触发
  (e: "increase", value: number): void; // 增加 时触发
  (e: "decrease", value: number): void; // 减少 时触发
}>();

// 本地值
const localValue = ref(props.modelValue);

watch(
  () => props.modelValue,
  (val) => (localValue.value = val)
);

// 未修改的索引
let ii: null | number = null

const increase = () => {
  const newVal = Math.min(localValue.value + props.step, props.max);
  localValue.value = newVal;
  emit("update:modelValue", newVal);
  emit("increase", newVal); // 触发自定义事件
  emit("change", newVal, localValue.value - 1, 1);   // 通用 change
};

const decrease = () => {
  const newVal = Math.max(localValue.value - props.step, props.min);

  localValue.value = newVal;
  emit("update:modelValue", newVal);
  emit("decrease", newVal); // 触发自定义事件
  emit("change", newVal, localValue.value + 1, 0);   // 通用 change
};

const onInput = (e: Event) => {
  // const val = Number((e.target as HTMLInputElement).value);
  // if (!isNaN(val)) {
  //   localValue.value = val;
  //   emit("update:modelValue", val);
  // }
};

const changeInput = (e: Event) => {
  let val = Number((e.target as HTMLInputElement).value);

  if (val >= props.max) {
    val = props.max;
    // localValue.value = val;
  } else if (val <= props.min) {
    val = props.min;
    // localValue.value = val;
  }

  // emit("update:modelValue", val);

  if (ii !== null && ii === val) {
    emit("change", val, ii as number, -1); // 如果值未改变，设置为 -1
  } else {
    emit("change", val, ii as number, -2); // 通用 change
  }

  ii = null;
};

</script>

<template>
  <div class="custom-input-number">
    <button class="btn" :disabled="localValue <= min" @click="decrease">-</button>
    <input type="number" :value="localValue" @input="onInput" @change="changeInput" @focus="ii = localValue" />
    <button class="btn" :disabled="localValue >= max" @click="increase">+</button>
  </div>
</template>

<style scoped lang="scss">
.custom-input-number {
  display: inline-flex;
  align-items: center;
  border: 1px solid var(--primary-color-100);
  /* 自定义边框颜色 */
  border-radius: 6px;
  overflow: hidden;
  height: 26px;
}

.custom-input-number input {
  width: 28px;
  text-align: center;
  border: none;
  outline: none;
  font-size: 14px;
  color: #2c3e50;
  /* 文字颜色 */
  background-color: transparent;
}

/* 去掉默认上下按钮 */
.custom-input-number input::-webkit-inner-spin-button,
.custom-input-number input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.custom-input-number .btn {
  background: var(--primary-color-300);
  /* 按钮背景色 */
  color: rgb(0, 0, 0);
  border: none;
  cursor: pointer;
  font-size: 12px;
  height: 100%;
  display: flex;
  width: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-duration-default);

  &:disabled {
    cursor: not-allowed;
    opacity: .5;
    background: var(--background-color-gray-dark) !important;
    /* 禁用状态颜色 */
  }
}

.custom-input-number .btn:hover {
  background: var(--primary-color-200);
  /* hover 颜色 */
}
</style>
