<template>
    <div class="all-chapter">
        <div v-if="!isEditing" class="all-chapter__table">
            <el-table :data="tableChaptersData" :row-key="(row: any) => row.id" height="100%" border
                style="width: 100%">
                <el-table-column prop="id" label="id" width="50">
                </el-table-column>
                <el-table-column prop="order" label="order" width="100">
                    <template #default="scope">
                        <div class="all-category__order">
                            <CustomNumberInput v-model="scope.row.order" :min="1" :max="tableChaptersData.length"
                                @change="(val, oldI: number, type) => changeOrder(val, oldI, type, scope)" />
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="title" label="章节标题" width="200">
                </el-table-column>
                <el-table-column label="章节内容">
                    <template #default="scope">
                        <button class="func-table-little-btn"
                            @click="clickPreviewChapterContent(scope.row.content)">查看内容</button>
                    </template>
                </el-table-column>
                <el-table-column prop="course_id" label="课程id" width="100">
                </el-table-column>
                <el-table-column prop="course_title" label="课程名称">
                </el-table-column>
                <el-table-column prop="is_published" label="章节状态" :formatter="chapterState">
                </el-table-column>
                <el-table-column prop="created_at" label="created_at">
                    <template #default="scope">
                        {{ formatDate(scope.row.created_at) }}
                    </template>
                </el-table-column>
                <el-table-column prop="updated_at" label="updated_at">
                    <template #default="scope">
                        {{ formatDate(scope.row.updated_at) }}
                    </template>
                </el-table-column>
                ,<el-table-column fixed="right" label="编辑" width="150">
                    <template #default="scope">
                        <button class="func-table-little-btn"
                            @click="clickOpenUpdateEditor(scope.$index, scope.row.id * 1)">修改</button>
                        <button class="func-table-little-btn func-table-little-btn--warn"
                            @click="clickDeleteChapter(scope.row.id)">删除</button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 新增章节按钮 -->
            <div class="all-chapter__table__add" v-if="!isSorting" @click="clickOpenEditorPage"><span>新增章节</span>
            </div>
            <!-- 修改操作按钮 -->
            <div class="all-category__update-btns" v-else>
                <div class="all-category__update-btns__btn" @click="confirmOrder">确认修改</div>
                <div class="all-category__update-btns__btn" @click="cancelOrder">取消修改</div>
            </div>
        </div>

        <!-- 富文本编辑器 -->
        <div class="all-chapter__edite-container" v-else>
            <!-- 顶部 -->
            <div class="all-chapter__edite-container--top">
                <!-- 章节标题 -->
                <div class="all-chapter__edite-container__title">
                    <label class="all-chapter__edite-container__title--label" for="">课程章节：</label>
                    <my-input v-model="currentEditorTitle" placeholder="请输入章节标题"></my-input>
                </div>

                <!-- 按钮 -->
                <div class="all-chapter__edite-container__btn">
                    <my-button @click="clickChapterSubmit">{{ isUpdateEditor ? '修改' :
                        '新增'
                        }}章节</my-button>
                    <my-button @click="clickCloseEditor">退出编辑</my-button>
                </div>
            </div>

            <div class="all-chapter__edite-container__editor"><my-editor v-model="currentEditorContent"
                    :uplode-image-api="uplodeChapterImage"></my-editor>
            </div>
        </div>

        <!-- 预览弹窗 -->
        <my-preview-popover v-if="isOpenChapterContentPreviewPopover" v-model:show="isOpenChapterContentPreviewPopover">
            <my-editor v-model="previewChapterContent" :editable="false"></my-editor>
        </my-preview-popover>
    </div>
</template>

<script setup lang="ts" name="all-chapter">
import { computed, onMounted, ref, onBeforeUnmount } from 'vue'
const handleBeforeUnload = (event: BeforeUnloadEvent) => {
    if (!isEditing) return
    event.preventDefault()
    // @ts-ignore
    event.returnValue = ''
}

import formatDate from '@/utils/formatDate';
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router'
const route = useRoute()
const router = useRouter()
onBeforeRouteLeave((_to, _from, next) => {
    if (!isEditing) return
    const answer = window.confirm('您有未保存的内容，确定要离开吗？')
    if (answer) {
        next()
    } else {
        next(false)
    }
})

