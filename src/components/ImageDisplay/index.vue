<template>
    <div class="image-display">
        <!-- 关闭按钮 -->
        <div class="image-display--close" @click="isOpen = false">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path
                    d="M11.9997 10.5865L16.9495 5.63672L18.3637 7.05093L13.4139 12.0007L18.3637 16.9504L16.9495 18.3646L11.9997 13.4149L7.04996 18.3646L5.63574 16.9504L10.5855 12.0007L5.63574 7.05093L7.04996 5.63672L11.9997 10.5865Z">
                </path>
            </svg>
        </div>

        <!-- 操作图片工具栏 -->
        <div class="image-display--toolbar">
            <!-- 按钮项-重置 -->
            <div class="image-display--toolbar--item" @click="resetRemoveResize(currentImgIndex)" title="重置">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path
                        d="M12 4C14.7486 4 17.1749 5.38626 18.6156 7.5H16V9.5H22V3.5H20V5.99936C18.1762 3.57166 15.2724 2 12 2C6.47715 2 2 6.47715 2 12H4C4 7.58172 7.58172 4 12 4ZM20 12C20 16.4183 16.4183 20 12 20C9.25144 20 6.82508 18.6137 5.38443 16.5H8V14.5H2V20.5H4V18.0006C5.82381 20.4283 8.72764 22 12 22C17.5228 22 22 17.5228 22 12H20Z">
                    </path>
                </svg>
            </div>
            <!-- 按钮项-放大 -->
            <div class="image-display--toolbar--item" @click="isOpenFullScreen = !isOpenFullScreen"
                :title="isOpenFullScreen ? '缩小' : '放大'">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                    v-if="!isOpenFullScreen">
                    <path d="M8 3V5H4V9H2V3H8ZM2 21V15H4V19H8V21H2ZM22 21H16V19H20V15H22V21ZM22 9H20V5H16V3H22V9Z">
                    </path>
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" v-else>
                    <path d="M18 7H22V9H16V3H18V7ZM8 9H2V7H6V3H8V9ZM18 17V21H16V15H22V17H18ZM8 15V21H6V17H2V15H8Z">
                    </path>
                </svg>
            </div>
        </div>

        <!-- 左右切换按钮 -->
        <div class="image-display__main--switch image-display__main--switch--left"
            :class="{ 'image-display__main--switch--disable': currentImgIndex <= 0 }" v-if="allSrc.length > 1"
            @click="goLast">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path
                    d="M10.8284 12.0007L15.7782 16.9504L14.364 18.3646L8 12.0007L14.364 5.63672L15.7782 7.05093L10.8284 12.0007Z">
                </path>
            </svg>
        </div>
        <div class="image-display__main--switch image-display__main--switch--right"
            :class="{ 'image-display__main--switch--disable': currentImgIndex >= allSrc.length - 1 }"
            v-if="allSrc.length > 1" @click="goNext">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path
                    d="M13.1717 12.0007L8.22192 7.05093L9.63614 5.63672L16.0001 12.0007L9.63614 18.3646L8.22192 16.9504L13.1717 12.0007Z">
                </path>
            </svg>
        </div>

        <!-- 主要展示 -->
        <main class="image-display__main" ref="displayImageRef" @transitionstart="handleTransitionStart"
            @transitionend="handleTransitionEnd">
            <!-- 包装 -->
            <div class="image-display__main__wrapper">
                <!-- 图片容器 -->
                <div class="image-display__main__wrapper__img-container"
                    :class="{ 'image-display__main__wrapper__img-container--hidden': index !== currentImgIndex }"
                    v-for="(item, index) in allSrc" :key="index">
                    <!-- 图片容器正宗 -->
                    <div class="image-display__main__wrapper__img-container--img" ref="mainImgRef"
                        @wheel="handleImgWheel" @mousedown="handleMouseDown" @mousemove="handleMouseMove"
                        @mouseup="handleMouseUp">
                        <img :src="item" :alt="props.alt">
                    </div>
                </div>
            </div>
        </main>

        <!-- 底部缩略图 -->
        <transition name="fade-updown">
            <div class="image-display__thumbnail" v-show="allSrc.length > 1 || isOpenFullScreen">
                <!-- 左右移动按钮 -->
                <div class="image-display__thumbnail--switch image-display__thumbnail--switch--left"
                    :class="{ 'image-display__main--switch--disable': currentImgIndex <= 0 }" @click="goLast">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path
                            d="M10.8284 12.0007L15.7782 16.9504L14.364 18.3646L8 12.0007L14.364 5.63672L15.7782 7.05093L10.8284 12.0007Z">
                        </path>
                    </svg>
                </div>
                <div class="image-display__thumbnail--switch image-display__thumbnail--switch--right"
                    :class="{ 'image-display__main--switch--disable': currentImgIndex >= allSrc.length - 1 }"
                    @click="goNext">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path
                            d="M13.1717 12.0007L8.22192 7.05093L9.63614 5.63672L16.0001 12.0007L9.63614 18.3646L8.22192 16.9504L13.1717 12.0007Z">
                        </path>
                    </svg>
                </div>

                <!-- 整体 -->
                <div class="image-display__thumbnail__transform-container" ref="displayThumbnailImageRef">
                    <!-- 图片容器 -->
                    <div class="image-display__thumbnail__transform-container__image-container"
                        @click="goDesignate(index)" v-for="(item, index) in allSrc" :key="index"
                        :class="[`image-display__thumbnail__transform-container__image-container--${Math.min(Math.abs(currentImgIndex - index), 4)}`, { 'image-display__thumbnail__transform-container__image-container--active': index === currentImgIndex }]">
                        <!-- 遮罩 -->
                        <div class="image-display__thumbnail__transform-container__image-container--mask"></div>
                        <!-- 三角标 -->
                        <div class="image-display__thumbnail__transform-container__image-container--triangle"></div>
                        <img :src="item" :alt="props.alt">
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup lang="ts" name="ImageDisplay">
import { computed, onMounted, ref, onUnmounted, watch } from 'vue';

