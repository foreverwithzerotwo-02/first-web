<template>
    <!-- 精选展示 -->
    <div class="home__layout-area-container">
        <!-- 左侧最新资讯，图片展示 -->
        <el-carousel height="100%" motion-blur :interval="6000" trigger="click" class="lac__left-wrapper"
            v-if="layoutNewsList">
            <el-carousel-item v-for="value in layoutNewsList.slice(0, 5)" :key="value.id">
                <div class="lac__left-wrapper--container" @click="clickLayoutToNews(value.link)">
                    <!-- 图片内容容器 -->
                    <div class="lac__left-wrapper__img-contaienr">
                        <img :src="value.image_url" alt="">
                    </div>

                    <!-- 文字内容容器 -->
                    <div class="lac__left-wrapper__text-contaienr">
                        <div class="tc__text">{{ value.title }}</div>
                    </div>
                </div>
            </el-carousel-item>
        </el-carousel>

        <!-- 右侧内容展示，文字展示 -->
        <div class="lac__right-wrapper">
            <!-- 最新资讯 -->
            <div class="rw__container">
                <h2 class="rw__container__h2">最新资讯</h2>

                <ul class="rw__container__box" v-if="layoutNewsList">
                    <li class="rw__container__box__item" v-for="value in layoutNewsList.slice(5, 13)" :key="value.id">
                        <a :href="value.link" target="_blank">
                            <svg-icons name="squareFill" :size="12" style="flex-shrink: 0; margin-right: 4px;" />
                            <span>{{ value.title }}</span>
                        </a>
                    </li>
                </ul>
            </div>

            <!-- 最新论坛 -->
            <div class="rw__container">
                <h2 class="rw__container__h2">最新博客</h2>

                <ul class="rw__container__box" v-if="layoutForumList">
                    <li class="rw__container__box__item" v-for="value in layoutForumList" :key="value.id">
                        <router-link :to="`/post/${value.id}`">
                            <svg-icons name="squareFill" :size="12" style="flex-shrink: 0; margin-right: 4px;" />
                            <span>{{ value.title }}</span>
                        </router-link>
                    </li>
                </ul>
            </div>
        </div>
    </div>

    <div class="container home">

        <!-- 资讯头条区域 -->
        <div class="home__news-area-container">
            <!-- 顶部标题区域 -->
            <div class="nac__top-title">
                <span class="tt__h">资讯头条</span>

                <div class="tt__to"><span>更多资讯</span> <svg-icons name="arrowRightLine" :size="24" /></div>
            </div>

            <!-- 内容展示区域 -->
            <div class="nac__content-view-container" v-if="allNewsList && allNewsList.length > 0">
                <!-- 带图展示区域 -->
                <div class="cvc__have-img-show">
                    <!-- 内容项 -->
                    <a class="his__content-item" :href="value.link" target="_blank"
                        v-for="(value, index) in allNewsList?.slice(0, 5)" :key="index">
                        <img :src="value.image_url" alt="">

                        <!-- 底部标题 -->
                        <div class="ci__title-box">
                            {{ value.title }}
                        </div>
                    </a>
                </div>

                <!-- 内容列表 -->
                <div class="cvc__content-list-box">
                    <a class="clb__item" :href="value.link" target="_blank"
                        v-for="(value, index) in allNewsList?.slice(5, 13)" :key="index">
                        <div class="item__icon"><svg-icons name="squareFill" :size="12" /></div>
                        <span class="item__content">{{ value.title }}</span>
                    </a>
                </div>
            </div>

            <el-skeleton style="display: flex; flex-direction: column; gap: 20px;" animated v-else>
                <template #template>
                    <div class="nac__skeleton-img">
                        <el-skeleton-item variant="image" style=" height: 130px" />
                        <el-skeleton-item variant="image" style=" height: 130px" />
                        <el-skeleton-item variant="image" style=" height: 130px" />
                        <el-skeleton-item variant="image" style=" height: 130px" />
                        <el-skeleton-item variant="image" style=" height: 130px" />
                    </div>
                    <div class="nac__skeleton-text">
                        <el-skeleton-item variant="p" />
                        <el-skeleton-item variant="p" />
                        <el-skeleton-item variant="p" />
                        <el-skeleton-item variant="p" />
                        <el-skeleton-item variant="p" />
                        <el-skeleton-item variant="p" />
                        <el-skeleton-item variant="p" />
                        <el-skeleton-item variant="p" />
                    </div>
                </template>
            </el-skeleton>
        </div>

        <!-- 热门课程区域 -->
        <div class="home__courses-area-container">
            <!-- 顶部标题区域 -->
            <div class="cac__top-title">
                <span class="tt__h">热门课程</span>

                <div class="tt__to"><span>更多课程</span> <svg-icons name="arrowRightLine" :size="24" /></div>
            </div>

            <!-- 课程展示列表 -->
            <div class="cac__courses-list-box" v-if="hotCoursesList && hotCoursesList.length > 0">
                <!-- 课程项 -->
                <router-link :to="`study/course-intro/${value.id}/${value.category}`" class="cac__clb__item"
                    v-for="(value, index) in hotCoursesList" :key="value.id">
                    <!-- 课程封面 -->
                    <div class="item__cover">
                        <img :src="value.cover_image" alt="">
                    </div>

                    <!-- 课程标题 -->
                    <div class="item__title">{{ value.title }}</div>

                    <!-- 课程介绍 -->
                    <div class="item__desc">{{ value.description }}</div>

                    <!-- 课程评分 -->
                    <div class="">
                        <el-rate :model-value="Number(value.rating)" disabled show-score class="rate-left-score"
                            text-color="#ff9900" :score-template="'{value} 分' + ` （ ${value.rating_count} 人 ）`" />
                    </div>

                    <!-- 课程标签 -->
                    <div class="item__tag-box">
                        <!-- 精选标签 -->
                        <div class="tb__item curation" v-if="index === 0 || index === 3">
                            <span>精选</span>
                        </div>

                        <!-- 热门标签 -->
                        <div class="tb__item hot">
                            <span>🔥</span><span>热门课程</span>
                        </div>
                    </div>
                </router-link>
            </div>

            <el-skeleton animated class="cac__skeleton-wrapper" v-else>
                <template #template>
                    <div class="" v-for="() in 5">
                        <el-skeleton-item variant="image" style="width: 100%; height: 140px" />
                        <div style="margin-top: 10px; display: flex; flex-direction: column; gap: 10px;">
                            <el-skeleton-item variant="p" style="width: 50%" />
                            <el-skeleton-item variant="p" style="width: 100%" />
                            <el-skeleton-item variant="p" style="width: 100%" />
                            <div style="display: flex;
                                    align-items: center;
                                    justify-items: space-between;
                                ">
                                <el-skeleton-item variant="text" style="margin-right: 16px" />
                                <el-skeleton-item variant="text" style="width: 60%" />
                            </div>
                        </div>
                    </div>
                </template>
            </el-skeleton>
        </div>

        <!-- 精选博客区域 -->
        <div class="home__forum-area-contaienr">
            <!-- 顶部标题区域 -->
            <div class="fac__top-title">
                <span class="tt__h">精选博客</span>

                <div class="tt__to"><span>更多博客</span> <svg-icons name="arrowRightLine" :size="24" /></div>
            </div>

            <!-- 内容列表区域 -->
            <div class="fac__content-list-box" v-infinite-scroll="loadForum"
                :infinite-scroll-disabled="loadForumDisabled">
                <!-- 精选带图区域 -->
                <div class="fac__clb__curation-container">
                    <router-link :to="`/post/${value.id}`" class="fac__clb__cc__item"
                        v-for="value in curationForumList">
                        <img :src="value.image_url" alt="">

                        <!-- 底部标题 -->
                        <div class="ci__title-box">
                            {{ value.title }}
                        </div>
                    </router-link>
                </div>

                <!-- 普通列表 -->
                <div class="fac__clb__item" v-for="(value, index) in allForumList" :key="value.id">
                    <!-- 帖子内容 -->
                    <div class="item__content-box">
                        <!-- 用户信息 -->
                        <div class="cb__user-info">
                            <!-- 用户头像 -->
                            <div class="ui__avatar">
                                <img :src="value.author.avatar" alt="">
                            </div>

                            <!-- 用户名 -->
                            <span class="ui__name">{{ value.author.nickname }}</span>
                        </div>

                        <!-- 帖子内容 -->
                        <router-link :to="`/post/${value.id}`" class="cb__content">
                            <!-- 标题 -->
                            <div class="content__title">{{ value.title }}</div>

                            <!-- 文本内容 -->
                            <div class="content__decraption">{{ getSummary(value.content) }}</div>
                        </router-link>

                        <!-- 操作 -->
                        <ul class="post__info-tool-box">
                            <!-- 浏览数 -->
                            <li class="box-item">
                                <svg-icons name="eye" :size="18" />
                                <span>阅读</span>
                                <span>{{ value.view_count }}</span>
                            </li>

                            <!-- 点赞 -->
                            <li class="box-item tool-btn__like" :class="{ 'tool-btn__like--active': value.is_liked }"
                                @click="toggleLikePostFun(value.id, index)">
                                <svg-icons class="" name="thumbUpLine" :size="18" />
                                <span>点赞</span>
                                <span>{{ value.like_count }}</span>
                            </li>

                            <!-- 收藏 -->
                            <li class="box-item tool-btn__favorite"
                                :class="{ 'tool-btn__favorite--active': value.is_favorited }"
                                @click="toggleFavoritePostFun(value.id, index)">
                                <svg-icons name="bookmarkLine" :size="18" />
                                <span>收藏</span>
                                <span>{{ value.favorite_count }}</span>
                            </li>

                            <!-- 发布时间 -->
                            <li class="box-item">
                                <svg-icons name="time" :size="18" />
                                <span>发布时间</span>
                                <span>{{ postCreateTime(value.created_at) }}</span>
                            </li>
                        </ul>
                    </div>

                    <!-- 封面 -->
                    <div class="item__cover" v-if="getFirstImage(value.content)">
                        <img :src="getFirstImage(value.content)" alt="">
                    </div>
                </div>

                <!-- 加载缓冲 -->
                <div class="fac__clb__item--load" v-if="isForumItemLoad">
                    <span>加载中</span>
                    <svg-icons name="loader2Line" :size="22" class="fac__clb__item--load-svg" />
                </div>

                <!-- 加载完提示 -->
                <div class="fac__clb__item--end" v-if="loadForumDisabled">
                    <span class="fac__clb__item--end-a">前往论坛，欣赏更多有趣的内容吧ヾ(≧▽≦*)o</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts" name="home">
