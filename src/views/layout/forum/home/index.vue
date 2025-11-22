<template>
    <div class="container forum-home">
        <!-- 选择窗口 -->
        <div class="fh-PaneWrapper">
            <!-- 窗口名称 -->
            <h2 class="pane__intro">分类</h2>

            <!-- 论坛分类 -->
            <ul class="pane__forum-category">
                <!-- 分类选中滑块 -->
                <li id="CategorySlider" class="category__slider" :style="categorySliderStyle"></li>

                <!-- 分类项 -->
                <li class="category__item" :class="{ 'category__item--active': !postParams.category }"
                    @click="updateCurrentCategoryId()">
                    全部
                </li>
                <li class="category__item" :class="{ 'category__item--active': value.id === postParams.category }"
                    @click="updateCurrentCategoryId(value.id)" v-for="value in allCategory" :key="value.id">
                    {{ value.name }}
                </li>
            </ul>
        </div>

        <!-- 主要内容 -->
        <div class="fh-mainWrapper">
            <!-- 骨架屏 -->
            <div class="mw__skeleton-list" v-if="isLoading">
                <el-skeleton :rows="4" animated v-for="num in 10" :key="num" />
            </div>

            <!-- 帖子列表 -->
            <div class="mw__posts-list" v-else>
                <!-- 帖子项 -->
                <div class="mw__post__item" v-for="(value, index) in allPosts.results" :key="value.id">
                    <!-- 帖子信息 -->
                    <div class="pi__info-container">
                        <!-- 作者信息 -->
                        <a class="post__author-info">
                            <!-- 头像 -->
                            <div class="author__img">
                                <img :src="value.author.avatar" alt="">
                            </div>

                            <!-- 名称 -->
                            <div class="author__name">{{ value.author.nickname }}</div>
                        </a>

                        <!-- 帖子标题 -->
                        <router-link class="post__title" :to="`/post/${value.id}`">
                            {{ value.title }}
                        </router-link>

                        <!-- 帖子内容 -->
                        <router-link class="post__content" :to="`/post/${value.id}`">
                            {{ getSummary(value.content) }}
                        </router-link>

                        <!-- 操作 -->
                        <ul class="post__info-tool-box">
                            <!-- 浏览数 -->
                            <li class="box-item">
                                <svg-icons name="eye" :size="15" />
                                <span>阅读</span>
                                <span>{{ value.view_count }}</span>
                            </li>

                            <!-- 点赞 -->
                            <li class="box-item tool-btn__like" :class="{ 'tool-btn__like--active': value.is_liked }"
                                @click="toggleLikePostFun(value.id, index)">
                                <svg-icons class="" name="thumbUpLine" :size="15" />
                                <span>点赞</span>
                                <span>{{ value.like_count }}</span>
                            </li>

                            <!-- 收藏 -->
                            <li class="box-item tool-btn__favorite"
                                :class="{ 'tool-btn__favorite--active': value.is_favorited }"
                                @click="toggleFavoritePostFun(value.id, index)">
                                <svg-icons name="bookmarkLine" :size="15" />
                                <span>收藏</span>
                                <span>{{ value.favorite_count }}</span>
                            </li>

                            <!-- 发布时间 -->
                            <li class="box-item">
                                <svg-icons name="time" :size="15" />
                                <span>发布时间</span>
                                <span>{{ postCreateTime(value.created_at) }}</span>
                            </li>
                        </ul>
                    </div>

                    <!-- 图片 -->
                    <div class="pi__img-wrapper" v-if="getFirstImage(value.content)">
                        <img :src="getFirstImage(value.content)" alt="">
                    </div>
                </div>

                <!-- 到底提示 -->
                <div v-if="allPosts.results.length < 10" class="mw__end">页面已经到尽头，是时候伸个懒腰了~</div>
            </div>

            <!-- 分页 -->
            <div class="mw__pagination-container">
                <el-pagination :current-page="postParams.page || 1" background layout="prev, pager, next"
                    :total="allPosts.count * 1" @current-change="changePage" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue';

import SvgIcons from '@/components/Icons/index.vue';

import { useRoute, useRouter, onBeforeRouteUpdate } from 'vue-router';
onBeforeRouteUpdate((_to, _from, next) => {
    window.scrollTo(0, 0) // 回到顶部
    next()
})
const route = useRoute()
const router = useRouter()

// 引入土司
import { toast } from '@/components/MyToast/toast';

// 格式化时间
import formatDate from '@/utils/formatDate'

// 引入用户信息状态库
import { useUserStore } from '@/stores/user';
const userStore = useUserStore()