onMounted(() => {
    document.body.style.overflow = 'hidden';
})
onUnmounted(() => {
    // 恢复页面滚动
    document.body.style.overflow = '';
});

const props = withDefaults(defineProps<{
    // 是否打开
    modelValue: boolean,
    // 图片src
    src: Array<string> | string,
    alt?: string,
    // 当前展示的图片索引
    currentIndex?: number,
}>(), {
    alt: '',
    currentIndex: 0,
})

const emit = defineEmits(['update:modelValue'])

// 当前组件是否打开
const isOpen = ref(props.modelValue)
watch(() => isOpen.value, () => {
    emit('update:modelValue', isOpen.value)
})

// 展示图片的src
const allSrc = computed(() => {
    if (Array.isArray(props.src)) {
        return props.src
    }

    const arr = []
    arr.push(props.src)
    return arr
})


// 当前展示图片的索引
const currentImgIndex = ref(props.currentIndex)

// 获取展示容器
const displayImageRef = ref()
// 获取缩略图展示容器
const displayThumbnailImageRef = ref()

// 移动主图展示
const transformImageContainer = (moveRef: HTMLElement, distance: number, isThumbnail: boolean = false, width?: number) => {
    // 获取视口宽度，为移动距离
    let distanceWidth = window.innerWidth

    if (width) distanceWidth = width

    if (!isThumbnail) {
        moveRef.style.transform = `translateX(-${distanceWidth * distance}px)`
    } else {
        moveRef.style.transform = `translateX(calc(50% - 75px - ${distanceWidth * distance}px))`
    }
}

// 下一张
const goNext = () => {

    if (currentImgIndex.value >= allSrc.value.length - 1) return

    currentImgIndex.value += 1

    // 移动主图
    transformImageContainer(displayImageRef.value, currentImgIndex.value)
    // 移动缩略图
    transformImageContainer(displayThumbnailImageRef.value, currentImgIndex.value, true, 140 + 6)
}
// 上一张
const goLast = () => {

    if (currentImgIndex.value <= 0) return

    currentImgIndex.value -= 1

    // 移动主图
    transformImageContainer(displayImageRef.value, currentImgIndex.value)
    // 移动缩略图
    transformImageContainer(displayThumbnailImageRef.value, currentImgIndex.value, true, 140 + 6)
}
// 跳转指定张
const goDesignate = (i: number) => {
    currentImgIndex.value = i

    // 移动主图
    transformImageContainer(displayImageRef.value, i)
    // 移动缩略图
    transformImageContainer(displayThumbnailImageRef.value, i, true, 140 + 6)
}

// ============================================== 操作图片工具栏 =======================================================

// 是否是全屏
let isOpenFullScreen = ref(false)

// ============================================== 操作图片工具栏 =======================================================

// ======================= 解决图片放大缩小以及拖动 ========================

// 获取图片容器
const mainImgRef = ref<Array<HTMLImageElement> | null>()

// 初始缩放比例
let mainImgScale = ref(1)