import { onMounted, ref, computed } from 'vue';

import SvgIcons from '@/components/Icons/index.vue'

// 引入土司
import { toast } from '@/components/MyToast/toast';

// 格式化时间
import formatDate from '@/utils/formatDate'

// 引入用户信息状态库
import { useUserStore } from '@/stores/user';
const userStore = useUserStore()

// 资讯api
import { getNewsList } from '@/api/new';
// 获取资讯列表
const getNewsListFun = () => {
    getNewsList({ limit: 13 }).then(res => {
        allNewsList.value = res
    })
}

// 课程api
import { fetchCoursesByIds } from '@/api/learning';
const fetchCoursesByIdsFun = () => {
    fetchCoursesByIds([4, 5, 6, 7, 8]).then(res => {
        console.log(res);
        hotCoursesList.value = res
    })
}

// 论坛博客api
import { getPosts, toggleLikePost, toggleFavoritePost } from '@/api/forum';
const getPostsFun = (page?: number, page_size?: number) => {
    getPosts({ page, page_size }).then((res: any) => {
        allForumList.value = res.results

        // 抽取带图展示
        for (let i = 0; i < res.results.length && curationForumList.value.length < 5; i++) {
            const image_forum = getFirstImage(allForumList.value[i].content)

            if (!image_forum) break

            allForumList.value[i].image_url = image_forum

            curationForumList.value.push(allForumList.value[i])


            allForumList.value.splice(i, 1)

            i--
        }
    })
}

