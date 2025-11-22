<template>
    <header class="navgation-bar">
        <!-- 左侧 -->
        <div class="navgation-bar__item">
            <router-link to="/study">学习</router-link>
            <router-link to="/forum">论坛</router-link>
        </div>
        <!-- 右侧 -->
        <ul class="navgation-bar__item">
            <!-- 用户信息 -->
            <li class="user-info" v-if="store.isAuthenticated" @mouseenter="showUserInfoDropdown = true"
                @mouseleave="showUserInfoDropdown = false">
                <!-- 详细内容容器 -->
                <transition name="fade-slide">
                    <div v-if="showUserInfoDropdown" class="info-warpper">
                        <div class="info-content">
                            <!-- 用户中心 -->
                            <div class="single-item" @click="goToUser">
                                <div class="single-text">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                        <path
                                            d="M4 22C4 17.5817 7.58172 14 12 14C16.4183 14 20 17.5817 20 22H18C18 18.6863 15.3137 16 12 16C8.68629 16 6 18.6863 6 22H4ZM12 13C8.685 13 6 10.315 6 7C6 3.685 8.685 1 12 1C15.315 1 18 3.685 18 7C18 10.315 15.315 13 12 13ZM12 11C14.21 11 16 9.21 16 7C16 4.79 14.21 3 12 3C9.79 3 8 4.79 8 7C8 9.21 9.79 11 12 11Z">
                                        </path>
                                    </svg>
                                    <span>用户中心</span>
                                </div>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                    <path
                                        d="M13.1717 12.0007L8.22192 7.05093L9.63614 5.63672L16.0001 12.0007L9.63614 18.3646L8.22192 16.9504L13.1717 12.0007Z">
                                    </path>
                                </svg>
                            </div>

                            <!-- 退出登录 -->
                            <div class="single-item" @click="clickLogout">
                                <div class="single-text">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                        <path
                                            d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C15.2713 2 18.1757 3.57078 20.0002 5.99923L17.2909 5.99931C15.8807 4.75499 14.0285 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C14.029 20 15.8816 19.2446 17.2919 17.9998L20.0009 17.9998C18.1765 20.4288 15.2717 22 12 22ZM19 16V13H11V11H19V8L24 12L19 16Z">
                                        </path>
                                    </svg>
                                    <span>退出登录</span>
                                </div>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                    <path
                                        d="M13.1717 12.0007L8.22192 7.05093L9.63614 5.63672L16.0001 12.0007L9.63614 18.3646L8.22192 16.9504L13.1717 12.0007Z">
                                    </path>
                                </svg>
                            </div>
                        </div>
                    </div>
                </transition>

                <!-- 头像 -->
                <div class="user-avatar">
                    <img :src="store?.info?.avatar || ''" alt="">
                </div>

                <!-- 用户名 -->
                <div class="user-name">
                    {{ store?.info?.username || '' }}
                </div>
            </li>
            <!-- 登录 -->
            <li class="login-btn" @click="authStore.openLogin" v-else>登录</li>

            <!-- 博客 -->
            <li class="popover-wrap" @mouseenter="enterShowPopover('forum')" @mouseleave="leaveHidePopover('forum')">
                <!-- 弹窗 -->
                <popover :isLogin="store.isAuthenticated" :isShow="isShowForum" class="popover">
                    <div class="popover-container">
                        <!-- 标题 -->
                        <h2 class="popover-title">个人博客</h2>

                        <!-- 个人帖子 -->
                        <ul class="user-posts-list-box" v-if="allUserPosts?.length > 0">
                            <li class="uplb__item" v-for="value in allUserPosts" :key="value.id">
                                <!-- 用户头像 -->
                                <div class="ituplb__item__avatar">
                                    <img :src="value.author_avatar || ''" alt="">
                                </div>

                                <!-- 帖子内容 -->
                                <div class="ituplb__item__info-container">
                                    <!-- 用户名 -->
                                    <div class="info__name">{{ value.author_nickname }}</div>

                                    <!-- 帖子状态 -->
                                    <div class="info__state">
                                        <span>{{ postCreateTime(value.created_at) }}</span>
                                        <span>•</span>
                                        <span>已发布</span>
                                    </div>

                                    <!-- 帖子内容 -->
                                    <div class="info__content" @click="goToPost(value.id)">
                                        <span class="title">{{ value.title }}</span>
                                        <span class="text">{{ getSummary(value.content, 30) }}</span>
                                    </div>
                                </div>
                            </li>
                        </ul>

                        <!-- 没有内容 -->
                        <div class="not-more-box" v-else>
                            您还未发表内容，快去发布帖子吧
                        </div>

                        <!-- 跳转至用户论坛页面 -->
                        <router-link to="/user/forum" class="popover-goroot"
                            v-if="allUserPosts?.length > 0">查看更多</router-link>
                    </div>
                </popover>

                <svg-icons class="popover-svg" name="newspaperLine" :size="20" />
                <span>博客</span>
            </li>

            <!-- 课程 -->
            <li class="popover-wrap" @mouseenter="enterShowPopover('favorate_course')"
                @mouseleave="leaveHidePopover('favorate_course')">
                <!-- 弹窗 -->
                <popover :isLogin="store.isAuthenticated" :isShow="isShowFavorateCourse" class="popover">
                    <div class="popover-container">
                        <!-- 标题 -->
                        <h2 class="popover-title">课程</h2>

                        <!-- 收藏课程 -->
                        <ul class="favorate-course-list" v-if="allFavoriteCourseList?.length > 0">
                            <li class="course-item" v-for="value in allFavoriteCourseList" :key="value.id"
                                @click="goToCourse(value.course.id, value.course.category)">
                                <!-- 遮罩 -->
                                <div class="course-mask"></div>

                                <!-- 图片 -->
                                <picture class="course-cover">
                                    <img :src="value.course.cover_image || ''" alt="课程封面">
                                </picture>

                                <!-- 课程信息 -->
                                <div class="course-info">
                                    <!-- 课程标题 -->
                                    <p class="course-title">{{ value.course.title }}</p>

                                    <!-- 开始时间 -->
                                    <p class="start-time">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                            <path
                                                d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM13 12H17V14H11V7H13V12Z">
                                            </path>
                                        </svg>
                                        <span>{{ favoriteCourseDate(value.created_at) }}</span>
                                    </p>

                                    <!-- 学习进度 -->
                                    <div class="course-learning-progress">
                                        <!-- 介绍 -->
                                        <div class="learning-desc">
                                            <span>学习进度</span>
                                            <span class="desc-state">正在学习</span>
                                        </div>

                                        <!-- 学习进度 -->
                                        <div class="learning-progress-wrap">
                                            <!-- 进度条容器 -->
                                            <div class="progress-container">
                                                <!-- 进度 -->
                                                <div class="progress-bar"></div>
                                            </div>

                                            <span class="progress-num">3 / 49</span>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </ul>

                        <!-- 没有内容 -->
                        <div class="not-more-box" v-else>
                            前往学习页面，收藏喜欢的课程吧
                        </div>

                        <!-- 跳转至用户收藏课程页面 -->
                        <router-link to="/user/favorite-course" class="popover-goroot"
                            v-if="allFavoriteCourseList?.length > 0">查看更多</router-link>
                    </div>
                </popover>

                <svg class="popover-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path
                        d="M3 18.5V5C3 3.34315 4.34315 2 6 2H20C20.5523 2 21 2.44772 21 3V21C21 21.5523 20.5523 22 20 22H6.5C4.567 22 3 20.433 3 18.5ZM19 20V17H6.5C5.67157 17 5 17.6716 5 18.5C5 19.3284 5.67157 20 6.5 20H19ZM10 4H6C5.44772 4 5 4.44772 5 5V15.3368C5.45463 15.1208 5.9632 15 6.5 15H19V4H17V12L13.5 10L10 12V4Z">
                    </path>
                </svg>
                <span>课程</span>
            </li>

            <!-- 收藏 -->
            <li class="popover-wrap" @mouseenter="enterShowPopover('collect')"
                @mouseleave="leaveHidePopover('collect')">
                <!-- 弹窗 -->
                <popover :isLogin="store.isAuthenticated" :isShow="isShowCollect" class="popover">
                    <div class="popover-container">
                        <!-- 标题 -->
                        <h2 class="popover-title">收藏</h2>

                        <!-- 收藏课程 -->
                        <ul class="favorate-course-list" v-if="allFavoriteCourseList?.length > 0">
                            <li class="course-item" v-for="value in allFavoriteCourseList" :key="value.id"
                                @click="goToCourse(value.course.id, value.course.category)">
                                <!-- 遮罩 -->
                                <div class="course-mask"></div>

                                <!-- 图片 -->
                                <picture class="course-cover">
                                    <img :src="value.course.cover_image || ''" alt="课程封面">
                                </picture>

                                <!-- 课程信息 -->
                                <div class="course-info">
                                    <!-- 课程标题 -->
                                    <p class="course-title">{{ value.course.title }}</p>

                                    <!-- 开始时间 -->
                                    <p class="start-time">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                            <path
                                                d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM13 12H17V14H11V7H13V12Z">
                                            </path>
                                        </svg>
                                        <span>{{ favoriteCourseDate(value.created_at) }}</span>
                                    </p>

                                    <!-- 学习进度 -->
                                    <div class="course-learning-progress">
                                        <!-- 介绍 -->
                                        <div class="learning-desc">
                                            <span>学习进度</span>
                                            <span class="desc-state">正在学习</span>
                                        </div>

                                        <!-- 学习进度 -->
                                        <div class="learning-progress-wrap">
                                            <!-- 进度条容器 -->
                                            <div class="progress-container">
                                                <!-- 进度 -->
                                                <div class="progress-bar"></div>
                                            </div>

                                            <span class="progress-num">3 / 49</span>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </ul>

                        <!-- 没有内容 -->
                        <div class="not-more-box" v-else>
                            前往学习页面，收藏喜欢的课程吧
                        </div>

                        <!-- 跳转至用户收藏课程页面 -->
                        <router-link to="/user/favorite-course" class="popover-goroot"
                            v-if="allFavoriteCourseList?.length > 0">查看更多</router-link>
                    </div>
                </popover>

                <svg class="popover-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path
                        d="M11.9996 0.5L16.2256 6.68342L23.4123 8.7918L18.8374 14.7217L19.053 22.2082L11.9996 19.6897L4.94617 22.2082L5.16179 14.7217L0.586914 8.7918L7.7736 6.68342L11.9996 0.5ZM11.9996 4.044L9.02186 8.40151L3.95659 9.887L7.18152 14.0655L7.02859 19.34L11.9996 17.566L16.9696 19.34L16.8177 14.0655L20.0416 9.887L14.9773 8.40151L11.9996 4.044ZM9.99959 12C9.99959 13.1046 10.895 14 11.9996 14C13.1042 14 13.9996 13.1046 13.9996 12H15.9996C15.9996 14.2091 14.2087 16 11.9996 16C9.79045 16 7.99959 14.2091 7.99959 12H9.99959Z">
                    </path>
                </svg>
                <span>收藏</span>
            </li>

            <!-- 历史 -->
            <li class="popover-wrap" @mouseenter="enterShowPopover('history')"
                @mouseleave="leaveHidePopover('history')">
                <!-- 弹窗 -->
                <popover :isLogin="store.isAuthenticated" :isShow="isShowHistory" class="popover">
                    <div class="popover-container">
                        <!-- 标题 -->
                        <h2 class="popover-title">历史</h2>

                        <!-- 收藏课程 -->
                        <ul class="favorate-course-list" v-if="allFavoriteCourseList?.length > 0">
                            <li class="course-item" v-for="value in allFavoriteCourseList" :key="value.id"
                                @click="goToCourse(value.course.id, value.course.category)">
                                <!-- 遮罩 -->
                                <div class="course-mask"></div>

                                <!-- 图片 -->
                                <picture class="course-cover">
                                    <img :src="value.course.cover_image || ''" alt="课程封面">
                                </picture>

                                <!-- 课程信息 -->
                                <div class="course-info">
                                    <!-- 课程标题 -->
                                    <p class="course-title">{{ value.course.title }}</p>

                                    <!-- 开始时间 -->
                                    <p class="start-time">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                            <path
                                                d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM13 12H17V14H11V7H13V12Z">
                                            </path>
                                        </svg>
                                        <span>{{ favoriteCourseDate(value.created_at) }}</span>
                                    </p>

                                    <!-- 学习进度 -->
                                    <div class="course-learning-progress">
                                        <!-- 介绍 -->
                                        <div class="learning-desc">
                                            <span>学习进度</span>
                                            <span class="desc-state">正在学习</span>
                                        </div>

                                        <!-- 学习进度 -->
                                        <div class="learning-progress-wrap">
                                            <!-- 进度条容器 -->
                                            <div class="progress-container">
                                                <!-- 进度 -->
                                                <div class="progress-bar"></div>
                                            </div>

                                            <span class="progress-num">3 / 49</span>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </ul>

                        <!-- 没有内容 -->
                        <div class="not-more-box" v-else>
                            前往学习页面，收藏喜欢的课程吧
                        </div>

                        <!-- 跳转至用户收藏课程页面 -->
                        <router-link to="/user/view-history" class="popover-goroot"
                            v-if="allFavoriteCourseList?.length > 0">查看更多</router-link>
                    </div>
                </popover>

                <svg class="popover-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path
                        d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12H4C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C9.25022 4 6.82447 5.38734 5.38451 7.50024L8 7.5V9.5H2V3.5H4L3.99989 5.99918C5.82434 3.57075 8.72873 2 12 2ZM13 7L12.9998 11.585L16.2426 14.8284L14.8284 16.2426L10.9998 12.413L11 7H13Z">
                    </path>
                </svg>
                <span>历史</span>
            </li>

            <!-- 发布论坛 -->
            <li class="publish-post" @click="goPostCreate">
                <svg-icons name="upload_line" :size="18" />
                <span>发帖</span>
            </li>
        </ul>
    </header>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import popover from './popover.vue';

