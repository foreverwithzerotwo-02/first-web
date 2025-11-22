<template>
    <nav class="toc">
        <div class="toc__slider" :style="sliderStyle"></div>
        <ul>
            <li v-for="(value, index) in tocList" :key="value.id" :id="value.content"
                :class="['toc-item', 'level-' + value.level, { 'toc-item__read': index === tocIndex, 'toc-item__have-read': index < tocIndex }]"
                @click="updateTocIndex(index)">
                <a :href="'#' + value.id">{{
                    value.content }}</a>
            </li>
        </ul>
    </nav>
</template>

<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'

const props = defineProps<{
    toc: Array<{ id: string, level: number, content: string }>
}>()

onMounted(() => {
    observer = new IntersectionObserver(
        entries => {
            for (const entry of entries) {
                if (!isClickScrolling && entry.isIntersecting) {
                    tocIndex.value = props.toc.findIndex(item => item.id === entry.target.id)
                    updateSlider()
                }
            }
        },
        { rootMargin: '0px 0px -70% 0px', threshold: 0 } // 提前高亮
    )
})

onUnmounted(() => {
    observer?.disconnect()
})

// ================== 全局变量 ======================

// 当前选中的目录索引
const tocIndex = ref(0)

const tocList = ref(props.toc)

let observer: IntersectionObserver | null = null

let isClickScrolling = false

let clickScrollingTime: null | number = null

// ================== 全局变量 ======================

// 切换选中目录
const updateTocIndex = (i: number) => {
    tocIndex.value = i

    updateSlider()

    isClickScrolling = true

    if (clickScrollingTime) {
        clearTimeout(clickScrollingTime)
    }

    clickScrollingTime = setTimeout(() => {
        isClickScrolling = false

        clickScrollingTime = null;
    }, 600) // 根据滚动动画时间设置
}

watch(() => props.toc, () => {
    nextTick(() => {
        const allH = document.querySelectorAll('.article')
        tocList.value = props.toc

        allH.forEach(item => observer?.observe(item))
        updateSlider()
    })
})

// 滑块样式
const sliderStyle = ref({
    height: '0px',
    top: '0px'
})

// 更新滑块位置
const updateSlider = async () => {
    await nextTick(() => { })

    // 获取当前阅读目录项
    const readToc = document.getElementById(props.toc[tocIndex.value]?.content || '')

    if (!readToc) return

    const link = readToc?.querySelector('a') as HTMLElement


    sliderStyle.value.top = link.offsetTop + 'px'
    sliderStyle.value.height = link.offsetHeight + 'px'

}
</script>

<style scoped lang="scss">
.toc {
    height: 100%;
    width: 100%;
    overflow-y: auto;
    position: relative;
    padding: 0 14px;
    box-sizing: border-box;

    // 滑块
    .toc__slider {
        position: absolute;
        left: 0;
        width: 4px;
        border-radius: 2px;
        background-color: var(--primary-color-100);
        transition: all .3s;
    }

    ul {
        padding: 0;
        margin: 0;
        width: 100%;
    }

    .toc-item {
        list-style: none;
        box-sizing: border-box;
        width: 100%;
        margin: 2px 0;
    }

    .toc-item.level-3 {
        margin-left: 16px;
    }

    .toc-item a {
        text-decoration: none;
        color: var(--text-color-gray-dark);
        transition: all var(--transition-duration-default);
        font-size: 14px;
        width: 100%;
        height: 100%;
        display: block;
        padding: 4px 0;
    }

    .toc-item a:hover {
        color: var(--color-white);
    }

    // 正在读的目录
    .toc-item__read {
        // background-color: var(--text-color-primary);

        a {
            color: var(--text-color-primary) !important;
        }

    }

    // 已读的目录
    .toc-item__have-read {
        a {
            color: var(--text-color-gray-light) !important;
        }
    }

}
</style>