<template>
    <router-view v-if="route.fullPath.includes('all-chapter')"></router-view>

    <div class="admin-study-all-course" v-else>
        <el-table :data="tableData" :row-key="(row: any) => row.id" height="100%" border style="width: 100%" stripe>
            <el-table-column prop="id" label="id" width="50" />
            <el-table-column prop="order" label="order" width="100">
                <template #default="scope">
                    <div class="all-category__order">
                        <CustomNumberInput v-model="scope.row.order" :min="1" :max="tableData.length"
                            @change="(val, oldI: number, type) => changeOrder(val, oldI, type, scope)" />
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="title" label="title" width="180" />
            <el-table-column prop="description" label="description">
                <template #default="scope">
                    {{ scope.row.description || '无' }}
                </template>
            </el-table-column>
            <el-table-column prop="cover_image" label="cover_image">
                <template #default="scope">
                    <div class="admin-study-all-course__cover_image__container">
                        <span @click="clickDisplayCoverImage(scope.row.cover_image)">{{ scope.row.cover_image }}</span>
                        <!-- <button class="admin-study-all-course__button"
                            @click="clickDisplayCoverImage(scope.row.cover_image)">查看</button> -->
                    </div>
                </template>
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
            <el-table-column fixed="right" label="label">
                <template #default="scope">
                    <!-- 查看课程章节按钮 -->
                    <button class="admin-study-all-course__button" @click="clickToChapter(scope.row.id)">查看章节</button>
                    <button class="admin-study-all-course__button" @click="clickModifyCourse(scope.row)">修改</button>
                    <button class="admin-study-all-course__button admin-study-all-course__button--warn"
                        @click="clickDeleteCourse(scope.row.id)">删除</button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 新增课程按钮 -->
        <div class="admin-study-all-course__add" v-if="!isSorting" @click="openAddCourseDrawer"><span>新增课程</span></div>
        <!-- 修改操作按钮 -->
        <div class="all-category__update-btns" v-else>
            <div class="all-category__update-btns__btn" @click="confirmOrder">确认修改</div>
            <div class="all-category__update-btns__btn" @click="cancelOrder">取消修改</div>
        </div>

        <!-- 新增或修改数据抽屉 -->
        <drawer v-model="isOpenAddDrawer" width="500px" placement="right" title="新增课程">
            <my-form ref="myFormRef" labelAlign="left" :form="addCourseFormValue" :rules="addCourseFormRulesValue">
                <my-form-item label="课程名称" required prop="title">
                    <my-input placeholder="请输入课程名称" v-model="addCourseFormValue.title" />
                </my-form-item>
                <my-form-item label="课程简介" prop="description">
                    <my-input type="textarea" placeholder="请输入课程简介" v-model="addCourseFormValue.description" />
                </my-form-item>
                <my-form-item required label="课程分类" prop="category_id">
                    <my-select v-model="addCourseFormValue.category_id">
                        <my-select-item v-for="(i) in allCourseCategory" :label="i.name"
                            :value="i.id + ''"></my-select-item>
                    </my-select>
                </my-form-item>
                <my-form-item label="课程封面" prop="cover_image" required>
                    <upload :onFileChange="addCourseCoverFile" :defaultImageUrl="modifyCourseUploadCoverUrl" />
                </my-form-item>
                <my-form-item>
                    <my-button :onClick="submitAddCourse">提交</my-button>
                </my-form-item>
            </my-form>
        </drawer>

        <!-- 展示图片 -->
        <image-dispaly v-if="isOpenDisplayImageWindow" v-model="isOpenDisplayImageWindow"
            :src="toDispalyImgSrc"></image-dispaly>
    </div>
</template>

<script setup lang="ts" name="admin-study-all-course">
import { ref, onMounted, reactive, watch } from 'vue'

import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()

// 引入抽屉组件
import drawer from '@/components/Drawer/index.vue'

// 引入表单组件
import MyForm from '@/components/MyForm/index.vue'
import type { FormRuleMap } from '@/components/MyForm/type'
import MyFormItem from '@/components/MyForm/MyFormItem/index.vue'
// 引入输入组件
import MyInput from '@/components/MyInput/index.vue'
// 引入上传组件
import Upload from '@/components/Upload/index.vue'
// 引入按钮组件
import MyButton from '@/components/MyButton/index.vue'
// 引入展示图片组件
import ImageDispaly from '@/components/ImageDisplay/index.vue'
// 多选组件
import MySelect from '@/components/MySelect/index.vue'
import MySelectItem from '@/components/MySelect/MySelectItem/index.vue'
// 引入排序数字输入框
import CustomNumberInput from "@/components/MyInputNumber/index.vue";

// 土司
import { toast } from '@/components/MyToast/toast'

// 确认对话框
import { useConfirm } from '@/components/MyConfirmDialog/index'

// ======================================== 引入课程相关 API ========================================