// 引入富文本编辑器
import MyEditor from '@/components/MyEditor/index.vue'
// 引入按钮组件
import MyButton from '@/components/MyButton/index.vue'
// 引入输入框组件
import MyInput from '@/components/MyInput/index.vue'
// 引入预览弹窗组件
import MyPreviewPopover from '@/components/MyPreviewPopover/index.vue'
// 引入土司组件
import { toast } from '@/components/MyToast/toast'
// 引入弹窗功能
import { useConfirm } from '@/components/MyConfirmDialog/index'
// 引入排序数字输入框
import CustomNumberInput from "@/components/MyInputNumber/index.vue";

// 引入接口
import { addChapter, getAllChapter, deleteChapter, updateChapter, uploadChapterImage, updateChapterOrder } from '@/api/admin/admin_learning'
// 获取全部章节数据
const getAllChaptersAPI = (course_id: number | string) => {

    getAllChapter(course_id).then((res: any) => {
        tableChaptersData.value = res.all_chapters

        tableChaptersDataBackup.value = JSON.parse(JSON.stringify(res.all_chapters))
    }).catch(err => {
        console.log(err);

        toast({
            message: '获取全部章节失败',
            type: 'error'
        })
    })
}
// 上传章节插图
const uplodeChapterImage = async (image: File) => {
    const formData = new FormData()

    if (!currentChapterId.value) {
        return toast({
            message: '未获取到编辑章节',
            type: 'error'
        })
    }

    formData.append('image', image)
    formData.append('chapter_id', currentChapterId.value + '')

    try {
        const response = await uploadChapterImage(formData) as any

        return response.image_url
    } catch (error) {
        toast({
            message: '图片上传失败',
            type: 'error'
        });
        return null
    }
}

onMounted(() => {
    // ========== 获取全部章节 ==========
    if (courseId.value) {
        getAllChaptersAPI(courseId.value)
    }
    // ========== 获取全部章节 ==========
})

window.addEventListener('beforeunload', function (event) {
    event.preventDefault();
    // 某些浏览器需要显式设置 returnValue
    event.returnValue = '您有未保存的内容，确定要离开吗？';
});

onMounted(() => {
    window.addEventListener('beforeunload', handleBeforeUnload)
})

onBeforeUnmount(() => {
    window.removeEventListener('beforeunload', handleBeforeUnload)
})

// 当前章节状态展示
function chapterState(row: any) {
    return row.is_published ? '发布' : '草稿';
}

// 当前编辑的课程id
const courseId = ref(route.params.course_id as string | number || null)

interface Lesson {
    id: number
    course_id: number
    course_title: string
    title: string
    content: string   // 存储的是 JSON 字符串
    order: number
    is_published: boolean
    created_at: string  // ISO 时间字符串
    updated_at: string  // ISO 时间字符串
}

// 存放全部章节
const tableChaptersData = ref<Lesson[]>([])

// 备份全部章节数据
const tableChaptersDataBackup = ref<Lesson[]>([])

// -------------------- 编辑器功能相关数据 --------------------------

// 是否打开富文本编辑器
const isEditing = ref(false)

// 当前编辑器章节标题
const currentEditorTitle = computed({
    get: () => isUpdateEditor.value ? updateChapterTitleValue.value : newChapterTitle.value,
    set: (val) => {
        if (isUpdateEditor.value) {
            updateChapterTitleValue.value = val
        } else {
            newChapterTitle.value = val
        }
    }
})

// 当前编辑器章节内容
const currentEditorContent = computed({
    get: () => isUpdateEditor.value ? updateChapterContentValue.value : newChapterContent.value,
    set: (val) => {
        if (isUpdateEditor.value) {
            updateChapterContentValue.value = val
        } else {
            newChapterContent.value = val
        }
    }
})

// 当前使用的提交按钮
const clickChapterSubmit = () => {
    if (isUpdateEditor.value) {
        clickUpdateChapter()
    } else {
        clickAddChapter()
    }
}

// 点击退出编辑使用的函数
const clickCloseEditor = () => {
    if (isUpdateEditor.value) {
        cleanUpdateDate()
    } else {
        cleanAddChapterValue()
    }
}

// -------------------- 编辑器功能相关数据 --------------------------

// ============================================= 处理编辑器小页面 ===========================================

// 点击打开编辑器
const clickOpenEditorPage = () => {
    // 打开富文本编辑器
    isEditing.value = true

    // 创建新草稿
    addDraftChapter()
}

