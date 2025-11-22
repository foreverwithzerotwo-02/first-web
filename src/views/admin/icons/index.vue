<template>
    <div class="icon-library">
        <h2>图标</h2>

        <!-- 图标预览 -->
        <ul class="icons-preview">
            <li class="icon-item" v-for="(_svg, name) in icons" :key="name" @click="copyTemplate(name)">
                <!-- 图标 -->
                <svg-icon :name="name" :size="32" />

                <!-- 名称 -->
                <span>{{ name }}</span>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import 'element-plus/dist/index.css'

// 引入图标组件
import svgIcon from '@/components/Icons/index.vue';
// 引入图标字典
import icons from '@/components/Icons/index'

// 复制
const copyTemplate = async (name: string) => {
    try {
        await navigator.clipboard.writeText(`<svg-icons name="${name}" />`);

        ElMessage({
            message: `${name} ， copy success.`,
            type: 'success',
        })
    } catch (e) {
        console.error("复制失败", e);
    }
}
</script>

<style scoped lang="scss">
ul {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
        list-style: none;
    }
}

.icon-library {
    width: 100%;

    // 图标展示
    .icons-preview {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));

        // 图标项
        .icon-item {
            aspect-ratio: 1/1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 10px;
            cursor: pointer;
            transition: all var(--transition-duration-default);
            border-radius: 10px;

            &:hover {
                transform: scale(1.1);
                background-color: var(--primary-color-400);
                color: var(--text-color-primary);
            }
        }
    }
}
</style>