// @ts-ignore 引入 api
import { getAllCourses, addCourse, updateCourse, deleteCourse, getAlllCourseCategorys, updateCourseOrder } from '@/api/admin/admin_learning'
// 获取全部课程数据的 API
const getAllCoursesApi = async () => {
    try {
        const response = await getAllCourses()
        return response
    } catch (error) {
        console.error('获取学习记录失败:', error)
    }
}
// 新增课程的 API
const addCourseApi = async (courseData: any) => {
    try {
        const response = await addCourse(courseData)
        return response
    } catch (error) {
        console.error('新增课程失败:', error)
    }
}
// 修改课程的 API
const updateCourseApi = async (courseData: any) => {
    try {
        const response = await updateCourse(courseData)
        return response
    } catch (error) {
        console.error('新增课程失败:', error)
    }
}
// 获取全部课程分类
const getAllCategoryData = () => {
    getAlllCourseCategorys().then(res => {
        allCourseCategory.value = res.data
    }).catch(err => {
        console.log("获取课程分类失败：", err);
    })
}

// ======================================== 引入课程相关 API ========================================


// ============================================================ 初始化 数据 ============================================================

onMounted(() => {
    // 初始化获取全部课程数据
    getAllCoursesApi().then((res: any) => {
        tableData.value = res || []
        // 备份数据 
        tableDataBackup.value = JSON.parse(JSON.stringify(res || []))
    }).catch(err => {
        console.log('获取失败全部课程数据：', err);
    })

    // 获取全部课程分类
    getAllCategoryData()
})

// 表格数据
let tableData = ref<any[]>([])

// 备份表格数据
let tableDataBackup = ref<any[]>([])

// ============================================================ 初始化 数据 ============================================================


// ============================ 处理全部课程分类 ================================

// 存放全部课程分类
const allCourseCategory = ref([])

// ============================ 处理全部课程分类 ================================


// ====================== 新增课程数据 ======================

// 是否打开新增课程数据抽屉
const isOpenAddDrawer = ref(false)

// 新增课程form容器
const myFormRef = ref()

// 新增课程数据表单
let addCourseFormValue = reactive<{
    title: string
    description: string
    category_id: string
    cover_image: File | null
}>({
    title: '',
    description: '',
    category_id: '',
    cover_image: null
})

// 表单验证规则
const addCourseFormRulesValue: FormRuleMap = reactive({
    title: [
        { required: true, message: '请指定课程名称' }
    ],
    category: [
        { required: true, message: '请指定课程分类' }
    ],
    cover_image: [
        { required: true, message: '封面不能为空' }
    ]
})

// 打开新增课程弹窗
const openAddCourseDrawer = () => {
    // 设置表单模式
    formMode.value = 'add'

    // 先清空值
    addCourseFormValue.title = ''
    addCourseFormValue.description = ''
    addCourseFormValue.category_id = ''
    addCourseFormValue.cover_image = null

    // 打开弹窗
    isOpenAddDrawer.value = true
}

// 课程封面
const addCourseCoverFile = (file: File | null) => {
    addCourseFormValue.cover_image = file
}

// ====================== 新增课程数据 ======================

// ========================================== 新增或修改表单 ================================================

// 当前的表单是修改还是新增
const formMode = ref<'add' | 'edit'>('add')

// 修改课程传入的封面url
let modifyCourseUploadCoverUrl = ref('')

// 要修改的课程id
let modifyCourseId: number | null = null

// 点击修改课程按钮
const clickModifyCourse = (couseInfo: Record<string, any>) => {
    // 设置表单模式
    formMode.value = 'edit'

    // 获取当前id
    modifyCourseId = couseInfo.id

    // 将修改的表值赋值
    modifyCourseUploadCoverUrl.value = couseInfo.cover_image

    addCourseFormValue.title = couseInfo.title

    addCourseFormValue.category_id = couseInfo.category_id + ''

    addCourseFormValue.description = couseInfo.description


    isOpenAddDrawer.value = true
}

// 新增或修改课程数据
const submitAddCourse = async () => {
    // 新增
    if (formMode.value === 'add') {
        // 判断表单验证是否成功
        if (myFormRef.value) {
            const results = await myFormRef.value.validate()

            if (!results) return

            // 整理上传数据
            const formData = new FormData()
            for (const [key, value] of Object.entries(addCourseFormValue)) {
                if (value !== '' && value !== null) {
                    formData.append(key, value)
                }
            }

            addCourseApi(formData).then(() => {
                // 关闭弹窗
                isOpenAddDrawer.value = false

                // 提示
                toast({ message: '添加成功', type: 'success' })

                // 重新获取课程信息
                getAllCoursesApi().then((res: any) => {
                    tableData.value = res || []
                }).catch(err => {
                    console.log('获取失败全部课程数据：', err);
                })
            }).catch(err => {
                console.log(err);
            })
        }
    } else {
        // 修改
        // 判断表单验证是否成功
        if (myFormRef.value) {
            const results = await myFormRef.value.validate()

            if (!results) return

            // 整理上传数据
            const formData = new FormData()
            for (const [key, value] of Object.entries(addCourseFormValue)) {
                if (value !== '' && value !== null) {
                    formData.append(key, value)
                }
            }

            if (!modifyCourseId) return
            formData.append('id', modifyCourseId + '')

            updateCourseApi(formData).then(() => {
                // 关闭弹窗
                isOpenAddDrawer.value = false

                // 提示
                toast({ message: '修改成功', type: 'success' })

                // 重新获取课程信息
                getAllCoursesApi().then((res: any) => {
                    tableData.value = res || []
                }).catch(err => {
                    console.log('获取失败全部课程数据：', err);
                })
            }).catch(err => {
                console.log(err);
            })
        }
    }
}