onMounted(() => {
    getNewsListFun()
    fetchCoursesByIdsFun()
    getPostsFun(1, 11)
    // 获取最新资讯
    getLayoutNewsList()
    // 获取最新博客
    getLayoutForumList()
})

// ------------------ 精选展示 变量 --------------------

// 存放最新资讯列表
const layoutNewsList = ref()

// 存放最新博客
const layoutForumList = ref()

// ------------------ 精选展示 变量 --------------------

// ====================================== 精选展示 函数 ============================================

// 点击跳转资讯
const clickLayoutToNews = (to: string) => {
    window.open(to)
}

// 获取最新资讯列表
const getLayoutNewsList = () => {
    getNewsList({ limit: 13 }).then((res: any) => {
        layoutNewsList.value = res
    })
}

// 获取最新博客列表
const getLayoutForumList = () => {
    getPosts({ page_size: 8 }).then((res: any) => {
        layoutForumList.value = res.results
    })
}

// ====================================== 精选展示 函数 ============================================

// ------------------ 资讯头条 变量 --------------------

// 资讯头条
const allNewsList = ref()

// ------------------ 资讯头条 变量 --------------------


// ------------------- 热门课程 变量 ---------------------

// 存放热门课程
const hotCoursesList = ref()

// ------------------- 热门课程 变量 ---------------------