// 引入图标组件
import svgIcons from '@/components/Icons/index.vue'

// 引入登录注册状态库
import { useAuthStore } from '@/stores/useAuthStore'
const authStore = useAuthStore()
// 引用用户状态库
import { useUserStore } from "@/stores/user";
const store = useUserStore();

// 引入课程相关api
import { getAllFavoriteCourse } from '@/api/learning'
// 获取全部收藏课程
const getAllFavoriteCourseFun = () => {
    getAllFavoriteCourse().then(res => {
        allFavoriteCourseList.value = res
    }).catch(err => {
        console.log(err);
    })
}

// 引入论坛相关 api
import { getUserPosts } from '@/api/forum';
const getUserPostsFun = () => {
    getUserPosts({ limit: 10 }).then(res => {
        console.log(res);

        allUserPosts.value = res
    }).catch(err => {
        console.log(err);
    })
}

// 引入自定义确认组件
import { useConfirm } from '@/components/MyConfirmDialog/index'

// 格式化时间工具函数
import formatDate from '@/utils/formatDate';

import { useRouter } from 'vue-router';
const router = useRouter()

onMounted(() => {
    getAllFavoriteCourseFun()
    getUserPostsFun()
})

// 是否显示用户信息容器
const showUserInfoDropdown = ref(false)