// 检测图片上的滚动事件
const handleImgWheel = (event: WheelEvent) => {
    event.preventDefault(); // 阻止默认滚动行为

    // 缩放步长
    let zoomStep = 0.1

    if (event.deltaY >= 0) {
        // 缩小
        mainImgScale.value = Math.max(mainImgScale.value - zoomStep, 0.2)
    } else {
        // 放大 
        mainImgScale.value = Math.min(mainImgScale.value + zoomStep, 10)
    }

    // 当前修改的图片
    const img = mainImgRef.value ? mainImgRef.value[currentImgIndex.value] : null;

    // 更新
    if (img) {
        img.style.transform = `translate(${currentTranslateX.value}px, ${currentTranslateY.value}px) scale(${mainImgScale.value})`
    }
}

// 是否可以移动
let isDragging = false
// 是否正在执行切换过渡
let isTransition = false
// 初始鼠标位置
let startX = 0
let startY = 0
// 移动距离
let currentTranslateX = ref(0)
let currentTranslateY = ref(0)

// 鼠标被按下
const handleMouseDown = (event: MouseEvent) => {
    event.preventDefault()

    // 父元素在过渡就不允许执行
    if (isTransition) return

    isDragging = true
    startX = event.clientX
    startY = event.clientY
}

// 鼠标移动
const handleMouseMove = (event: MouseEvent) => {
    if (!isDragging) return

    const deltaX = event.clientX - startX
    const deltaY = event.clientY - startY

    const img = mainImgRef.value ? mainImgRef.value[currentImgIndex.value] : null
    if (img) {
        currentTranslateX.value += deltaX
        currentTranslateY.value += deltaY
        img.style.transform = `translate(${currentTranslateX.value}px, ${currentTranslateY.value}px) scale(${mainImgScale.value})`
    }

    startX = event.clientX
    startY = event.clientY
}

// 处理鼠标释放事件
const handleMouseUp = () => {
    isDragging = false
}

// 重置
const resetRemoveResize = (i: number) => {
    // 缩放大小
    mainImgScale.value = 1
    // 是否可以移动
    isDragging = false
    // 初始鼠标位置
    startX = 0
    startY = 0
    // 移动距离
    currentTranslateX.value = 0
    currentTranslateY.value = 0

    const img = mainImgRef.value ? mainImgRef.value[i] : null
    if (img) {
        img.style.transform = `translate(${currentTranslateX.value}px, ${currentTranslateY.value}px) scale(${mainImgScale.value})`
    }
}

// 监听切换图片
watch(() => currentImgIndex.value, (nv, ov) => {
    resetRemoveResize(ov)
})

// 切换图片容器过渡开始触发
const handleTransitionStart = () => {
    isTransition = true
}
// 切换图片容器过渡结束触发
const handleTransitionEnd = () => {
    isTransition = false
}

// ======================= 解决图片放大缩小以及拖动 ========================
</script>

<style scoped lang="scss">
$--back-color-gray-transform-2: rgba(180, 180, 180, 0.646);


// 下移淡出，上移淡入
.fade-updown-leave-active {
    animation: fade-updown-leave-active-leave 1s;

    @keyframes fade-updown-leave-active-leave {
        0% {
            // transform: translateY(0);
            height: 100px;
            opacity: 1;
            margin-bottom: 20px;
        }

        100% {
            // transform: translateY(50%);
            opacity: 0;
            height: 0px;
            margin-bottom: 0px;
        }
    }
}

.fade-updown-enter-active {
    animation: fade-updown-leave-active-enter 1s;

    @keyframes fade-updown-leave-active-enter {
        0% {
            transform: translateY(50%);
            opacity: 0;
            // height: 0px;
            // margin-bottom: 0px;
        }

        100% {
            transform: translateY(0%);
            opacity: 1;
            // height: 100px;
            // margin-bottom: 20px;
        }
    }
}

