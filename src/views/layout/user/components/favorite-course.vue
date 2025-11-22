<template>
    <div class="func-container">
        <div class="title">我的课程</div>

        <div class="module-wrapper">
            <div class="module-title">收藏课程</div>

            <!-- 课程列表 -->
            <div class="module-container course-list">
                <!-- 没有内容 -->
                <div class="nocontent" v-if="allFavoriteCourse?.length <= 0">
                    暂无收藏，快去浏览课程，把喜欢的加入收藏吧！
                </div>

                <!-- 课程项 -->
                <div class="course-list-item" v-else v-for="value in allFavoriteCourse" :key="value.id"
                    @click="goToCourse(value.course.id, value.course.category)">
                    <!-- 遮罩 -->
                    <div class="item-shadow">
                        前往课程详情页
                    </div>

                    <!-- 左侧封面 -->
                    <div class="item-cover-container">
                        <img :src="value.course.cover_image" alt="">
                    </div>

                    <!-- 课程信息 -->
                    <div class="item-content">
                        <div class="content-info-container">
                            <p class="info-title">课程名称</p> {{ value.course.title
                                || '' }}
                        </div>

                        <!-- 简介 -->
                        <div class="content-info-container">
                            <p class="info-title">课程简介</p>
                            <p class="info-desc">{{
                                value.course.description || '' }}</p>
                        </div>

                        <!-- 开始时间 -->
                        <div class="content-info-container">
                            <p class="info-title">开始时间</p> {{
                                favoriteCourseDate(value.created_at) }}
                        </div>

                        <!-- 学习进度 -->
                        <div class="study-progress">
                            <!-- 进度信息 -->
                            <div class="progress-info">
                                <span style="color: var(--text-color-primary-deep);">学习进度</span>

                                <span class="animated-gradient">从头开始，一起加油</span>

                                <span>已完成： 1 / 49</span>
                            </div>

                            <!-- 进度条 -->
                            <div class="progress-link">
                                <!-- 进度条容器 -->
                                <div class="link-wrapper">
                                    <!-- 进度条背景 -->
                                    <div class="link-back"></div>

                                    <!-- 进度 -->
                                    <div class="link-pace"></div>
                                </div>

                                <!-- 进度百分比 -->
                                <span>1 %</span>
                            </div>
                        </div>
                    </div>

                    <!-- 右侧图标 -->
                    <div class="item-toicon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path
                                d="M13.1717 12.0007L8.22192 7.05093L9.63614 5.63672L16.0001 12.0007L9.63614 18.3646L8.22192 16.9504L13.1717 12.0007Z">
                            </path>
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import '../fun.scss'
import { useRouter } from 'vue-router';
const router = useRouter()

// 引入api
import { getAllFavoriteCourse } from '@/api/learning'
const getAllFavoriteCourseFun = () => {
    getAllFavoriteCourse().then(res => {
        allFavoriteCourse.value = res
    }).catch(err => {
        console.log(err);
    })
}

// 格式化时间工具函数
import formatDate from '@/utils/formatDate';

onMounted(() => {
    getAllFavoriteCourseFun()
})

// =================== 全局变量 ==========================

// 收藏课程
const allFavoriteCourse = ref()

// 收藏课程的时间
const favoriteCourseDate = (date: string) => {
    return formatDate(date, 'yyyy年MM月dd日')
}

// =================== 全局变量 ==========================

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
</script>

<style scoped lang="scss">
.animated-gradient {
    --c1: #ff6a88;
    --c2: #ffb86b;
    --c3: #7afcff;
    --c4: #5d3aff;

    font-size: 16px;
    font-weight: 800;
    background: linear-gradient(120deg, var(--c1), var(--c2), var(--c3), var(--c4));
    background-size: 300% 300%;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: gradient-move 6s ease infinite;
}

/* 遵守用户减少动画偏好 */
@media (prefers-reduced-motion: reduce) {
    .animated-gradient {
        animation: none;
        background-size: cover;
    }
}

@keyframes gradient-move {
    0% {
        background-position: 0% 50%;
    }

    50% {
        background-position: 100% 50%;
    }

    100% {
        background-position: 0% 50%;
    }
}

// 课程项
.course-list {
    gap: 15px !important;

    // 无内容
    .nocontent {
        width: 100%;
        height: 200px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .course-list-item {
        display: flex;
        justify-content: space-evenly;
        gap: 30px;
        width: 100%;
        height: 160px;
        box-sizing: border-box;
        padding: 14px 20px;
        box-shadow: 0 0 6px rgb(106, 106, 106) inset;
        border-radius: 15px;
        user-select: none;
        cursor: pointer;
        transition: all var(--transition-duration-default);
        position: relative;

        &:hover {
            box-shadow: 0 0 10px rgba(76, 153, 83, 0.667) inset;
            background-color: var(--primary-color-500);
            transform: scale(1.008);

            .item-shadow {
                opacity: 1;
            }

            svg {
                color: var(--text-color-primary);
            }
        }

        // 遮罩
        .item-shadow {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(218, 255, 222, 0.324);
            transition: all var(--transition-duration-default);
            border-radius: 15px;
            opacity: 0;
            z-index: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            font-weight: bold;
        }

        // 左侧封面
        .item-cover-container {
            height: 100%;
            aspect-ratio: 1/1;
            border-radius: 10px;
            overflow: hidden;

            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
        }

        // 课程信息
        .item-content {
            flex: 1;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;

            .content-info-container {
                display: flex;

                .info-title {
                    font-weight: bold;
                    width: 80px;
                    margin: 0;
                    color: var(--text-color-primary-deep);
                }

                .info-desc {
                    overflow: hidden;
                    text-overflow: ellipsis;
                    margin: 0;
                    white-space: nowrap;
                    max-width: 550px;
                }
            }

            // 学习进度
            .study-progress {
                display: flex;
                flex-direction: column;
                gap: 5px;

                // 进度信息
                .progress-info {
                    display: flex;
                    justify-content: space-between;
                    font-weight: bold;
                }

                // 进度条
                .progress-link {
                    display: flex;
                    gap: 20px;
                    align-items: center;

                    // 进度条包装容器
                    .link-wrapper {
                        flex: 1;
                        height: 10px;
                        position: relative;

                        // 进度条背景
                        .link-back {
                            width: 100%;
                            height: 100%;
                            background-color: black;
                            border-radius: 5px;
                            box-shadow: 0 0 6px rgb(244, 218, 255) inset;
                        }

                        // 进度
                        .link-pace {
                            width: 1%;
                            height: 100%;
                            background-color: rgb(47, 223, 50);
                            box-shadow: 0 0 10px rgb(82, 251, 56);
                            border-radius: 5px 0 0 5px;
                            position: absolute;
                            top: 0;
                            left: 0;
                        }
                    }
                }
            }
        }

        // 右侧图标
        .item-toicon {
            width: 50px;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;

            svg {
                width: 40px;
                height: 40px;
                transition: all var(--transition-duration-default);
            }
        }
    }
}
</style>