// -------------------- 精选博客 变量 -----------------------

// 存放博客内容
const allForumList = ref()

// 带图片的精选展示
const curationForumList = ref<Array<any>>([])

// 当前页码
const forumPage = ref(1)

// 每次加载获取几页
const forumPageSize = ref(7)

// 是否在加载
const isForumItemLoad = ref(false)

// -------------------- 精选博客 变量 -----------------------

// ===================================== 精选博客 函数 ===========================================

// 加载获取博客函数
const loadForum = () => {
    if (isForumItemLoad.value) return

    // 正在加载
    isForumItemLoad.value = true

    // 获取博客
    getPosts({ page: forumPage.value, page_size: forumPageSize.value }).then((res: any) => {
        allForumList.value.push(...res.results)

        // 新增页
        forumPage.value++

        isForumItemLoad.value = false
    }).catch(err => {
        console.log(err);
        isForumItemLoad.value = false
    })
}

// 检测是否超出获取上限
const loadForumNoMore = computed(() => forumPage.value >= 3)

// 判断是否禁用加载
const loadForumDisabled = computed(() => loadForumNoMore.value)

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
function getSummary(content: string, length = 130): string {
    try {
        const obj = JSON.parse(content)
        const text = extractText(obj)
        return text.length > length ? text.slice(0, length) + '...' : text
    } catch (e) {
        return ''
    }
}

// 发布时间
const postCreateTime = (date: string) => {
    return formatDate(date, 'yyyy-MM-dd HH:mm')
}