// 前往用户中心
const goToUser = () => {
    router.push({
        name: 'user'
    })
}

// 退出登录
const clickLogout = async () => {
    const is = await useConfirm({ message: '是否退出登录', title: '退出登录' })

    if (is) {
        store.logout()
    }
}

// 前往发布帖子
const goPostCreate = () => {
    if (!store.isAuthenticated) {
        authStore.openLogin()

        return
    }

    router.push({
        name: 'post-create'
    })
}

// ============================== 全局变量 ===================================

// 全部收藏课程
const allFavoriteCourseList = ref()

// ============================== 全局变量 ===================================

// ========= 收藏课程 =========

// 是否显示博客
const isShowForum = ref(false)

// 是否显示收藏课程弹窗
const isShowFavorateCourse = ref(false)

// 是否显示收藏
const isShowCollect = ref(false)

// 是否显示历史记录
const isShowHistory = ref(false)

// 移入显示弹窗
const enterShowPopover = (which: string) => {
    switch (which) {
        case 'favorate_course':
            isShowFavorateCourse.value = true
            break
        case 'collect':
            isShowCollect.value = true
            break
        case 'history':
            isShowHistory.value = true
            break
        case 'forum':
            isShowForum.value = true
            break
    }
}
// 移出隐藏弹窗
const leaveHidePopover = (which: string) => {
    switch (which) {
        case 'favorate_course':
            isShowFavorateCourse.value = false
            break
        case 'collect':
            isShowCollect.value = false
            break
        case 'history':
            isShowHistory.value = false
            break
        case 'forum':
            isShowForum.value = false
            break
    }
}

