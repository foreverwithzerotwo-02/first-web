<template>
    <div class="container lesson">
        <!-- 左侧章节目录 -->
        <div class="left-directory">
            <!-- 标题栏 -->
            <div class="directory-title">
                <div class="directory-title__return" @click="returnCourseChoose">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        stroke-linecap="round" stroke-linejoin="round">
                        <!-- 横线 -->
                        <line x1="20" y1="12" x2="6" y2="12" />
                        <!-- 箭头 -->
                        <polyline points="12 6 6 12 12 18" />
                    </svg>
                    返回课程
                </div>
            </div>

            <!-- 章节列表 -->
            <div class="directory-list">
                <!-- 章节项 -->
                <div class="directory-list__item" v-for="value in allChapters" :key="value.id"
                    :class="{ 'directory-list__item--active': Number(chapter_id) === value.id }"
                    @click="selectChapter(value.id)">
                    {{ value.title }}
                </div>
            </div>
        </div>

        <!-- 章节内容展示 -->
        <div class="lesson-main">
            <div class="previous-next-link">
                <div class="previous-next-link__item previous" v-if="!(currentChapterIndex <= 0)"
                    @click="selectChapter(allChapters[currentChapterIndex - 1]?.id)">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        stroke-linecap="round" stroke-linejoin="round">
                        <!-- 横线 -->
                        <line x1="20" y1="12" x2="6" y2="12" />
                        <!-- 箭头 -->
                        <polyline points="12 6 6 12 12 18" />
                    </svg>

                    {{ allChapters[currentChapterIndex - 1]?.title || '' }}
                </div>
                <div class="previous-next-link__item next" v-if="!(currentChapterIndex >= allChapters.length - 1)"
                    @click="selectChapter(allChapters[currentChapterIndex + 1]?.id)">
                    {{ allChapters[currentChapterIndex + 1]?.title || '' }}

                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        stroke-linecap="round" stroke-linejoin="round">
                        <!-- 横线 -->
                        <line x1="4" y1="12" x2="18" y2="12" />
                        <!-- 箭头 -->
                        <polyline points="12 6 18 12 12 18" />
                    </svg>
                </div>
            </div>

            <my-editor v-model="currentDisplayChapter" :editable="false" @update:toc="getEditorToc"></my-editor>

            <div class="previous-next-link">
                <div class="previous-next-link__item previous" v-if="!(currentChapterIndex <= 0)"
                    @click="selectChapter(allChapters[currentChapterIndex - 1]?.id)">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        stroke-linecap="round" stroke-linejoin="round">
                        <!-- 横线 -->
                        <line x1="20" y1="12" x2="6" y2="12" />
                        <!-- 箭头 -->
                        <polyline points="12 6 6 12 12 18" />
                    </svg>

                    {{ allChapters[currentChapterIndex - 1]?.title || '' }}
                </div>
                <div class="previous-next-link__item next" v-if="!(currentChapterIndex >= allChapters.length - 1)"
                    @click="selectChapter(allChapters[currentChapterIndex + 1]?.id)">
                    {{ allChapters[currentChapterIndex + 1]?.title || '' }}

                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        stroke-linecap="round" stroke-linejoin="round">
                        <!-- 横线 -->
                        <line x1="4" y1="12" x2="18" y2="12" />
                        <!-- 箭头 -->
                        <polyline points="12 6 18 12 12 18" />
                    </svg>
                </div>
            </div>
        </div>

        <!--右侧章节目录 -->
        <div class="right-toc" v-show="editorToc.length > 0">
            <toc :toc="editorToc"></toc>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router';
const router = useRouter()

const props = defineProps<{
    id: string  // 课程 id
    chapter_id: string,
    category_id: string
}>()

// 引入编辑器组件展示内容
import MyEditor from '@/components/MyEditor/index.vue'
// 引入目录组件
import Toc from '@/components/Toc/index.vue'

// 引入api
import { getPublishedChapterByCourse, recordCourseView } from '@/api/learning'
// 获取全部章节以及对应课程信息
const getPublishedChapterByCourseFun = (id: string) => {
    getPublishedChapterByCourse(id).then((res: any) => {
        courseInfo.value = res.course
        allChapters.value = res.chapters
    }).catch(err => {
        console.log(err);
    })
}

onMounted(() => {
    // 获取全部章节以及对应课程信息
    getPublishedChapterByCourseFun(props.id)

    // 记录课程浏览
    recordCourseView(props.id)
})

// ========================== 全局变量 ==========================

