<template>
    <div class="course-intro">
        <!-- 顶部课程介绍 -->
        <div class="top-course-details">
            <!-- 容器 -->
            <div class="container top-course-details__container">
                <!-- 左侧课程信息 -->
                <div class="left-course-info">
                    <!-- 返回课程选择 -->
                    <div class="return-course-select" @click="returnCourseSelect">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-linecap="round" stroke-linejoin="round">
                            <!-- 横线 -->
                            <line x1="20" y1="12" x2="6" y2="12" />
                            <!-- 箭头 -->
                            <polyline points="12 6 6 12 12 18" />
                        </svg>
                        课程选择
                    </div>
                    <p class="title">{{ courseInfo.title }}</p>
                    <p class="desc">{{ courseInfo.description }}</p>
                    <!-- 相关信息 -->
                    <div class="info">
                        <span>最近更新日期：{{ currentCourseUpdateDate }}</span>
                    </div>

                    <!-- 课程评分 -->
                    <div class="rating">
                        <el-rate :model-value="Number(courseInfo.rating)" disabled show-score size="large"
                            class="rate-left-score" text-color="#ff9900"
                            :score-template="'{value} 分' + ` （ ${courseInfo.rating_count} 人 ）`" />
                    </div>

                    <!-- 取消收藏 -->
                    <div class="cancel-favorite-btn favorite-btn" @click="clickCanCelFavoriteCourse"
                        v-if="courseInfo.is_favorited">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path
                                d="M12.0006 18.26L4.94715 22.2082L6.52248 14.2799L0.587891 8.7918L8.61493 7.84006L12.0006 0.5L15.3862 7.84006L23.4132 8.7918L17.4787 14.2799L19.054 22.2082L12.0006 18.26Z">
                            </path>
                        </svg>

                        <span>已收藏</span>
                    </div>

                    <!-- 收藏按钮 -->
                    <div class="favorite-btn" @click="clickFavoriteCourse" v-else>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path
                                d="M12.0006 18.26L4.94715 22.2082L6.52248 14.2799L0.587891 8.7918L8.61493 7.84006L12.0006 0.5L15.3862 7.84006L23.4132 8.7918L17.4787 14.2799L19.054 22.2082L12.0006 18.26ZM12.0006 15.968L16.2473 18.3451L15.2988 13.5717L18.8719 10.2674L14.039 9.69434L12.0006 5.27502L9.96214 9.69434L5.12921 10.2674L8.70231 13.5717L7.75383 18.3451L12.0006 15.968Z">
                            </path>
                        </svg>

                        <span>收藏课程</span>
                    </div>
                </div>

                <!-- 右侧封面 -->
                <div class="right-course-cover">
                    <img :src="courseInfo.cover_image">

                    <!-- 课程评分 -->
                    <div class="course-rate">
                        <!-- 用户评分容器 -->
                        <div class="user-rating">
                            <span>课程评分：</span>
                            <el-rate v-model="userRate" allow-half show-score text-color="#ff9900"
                                @change="rateCouresFun" score-template="{value} 分" size="large" />
                        </div>

                        <!-- 评分容器 -->
                        <div class="rate-container">
                            <!-- 分数 -->
                            <div class="course-rating">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                    <path
                                        d="M11.9996 0.5L16.2256 6.68342L23.4123 8.7918L18.8374 14.7217L19.053 22.2082L11.9996 19.6897L4.94617 22.2082L5.16179 14.7217L0.586914 8.7918L7.7736 6.68342L11.9996 0.5ZM11.9996 4.044L9.02186 8.40151L3.95659 9.887L7.18152 14.0655L7.02859 19.34L11.9996 17.566L16.9696 19.34L16.8177 14.0655L20.0416 9.887L14.9773 8.40151L11.9996 4.044ZM9.99959 12C9.99959 13.1046 10.895 14 11.9996 14C13.1042 14 13.9996 13.1046 13.9996 12H15.9996C15.9996 14.2091 14.2087 16 11.9996 16C9.79045 16 7.99959 14.2091 7.99959 12H9.99959Z">
                                    </path>
                                </svg>
                                <span>{{ courseInfo.rating }} / 5.0 分</span>
                            </div>

                            <!-- 人数 -->
                            <div class="course-rating"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                    fill="currentColor">
                                    <path
                                        d="M12 14V16C8.68629 16 6 18.6863 6 22H4C4 17.5817 7.58172 14 12 14ZM12 13C8.685 13 6 10.315 6 7C6 3.685 8.685 1 12 1C15.315 1 18 3.685 18 7C18 10.315 15.315 13 12 13ZM12 11C14.21 11 16 9.21 16 7C16 4.79 14.21 3 12 3C9.79 3 8 4.79 8 7C8 9.21 9.79 11 12 11ZM18 21.5L15.0611 23.0451L15.6224 19.7725L13.2447 17.4549L16.5305 16.9775L18 14L19.4695 16.9775L22.7553 17.4549L20.3776 19.7725L20.9389 23.0451L18 21.5Z">
                                    </path>
                                </svg>
                                <span>{{ courseInfo.rating_count }} 人</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 章节列表展示 -->
        <main class="main-container">
            <div class="container chapter-container">
                <!-- 标题 -->
                <div class="chapter-title">
                    章节目录
                    <span class="chapter-title__comment">可以先看看章节目录，判断此课程是否满足需求</span>
                </div>

                <!-- 章节列表 -->
                <div class="chapter-list">
                    <!-- 章节项 -->
                    <div class="chapter-list__item" v-for="value in allChapters" :key="value.id"
                        @click="goToLesson(value.id)">
                        {{ value.title }}
                    </div>
                </div>
            </div>
        </main>

        <!-- 相似课程推荐 -->
        <div class="container related-container">
            <!-- 标题 -->
            <div class="related-title">相关课程推荐</div>

            <!-- 推荐的课程内容 -->
            <div class="related-course-list">
                <!-- 课程项 -->
                <div class="related-course-list__item" v-for="value in relatedCourses" :key="value.id"
                    @click="goToRelatedCourse(value.id)">
                    <!-- 课程封面 -->
                    <img :src="value.cover_image">

                    <!-- 课程信息 -->
                    <div class="course-item__info">
                        <div class="course-item__info__title">{{ value.title }}</div>
                        <div class="course-item__info__desc">{{ value.description }}</div>

                        <!-- 课程评分 -->
                        <el-rate :model-value="Number(value.rating)" disabled show-score size="large"
                            class="rate-left-score" text-color="#ff9900"
                            :score-template="'{value} 分' + ` （ ${value.rating_count} 人 ）`" />

                        <!-- 标签 -->
                        <div class="study__all-course__course-style__course-list__card__info__tag">
                            <!-- 热门标签 -->
                            <p class="tag-item"><span>🔥</span><span>热门课程</span></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts" name="CourseIntro">
