<template>
    <div class="container study">
        <!-- 区域介绍 -->
        <div class="study__region-intro">
            <el-carousel :interval="5000" :duration="0.8">
                <el-carousel-item class="intro-item" v-for="value in sliderRegionIntroArr">
                    <div class="intro-container left-text-intro">
                        <!-- 正标题 -->
                        <div class="main-title">{{ value.mainTitle }}</div>
                        <!-- 副标题 -->
                        <div class="sub-title">{{ value.subTitle }}</div>
                        <!-- 简介 -->
                        <div class="desc">{{ value.desc }}</div>
                        <!-- 行动按钮 -->
                        <div class="action-btn">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
                                <!-- 横线 -->
                                <line x1="24" y1="12" x2="6" y2="12" />
                                <!-- 箭头 -->
                                <polyline points="12 6 6 12 12 18" />
                            </svg>
                            {{ value.btnTitle }}
                        </div>
                    </div>
                    <div class="intro-container right-img-intro">
                        <img :src="value.img" alt="">
                    </div>
                </el-carousel-item>
            </el-carousel>
        </div>

        <!-- 精选课程区域 -->
        <div class="study__region-selected-course">
            <!-- 模块标题 -->
            <div class="modular-title">精选课程</div>

            <!-- 课程展示 -->
            <div class="rsc__course-show">
                <!-- 每个卡片项 -->
                <div class="rsc__course-show__card" v-for="v in popularCourses" :key="v.id"
                    @click="goToCourseIntrro(v.id)">
                    <!-- 课程封面 -->
                    <div class="rsc__course-show__card__cover">
                        <img class="" :src="v.cover_image">

                        <!-- 课程分类标签 -->
                        <div class="rsc__course-show__card__cover__tag">{{ v.category_name }}</div>
                    </div>

                    <!-- 课程信息 -->
                    <div class="rsc__course-show__card__info">
                        <!-- 课程标题 -->
                        <div class="rsc__course-show__card__info__title">{{ v.title }}</div>

                        <!-- 课程简介 -->
                        <div class="rsc__course-show__card__info__desc">{{ v.description }}</div>

                        <!-- 课程评分 -->
                        <el-rate :model-value="Number(v.rating)" disabled show-score size="large"
                            class="rate-left-score" text-color="#ff9900"
                            :score-template="'{value} 分' + ` （ ${v.rating_count} 人 ）`" />

                        <!-- 标签 -->
                        <div class="rsc__course-show__card__info__tag">
                            <!-- 热门标签 -->
                            <p class="tag-item"><span>🔥</span><span>热门课程</span></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 热门课程介绍 -->


        <!-- 全部课程模块 -->
        <div class="study__all-course">
            <!-- 模块标题 -->
            <div class="modular-title">全部课程</div>

            <!-- 类型选择 -->
            <div class="study__all-course__course-style">
                <!-- 底部滑块 -->
                <div class="study__all-course__course-style__bottom-slide" :style="categorySliderStyle"></div>

                <!-- 课程分类项 -->
                <div class="study__all-course__course-style__item"
                    :class="{ 'study__all-course__course-style__item-active': currentCourseCategoryIndex === i }"
                    v-for="(v, i) in allCourseCategorys" :key="i" ref="courseCategoryRefs"
                    @click="setCurrentCourseCategoryIndex(i)">
                    {{ v.name }}
                </div>
            </div>

            <!-- 课程展示 -->
            <div class="study__all-course__course-style__course-list">
                <!-- 每个卡片项 -->
                <div class="study__all-course__course-style__course-list__card" v-for="v in allCourses" :key="v.id"
                    @click="goToCourseIntrro(v.id)">
                    <!-- 课程封面 -->
                    <img class="study__all-course__course-style__course-list__card__cover" :src="v.cover_image">

                    <!-- 课程信息 -->
                    <div class="study__all-course__course-style__course-list__card__info">
                        <!-- 课程标题 -->
                        <div class="study__all-course__course-style__course-list__card__info__title">{{ v.title }}</div>

                        <!-- 课程简介 -->
                        <div class="study__all-course__course-style__course-list__card__info__desc">{{ v.description }}
                        </div>

                        <!-- 课程评分 -->
                        <el-rate :model-value="Number(v.rating)" disabled show-score size="large"
                            class="rate-left-score" text-color="#ff9900"
                            :score-template="'{value} 分' + ` （ ${v.rating_count} 人 ）`" />

                        <!-- 标签 -->
                        <div class="study__all-course__course-style__course-list__card__info__tag">
                            <!-- 热门标签 -->
                            <p class="tag-item" v-if="v.rating_count > 100"><span>🔥</span><span>热门课程</span></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, nextTick } from "vue";