// 点击关闭编辑器
const clickCloseEditorPage = () => {
    // 古纳比富文本吗编辑器
    isEditing.value = false
}

// ============================================= 处理编辑器小页面 ===========================================

// -------------- 存放新增章节相关数据 --------------

// 存放新增章节标题
const newChapterTitle = ref('')

// 存放新增章节富文本内容
const newChapterContent = ref('')

// 当前新增编辑的章节id
const currentChapterId = ref<number | null>(null)

// 是否为正式发布(否则为保存为草稿)
let is_add_chapter_published = false

// -------------- 存放新增章节相关数据 --------------

// ================================== 处理新增章节 ========================================

// 清空新增章节相关数据
const cleanAddChapterValue = () => {
    isEditing.value = false
    newChapterTitle.value = ''
    newChapterContent.value = ''
    is_add_chapter_published = false
    currentChapterId.value = null
}

// 初始化创建章节草稿
const addDraftChapter = async () => {
    // 判断是否有课程id
    if (!courseId.value) {
        toast({
            message: '课程id不能为空',
            type: 'error',
        })
        return
    }

    // 判断是否有草稿
    const draftChapter = tableChaptersData.value.find((i: any) => i.is_published === false) as any
    if (draftChapter) {
        const is = await useConfirm({
            'message': '是否继续编辑之前的草稿',
            confirmText: '接着编辑',
            cancelText: '删除掉吧'
        })

        if (is) {
            // 赋值当前编辑章节
            currentChapterId.value = draftChapter.id

            // 不用新建草稿章节
            return
        } else {
            // 删除掉当前草稿章节，继续新建草稿
            deleteChapter([draftChapter.id]).catch(err => {
                console.log(err);

                toast({
                    message: '出了点错误',
                    type: 'error'
                })

                router.go(-1)

                return
            })
        }
    }

    const data = {
        course_id: courseId.value,
        is_published: is_add_chapter_published
    }

    addChapter(data).then((res) => {
        // 重新获取全部章节
        if (courseId.value) {
            getAllChaptersAPI(courseId.value)
        }

        currentChapterId.value = res.data.id
    }).catch(err => {
        console.log(err);

        toast({
            message: '出了点错误',
            type: 'error'
        })

        router.go(-1)

        return
    })
}

// 点击新增章节
const clickAddChapter = () => {
    // 判断是否有章节id
    if (!currentChapterId.value) {
        toast({
            message: '章节id不能为空',
            type: 'error',
        })
        return
    }

    // 判断章节标题和内容是否为空
    if (!newChapterTitle.value || !newChapterContent.value) {
        toast({
            message: '章节标题和内容不能为空',
            type: 'error',
        })
        return
    }

    // 确认发布
    is_add_chapter_published = true

    // 数据
    const data = {
        chapter_id: currentChapterId.value,
        title: newChapterTitle.value,
        content: JSON.stringify(newChapterContent.value),
        is_published: is_add_chapter_published
    }

    // 调用更新章节的接口
    updateChapter(data).then(() => {
        toast({
            message: '新增课程成功',
            type: 'success'
        })

        // 清空数据
        cleanAddChapterValue()

        // 重新获取全部章节
        if (courseId.value) {
            getAllChaptersAPI(courseId.value)
        }
    }).catch(err => {
        console.error(err);
        toast({
            message: err.response.data.message || '新增章节失败',
            type: 'error',
        })
    })
}

// 点击退出新增章节
const clickCloseAddChapterEditor = () => {
    cleanAddChapterValue()
}

// ================================== 处理新增章节 ========================================

// -------- 更新章节数据 ---------

// 是否是更新章节编辑器
const isUpdateEditor = ref(false)

// 更新的章节标题值
const updateChapterTitleValue = ref('')

// 更新的章节内容值
const updateChapterContentValue = ref('')

// 当前修改的章节 id
let updateChapterId: number | null = null

// -------- 更新章节数据 ---------

// ==================================== 处理更新章节 ==========================================

