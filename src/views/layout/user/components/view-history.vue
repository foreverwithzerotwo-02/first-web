<template>
    <div class="func-container">
        <div class="title">浏览历史</div>

        <!-- 没有浏览记录 -->
        <div class="no-history" v-if="!allViewHistory || allViewHistory.length <= 0">暂时没有浏览记录，快快去看看感兴趣的吧</div>

        <!-- 浏览历史容器 -->
        <div class="view-history-wrapper" v-else>
            <!-- 功能栏 -->
            <div class="func-bar">
                <!-- 清空浏览历史按钮 -->
                <button class="func-btn-container" @click="clearCourseViewHistoryFun">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path
                            d="M8 19.9967V14.9967H10V19.9967H19V12.9967H5V19.9967H8ZM4 10.9967H20V7.9967H14V3.9967H10V7.9967H4V10.9967ZM3 20.9967V12.9967H2V6.9967C2 6.44442 2.44772 5.9967 3 5.9967H8V2.9967C8 2.44442 8.44772 1.9967 9 1.9967H15C15.5523 1.9967 16 2.44442 16 2.9967V5.9967H21C21.5523 5.9967 22 6.44442 22 6.9967V12.9967H21V20.9967C21 21.549 20.5523 21.9967 20 21.9967H4C3.44772 21.9967 3 21.549 3 20.9967Z">
                        </path>
                    </svg>

                    <span>清空历史</span>
                </button>
            </div>

            <!-- 历史记录列表 -->
            <ul class="view-history-list">
                <li class="view-item" v-for="({ id, course, last_viewed_at }, index) in allViewHistory"
                    :key="course.id">
                    <!-- 课程封面 -->
                    <div class="view-cover">
                        <picture>
                            <img :src="course.cover_image" alt="">
                        </picture>

                        <!-- 进度数字 -->
                        <div class="course-learning-progress">
                            <span>1 / 45</span>
                        </div>

                        <!-- 进度条 -->
                        <div class="progress-wrapper">
                            <!-- 进度 -->
                            <div class="progress-bar"></div>
                        </div>
                    </div>

                    <!-- 内容 -->
                    <div class="view-info">
                        <!-- 标题 -->
                        <div class="info-title">
                            <p class="title-text" @click="goToCourse(course.id, course.category)">{{ course.title }}</p>

                            <!-- 删除 -->
                            <svg @click="deleteCourseViewHistoryFun(id, index)" xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24" fill="currentColor">
                                <path
                                    d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM18 8H6V20H18V8ZM9 11H11V17H9V11ZM13 11H15V17H13V11ZM9 4V6H15V4H9Z">
                                </path>
                            </svg>
                        </div>

                        <!-- 浏览时间 -->
                        <span class="view-data"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                fill="currentColor">
                                <path
                                    d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12H4C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C9.25022 4 6.82447 5.38734 5.38451 7.50024L8 7.5V9.5H2V3.5H4L3.99989 5.99918C5.82434 3.57075 8.72873 2 12 2ZM13 7L12.9998 11.585L16.2426 14.8284L14.8284 16.2426L10.9998 12.413L11 7H13Z">
                                </path>
                            </svg> {{ lasterViewDate(last_viewed_at) }}</span>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup lang="ts">
import '../fun.scss'
import { onMounted, ref } from 'vue';

import { useRouter } from 'vue-router';
const router = useRouter()

// 引入土司
import { toast } from '@/components/MyToast/toast';
// 引入确认弹窗
import { useConfirm } from '@/components/MyConfirmDialog';

// 格式化时间工具函数
import formatDate from '@/utils/formatDate';

// 获取api
import { getUserCourseHistory, deleteCourseViewHistory, clearCourseViewHistory } from '@/api/learning';
// 获取全部浏览历史
const getUserCourseHistoryFun = () => {
    getUserCourseHistory(9999).then((res: any) => {
        console.log(res);
        allViewHistory.value = res.results
    }).catch(err => {
        console.log(err);
    })
}

onMounted(() => {
    getUserCourseHistoryFun()
})