.image-display {
    position: fixed;
    top: 0;
    left: 0;
    width: 100dvw;
    height: 100dvh;
    z-index: 9999;
    background-color: var(--background-color-black-transparent);
    backdrop-filter: blur(2px);
    box-sizing: border-box;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    user-select: none;
    animation: identifier 1s;

    @keyframes identifier {
        0% {
            opacity: 0;
            backdrop-filter: blur(0px);
        }

        100% {
            opacity: 1;
            backdrop-filter: blur(2px);
        }
    }

    // 关闭按钮
    .image-display--close {
        width: 40px;
        height: 40px;
        position: absolute;
        right: 20px;
        top: 20px;
        border-radius: 50%;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.381);
        cursor: pointer;
        z-index: 1;
        transition: all var(--transition-duration-default);

        &:hover {
            background-color: var(--background-color-black-transparent-light);
            transform: scale(.98);

            svg {
                color: var(--text-color-primary);
            }
        }

        &:active {
            transform: scale(1);

            svg {
                color: var(--text-color-primary-light);
            }
        }

        svg {
            width: 100%;
            height: 100%;
            color: var(--text-color-gray-dark);
            transition: all var(--transition-duration-default);
        }
    }


    // 操作图片工具栏
    .image-display--toolbar {
        position: absolute;
        left: 50%;
        top: 20px;
        padding: 7px 10px;
        transform: translateX(-50%);
        background-color: $--back-color-gray-transform-2;
        box-shadow: 0 0 10px rgba(46, 46, 46, 0.538);
        border-radius: 10px;
        opacity: .3;
        z-index: 2;
        display: flex;
        gap: 10px;
        box-sizing: border-box;
        transition: all var(--transition-duration-default);

        &:hover {
            box-shadow: 0 0 16px rgba(46, 46, 46, 0.582);
            opacity: 1;
        }

        &--item {
            width: 30px;
            height: 30px;
            box-sizing: border-box;
            padding: 4px;
            border-radius: 5px;
            transition: all var(--transition-duration-default);
            cursor: pointer;

            &:hover {
                background-color: var(--background-color-black-default);
                transform: scale(.90);

                svg {
                    color: var(--text-color-primary-light);
                }
            }

            &:active {
                transform: scale(1);
            }

            svg {
                width: 100%;
                height: 100%;
                color: var(--text-color-gray-dark);
                transition: all var(--transition-duration-default);
            }
        }
    }

    // 左右切换按钮
    .image-display__main--switch {
        position: absolute;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        top: 50%;
        transform: translateY(-50%);
        background-color: var(--background-color-black-transparent-light);
        transition: all var(--transition-duration-default);
        cursor: pointer;
        z-index: 1;
        box-shadow: 0 0 10px rgba(100, 100, 100, 0.363);

        &--disable {
            background-color: var(--background-color-disable-gray-transparent);
            box-shadow: 0 0 10px rgba(100, 100, 100, 0.363);
            pointer-events: none;

            svg {
                color: var(--text-color-disable-gray-dark) !important;
            }
        }

        svg {
            width: 100%;
            height: 100%;
            color: var(--text-color-gray-dark);
            transition: all var(--transition-duration-default);
        }

        &:hover {
            background-color: var(--background-color-black-transparent);
            transform: translateY(-50%) scale(.95);
            box-shadow: 0 0 10px rgba(8, 8, 8, 0.363);

            svg {
                color: var(--text-color-primary);
            }
        }

        &:active {
            background-color: var(--background-color-black-transparent-light);
            transform: translateY(-50%) scale(1);
        }

        &--left {
            left: 20px;
        }

        &--right {
            right: 20px;
        }
    }

    // 主要展示
    .image-display__main {
        flex: 1;
        width: 100dvw;
        display: flex;
        transition: all 1.2s;
        flex-shrink: 0; // 防止被压缩
        position: relative;
        // position: absolute;
        // left: 0;
        // right: 0;

        // 包装图片
        .image-display__main__wrapper {
            position: absolute;
            width: 100%;
            height: 100%;
            max-height: 100vdh;
            display: flex;

            // 图片容器
            .image-display__main__wrapper__img-container {
                width: 100dvw;
                height: 100%;
                max-height: 100dvh;
                display: flex;
                align-items: center;
                justify-content: center;
                box-sizing: border-box;
                flex-shrink: 0;

                &--hidden {
                    overflow: hidden;
                }

                .image-display__main__wrapper__img-container--img {
                    max-width: 100%;
                    max-height: 100%;
                    height: 70%;
                    display: flex;
                    cursor: grab;

                    img {
                        width: 100%;
                        height: 100%;
                        object-fit: scale-down;
                    }
                }
            }
        }
    }

    // 缩略图
    .image-display__thumbnail {
        position: relative; // 改为相对定位
        margin-bottom: 20px;
        width: 80%;
        height: 100px;
        background-color: var(--background-color-black-transparent);
        border-radius: 5px;
        flex-shrink: 0;
        z-index: 1;
        transition: all var(--transition-duration-slow);
        display: flex;
        box-sizing: border-box;
        justify-content: center;
        padding: 10px 20px;
        overflow: hidden;

        &:hover {
            background-color: var(--background-color-black-transparent-dark);
        }

        // 左右移动按钮
        .image-display__thumbnail--switch {
            width: 45px;
            height: 45px;
            border-radius: 50%;
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            z-index: 1;
            background-color: var(--background-color-gray-transparent);
            box-shadow: 0 0 10px rgba(63, 63, 63, 0.363);
            transition: all var(--transition-duration-slow);
            cursor: pointer;

            &--disable {
                background-color: var(--background-color-disable-gray-transparent);
                box-shadow: 0 0 10px rgba(100, 100, 100, 0.363);
                pointer-events: none;

                svg {
                    color: var(--text-color-disable-gray-dark) !important;
                }
            }

            &:hover {
                background-color: var(--background-color-gray-transparent-light);
                box-shadow: 0 0 5px rgba(0, 0, 0, 0.531);
                transform: translateY(-50%) scale(.96);

                svg {
                    color: var(--text-color-primary);
                }
            }

            &:active {
                transform: translateY(-50%) scale(1);
                background-color: var(--background-color-gray-transparent);
            }

            svg {
                width: 100%;
                height: 100%;
                color: var(--text-color-gray-dark);
                transition: all var(--transition-duration-slow);
            }

            &--left {
                left: 20px;
            }

            &--right {
                right: 20px;
            }
        }

        // 整体过渡容器
        .image-display__thumbnail__transform-container {
            transition: all 1.2s;
            height: 100%;
            display: flex;
            align-items: center;
            gap: 12px;
            transform: translateX(calc(50% - 75px));

            // 图片容器
            .image-display__thumbnail__transform-container__image-container {
                height: 100%;
                width: 140px;
                position: relative;
                border-radius: 7px;
                overflow: hidden;
                transition: all var(--transition-duration-slow);
                cursor: pointer;
                border: 2px solid transparent;
                box-shadow: 0 0 10px rgba(80, 80, 80, 0);
                filter: brightness(1);

                &--1 {
                    transform: scale(.95);
                    box-shadow: 0 0 10px rgba(80, 80, 80, 0.618);
                    filter: brightness(0.9) opacity(.9);

                    .image-display__thumbnail__transform-container__image-container--mask {
                        backdrop-filter: blur(2px) !important;
                    }
                }

                &--2 {
                    transform: scale(.92);
                    box-shadow: 0 0 10px rgba(63, 63, 63, 0.618);
                    filter: brightness(0.8) opacity(.8);

                    .image-display__thumbnail__transform-container__image-container--mask {
                        backdrop-filter: blur(3px) !important;
                    }
                }

                &--3 {
                    transform: scale(.9);
                    box-shadow: 0 0 10px rgba(49, 49, 49, 0.618);
                    filter: brightness(0.75) opacity(.7);

                    .image-display__thumbnail__transform-container__image-container--mask {
                        backdrop-filter: blur(4px) !important;
                    }
                }

                &--4 {
                    transform: scale(.88);
                    box-shadow: 0 0 10px rgba(35, 35, 35, 0.618);
                    filter: brightness(0.7) opacity(.6);

                    .image-display__thumbnail__transform-container__image-container--mask {
                        backdrop-filter: blur(5px) !important;
                    }
                }

                &--5 {
                    transform: scale(.86);
                    box-shadow: 0 0 10px rgba(20, 20, 20, 0.618);
                    filter: brightness(0.7) opacity(.6);

                    .image-display__thumbnail__transform-container__image-container--mask {
                        backdrop-filter: blur(6px) !important;
                    }
                }

                // 被选中
                &--active {
                    cursor: default;
                    border: 2px solid var(--border-color-gray-default);

                    .image-display__thumbnail__transform-container__image-container--mask {
                        background-color: transparent !important;
                        backdrop-filter: blur(0) !important;
                    }
                }

                &:hover {
                    border: 2px solid var(--border-color-gray-default);
                    filter: brightness(1) opacity(1);

                    .image-display__thumbnail__transform-container__image-container--mask {
                        background-color: transparent;
                        backdrop-filter: blur(0) !important;
                    }
                }

                // 遮罩
                .image-display__thumbnail__transform-container__image-container--mask {
                    width: 100%;
                    height: 100%;
                    position: absolute;
                    transition: all var(--transition-duration-slow);
                    left: 0;
                    top: 0;
                    overflow: hidden;
                    background-color: var(--background-color-black-transparent);
                    backdrop-filter: blur(2px);
                    border-radius: 7px;
                    z-index: 1;
                }

                img {
                    width: 100%;
                    height: 100%;
                    object-fit: scale-down;
                }
            }
        }
    }
}

@media screen and (max-width: 768px) {
    .image-display {

        // 关闭按钮
        .image-display--close {
            width: 30px;
            height: 30px;
        }

        // 左右切换按钮
        .image-display__main--switch {
            display: none;
        }

        // 缩略图
        .image-display__thumbnail {
            height: 80px;
            width: 90%;
        }
    }
}
</style>