// 引入 api
import { getPosts, toggleLikePost, toggleFavoritePost } from '@/api/forum';
import { getForumCategories } from '@/api/admin/admin_forum';
// 获取全部帖子
const getPostsFun = (params?: { category?: number; page?: number; page_size?: number }) => {
    getPosts(params).then((res: any) => {
        console.log(res);
        allPosts.value = res

        isLoading.value = false
    }).catch(err => {
        console.log(err);
    })
}
// 获取论坛分类
const getForumCategoriesFun = () => {
    getForumCategories().then(res => {
        console.log(res);

        allCategory.value = res
    }).catch(err => {
        console.log(err);
    })
}

onMounted(() => {
    getPostsFun(postParams.value)
    getForumCategoriesFun()

    updateCurrentCategoryId(postParams.value.category)
})

// ================ 全局变量 ================

// 分类列表
const allCategory = ref<any>([])

// 全部帖子
const allPosts = ref<any>([])

// 是否加载中
const isLoading = ref(true)

// 帖子参数
const postParams = ref({
    category: Number(route.query.category) || undefined,
    page: Number(route.query.page) || 1 || undefined,
    pagesize: Number(route.query.page_size || 10)
})

// ================ 全局变量 ================

// -------------------- 分类窗口变量 --------------------

// 当前选中分类索引
// const currentCategoryId = ref()

// 分类选中滑块样式
const categorySliderStyle = ref({
    top: '0px',
    height: '0px'
})

// -------------------- 分类窗口变量 --------------------

// ======================================== 分类窗口函数 ========================================

// 监听分类项修改分类滑块位置
watch(() => postParams.value.category, async (newVal) => {
    await nextTick(() => {
        const categoryItems = document.getElementsByClassName('category__item')

        if (categoryItems.length === 0) return

        const index = newVal === 0 ? 0 : Array.from(allCategory.value).findIndex((item: any) => item.id === newVal) + 1

        const currentItem = categoryItems[index] as HTMLElement

        categorySliderStyle.value = {
            top: currentItem.offsetTop + 'px',
            height: currentItem.offsetHeight + 'px',
        }
    })
}, { immediate: true })

// 更新选中分类 id
const updateCurrentCategoryId = (id: number | undefined = undefined) => {
    postParams.value.category = id
    postParams.value.page = undefined

    router.push({
        query: postParams.value
    })
}

// ======================================== 分类窗口函数 ========================================

// ----------------- 帖子列表变量 ------------------

// 发布时间
const postCreateTime = (date: string) => {
    return formatDate(date, 'yyyy-MM-dd HH:mm')
}

// ----------------- 帖子列表变量 ------------------

// ======================================== 帖子列表函数 ========================================

// 获取第一张图片url
function getFirstImage(post: any): string {
    post = post ? JSON.parse(post) : ''

    if (!post || !post.content) return '';

    if (!post.content || !Array.isArray(post.content)) return '';

    // 查找第一个 image 节点
    for (const node of post.content) {
        if (node.type === 'image' && node.attrs?.src) {
            return node.attrs.src;
        }
    }

    return '';
}

// 提取文本内容
function extractText(node: any): string {
    if (!node) return ''
    if (node.type === 'text') return node.text
    if (node.content) return node.content.map(extractText).join('')
    return ''
}

// 获取帖子内容摘要
function getSummary(content: string, length = 100): string {
    try {
        const obj = JSON.parse(content)
        const text = extractText(obj)
        return text.length > length ? text.slice(0, length) + '...' : text
    } catch (e) {
        return ''
    }
}

// 点赞/取消点赞
const toggleLikePostFun = (postId: number, index: number) => {
    if (!userStore.isAuthenticated) {
        toast({ message: '请先登录', type: 'error' })
        return
    }

    toggleLikePost(postId).then((res: any) => {
        allPosts.value.results[index].is_liked = !allPosts.value.results[index].is_liked

        allPosts.value.results[index].like_count = res.like_count

        toast({
            message: allPosts.value.results[index].is_liked ? '点赞成功' : '取消点赞成功',
            type: 'success',
        })
    }).catch(err => {
        console.log(err);
    })
}

// 点赞/取消收藏
const toggleFavoritePostFun = (postId: number, index: number) => {
    if (!userStore.isAuthenticated) {
        toast({ message: '请先登录', type: 'error' })
        return
    }

    toggleFavoritePost(postId).then((res: any) => {
        allPosts.value.results[index].is_favorited = !allPosts.value.results[index].is_favorited

        allPosts.value.results[index].favorite_count = res.favorite_count

        toast({
            message: allPosts.value.results[index].is_favorited ? '收藏成功' : '取消收藏成功',
            type: 'success',
        })
    }).catch(err => {
        console.log(err);
    })
}