// 当前选中的章节在数组的索引
const currentChapterIndex = computed(() => {
    return allChapters.value.findIndex(item => item.id === Number(props.chapter_id))
})

// 存放对应课程信息
const courseInfo = ref<any>({})

// 存放全部章节数据
const allChapters = ref<any[]>([])

// 存放当前展示的章节
const currentDisplayChapter = computed<JSON | string>(() => {
    const list = allChapters.value
    if (!list?.length) return ''                    // 数据还没回来

    const id = Number(props.chapter_id)
    const v = list.find(item => item.id === id) ?? list[0]  // 找不到时用第一个

    return JSON.parse(v?.content) ?? ''
})

// ========================== 全局变量 ==========================

// ========================================================== 左侧导航目录 ==================================================================

// 返回选中课程
const returnCourseChoose = () => {
    router.push({
        name: 'study-course-intro',
        params: {
            id: props.id,
            category_id: props.category_id
        }
    })
}

// ========================================================== 左侧导航目录 ==================================================================

// ============================================= 章节目录 =============================================

// 存放编辑器目录
const editorToc = ref([])

// 选择章节
const selectChapter = (chapter_id: number) => {
    router.push({
        name: 'study-course-lesson',
        params: {
            id: props.id,
            chapter_id
        }
    }).then(() => {
        // 跳转完成后拉回顶部
        window.scrollTo(0, 0)
    })
}

// 获取编辑器章节目录
const getEditorToc = (value: []) => {
    editorToc.value = value
}

// ============================================= 章节目录 =============================================
</script>

<style scoped lang="scss">
.lesson {
    display: flex;
    position: relative;

    /* 左侧章节目录 */
    .left-directory {
        position: sticky;
        top: 0px;
        width: 240px;
        height: 100vh;
        background-color: var(--primary-color-600);
        box-shadow: 0 2px 15px var(--background-color-gray-transparent-light);
        // border: 1px solid var(--primary-color-100);
        border-radius: 10px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        overflow-y: auto;

        // 标题栏
        .directory-title {
            height: 45px;
            background-color: var(--primary-color-300);
            display: flex;
            align-items: center;
            padding: 0 10px;
            flex-shrink: 0;

            // 返回课程
            .directory-title__return {
                height: 100%;
                display: flex;
                align-items: center;
                gap: 6px;
                font-weight: bold;
                cursor: pointer;
                font-size: 15px;
                color: var(--text-color-gray-dark);
                transition: all var(--transition-duration-default);

                &:hover {
                    color: var(--text-color-primary-deep);
                }

                svg {
                    width: 20px;
                    height: 20px;
                    stroke-width: 3px;
                }
            }
        }

        // 章节列表
        .directory-list {
            flex: 1;

            // 章节项
            .directory-list__item {
                flex-shrink: 0;
                font-size: 14px;
                padding: 14px 12px;
                cursor: pointer;
                transition: all var(--transition-duration-default) ease;
                color: var(--text-color-gray-dark);

                &:hover {
                    background-color: var(--primary-color-400);
                }
            }

            // 选中状态
            .directory-list__item--active {
                background-color: var(--primary-color-400);
                font-weight: bold;
                color: var(--text-color-primary-deep);
            }
        }
    }

    // 章节内容展示
    .lesson-main {
        flex: 1;
        margin-left: 15px;
        margin-right: 10px;

        // 向前后跳转章节
        .previous-next-link {
            display: flex;
            padding: 10px 15px;
            box-sizing: border-box;
            border-radius: 10px;
            background-color: var(--primary-color-600);
            box-shadow: 0 0 10px var(--background-color-gray-transparent);
            transition: var(--transition-duration-default);
            user-select: none;

            &:hover {
                box-shadow: 0 0 10px var(--background-color-gray-transparent-dark);
            }

            .previous-next-link__item {
                display: flex;
                align-items: center;
                gap: 6px;
                color: var(--text-color-gray-default);
                cursor: pointer;
                transition: var(--transition-duration-default);

                &:hover {
                    color: var(--text-color-primary-light);
                }

                svg {
                    width: 22px;
                    height: 22px;
                    stroke-width: 3px;
                }
            }

            // .previous-next-link__item.previous {}

            .previous-next-link__item.next {
                margin-left: auto;
                /* 把右边推到最右 */
            }
        }
    }

    // 右侧章节目录
    .right-toc {
        width: 240px;
        position: sticky;
        padding: 10px;
        box-sizing: border-box;
        top: 0px;
        height: 100vh;
        /* 超出时可以滚动 */
        overflow-y: auto;
    }
}
</style>