import { ref, onMounted, computed } from 'vue'
import { useRouter, onBeforeRouteUpdate } from 'vue-router'
const router = useRouter()

// 引入格式化日期工具函数
import formatDate from '@/utils/formatDate'

// 引入土司组件
import { toast } from '@/components/MyToast/toast'

// 引入用户状态库
import { useUserStore } from '@/stores/user'
const userStore = useUserStore()
// 引入登录状态库
import { useAuthStore } from '@/stores/useAuthStore'
const authstore = useAuthStore()

// 引入api
import { getAlllCourseByCagegory } from '@/api/admin/admin_learning'
import { getPublishedChapterByCourse, favoriteCourse, cancelFavoriteCourse, rateCourse } from '@/api/learning'
// 获取全部章节以及对应课程信息
const getPublishedChapterByCourseFun = (id: string) => {
    getPublishedChapterByCourse(id).then((res: any) => {
        courseInfo.value = res.course
        allChapters.value = res.chapters
    }).catch(err => {
        console.log(err);
    })
}
// 获取对应课程分类id的全部课程
const getAlllCourseByCagegoryFun = (id: string) => {
    getAlllCourseByCagegory({ id }).then((res: any) => {
        // 只获取前四个
        relatedCourses.value = res.courses.slice(0, 4)
    }).catch(err => {
        console.log(err);
    })
}

const props = defineProps<{
    id: string
    category_id: string
}>()

onMounted(() => {
    // 获取全部章节以及对应课程信息
    getPublishedChapterByCourseFun(props.id)

    // 获取对应课程分类id的全部课程信息
    getAlllCourseByCagegoryFun(props.category_id)
})

// 当路由参数变化时（id 或 category_id 变了）
onBeforeRouteUpdate((to, _from, next) => {
    // 拿到新的参数
    const { id, category_id } = to.params

    // 拉取新数据
    if (id) getPublishedChapterByCourseFun(id as string)
    if (category_id) getAlllCourseByCagegoryFun(category_id as string)

    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' })

    // 确认跳转
    next()
})

// ========================== 全局变量 ==========================

// 存放对应课程信息
const courseInfo = ref<any>({})