// 点赞/取消点赞
const toggleLikePostFun = (postId: number, index: number) => {
    if (!userStore.isAuthenticated) {
        toast({ message: '请先登录', type: 'error' })
        return
    }

    toggleLikePost(postId).then((res: any) => {
        allForumList.value[index].is_liked = !allForumList.value[index].is_liked

        allForumList.value[index].like_count = res.like_count

        toast({
            message: allForumList.value[index].is_liked ? '点赞成功' : '取消点赞成功',
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
        allForumList.value[index].is_favorited = !allForumList.value[index].is_favorited

        allForumList.value[index].favorite_count = res.favorite_count

        toast({
            message: allForumList.value[index].is_favorited ? '收藏成功' : '取消收藏成功',
            type: 'success',
        })
    }).catch(err => {
        console.log(err);
    })
}

// ===================================== 精选博客 函数 ===========================================
</script>

<style scoped lang="scss">
ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

// 精选内容展示
.home__layout-area-container {
    width: 100%;
    background-color: var(--background-color-white-opposite);
    height: 460px;
    margin-bottom: 50px;
    display: flex;
    box-sizing: border-box;
    padding: 15px 70px;
    gap: 30px;

    // 左侧图片资讯容器
    .lac__left-wrapper {
        position: relative;
        height: 100%;
        flex: 1;
        min-width: 400px;
        cursor: pointer;
        overflow: hidden;
        flex-shrink: 0;

        &:hover {
            .lac__left-wrapper--container {
                .lac__left-wrapper__img-contaienr {
                    &::after {
                        opacity: 1;
                    }
                }
            }

            img {
                transform: scale(1.1);
            }
        }

        .lac__left-wrapper--container {
            width: 100%;
            height: 100%;
            position: relative;
            display: flex;
            flex-direction: column;

            // 图片内容容器
            .lac__left-wrapper__img-contaienr {
                position: relative;
                flex: 1;
                width: 100%;
                overflow: hidden;

                &::after {
                    content: '';
                    opacity: 0;
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    left: 0;
                    top: 0;
                    z-index: 1;
                    background-color: var(--background-color-black-transparent);
                    transition: all var(--transition-duration-default);
                }

                img {
                    width: 100%;
                    height: 100%;
                    transition: all var(--transition-duration-default);
                }
            }

            // 文字内容
            .lac__left-wrapper__text-contaienr {
                width: 100%;
                height: 60px;
                box-sizing: border-box;
                transition: all var(--transition-duration-default);
                overflow: hidden;
                flex-shrink: 0;
                padding: 8px 0;
                box-sizing: border-box;
                overflow: hidden;

                // 文字
                .tc__text {
                    margin: 0;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 1;
                    line-clamp: 1;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    font-size: 16px;
                    color: var(--text-color-white-light);
                    transition: all var(--transition-duration-default);
                }
            }
        }
    }

    // 右侧文字列表
    .lac__right-wrapper {
        display: flex;
        height: 100%;
        min-width: 400px;
        max-width: 1000px;
        width: 650px;
        gap: 30px;
        overflow: hidden;

        // 最新内容容器
        .rw__container {
            display: flex;
            flex-direction: column;
            color: white;
            gap: 15px;
            width: 50%;

            .rw__container__h2 {
                font-size: 18px;
                margin: 0;
            }

            .rw__container__box {
                width: 100%;
                font-size: 15px;
                flex-shrink: 0;
                display: flex;
                flex-direction: column;
                gap: 15px;
                flex: 1;

                .rw__container__box__item {
                    flex: 1;
                    width: 100%;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 1;
                    line-clamp: 1;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    cursor: pointer;
                    transition: all var(--transition-duration-default);

                    &:hover {
                        color: var(--text-color-primary-light-more);
                    }
                }
            }
        }
    }
}

.home {

    // 资讯头条区域
    .home__news-area-container {
        width: 100%;

        // 顶部标题
        .nac__top-title {
            display: flex;
            margin-bottom: 20px;
            justify-content: space-between;
            align-items: center;

            // 标题
            .tt__h {
                font-size: 22px;
                font-weight: bold;
            }

            .tt__to {
                display: flex;
                align-items: center;
                font-size: 15px;
                color: var(--text-color-gray-default);
                transition: all var(--transition-duration-default);
                cursor: pointer;

                &:hover {
                    color: var(--text-color-primary-deep);
                }
            }
        }

        // 内容展示区域
        .nac__content-view-container {

            // 带图展示区域
            .cvc__have-img-show {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
                gap: 20px;

                // 内容项
                .his__content-item {
                    border-radius: 10px;
                    overflow: hidden;
                    position: relative;
                    height: 130px;
                    cursor: pointer;

                    &:hover {
                        img {
                            transform: scale(1.3);
                        }

                        .ci__title-box {
                            color: var(--text-color-primary-light-more);
                        }
                    }

                    img {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                        transition: all var(--transition-duration-default);
                    }

                    // 底部标题
                    .ci__title-box {
                        box-sizing: border-box;
                        padding: 6px 8px 3px;
                        position: absolute;
                        width: 100%;
                        -webkit-box-orient: vertical;
                        transition: all var(--transition-duration-default);
                        /* 垂直排列子元素 */
                        font-size: 15px;
                        bottom: 0;
                        left: 0;
                        color: var(--text-color-white-light);
                        background-image: linear-gradient(180deg, rgba(0, 0, 0, 0), rgb(0, 0, 0));
                        display: -webkit-box;
                        -webkit-line-clamp: 2;
                        line-clamp: 2;
                        line-height: 20px;
                        font-weight: bold;
                        /* 限制显示的行数，这里是 2 行 */
                        overflow: hidden;
                        /* 超出隐藏 */
                        text-overflow: ellipsis;
                        /* 省略号 */
                    }
                }
            }

            // 内容列表
            .cvc__content-list-box {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 20px;
                margin-top: 25px;

                .clb__item {
                    flex: 1;
                    box-sizing: border-box;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: flex;
                    gap: 10px;
                    align-items: center;
                    transition: all var(--transition-duration-default);
                    cursor: pointer;

                    &:hover {
                        color: var(--text-color-primary-deep);

                        .item__icon {
                            color: var(--text-color-primary-deep);
                        }
                    }

                    .item__icon {
                        flex-shrink: 0;
                        color: var(--text-color-gray-light);
                        transition: all var(--transition-duration-default);
                    }

                    .item__content {
                        flex: 1;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }
                }
            }
        }

        // 骨架屏
        .nac__skeleton-img {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
            gap: 20px;
        }

        // 骨架屏内容
        .nac__skeleton-text {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
        }
    }

    // 热门课程区域
    .home__courses-area-container {
        width: 100%;
        margin-top: 60px;

        // 标题区域
        .cac__top-title {
            display: flex;
            margin-bottom: 20px;
            justify-content: space-between;
            align-items: center;

            // 标题
            .tt__h {
                font-size: 22px;
                font-weight: bold;
            }

            .tt__to {
                display: flex;
                align-items: center;
                font-size: 15px;
                color: var(--text-color-gray-default);
                transition: all var(--transition-duration-default);
                cursor: pointer;

                &:hover {
                    color: var(--text-color-primary-deep);
                }
            }
        }

        // 展示区域
        .cac__courses-list-box {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
            gap: 20px;

            // 课程项
            .cac__clb__item {
                display: flex;
                flex-direction: column;
                gap: 6px;
                cursor: pointer;

                &:hover {
                    .item__title {
                        color: var(--text-color-primary-deep);
                    }

                    .item__cover {
                        img {
                            transform: scale(1.2);
                        }
                    }

                    .item__desc {
                        color: var(--text-color-primary-deep);
                        text-decoration: underline;
                    }
                }

                // 课程封面
                .item__cover {
                    width: 100%;
                    height: 140px;
                    border-radius: 10px;
                    overflow: hidden;

                    img {
                        transition: all var(--transition-duration-default);
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                    }
                }

                // 课程标题
                .item__title {
                    transition: all var(--transition-duration-default);
                    font-size: 18px;
                    font-weight: bold;
                }

                // 课程简介
                .item__desc {
                    transition: all var(--transition-duration-default);
                    font-size: 15px;
                    color: var(--text-color-gray-default);
                    max-height: 40px; // 固定两行高度
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 2; // 显示两行
                    line-clamp: 2;
                    -webkit-box-orient: vertical;
                    // 确保整行高度被裁剪
                    line-height: 1.4em;
                }

                // 课程标签
                .item__tag-box {
                    display: flex;
                    gap: 10px;

                    .tb__item {
                        margin: 3px 0;
                        padding: 6px 10px;
                        display: flex;
                        gap: 3px;
                        font-size: 13px;
                        border-radius: 6px;

                        &.hot {
                            color: rgb(253, 181, 181);
                            background-color: #98120d;
                        }

                        &.curation {
                            color: rgb(181, 253, 246);
                            background-color: #17ada6;
                        }
                    }
                }
            }
        }

        // 骨架屏
        .cac__skeleton-wrapper {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
            gap: 20px;
        }
    }

    // 精选博客区域
    .home__forum-area-contaienr {
        width: 100%;
        margin-top: 60px;

        // 顶部标题区域
        .fac__top-title {
            display: flex;
            margin-bottom: 20px;
            justify-content: space-between;
            align-items: center;
            display: flex;
            margin-bottom: 20px;
            justify-content: space-between;
            align-items: center;

            // 标题
            .tt__h {
                font-size: 22px;
                font-weight: bold;
            }

            .tt__to {
                display: flex;
                align-items: center;
                font-size: 15px;
                color: var(--text-color-gray-default);
                transition: all var(--transition-duration-default);
                cursor: pointer;

                &:hover {
                    color: var(--text-color-primary-deep);
                }
            }
        }

        // 内容列表区域
        .fac__content-list-box {
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 23px;

            // 精选带图区域
            .fac__clb__curation-container {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
                gap: 20px;

                // 每项
                .fac__clb__cc__item {
                    border-radius: 10px;
                    overflow: hidden;
                    position: relative;
                    height: 130px;
                    cursor: pointer;

                    &:hover {
                        img {
                            transform: scale(1.3);
                        }

                        .ci__title-box {
                            color: var(--text-color-primary-light-more);
                        }
                    }

                    img {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                        transition: all var(--transition-duration-default);
                    }

                    // 底部标题
                    .ci__title-box {
                        box-sizing: border-box;
                        padding: 6px 8px 3px;
                        position: absolute;
                        width: 100%;
                        -webkit-box-orient: vertical;
                        transition: all var(--transition-duration-default);
                        /* 垂直排列子元素 */
                        font-size: 15px;
                        bottom: 0;
                        left: 0;
                        color: var(--text-color-white-light);
                        background-image: linear-gradient(180deg, rgba(0, 0, 0, 0), rgb(0, 0, 0));
                        display: -webkit-box;
                        -webkit-line-clamp: 2;
                        line-clamp: 2;
                        line-height: 20px;
                        font-weight: bold;
                        /* 限制显示的行数，这里是 2 行 */
                        overflow: hidden;
                        /* 超出隐藏 */
                        text-overflow: ellipsis;
                        /* 省略号 */
                    }
                }
            }

            // 帖子内容项
            .fac__clb__item {
                display: flex;
                align-items: center;
                gap: 20px;

                &:not(:last-of-type) {
                    border-bottom: 1px solid var(--border-color-gray-dark);
                    padding-bottom: 15px;
                }

                // 帖子内容
                .item__content-box {
                    display: flex;
                    flex-direction: column;

                    // 用户信息
                    .cb__user-info {
                        display: flex;
                        align-items: center;
                        gap: 10px;

                        // 用户头像
                        .ui__avatar {
                            width: 30px;
                            height: 30px;
                            overflow: hidden;
                            border-radius: 50%;

                            img {
                                width: 100%;
                                height: 100%;
                                object-fit: cover;
                            }
                        }

                        // 用户名
                        .ui__name {
                            font-size: 15px;
                            font-weight: bold;
                            transition: all var(--transition-duration-default);
                            cursor: pointer;

                            &:hover {
                                color: var(--text-color-primary-deep);
                                text-decoration: underline;
                            }
                        }
                    }

                    // 帖子内容
                    .cb__content {
                        display: flex;
                        flex-direction: column;
                        gap: 5px;
                        margin: 10px 0;

                        // 帖子标题
                        .content__title {
                            font-size: 18px;
                            transition: all var(--transition-duration-default);
                            cursor: pointer;

                            &:hover {
                                color: var(--text-color-primary-deep);
                            }
                        }

                        // 帖子详情
                        .content__decraption {
                            font-size: 15px;
                            color: var(--text-color-gray-default);
                            transition: all var(--transition-duration-default);
                            cursor: pointer;

                            &:hover {
                                color: var(--text-color-primary-deep);
                                text-decoration: underline;
                            }
                        }
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
                            font-size: 15px;
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

                // 封面
                .item__cover {
                    height: 120px;
                    width: 220px;
                    border-radius: 10px;
                    overflow: hidden;
                    flex-shrink: 0;

                    img {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                    }
                }
            }

            // 帖子加载缓冲
            .fac__clb__item--load {
                display: flex;
                align-items: center;
                justify-content: center;
                padding-bottom: 20px;
                width: 100%;
                color: var(--text-color-gray-default);
                gap: 6px;

                // 加载图标
                .fac__clb__item--load-svg {
                    animation: loadSvg 3s linear infinite;

                    @keyframes loadSvg {
                        100% {
                            transform: rotate(360deg);
                        }
                    }
                }
            }

            // 加载完提示
            .fac__clb__item--end {
                display: flex;
                align-items: center;
                justify-content: center;
                height: 50px;
                width: 100%;
                padding-bottom: 20px;
                color: var(--text-color-gray-default);

                // 跳转标签
                .fac__clb__item--end-a {
                    text-decoration: underline;
                    cursor: pointer;
                    transition: all var(--transition-duration-default);

                    &:hover {
                        color: var(--text-color-primary-deep);
                    }
                }
            }
        }
    }
}
</style>