// 收藏课程的时间
const favoriteCourseDate = (date: string) => {
    return formatDate(date, 'yyyy年MM月dd日')
}

// 跳转至课程详情
const goToCourse = (id: number, category_id: number) => {
    router.push({
        name: 'study-course-intro',
        params: {
            id,
            category_id
        }
    })
}

// ========= 收藏课程 =========

// =========================== 论坛 ===========================

// 全部个人博客
const allUserPosts = ref()

// 发布时间
const postCreateTime = (date: string) => {
    return formatDate(date, 'yyyy-MM-dd HH:mm')
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

// 跳转至对应帖子
const goToPost = (id: number) => {
    router.push({
        name: 'post',
        params: {
            id
        }
    })
}

// =========================== 论坛 ===========================
</script>

<style scoped lang="scss">
ul {
    margin: 0;
    padding: 0;

    li {
        list-style-type: none;
    }
}

.navgation-bar {
    width: 100vdh;
    position: relative;
    top: 0;
    z-index: 9999;
    height: var(--header-height);
    display: flex;
    align-items: center;
    box-sizing: border-box;
    padding: 0 150px;
    justify-content: space-between;
    background-color: var(--background-color-white);

    // 容器
    .navgation-bar__item {
        display: flex;
        height: 100%;
        align-items: center;
        gap: 25px;

        // 弹窗口包装
        .popover-wrap {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
            font-size: 14px;
            gap: 3px;
            cursor: pointer;
            position: relative;

            &:hover .popover-svg {
                animation: shuttle var(--transition-duration-default);
            }

            // 弹窗容器
            .popover-container {
                box-shadow: 0 0 10px var(--background-color-black-transparent-dark);
                width: 340px;
                box-sizing: border-box;
                padding: 10px 0;
                background-color: var(--background-color-white);
                border-radius: 10px;
                box-sizing: border-box;

                p {
                    margin: 0;
                }

                // 标题
                .popover-title {
                    font-size: 18px;
                    font-weight: bold;
                    margin: 7px 0 10px 0;
                    padding: 0 15px;
                    box-sizing: border-box;
                }


                // 个人帖子
                .user-posts-list-box {
                    display: flex;
                    flex-direction: column;
                    max-height: 300px;
                    overflow-y: auto;
                    box-sizing: border-box;
                    padding: 0 15px;
                    gap: 15px;
                    margin: 15px 0;

                    // 项
                    .uplb__item {
                        display: flex;
                        gap: 15px;

                        &:not(:last-of-type) .ituplb__item__info-container {
                            padding-bottom: 10px;
                            border-bottom: 1px solid var(--border-color-gray-dark);
                        }

                        // 头像
                        .ituplb__item__avatar {
                            width: 30px;
                            height: 30px;
                            overflow: hidden;
                            border-radius: 50%;
                            flex-shrink: 0;

                            img {
                                width: 100%;
                                height: 100%;
                                object-fit: cover;
                            }
                        }

                        // 帖子内容
                        .ituplb__item__info-container {
                            flex: 1;
                            display: flex;
                            flex-direction: column;
                            gap: 4px;

                            // 标题
                            .info__name {
                                font-weight: bold;
                                color: rgb(255, 117, 140);
                            }

                            // 帖子状态
                            .info__state {
                                display: flex;
                                gap: 5px;
                                font-size: 12px;
                                color: var(--text-color-gray-default);
                            }

                            // 帖子内容
                            .info__content {
                                display: flex;
                                flex-direction: column;
                                gap: 5px;
                                margin-top: 2px;
                                transition: all var(--transition-duration-default);

                                &:hover {
                                    color: var(--text-color-primary-deep);
                                }

                                .text {
                                    color: var(--text-color-gray-dark);
                                    font-size: 13px;
                                }
                            }
                        }
                    }
                }

                // 收藏课程列表
                .favorate-course-list {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;

                    // 课程项
                    .course-item {
                        height: 75px;
                        display: flex;
                        gap: 12px;
                        position: relative;
                        padding: 8px 15px;

                        &:hover .course-mask {
                            opacity: 1;
                        }

                        // 遮罩
                        .course-mask {
                            opacity: 0;
                            position: absolute;
                            width: 100%;
                            height: 100%;
                            top: 0;
                            left: 0;
                            z-index: 1;
                            background-color: var(--background-color-black-transparent-pale);
                            transition: all var(--transition-duration-default);
                        }

                        // 图片
                        .course-cover {
                            height: 100%;
                            width: 130px;

                            img {
                                width: 100%;
                                height: 100%;
                                object-fit: cover;
                                border-radius: 5px;
                            }
                        }

                        // 课程信息
                        .course-info {
                            display: flex;
                            flex-direction: column;
                            justify-content: space-between;
                            flex: 1;

                            // 课程标题
                            .course-title {
                                font-weight: bold;
                            }

                            // 开始时间
                            .start-time {
                                font-size: 12px;
                                color: var(--text-color-gray-default);
                                display: flex;
                                align-items: center;
                                gap: 5px;

                                svg {
                                    height: 14px;
                                    width: 14px;
                                }
                            }

                            // 学习进度
                            .course-learning-progress {
                                display: flex;
                                flex-direction: column;
                                gap: 3px;

                                // 学习介绍
                                .learning-desc {
                                    display: flex;
                                    justify-content: space-between;
                                    font-size: 12px;

                                    .desc-state {
                                        color: var(--text-color-primary-deep);
                                    }
                                }

                                // 学习进度
                                .learning-progress-wrap {
                                    display: flex;
                                    align-items: center;
                                    gap: 10px;

                                    // 进度条容器
                                    .progress-container {
                                        position: relative;
                                        background-color: var(--background-color-black-deepest);
                                        box-shadow: 0 0 3px var(--background-color-white) inset;
                                        flex: 1;
                                        border-radius: 5px;
                                        height: 5px;

                                        // 进度条
                                        .progress-bar {
                                            width: 50%;
                                            height: 100%;
                                            border-radius: 5px;
                                            background-color: rgb(22, 237, 22);
                                            box-shadow: 0 0 6px rgba(34, 255, 0, 0.766);
                                        }
                                    }

                                    // 进度数字
                                    .progress-num {
                                        font-size: 12px;
                                        color: rgb(136, 88, 4);
                                    }
                                }
                            }
                        }
                    }
                }

                // 没有内容展示
                .not-more-box {
                    width: 100%;
                    height: 100px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                // 前往目的
                .popover-goroot {
                    width: 100%;
                    height: 35px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-top: 6px;
                    transition: all var(--transition-duration-default);

                    &:hover {
                        color: var(--text-color-primary-deep);
                        background-color: var(--primary-color-300);
                    }
                }
            }

            svg {
                width: 20px;
                height: 20px;
            }

            @keyframes shuttle {
                50% {
                    transform: translateY(-3px);
                }

                100% {
                    transform: translateY(0px);
                }
            }
        }

        // 登录按钮
        .login-btn {
            width: 80px;
            height: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 6px;
            cursor: pointer;
            background-color: var(--primary-color-300);
            color: var(--text-color-gray-dark);
            border: 1px solid var(--primary-color-200);
            transition: all var(--transition-duration-default);

            &:hover {
                background-color: var(--primary-color-200);
            }
        }

        // 用户信息
        .user-info {
            display: flex;
            align-items: center;
            gap: 5px;
            position: relative;
            cursor: pointer;
            justify-content: center;

            // 其他内容容器
            .info-warpper {
                position: absolute;
                bottom: 0px;
                transform: translateY(100%);
                padding-top: 10px;

                // 内容
                .info-content {
                    width: 240px;
                    background-color: var(--background-color-white);
                    padding: 10px 14px;
                    box-sizing: border-box;
                    box-shadow: 0 0 10px var(--background-color-gray-transparent-light);
                    border-radius: 10px;

                    .single-item {
                        padding: 10px 10px;
                        width: 100%;
                        box-sizing: border-box;
                        font-size: 14px;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        cursor: pointer;
                        border-radius: 5px;
                        transition: all var(--transition-duration-default);

                        &:hover {
                            background-color: var(--background-color-gray-default);
                        }

                        .single-text {
                            height: 100%;
                            display: flex;
                            align-items: center;
                            gap: 6px;
                        }

                        svg {
                            width: 18px;
                            height: 18px;
                        }
                    }
                }
            }

            // 头像
            .user-avatar {
                width: 36px;
                height: 36px;
                border-radius: 50%;
                overflow: hidden;

                img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
            }

            // 用户名
            .user-name {
                font-size: 14px;
            }
        }

        // 创建帖子按钮
        .publish-post {
            display: flex;
            gap: 8px;
            align-items: center;
            justify-content: center;
            width: 100px;
            height: 36px;
            border-radius: 6px;
            cursor: pointer;
            background-color: var(--primary-color-300);
            color: var(--text-color-gray-dark);
            border: 1px solid var(--primary-color-200);
            transition: all var(--transition-duration-default);

            &:hover {
                background-color: var(--primary-color-200);
            }
        }
    }
}

/* 进入动画：下 -> 上 */
.fade-slide-enter-active {
    transition: all 0.2s ease;
}

.fade-slide-enter-from {
    opacity: 0;
    transform: translateY(10px);
    /* 从下方开始 */
}

.fade-slide-enter-to {
    opacity: 1;
    transform: translateY(100%);
    /* 滑到正常位置 */
}

/* 离开动画：上 -> 下 */
.fade-slide-leave-active {
    transition: all 0.2s ease;
}

.fade-slide-leave-from {
    opacity: 1;
    transform: translateY(100%);
    /* 从正常位置开始 */
}

.fade-slide-leave-to {
    opacity: 0;
    transform: translateY(10px);
    /* 向下滑出 */
}
</style>