import { useRouter } from 'vue-router'
const router = useRouter()

// 引入图片
import personImg from '@/assets/study/person_study_of_computed.png'
import frontImg from '@/assets/study/front.png'
import shujufenxiImg from '@/assets/study/shujufenxi.png'

// 引入 api 接口
import { getAlllCourseCategorys, getAlllCourseByCagegory } from '@/api/admin/admin_learning'
// 获取全部课程分类
const getAlllCourseCategorysFun = () => {
    getAlllCourseCategorys().then(async res => {
        allCourseCategorys.value = res.data

        await nextTick()

        // 初始化全部课程分类滑块位置
        updateCourseCategorySlider()
    }).catch(err => {
        console.log(err);
    })
}
// 通过课程分类获取全部课程
const getAlllCourseByCagegoryFun = (categoryId: number) => {
    getAlllCourseByCagegory({ id: categoryId }).then((res: any) => {
        allCourses.value = res.courses
    }).catch(err => {
        console.log(err);
    })
}

// 引入api接口
import { getAllPopularCourse } from '@/api/learning'
// 获取最受欢迎课程
const getAllPopularCourseFun = () => {
    getAllPopularCourse().then((res: any) => {
        console.log(res);

        popularCourses.value = res
    }).catch(err => {
        console.log(err);
    })
}

onMounted(async () => {
    // 获取全部课程分类
    getAlllCourseCategorysFun()

    // 获取最受欢迎课程
    getAllPopularCourseFun()
})

// ============================================= 全局变量 =============================================

// 存放全部课程分类数据
const allCourseCategorys = ref<any[]>([])

// 存放全部课程数据
const allCourses = ref<any[]>([])

// 当前课程分类id
const currentCategoryId = ref(0)

// 最受欢迎课程数据
const popularCourses = ref<any[]>([])

// ============================================= 全局变量 =============================================


// ============================================================= 轮播图区域介绍 ===================================================================

// 存放全部内容数组
const sliderRegionIntroArr = ref([
    {
        mainTitle: '开启你的学习之旅',
        subTitle: '为学习者提供参考资料，帮助你从零到实战',
        desc: '从前端到人工智能，希望打造一个开放的学习空间，让所有人都能自由探索知识',
        btnTitle: '开始探索吧',
        img: personImg
    },
    {
        mainTitle: '学习前端开发',
        subTitle: '从零开始搭建属于你的网站和应用',
        desc: '学习 HTML、CSS、JavaScript 等核心技术，掌握网页开发的基础能力。通过实战练习，你将能独立完成网站界面设计和交互效果，实现从静态页面到动态应用的进阶',
        btnTitle: '开始探索吧',
        img: frontImg
    },
    {
        mainTitle: '学习数据分析',
        subTitle: '从数据中发现价值，驱动更聪明的决策',
        desc: '掌握数据清洗、可视化和建模等技能，学习使用 Python、Pandas、Excel 等工具分析数据。通过数据，你将学会发现趋势、解决问题，并支持科学决策',
        btnTitle: '开始探索吧',
        img: shujufenxiImg
    },
])

// ============================================================= 轮播图区域介绍 ===================================================================


// =================== 全部课程分类模块 ===================