// ========================================== 新增或修改表单 ================================================

// ============================================== 图片展示弹窗 ==============================================

// 是否打开弹窗
const isOpenDisplayImageWindow = ref(false)

// 要展示的图片src
const toDispalyImgSrc = ref<string | Array<string>>('')

// 展示课程封面
const clickDisplayCoverImage = (src: string) => {
    // 打开弹窗
    isOpenDisplayImageWindow.value = true

    toDispalyImgSrc.value = src
}

// ============================================== 图片展示弹窗 ==============================================

// ==================== 数据表内操作 =====================

// 格式化日期方法
const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(date)
}

// 删除课程数据
const clickDeleteCourse = async (id: number) => {
    await useConfirm({
        message: '是否删除这条数据',
        title: '删除确认'
    }).then(res => {
        if (res) {
            deleteCourse(id).then(() => {
                toast({ message: '刪除成功', type: 'success' })

                // 重新获取课程信息
                getAllCoursesApi().then((res: any) => {
                    tableData.value = res || []
                }).catch(err => {
                    console.log('获取失败全部课程数据：', err);
                })
            }).catch(err => {
                console.log(err);
                toast({ message: '刪除失败', type: 'error' })
            })
        }
    })
}

// 跳转对应课程章节
const clickToChapter = (id: number) => {
    router.push({
        name: 'admin-study-course-all-chapter',
        params: {
            course_id: id
        }
    })
}

// ==================== 数据表内操作 =====================


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
        const toI = tableData.value.findIndex(item => item.order === i)
        // 取出要跳转的值
        const ob = tableData.value.splice(scope.$index, 1)[0]
        // 插入到指定位置
        tableData.value.splice(toI, 0, ob)

        // 重新排序
        for (let index = 0; index < tableData.value.length; index++) {
            tableData.value[index].order = index + 1
        }

        return
    }

    // 获取当前行数据
    let currentRow = tableData.value[scope.$index];
    // 获取跳转到的行数据
    let targetRow = tableData.value.filter(item => item.order === i)[type]
    // 获取跳转到的行索引
    let targetRowIndex = tableData.value.indexOf(targetRow)
    // 暂存
    let c = null

    // 修改排序
    targetRow.order = oldI

    c = targetRow
    tableData.value[targetRowIndex] = currentRow
    tableData.value[scope.$index] = c
}

// 确认修改排序
const confirmOrder = () => {
    const data = tableData.value.map(item => ({
        id: item.id,
        order: item.order
    }))

    updateCourseOrder({ orders: data }).then(() => {
        toast({
            message: '修改排序成功',
            type: 'success'
        })

        getAllCoursesApi().then((res: any) => {
            tableData.value = res || []
            // 备份数据 
            tableDataBackup.value = JSON.parse(JSON.stringify(res || []))
        }).catch(err => {
            console.log('获取失败全部课程数据：', err);
        })

        isSorting.value = false
    }).catch(err => {
        console.log(err);

        toast({
            message: '修改排序失败',
            type: 'error'
        })

        // 还原数据
        tableData.value = JSON.parse(JSON.stringify(tableDataBackup.value))
        isSorting.value = false
    })
}

// 取消修改
const cancelOrder = () => {
    // 还原数据
    tableData.value = JSON.parse(JSON.stringify(tableDataBackup.value))
    isSorting.value = false
}

// ============================== 排序 ===============================
</script>

<style scoped lang="scss">
// 全部课程
.admin-study-all-course {
    height: 100%;
    min-height: 0;
    /* 关键：防止溢出 */
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 20px;

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

    // 图片链接
    .admin-study-all-course__cover_image__container {
        display: flex;
        flex-direction: column;

        span {
            color: var(--text-color-primary);
            text-decoration: underline;
            word-break: break-all;
            transition: color 0.3s;
            cursor: pointer;

            &:hover {
                color: var(--text-color-primary-light);
            }
        }
    }

    // 表格按钮
    .admin-study-all-course__button {
        color: var(--text-color-primary);
        font-weight: bold;
        cursor: pointer;
        border: none;
        transition: all var(--transition-duration-default);
        background-color: transparent;

        &:hover {
            color: var(--text-color-primary-light);
        }

        &:active {
            color: var(--text-color-primary);
        }

        // 紅色
        &--warn {
            color: var(--warn-color-100);

            &:hover {
                color: var(--warn-color-200);
            }

            &:active {
                color: var(--warn-color-100);
            }
        }
    }

    // 添加课程按钮
    .admin-study-all-course__add {
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
</style>