// 点击打开修改章节编辑器
const clickOpenUpdateEditor = (chapter_index: number, chapter_id: number) => {
    if (!(tableChaptersData.value[chapter_index] as any).is_published) {
        toast({
            type: 'error',
            message: '当前为草稿，请点击新建'
        })
        return
    }

    isUpdateEditor.value = true

    // 赋值内容
    updateChapterId = chapter_id
    updateChapterTitleValue.value = (tableChaptersData.value[chapter_index] as any).title as string
    updateChapterContentValue.value = JSON.parse((tableChaptersData.value[chapter_index] as any).content)
    currentChapterId.value = chapter_id

    // 打开编辑器
    isEditing.value = true
}

// 清空更新章节相关数据
const cleanUpdateDate = () => {
    isEditing.value = false
    isUpdateEditor.value = false
    updateChapterTitleValue.value = ''
    updateChapterContentValue.value = ''
    updateChapterId = null
    currentChapterId.value = null
}

// 修改章节内容
const clickUpdateChapter = () => {
    if (!updateChapterId) {
        toast({
            message: '未获取到修改的章节 ID',
            type: 'error'
        })

        return
    }

    // 判断章节标题和内容是否为空
    if (!updateChapterTitleValue.value || !updateChapterContentValue.value) {
        toast({
            message: '章节标题和内容不能为空',
            type: 'error',
        })
        return
    }

    // 修改数据
    const data = {
        title: updateChapterTitleValue.value,
        chapter_id: updateChapterId,
        content: JSON.stringify(updateChapterContentValue.value),
        is_published: true,
    }

    updateChapter(data).then(() => {
        toast({
            message: '修改成功',
            type: 'success'
        })

        // 清空数据
        cleanUpdateDate()

        // 重新获取全部章节
        if (courseId.value) {
            getAllChaptersAPI(courseId.value)
        }
    }).catch(err => {
        console.log(err);

        toast({
            message: err.message || '修改失败',
            type: 'error'
        })
    })
}

// ==================================== 处理更新章节 ==========================================

// ----------- 章节预览相关数据 -------------

// 存放预览内容
const previewChapterContent = ref({})

// 是否打开预览弹窗
const isOpenChapterContentPreviewPopover = ref(false)

// ----------- 章节预览相关数据 -------------

// ======================================== 处理章节内容预览 =================================================

// 点击预览章节内容
const clickPreviewChapterContent = (content: string) => {
    // 打开弹窗
    isOpenChapterContentPreviewPopover.value = true

    // 将文本转为字符串数据
    const jsonContent = JSON.parse(content)

    if (!jsonContent) {
        toast({
            message: '查看章节内容失败',
            type: 'error'
        })
        return
    }

    // 将文本内容赋值给变量
    previewChapterContent.value = jsonContent
}

// ======================================== 处理章节内容预览 =================================================

// -------- 删除章节数据 -----------



// -------- 删除章节数据 -----------

// ============================================= 操作删除章节数据 =======================================================

// 点击删除章节
const clickDeleteChapter = async (chapter_id: number | string) => {
    const isdele = await useConfirm({
        message: '是否删除此章节'
    })

    if (!isdele) return;

    if (typeof (chapter_id) !== 'number') {
        chapter_id = Number(chapter_id)
    }

    deleteChapter([chapter_id]).then(() => {
        toast({
            message: '删除成功',
            type: 'success'
        })

        if (courseId.value) {
            getAllChaptersAPI(courseId.value)
        }
    }).catch(err => {
        console.log(err);

        toast({
            message: '删除失败',
            type: 'error'
        })
    })
}

// ============================================= 操作删除章节数据 =======================================================


// ============================== 排序 ===============================

// 是否正在排序
const isSorting = ref(false)

// 改变时触发
// i：修改到的位置
const changeOrder = (i: number, oldI: number, type: number, scope: any) => {
    isSorting.value = true

    if (type === -1) {
        // 值未改变
        return
    } else if (type === -2) {
        // 跳转位置所在的索引
        const toI = tableChaptersData.value.findIndex(item => item.order === i)
        // 取出要跳转的值
        const ob = tableChaptersData.value.splice(scope.$index, 1)[0]
        // 插入到指定位置
        tableChaptersData.value.splice(toI, 0, ob)

        // 重新排序
        for (let index = 0; index < tableChaptersData.value.length; index++) {
            tableChaptersData.value[index].order = index + 1
        }

        return
    }

    // 获取当前行数据
    let currentRow = tableChaptersData.value[scope.$index];
    // 获取跳转到的行数据
    let targetRow = tableChaptersData.value.filter(item => item.order === i)[type]
    // 获取跳转到的行索引
    let targetRowIndex = tableChaptersData.value.indexOf(targetRow)
    // 暂存
    let c = null

    // 修改排序
    targetRow.order = oldI

    c = targetRow
    tableChaptersData.value[targetRowIndex] = currentRow
    tableChaptersData.value[scope.$index] = c
}