// 当前选中的课程分类索引
const currentCourseCategoryIndex = ref(0)

// 全部课程分类选项
const courseCategoryRefs = ref<HTMLElement[]>([])

// 存放滑块样式
const categorySliderStyle = reactive({
    width: '0px',
    left: '0px',
})

// 设置当前选中的课程分类索引
const setCurrentCourseCategoryIndex = (index: number) => {
    currentCourseCategoryIndex.value = index
    updateCourseCategorySlider()
}

// 更新当前选中的课程分类
const updateCourseCategorySlider = () => {
    const el = courseCategoryRefs.value[currentCourseCategoryIndex.value]

    currentCategoryId.value = allCourseCategorys.value[currentCourseCategoryIndex.value].id

    if (el) {
        categorySliderStyle.width = `${el.offsetWidth}px`
        categorySliderStyle.left = `${el.offsetLeft}px`
    }

    // 获取对应分类的全部课程
    getAlllCourseByCagegoryFun(allCourseCategorys.value[currentCourseCategoryIndex.value].id)
}

// 跳转到对应课程介绍
const goToCourseIntrro = (id: number) => {
    router.push({
        name: 'study-course-intro',
        params: {
            id,
            category_id: currentCategoryId.value
        }
    })
}

// =================== 全部课程分类模块 ===================
</script>