// 存放全部章节数据
const allChapters = ref<any[]>([])

// 课程最新更新日期
const currentCourseUpdateDate = computed(() => {
    return courseInfo.value.created_at
        ? formatDate(courseInfo.value.created_at, 'yyyy/MM')
        : ''
})

// 存放四个相关课程推荐课程
const relatedCourses = ref<any[]>([])

// ========================== 全局变量 ==========================

// 返回课程选择
const returnCourseSelect = () => {
    router.push({
        name: 'study-home'
    })
}

// 点击章节跳转
const goToLesson = (chapter_id: number) => {
    router.push({
        name: 'study-course-lesson',
        params: {
            id: props.id,  // 课程 id
            chapter_id,
            category_id: props.category_id
        }
    }).then(() => {
        // 跳转完成后拉回顶部
        window.scrollTo(0, 0)
    })
}

// 点击跳转至推荐课程
const goToRelatedCourse = (id: number) => {
    router.push({
        name: 'study-course-intro',
        params: {
            id
        }
    })
}

// ======================= 收藏课程 =============================

// 收藏课程
const clickFavoriteCourse = () => {
    // 判断是否登录
    if (!userStore.isAuthenticated) {
        toast({ message: '请先登录', type: 'error' })

        // 打开登录弹窗
        authstore.visible = true

        return
    }

    favoriteCourse(props.id).then(() => {
        courseInfo.value.is_favorited = true
        toast({ message: '收藏成功，学习加油哦', type: 'success' })
    }).catch(err => {
        console.log(err);
        toast({ message: '收藏失败，请重试', type: 'error' })
    })
}

// 取消收藏
const clickCanCelFavoriteCourse = () => {
    cancelFavoriteCourse(props.id).then(() => {
        courseInfo.value.is_favorited = false
        toast({ message: '已取消收藏', type: 'success' })
    }).catch(err => {
        console.log(err);
        toast({ message: '取消收藏失败，请重试', type: 'error' })
    })
}

// ======================= 收藏课程 =============================

// ========================================= 用户评分 =============================================

// 课程评分
const userRate = ref(5)

// 给课程评分
const rateCouresFun = (v: number) => {
    // 判断是否登录
    if (!userStore.isAuthenticated) {
        toast({ message: '请先登录', type: 'error' })

        // 打开登录弹窗
        authstore.visible = true

        return
    }

    rateCourse(props.id, v).then(res => {
        courseInfo.value.rating = res.rating
        courseInfo.value.rating_count = res.rating_count

        if (v >= 4) {
            toast({ message: '感谢您的肯定，我们会更加努力的', type: 'success' })
        } else {
            toast({ message: '感谢您的指点，我们会发现不足改进的', type: 'success' })
        }
    }).catch(err => {
        console.log(err);

        toast({ message: '评分失败，请重新尝试', type: 'error' })
    })
}

// ========================================= 用户评分 =============================================
</script>