// 确认修改排序
const confirmOrder = () => {
    const data = tableChaptersData.value.map(item => ({
        id: item.id,
        order: item.order
    }))

    updateChapterOrder({ orders: data }).then(() => {
        toast({
            message: '修改排序成功',
            type: 'success'
        })

        // 重新获取全部章节
        if (courseId.value) {
            getAllChaptersAPI(courseId.value)
        }

        isSorting.value = false
    }).catch(err => {
        console.log(err);

        toast({
            message: '修改排序失败',
            type: 'error'
        })

        // 还原数据
        tableChaptersData.value = JSON.parse(JSON.stringify(tableChaptersDataBackup.value))
        isSorting.value = false
    })
}

// 取消修改
const cancelOrder = () => {
    // 还原数据
    tableChaptersData.value = JSON.parse(JSON.stringify(tableChaptersDataBackup.value))
    isSorting.value = false
}

// ============================== 排序 ===============================
</script>

<style scoped lang="scss">
.all-chapter {
    width: 100%;
    height: 100%;

    .all-chapter__table {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        gap: 10px;

        // 强制覆盖所有 hover 行（包括斑马纹）
        :deep(.el-table__body tr:hover)>td,
        :deep(.el-table__body tr:hover) {
            background-color: #e6e6e6 !important;
            transition: all var(--transition-duration-default);
        }

        // 设置斑马纹背景色偶数
        :deep(.el-table__row--striped)>td {
            background-color: #f5f5f5 !important;
        }

        // 修改 el-table 边框颜色
        :deep(.el-table) {
            --el-table-border-color: var(--border-color-gray-default);
            border-radius: 2px;
        }

        // 添加章节按钮
        .all-chapter__table__add {
            width: 100%;
            height: 40px;
            cursor: pointer;
            border: 1px solid var(--border-color-gray-dark);
            border-radius: 5px;
            display: flex;
            justify-content: center;
            align-items: center;
            color: var(--text-color-gray-dark);
            user-select: none;
            transition: all var(--transition-duration-default);
            box-sizing: border-box;

            &:hover {
                border: 1px solid var(--primary-color-100);
                color: var(--text-color-primary);
                background-color: var(--primary-color-300);
                transform: scale(.99);
            }

            &:active {
                color: var(--text-color-primary-light);
                background-color: var(--primary-color-200);
                transform: scale(1);
            }
        }


        // 确认修改操作按钮
        .all-category__update-btns {
            display: flex;
            gap: 20px;
            width: 100%;
            height: 40px;
            margin-top: 10px;

            // 按钮项
            .all-category__update-btns__btn {
                width: 100%;
                height: 100%;
                cursor: pointer;
                border: 1px solid var(--border-color-gray-dark);
                border-radius: 5px;
                display: flex;
                justify-content: center;
                align-items: center;
                color: var(--text-color-gray-dark);
                user-select: none;
                transition: all var(--transition-duration-default);
                box-sizing: border-box;

                &:hover {
                    border: 1px solid var(--primary-color-100);
                    color: var(--text-color-primary);
                    background-color: var(--primary-color-300);
                    transform: scale(.99);
                }

                &:active {
                    color: var(--text-color-primary-light);
                    background-color: var(--primary-color-200);
                    transform: scale(1);
                }
            }
        }
    }

    // 富文本编辑器容器
    .all-chapter__edite-container {
        width: 100%;
        height: 100%;
        gap: 15px;
        display: flex;
        flex-direction: column;

        // 顶部
        .all-chapter__edite-container--top {
            display: flex;
            gap: 20px;

            // 章节标题
            .all-chapter__edite-container__title {
                flex: 1;
                display: flex;
                align-items: center;

                &--label {
                    white-space: nowrap;
                }
            }

            // 按钮
            .all-chapter__edite-container__btn {
                display: flex;
                justify-content: center;
                gap: 10px;
            }
        }

        // 富文本编辑器
        .all-chapter__edite-container__editor {
            flex: 1;
            overflow: hidden;
        }
    }
}
</style>