// 上次浏览课程的时间
const lasterViewDate = (date: string) => {
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

// 删除课程浏览记录
const deleteCourseViewHistoryFun = (historyID: number, index: number) => {
    deleteCourseViewHistory(historyID).then(() => {
        toast({ message: '删除成功', type: 'success' })

        allViewHistory.value.splice(index, 1)
    }).catch(err => {
        console.log(err);
        toast({ message: '删除失败', type: 'error' })
    })
}

// 清空课程浏览历史
const clearCourseViewHistoryFun = async () => {
    const is = await useConfirm({ message: '是否要清空浏览记录' })

    if (!is) return

    clearCourseViewHistory().then(() => {
        toast({ message: '已清空浏览记录', type: 'success' })

        allViewHistory.value.splice(0, allViewHistory.value.length)
    }).catch(err => {
        console.log(err);
        toast({ message: '清空失败', type: 'error' })
    })
}

// ================= 全局变量 =====================

// 浏览历史
const allViewHistory = ref()

// ================= 全局变量 =====================
</script>

<style scoped lang="scss">
ul {
    list-style: none;
    /* 去掉前面的圆点 */
    margin: 0;
    /* 去掉默认外边距 */
    padding: 0;
    /* 去掉默认内边距 */
}

li {
    list-style: none;
    /* 保险：单独给 li 也去掉 */
}

// 浏览历史容器
.view-history-wrapper {
    width: 100%;

    // 功能栏
    .func-bar {
        display: flex;

        // 功能按钮
        .func-btn-container {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 5px;
            background-color: transparent;
            border: 1px solid var(--border-color-gray-deepest);
            padding: 7px 12px;
            border-radius: 5px;
            cursor: pointer;
            transition: all var(--transition-duration-default);
            margin-bottom: 15px;

            &:hover {
                background-color: var(--primary-color-400);
                border: 1px solid var(--primary-color-100);
                color: var(--text-color-primary-deep);
            }

            svg {
                width: 20px;
                height: 20px;
            }
        }
    }

    // 历史记录列表
    .view-history-list {
        width: 100%;
        padding: 0 20px;
        box-sizing: border-box;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 10px;

        .view-item {
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 5px;

            // 课程封面
            .view-cover {
                width: 100%;
                height: 140px;
                border-radius: 10px;
                position: relative;
                overflow: hidden;

                // 进度信息
                .course-learning-progress {
                    position: absolute;
                    bottom: 0px;
                    left: 0px;
                    display: flex;
                    flex-direction: column;
                    align-items: end;
                    width: 100%;
                    color: white;
                    box-sizing: border-box;
                    padding: 13px 10px 8px;
                    font-size: 14px;
                    background-image: linear-gradient(180deg, rgba(0, 0, 0, 0), rgba(0, 0, 0, .8));
                }

                // 进度条
                .progress-wrapper {
                    position: absolute;
                    width: 100%;
                    bottom: 0;
                    left: 0;
                    height: 3px;
                    background-color: black;

                    .progress-bar {
                        position: absolute;
                        width: 10%;
                        top: 0;
                        left: 0;
                        height: 100%;
                        background-color: var(--primary-color-100);
                        box-shadow: 0 0 3px rgb(0, 255, 0);
                    }
                }

                img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
            }


            // 课程信息
            .view-info {
                width: 100%;
                padding: 10px;
                box-sizing: border-box;
                display: flex;
                flex-direction: column;
                gap: 8px;

                // 标题
                .info-title {
                    display: flex;
                    gap: 10px;

                    .title-text {
                        flex: 1;
                        line-height: 22px;
                        font-weight: bold;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        max-height: 45px; // 固定两行高度
                        -webkit-line-clamp: 2; // 显示两行
                        line-clamp: 2;
                        display: -webkit-box;
                        -webkit-box-orient: vertical;
                        margin: 0;
                        transition: all var(--transition-duration-default);
                        cursor: pointer;

                        &:hover {
                            color: var(--text-color-primary);
                        }
                    }

                    svg {
                        width: 22px;
                        height: 22px;
                        transition: all var(--transition-duration-default);
                        cursor: pointer;

                        &:hover {
                            color: var(--text-color-primary);
                        }
                    }
                }

                // 观看时间
                .view-data {
                    color: var(--text-color-gray-default);
                    font-size: 14px;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    transition: all var(--transition-duration-default);
                    cursor: pointer;

                    &:hover {
                        color: var(--text-color-primary);
                    }

                    svg {
                        width: 18px;
                        height: 18px;
                    }
                }
            }
        }
    }
}

// 没有浏览记录
.no-history {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    height: 200px;
    width: 100%;
}
</style>