<style scoped lang="scss">
.course-intro {
    width: 100%;
    padding-bottom: 80px;

    // 顶部课程介绍
    .top-course-details {
        background-color: var(--background-color-white-opposite);
        margin-bottom: 40px;

        // 容器
        .top-course-details__container {
            display: flex;
            justify-content: space-between;
            color: var(--text-color-white-light);
            padding: 30px 0;
            gap: 100px;
            align-items: center;

            // 左侧课程信息
            .left-course-info {
                display: flex;
                flex-direction: column;
                gap: 10px;

                // 返回课程选择
                .return-course-select {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 14px;
                    text-decoration: underline;
                    cursor: pointer;
                    transition: all var(--transition-duration-default);

                    &:hover {
                        color: var(--text-color-primary-light);
                    }

                    svg {
                        width: 18px;
                        height: 18px;
                        stroke-width: 3px;
                    }
                }

                // 标题
                .title {
                    font-size: 25px;
                    font-weight: bold;
                    margin: 18px 0;
                }

                // 描述
                .desc {
                    line-height: 22px;
                    margin: 0;
                    margin-bottom: 10px;
                }

                // 信息
                .info {
                    font-size: 13px;
                }

                // 评分
                .rating {
                    display: flex;
                }

                // 取消收藏
                .cancel-favorite-btn {
                    color: var(--text-color-primary-light) !important;
                    border: 1px solid var(--primary-color-100) !important;

                    &:hover {
                        color: var(--text-color-white-light) !important;
                        border: 1px solid var(--border-color-gray-default) !important;
                    }
                }

                // 收藏按钮
                .favorite-btn {
                    background-color: transparent;
                    border: 1px solid var(--border-color-gray-default);
                    color: var(--text-color-white-light);
                    width: 130px;
                    height: 44px;
                    border-radius: 10px;
                    margin: 15px 0;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 6px;
                    transition: all var(--transition-duration-default);

                    &:hover {
                        color: var(--text-color-primary-light);
                        border: 1px solid var(--primary-color-100);
                    }

                    svg {
                        width: 23px;
                        height: 23px;
                    }
                }
            }

            // 右侧封面
            .right-course-cover {
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                gap: 20px;
                user-select: none;

                img {
                    object-fit: cover;
                    max-width: 400px;
                    max-height: 400px;
                    border-radius: 6px;
                }

                // 课程评分
                .course-rate {
                    display: flex;
                    position: relative;
                    padding: 6px 0;

                    &:hover .user-rating {
                        opacity: 1;
                    }

                    // 用户评分
                    .user-rating {
                        opacity: 0;
                        transition: all var(--transition-duration-default);
                        width: 100%;
                        height: 100%;
                        position: absolute;
                        top: 0;
                        left: 0;
                        z-index: 1;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        border-radius: 10px;
                        font-weight: bold;
                        backdrop-filter: blur(2px);
                        background-color: var(--background-color-black-transparent-deep);
                    }

                    // 评分容器
                    .rate-container {
                        width: 100%;
                        display: flex;
                        justify-content: space-around;

                        // 评分
                        .course-rating {
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            gap: 6px;
                            color: #d39822;
                            font-weight: bold;

                            svg {
                                width: 20px;
                                height: 20px;
                            }
                        }
                    }
                }
            }
        }
    }

    // 章节容器
    .chapter-container {
        border: 1px solid var(--border-color-gray-dark);
        padding: 20px;
        border-radius: 10px;

        // 章节标题
        .chapter-title {
            font-size: 22px;
            font-weight: bold;
            padding-bottom: 7px;
            margin-bottom: 15px;
            border-bottom: 2px solid var(--border-color-gray-deepest);

            // 备注
            .chapter-title__comment {
                font-size: 16px;
                margin-left: 10px;
                font-weight: normal;
            }
        }

        // 章节列表
        .chapter-list {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            /* 两列均分 */
            /* 两列均分 */
            gap: 16px;

            // 章节项
            .chapter-list__item {
                background: var(--background-color-gray-light);
                padding: 10px;
                border-radius: 5px;
                box-shadow: 0 0 10px var(--background-color-gray-transparent-light);
                cursor: pointer;
                transition: all var(--transition-duration-default) ease;

                &:hover {
                    transform: scale(1.02);
                    background: var(--background-color-gray-default);
                }
            }
        }
    }

    // 相关课程推荐
    .related-container {
        margin-top: 50px;

        // 标题
        .related-title {
            font-size: 22px;
            font-weight: bold;
            padding-bottom: 7px;
            margin-bottom: 15px;
            border-bottom: 2px solid var(--border-color-gray-deepest);
        }

        // 推荐的课程内容
        .related-course-list {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 16px;

            // 课程项
            .related-course-list__item {
                border-radius: 8px;
                box-shadow: 0 0 10px var(--background-color-black-transparent-light);
                transition: all var(--transition-duration-default) ease;
                cursor: pointer;

                &:hover {
                    transform: translateY(-2px) scale(1.02);

                    img {
                        filter: brightness(80%);
                    }
                }

                img {
                    width: 100%;
                    height: 180px;
                    object-fit: cover;
                    border-radius: 10px;
                    transition: all var(--transition-duration-default) ease;
                }

                // 课程信息
                .course-item__info {
                    padding: 10px 20px;

                    // 课程标题
                    &__title {
                        font-weight: bold;
                        margin-bottom: 8px;
                        display: -webkit-box;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        -webkit-line-clamp: 2; // 显示两行
                        line-clamp: 2;
                        -webkit-box-orient: vertical;
                        // 确保整行高度被裁剪
                        line-height: 1.4em;
                        max-height: 40px; // 固定两行高度
                    }

                    // 课程简介
                    &__desc {
                        font-size: 14px;
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
                    .study__all-course__course-style__course-list__card__info__tag {
                        display: flex;

                        .tag-item {
                            margin: 3px 0;
                            padding: 6px 10px;
                            display: flex;
                            gap: 3px;
                            font-size: 13px;
                            border-radius: 6px;
                            color: rgb(253, 181, 181);
                            background-color: #98120d;
                        }
                    }
                }
            }
        }
    }
}
</style>