// 切换页面
const changePage = (p: number) => {
    isLoading.value = true

    router.push({
        query: {
            page: p
        }
    })
}

// 监听页面改变
watch(() => route.query, (newVal) => {
    postParams.value.page = Number(newVal.page) || 1

    getPostsFun(newVal)
})

// ======================================== 帖子列表函数 ========================================
</script>

<style scoped lang="scss">
ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.forum-home {
    display: flex;
    gap: 20px;

    // 分类选择窗口
    .fh-PaneWrapper {
        position: sticky;
        flex-shrink: 0;
        top: 0;
        width: 260px;
        height: 100vh;
        padding: 0 15px;
        box-sizing: border-box;
        box-shadow: 0 0 10px rgba(72, 72, 72, 0) inset, 0 0 10px var(--background-color-black-transparent);
        transition: all var(--transition-duration-slow);
        border-radius: 6px;

        &:hover {
            box-shadow: 0 0 10px var(--background-color-black-transparent) inset, 0 0 10px rgba(72, 72, 72, 0);
        }

        // 窗口名称
        .pane__intro {
            font-size: 22px;
        }

        // 分类列表
        .pane__forum-category {
            position: relative;
            padding: 0 10px;
            box-sizing: border-box;

            // 装饰滑块
            .category__slider {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                border-right: 4px solid var(--primary-color-100);
                border-left: 4px solid var(--primary-color-100);
                border-radius: 4px;
                box-sizing: border-box;
                pointer-events: none;
                transition: all var(--transition-duration-default);
            }

            // 分类项
            .category__item {
                padding: 12px;
                box-sizing: border-box;
                cursor: pointer;
                border-radius: 5px;
                transition: all var(--transition-duration-default);

                &:hover {
                    background-color: var(--primary-color-300);
                    color: var(--text-color-primary-deep);
                }
            }

            // 选中状态
            .category__item--active {
                background-color: var(--primary-color-400);
                color: var(--text-color-primary-deep);
            }
        }
    }

    // 主要内容展示
    .fh-mainWrapper {
        flex: 1;
        overflow: hidden;

        // 骨架屏
        .mw__skeleton-list {
            display: flex;
            flex-direction: column;
            gap: 30px;
        }

        // 帖子列表
        .mw__posts-list {
            width: 100%;

            // 帖子项
            .mw__post__item {
                display: flex;
                align-items: center;
                gap: 20px;
                width: 100%;
                padding: 22px 0;
                border-bottom: 1px solid var(--border-color-gray-dark);

                // 帖子信息
                .pi__info-container {
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    gap: 8px;


                    // 作者信息
                    .post__author-info {
                        display: flex;
                        gap: 10px;
                        align-items: center;
                        margin-bottom: 4px;

                        &:hover {
                            .author__name {
                                color: var(--text-color-primary-deep);
                                text-decoration: underline;
                            }
                        }

                        // 头像
                        .author__img {
                            width: 28px;
                            height: 28px;
                            overflow: hidden;
                            border-radius: 50%;

                            img {
                                width: 100%;
                                height: 100%;
                                object-fit: cover;
                            }
                        }

                        // 名称
                        .author__name {
                            transition: all var(--transition-duration-default);
                            font-size: 15px;
                            font-weight: bold;
                            color: var(--text-color-gray-dark);
                        }
                    }

                    // 帖子标题
                    .post__title {
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        transition: all var(--transition-duration-default);

                        &:hover {
                            color: var(--text-color-primary-deep);
                            text-decoration: underline;
                        }
                    }

                    // 帖子内容
                    .post__content {
                        font-size: 15px;
                        color: var(--text-color-gray-default);
                    }


                    // 更多内容和操作
                    .post__info-tool-box {
                        display: flex;
                        align-items: center;
                        gap: 20px;
                        margin-top: 6px;

                        // 内容项
                        .box-item {
                            display: flex;
                            font-size: 12px;
                            color: var(--text-color-gray-default);
                            gap: 3px;
                            transition: all var(--transition-duration-default);
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
                }

                // 帖子图片
                .pi__img-wrapper {
                    height: 110px;
                    width: 200px;
                    overflow: hidden;
                    border-radius: 10px;

                    img {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                    }
                }
            }

            // 结束
            .mw__end {
                display: flex;
                align-items: center;
                justify-content: center;
                margin-top: 30px;
            }
        }

        // 分页容器
        .mw__pagination-container {
            width: 100%;
            display: flex;
            justify-content: center;
            margin: 30px 0;
        }
    }
}
</style>