<style scoped lang="scss">
.study {
    width: 100%;

    // 每个模块标题部分
    .modular-title {
        font-size: 23px;
        font-weight: bold;
        margin-bottom: 15px;
    }

    // 区域介绍
    .study__region-intro {
        user-select: none;
        width: 100%;
        height: 60vh;
        background-color: var(--primary-color-400);
        // background-color: rgb(206, 206, 206);
        // background-image:url('../../../../static/study/person_study_of_computed.png');

        // 每一项
        .intro-item {
            display: flex;
            align-items: center;
            height: 100%;

            .intro-container {
                width: 50%;
                height: 100%;
                padding: 40px 80px;
                box-sizing: border-box;
            }

            // 左侧文字介绍
            .left-text-intro {
                display: flex;
                flex-direction: column;
                justify-content: center;
                gap: 20px;
                padding-right: 50px;

                // 正标题
                .main-title {
                    font-size: 40px;
                    line-height: 1.2;
                    font-weight: bold;
                }

                // 副标题
                .sub-title {
                    font-size: 22px;
                    line-height: 1.4;
                    font-weight: bold;
                }

                // 简介
                .desc {
                    font-size: 16px;
                    line-height: 1.4;
                }

                // 行动按钮
                .action-btn {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    transition: all var(--transition-duration-default);
                    cursor: pointer;
                    margin-top: 40px;

                    &:hover {
                        color: var(--text-color-primary-light);
                    }

                    svg {
                        width: 20px;
                        height: 20px;
                        stroke-width: 2px;
                    }
                }
            }

            // 右侧图片
            .right-img-intro {

                img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    border-radius: 10px;
                }
            }
        }

        .el-carousel {
            height: 100%;
        }

        /* 修改指示器未激活时的颜色 */
        .el-carousel__button {
            background-color: #bbb !important;
        }

        /* 修改指示器激活时的颜色 */
        .el-carousel__indicator.is-active .el-carousel__button {
            background-color: #ff4d4f !important;
        }
    }

    // 精选课程区域
    .study__region-selected-course {
        display: flex;
        flex-direction: column;
        width: 100%;

        // 课程展示
        .rsc__course-show {
            width: 100%;
            display: flex;
            gap: 20px;

            // 课程项
            .rsc__course-show__card {
                flex: 1;
                cursor: pointer;

                &:hover {
                    .rsc__course-show__card__info {
                        .rsc__course-show__card__info__title {
                            color: var(--text-color-primary-deep);
                        }

                        // 课程简介
                        .rsc__course-show__card__info__desc {
                            color: var(--text-color-primary-deep);
                        }
                    }

                    // 课程封面
                    .rsc__course-show__card__cover {

                        img {
                            transform: scale(1.2);
                        }

                        // 分类标签
                        .rsc__course-show__card__cover__tag {
                            opacity: .9;
                            backdrop-filter: blur(2px);
                        }
                    }
                }

                // 课程封面
                .rsc__course-show__card__cover {
                    position: relative;
                    width: 100%;
                    height: 150px;
                    margin-bottom: 10px;
                    overflow: hidden;

                    img {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                        border-radius: 8px;
                        transition: all var(--transition-duration-default);
                    }

                    // 分类标签
                    .rsc__course-show__card__cover__tag {
                        position: absolute;
                        top: 5px;
                        left: 5px;
                        padding: 4px 13px;
                        opacity: 0;
                        border-radius: 5px;
                        font-size: 12px;
                        background-color: var(--primary-color-300);
                        border: 1px solid var(--primary-color-100);
                        box-shadow: 0 0 10px var(--background-color-black-transparent-light);
                        transition: all var(--transition-duration-default);
                    }
                }

                // 课程信息
                .rsc__course-show__card__info {
                    display: flex;
                    flex-direction: column;

                    // 课程标题
                    .rsc__course-show__card__info__title {
                        font-weight: bold;
                        font-size: 17px;
                        transition: all var(--transition-duration-default);
                        display: -webkit-box;
                        line-clamp: 1;
                        -webkit-line-clamp: 1; // 显示四行
                        -webkit-box-orient: vertical;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        margin-bottom: 6px;
                    }

                    // 课程简介
                    .rsc__course-show__card__info__desc {
                        font-size: 14px;
                        line-height: 18px;
                        display: -webkit-box;
                        line-clamp: 4;
                        -webkit-line-clamp: 4; // 显示四行
                        -webkit-box-orient: vertical;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        transition: all var(--transition-duration-default);
                    }

                    // 课程标签
                    .rsc__course-show__card__info__tag {
                        display: flex;

                        .tag-item {
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

    // 全部课程模块
    .study__all-course {
        width: 100%;

        // 课程类型选择
        .study__all-course__course-style {
            position: relative;
            width: 100%;
            display: flex;
            gap: 15px;
            border-bottom: 1px solid var(--background-color-black-deep);
            padding-bottom: 10px;
            padding-top: 8px;
            user-select: none;
            margin-bottom: 15px;
            font-size: 18px;

            // 底部滑块
            .study__all-course__course-style__bottom-slide {
                position: absolute;
                bottom: 0;
                left: 0;
                width: 60px;
                height: 1px;
                border-radius: 2px;
                background-color: var(--background-color-black-deepest);
                transition: all var(--transition-duration-default) ease;
            }

            // 全部课程分类项
            .study__all-course__course-style__item {
                position: relative;
                color: var(--text-color-gray-default);
                cursor: pointer;
                transition: all var(--transition-duration-default) ease;

                &-active {
                    font-weight: bold;
                    color: var(--text-color-gray-drak);
                }
            }
        }

        // 课程列表
        .study__all-course__course-style__course-list {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
            gap: 20px;

            // 卡片项
            .study__all-course__course-style__course-list__card {
                // background: var(--background-color-gray-light);
                border-radius: 8px;
                box-shadow: 0 0 10px var(--background-color-black-transparent-light);
                transition: all var(--transition-duration-default) ease;
                cursor: pointer;

                &:hover {
                    transform: translateY(-2px) scale(1.02);

                    .study__all-course__course-style__course-list__card__cover {
                        filter: brightness(80%);
                        /* 50% 越小越暗 */
                    }
                }

                // 封面图片
                &__cover {
                    width: 100%;
                    height: 160px;
                    object-fit: cover;
                    border-radius: 8px;
                    box-shadow: 0 0 10px var(--background-color-gray-transparent-light);
                    transition: all var(--transition-duration-default) ease;
                }

                // 课程信息
                .study__all-course__course-style__course-list__card__info {
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