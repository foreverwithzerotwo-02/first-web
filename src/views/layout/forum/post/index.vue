<template>
    <div class="container post-view-wrapper">
        <!-- 帖子内容 -->
        <div class="pvw__main-content">
            <!-- 帖子标题 -->
            <h1>{{ currentPostDetail?.title }}</h1>

            <!-- 作者信息 -->
            <div class="mc__author-info-container">
                <!-- 装饰灯条上 -->
                <div class="aic__glow-line top"></div>
                <div class="aic__glow-line bottom"></div>

                <!-- 头像 -->
                <div class="aic__avatar">
                    <img :src="currentPostDetail?.author?.avatar || ''" alt="">
                </div>

                <!-- 详细信息 -->
                <div class="aic__detail-wrapper">
                    <!-- 顶部内容 -->
                    <div class="dw__top-content">
                        <!-- 用户名称 -->
                        <span class="tc__author-name">{{ currentPostDetail?.author?.nickname || '匿名用户' }}</span>

                        <!-- 帖子点赞等信息 -->
                        <ul class="tc__box-container">
                            <!-- 浏览数 -->
                            <li class="box-item">
                                <svg-icons name="eye" :size="15" />
                                <span>阅读</span>
                                <span>{{ currentPostDetail?.view_count }}</span>
                            </li>

                            <!-- 点赞 -->
                            <li class="box-item tool-btn__like"
                                :class="{ 'tool-btn__like--active': currentPostDetail?.is_liked }"
                                @click="toggleLikePostFun(currentPostDetail?.id)">
                                <svg-icons class="" name="thumbUpLine" :size="15" />
                                <span>点赞</span>
                                <span>{{ currentPostDetail?.like_count }}</span>
                            </li>

                            <!-- 收藏 -->
                            <li class="box-item tool-btn__favorite"
                                :class="{ 'tool-btn__favorite--active': currentPostDetail?.is_favorited }"
                                @click="toggleFavoritePostFun(currentPostDetail?.id)">
                                <svg-icons name="bookmarkLine" :size="15" />
                                <span>收藏</span>
                                <span>{{ currentPostDetail?.favorite_count }}</span>
                            </li>

                            <!-- 发布时间 -->
                            <li class="box-item">
                                <svg-icons name="time" :size="15" />
                                <span>发布时间</span>
                                <span>{{ postCreateTime(currentPostDetail?.created_at) }}</span>
                            </li>
                        </ul>
                    </div>

                    <!-- 底部内容 -->
                    <div class="dw__bottom-content">
                        <!-- 所属分类 -->
                        <div class="tc__category-box">
                            <span>分类专栏：</span>
                            <span class="category-text">{{ currentPostDetail?.category_name }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <my-editor v-model="editorContent" :editable="false" @update:toc="getEditorToc"></my-editor>

            <!-- 用户信息小标签 -->
            <div class="mc__author-little-bubble">
                <!-- 作者信息 -->
                <div class="alb__author-info">
                    <!-- 头像 -->
                    <div class="ai__avatar">
                        <img :src="currentPostDetail?.author?.avatar || ''" alt="">
                    </div>

                    <!-- 作者 -->
                    <div class="ai__name">
                        <span>{{ currentPostDetail?.author.nickname || '匿名用户' }}</span>

                        <!-- 关注按钮 -->
                        <div class="name-btn">
                            <svg-icons name="heartAddLine" :size="18" />
                            <span>关注</span>
                        </div>
                    </div>
                </div>

                <!-- 功能 -->
                <ul class="tc__box-container">
                    <!-- 浏览数 -->
                    <li class="box-item">
                        <svg-icons name="eye" :size="17" />
                        <span>阅读</span>
                        <span>{{ currentPostDetail?.view_count }}</span>
                    </li>

                    <!-- 点赞 -->
                    <li class="box-item tool-btn__like"
                        :class="{ 'tool-btn__like--active': currentPostDetail?.is_liked }"
                        @click="toggleLikePostFun(currentPostDetail?.id)">
                        <svg-icons class="" name="thumbUpLine" :size="17" />
                        <span>点赞</span>
                        <span>{{ currentPostDetail?.like_count }}</span>
                    </li>

                    <!-- 收藏 -->
                    <li class="box-item tool-btn__favorite"
                        :class="{ 'tool-btn__favorite--active': currentPostDetail?.is_favorited }"
                        @click="toggleFavoritePostFun(currentPostDetail?.id)">
                        <svg-icons name="bookmarkLine" :size="17" />
                        <span>收藏</span>
                        <span>{{ currentPostDetail?.favorite_count }}</span>
                    </li>

                    <!-- 发布时间 -->
                    <li class="box-item">
                        <svg-icons name="time" :size="17" />
                        <span>发布时间</span>
                        <span>{{ postCreateTime(currentPostDetail?.created_at) }}</span>
                    </li>
                </ul>
            </div>

            <!-- 评论区 -->
            <comment v-if="currentPostDetail?.id" :post-id="currentPostDetail?.id"></comment>
        </div>

        <!-- 右侧导航目录 -->
        <div class="pvw__navigation-toc">
            <!-- 标题 -->
            <h2 class="nt-title">目录</h2>

            <toc :toc="editorToc"></toc>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';

import SvgIcons from '@/components/Icons/index.vue';

import Comment from './components/comment.vue';

// 引入用户信息状态库
import { useUserStore } from '@/stores/user';
const userStore = useUserStore()

// 引入土司
import { toast } from '@/components/MyToast/toast';

// 格式化时间
import formatDate from '@/utils/formatDate'

import MyEditor from '@/components/MyEditor/index.vue'
import Toc from '@/components/Toc/index.vue'

const props = defineProps<{
    id: string
}>()

import { getPostDetail, toggleLikePost, toggleFavoritePost } from '@/api/forum';
// 获取单帖详情
const getPostDetailFun = () => {
    getPostDetail(props.id).then(res => {
        console.log(res);

        currentPostDetail.value = res
    }).catch(err => {
        console.log(err);
    })
}

onMounted(() => {
    getPostDetailFun()
})

watch(
    () => props.id,   // 整个 url 变化时触发
    () => {
        location.reload() // 强制刷新页面
    }
)

// ========================================= 全局变量 =========================================

// 帖子详情
const currentPostDetail = ref()

// 帖子富文本
const editorContent = computed(() => {
    return currentPostDetail.value ? JSON.parse(currentPostDetail.value.content) : ''
})

// ========================================= 全局变量 =========================================

// ----------------- 左侧主要内容变量 ------------------
// ----------------- 左侧主要内容变量 ------------------

// ============================================== 左侧主要内容函数 ==============================================

// 发布时间
const postCreateTime = (date: string) => {
    return formatDate(date, 'yyyy-MM-dd HH:mm')
}

// 点赞/取消点赞
const toggleLikePostFun = (postId: number) => {
    if (!userStore.isAuthenticated) {
        toast({ message: '请先登录', type: 'error' })
        return
    }

    toggleLikePost(postId).then((res: any) => {
        currentPostDetail.value.is_liked = !currentPostDetail.value.is_liked

        currentPostDetail.value.like_count = res.like_count

        toast({
            message: currentPostDetail.value.is_liked ? '点赞成功' : '取消点赞成功',
            type: 'success',
        })
    }).catch(err => {
        console.log(err);
    })
}

// 点赞/取消收藏
const toggleFavoritePostFun = (postId: number) => {
    if (!userStore.isAuthenticated) {
        toast({ message: '请先登录', type: 'error' })
        return
    }

    toggleFavoritePost(postId).then((res: any) => {
        currentPostDetail.value.is_favorited = !currentPostDetail.value.is_favorited

        currentPostDetail.value.favorite_count = res.favorite_count

        toast({
            message: currentPostDetail.value.is_favorited ? '收藏成功' : '取消收藏成功',
            type: 'success',
        })
    }).catch(err => {
        console.log(err);
    })
}

// ============================================== 左侧主要内容函数 ==============================================

// ------------------ 右侧目录变量 ------------------

// 编辑器目录
const editorToc = ref([])

// ------------------ 右侧目录变量 ------------------

// ================================================= 右侧目录函数 =================================================

// 获取编辑器目录
const getEditorToc = (value: []) => {
    editorToc.value = value
}

// ================================================= 右侧目录函数 =================================================
</script>

<style scoped lang="scss">
ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.post-view-wrapper {
    display: flex;
    gap: 20px;

    // 帖子内容
    .pvw__main-content {
        flex: 1;
        display: flex;
        flex-direction: column;

        // 点赞等
        .tc__box-container {
            display: flex;
            align-items: center;
            gap: 20px;

            // 内容项
            .box-item {
                display: flex;
                font-size: 12px;
                color: var(--text-color-gray-default);
                gap: 3px;

            }

            .tool-btn__favorite {
                cursor: pointer;

                &:hover {
                    color: rgb(213, 163, 25);
                    text-decoration: underline;
                }
            }

            .tool-btn__like {
                cursor: pointer;

                &:hover {
                    color: var(--text-color-primary-deep);
                    text-decoration: underline;
                }
            }

            // 选中状态
            .tool-btn__like--active {
                cursor: pointer;

                &:hover {
                    color: var(--text-color-primary-deep);
                    text-decoration: underline;
                }

                color: var(--text-color-primary-deep);
            }

            .tool-btn__favorite--active {
                cursor: pointer;

                &:hover {
                    color: var(--text-color-primary-deep);
                    text-decoration: underline;
                }

                color: rgb(213, 163, 25);
            }
        }

        // 作者信息
        .mc__author-info-container {
            position: relative;
            display: flex;
            align-items: center;
            gap: 23px;
            margin: 30px 0;
            padding: 30px;
            border-radius: 10px;
            background-color: var(--primary-color-500);

            .aic__glow-line {
                position: absolute;
                left: 0;
                width: 100%;
                height: 2px;
                opacity: .5;
                border-radius: 6px;
                background: linear-gradient(90deg, #ff6b6b, #ffd86b, #6be3ff, #9b6bff);
                background-size: 300% 100%;
                animation: glow-move 4s linear infinite;
                box-shadow: 0 0 12px rgba(155, 107, 255, 0.25), 0 0 20px rgba(107, 227, 255, 0.12);

                &.top {
                    top: 0;
                    transform: translateY(-15px);
                }

                &.bottom {
                    bottom: 0;
                    transform: translateY(15px);
                }
            }

            /* 在底下做一层更柔和的光晕（可选） */
            .aic__glow-line::after {
                content: "";
                position: absolute;
                inset: -6px 0 -6px 0;
                border-radius: 8px;
                filter: blur(12px);
                opacity: .6;
                background: inherit;
                z-index: -1;
                background-size: inherit;
                animation: glow-move 4s linear infinite;
            }

            @keyframes glow-move {
                0% {
                    background-position: 0% 50%;
                }

                100% {
                    background-position: 300% 50%;
                }
            }

            // 头像
            .aic__avatar {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                overflow: hidden;

                img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
            }

            // 详细内容
            .aic__detail-wrapper {
                flex: 1;
                display: flex;
                flex-direction: column;
                gap: 6px;

                // 顶部内容
                .dw__top-content {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                    height: 30px;

                    // 用户名称
                    .tc__author-name {
                        font-size: 14px;
                        font-weight: bold;
                    }
                }

                // 底部内容
                .dw__bottom-content {
                    display: flex;

                    // 分类
                    .tc__category-box {
                        font-size: 14px;

                        // 分类盒
                        .category-text {
                            font-size: 12px;
                            background-color: var(--primary-color-400);
                            border: 1px solid var(--primary-color-200);
                            border-radius: 2px;
                            padding: 3px 10px;
                            color: var(--text-color-primary-deep);
                            margin-left: 4px;
                        }
                    }
                }
            }
        }

        // 用户信息小气泡
        .mc__author-little-bubble {
            width: 100%;
            margin: 20px 0;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px 30px;
            background-color: var(--background-color-gray-light-more);
            border-radius: 10px;
            box-sizing: border-box;

            .box-item {
                font-size: 14px !important;
            }

            // 作者信息
            .alb__author-info {
                display: flex;
                align-items: center;
                font-size: 15px;
                gap: 15px;

                // 头像
                .ai__avatar {
                    width: 35px;
                    height: 35px;
                    overflow: hidden;
                    border-radius: 50%;

                    img {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                    }
                }

                // 作者名
                .ai__name {
                    display: flex;
                    align-items: center;
                    gap: 5px;

                    // 按钮
                    .name-btn {
                        cursor: pointer;
                        display: flex;
                        gap: 5px;
                        padding: 8px 12px;
                        border-radius: 15px;
                        background-color: var(--primary-color-400);
                        border: 1px solid var(--primary-color-200);
                        transition: all var(--transition-duration-default);

                        &:hover {
                            transform: scale(1.05);
                            color: var(--text-color-primary-deep);
                            background-color: var(--primary-color-300);
                        }
                    }
                }
            }
        }
    }

    // 右侧导航目录
    .pvw__navigation-toc {
        position: sticky;
        top: 0;
        width: 240px;
        max-height: 100vh;
        flex-shrink: 0;
        font-size: 20px;
        padding: 20px 0;
        box-sizing: border-box;

        // 标题
        .nt-title {
            font-size: 20px;
            margin: 8px 0;
        }
    }
}
</style>