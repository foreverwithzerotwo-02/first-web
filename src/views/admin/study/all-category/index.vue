<template>
    <div class="all-category">
        <el-table :data="categoryList" :row-key="(row: any) => row.id" height="100%" border style="width: 100%" stripe>
            <el-table-column prop="id" label="id" width="50" />
            <el-table-column prop="order" label="order" width="100">
                <template #default="scope">
                    <div class="all-category__order">
                        <CustomNumberInput v-model="scope.row.order" :min="1" :max="categoryList.length"
                            @change="(val, oldI: number, type) => changeOrder(val, oldI, type, scope)" />
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="name" label="name" width="180" />
            <el-table-column prop="description" label="description" />
            <el-table-column prop="created_at" label="created_at">
                <template #default="scope">
                    {{ formatDate(scope.row.created_at) }}
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="label" width="150">
                <template #default="scope">
                    <!-- 查看课程章节按钮 -->
                    <button class="func-table-little-btn" @click="clickUpdateCategory(scope.row)">修改</button>
                    <button class="func-table-little-btn func-table-little-btn--warn"
                        @click="clickDeleteCategory(scope.row.id)">删除</button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 添加课程分类 -->
        <div class="all-category__add" v-if="!isSorting" @click="clickOpenAddCategory"><span>新增课程分类</span></div>
        <!-- 修改操作按钮 -->
        <div class="all-category__update-btns" v-else>
            <div class="all-category__update-btns__btn" @click="confirmOrder">确认修改</div>
            <div class="all-category__update-btns__btn" @click="cancelOrder">取消修改</div>
        </div>

        <!-- 新增或更新容器 -->
        <drawer v-model="isOpenAddUpdateDrawer" placement="right" width="400px" title="新增或修改课程数据">
            <my-form ref="addFormRef" :form="addOrUpdateCategoryFormDate" :rules="addOrUpdateCategoryFormRule"
                label-align="left">
                <my-form-item prop="name" label="分类名称">
                    <my-input v-model="addOrUpdateCategoryFormDate.name"></my-input>
                </my-form-item>
                <my-form-item prop="description" label="分类简介">
                    <my-input v-model="addOrUpdateCategoryFormDate.description" type="textarea"></my-input>
                </my-form-item>
                <my-form-item>
                    <my-button :onClick="addOrUpdateCourseCategoryDate">提交</my-button>
                </my-form-item>
            </my-form>
        </drawer>
    </div>
</template>

<script setup lang="ts" name="allcategory">
import { onMounted, reactive, ref, toRaw } from 'vue';

// 引入抽屉组件
import Drawer from '@/components/Drawer/index.vue'
// 引入表单组件
import MyForm from '@/components/MyForm/index.vue'
import MyFormItem from '@/components/MyForm/MyFormItem/index.vue'
import type { FormRuleMap } from '@/components/MyForm/type'
// 引入输入组件
import MyInput from '@/components/MyInput/index.vue'
// 引入按钮组件
import MyButton from '@/components/MyButton/index.vue'
// 土司
import { toast } from '@/components/MyToast/toast'
// 引入确认框
import { useConfirm } from '@/components/MyConfirmDialog/index'
// 引入排序数字输入框
import CustomNumberInput from "@/components/MyInputNumber/index.vue";

// 引入格式化日期工具
import formatDate from '@/utils/formatDate'

// 课程分类相关api
import { getAlllCourseCategorys, addCourseCategory, updateCourseCategory, deleteCourseCategory, updateCourseCategoryOrder } from '@/api/admin/admin_learning'
// 获取并存放课程分类
const getSaveCourseCategoryList = () => {
    getAlllCourseCategorys().then(res => {
        categoryList.value = res.data
        categoryListBackup.value = JSON.parse(JSON.stringify(res.data))
    }).catch(err => {
        console.log('--- 获取课程分类失败： ---', err);
    })
}

onMounted(() => {
    getSaveCourseCategoryList()
})

// ------------------------------- 全局数据 -------------------------------

// 存放全部分类
const categoryList = ref<Array<{
    id: number,
    name: 'string',
    order: number;
    description: 'string',
    created_at: 'string'
}>>([])

// 备份全部分类
const categoryListBackup = ref<Array<{
    id: number,
    name: 'string',
    order: number;
    description: 'string',
    created_at: 'string'
}>>([])

// ------------------------------- 全局数据 -------------------------------

// ------------- 新增或修改课程分类变量 -------------------

// 新增表单容器
const addFormRef = ref()

// 添加或更新侧边栏是否打开
const isOpenAddUpdateDrawer = ref(false)

// 当前是添加还是修改数据
const addOrUpdate = ref<'add' | 'update'>('add')

// 当前要修改的分类id
let updateCategoryId: null | number = null

// 存放新增表单数据
const addOrUpdateCategoryFormDate = reactive<{
    id?: number,
    name: string,
    description: string
}>({
    name: '',
    description: ''
})

// 存放新增表单验证规则
const addOrUpdateCategoryFormRule = reactive<FormRuleMap>({
    name: [{ required: true, message: '请记录分类名称' }],
    description: [{ required: true, message: '请记录分类简介' }]
})

// ------------- 新增或修改课程分类变量 -------------------
// =============================== 新增或修改课程分类 ================================

// 点击打开新增课程分类
const clickOpenAddCategory = () => {
    cleanAddCategoryData()

    isOpenAddUpdateDrawer.value = true

    addOrUpdate.value = 'add'
}

// 清空新增课程分类
const cleanAddCategoryData = () => {
    addOrUpdateCategoryFormDate.name = ''
    addOrUpdateCategoryFormDate.description = ''

    isOpenAddUpdateDrawer.value = false
}

// 点击修改分类
const clickUpdateCategory = (data: any) => {
    cleanUpdateCategoryData()

    isOpenAddUpdateDrawer.value = true

    addOrUpdate.value = 'update'

    updateCategoryId = data.id
    addOrUpdateCategoryFormDate.name = data.name
    addOrUpdateCategoryFormDate.description = data.description
}

// 清空修改课程分类
const cleanUpdateCategoryData = () => {
    addOrUpdateCategoryFormDate.name = ''
    addOrUpdateCategoryFormDate.description = ''

    isOpenAddUpdateDrawer.value = false

    updateCategoryId = null
}

// 新增或修改课程分类
const addOrUpdateCourseCategoryDate = async () => {
    if (!addFormRef.value) return

    // 判断表单是否符合规则
    const isContinue = await addFormRef.value.validate()
    if (!isContinue) return

    // 新增课程分类数据
    if (addOrUpdate.value === 'add') {
        const data = toRaw(addOrUpdateCategoryFormDate)

        addCourseCategory(data).then(() => {
            toast({
                message: '添加分类成功',
                type: 'success'
            })

            // 重新获取全部分类
            getSaveCourseCategoryList()

            // 清空
            cleanAddCategoryData()
        }).catch(err => {
            console.log(err);

            toast({
                message: '添加分类失败',
                type: 'error'
            })
        })
    } else {
        // 修改
        if (!updateCategoryId) {
            toast({
                message: '不存在分类id',
                type: 'error'
            })
            return
        }
        const data = toRaw(addOrUpdateCategoryFormDate)
        data.id = updateCategoryId

        updateCourseCategory(data as { id: number, name: string, description: string }).then(() => {
            toast({
                message: '修改分类成功',
                type: 'success'
            })

            // 重新获取全部分类
            getSaveCourseCategoryList()

            // 清空
            cleanUpdateCategoryData()
        }).catch(err => {
            console.log(err);

            toast({
                message: '修改分类失败',
                type: 'error'
            })
        })
    }
}

// =============================== 新增或修改课程分类 ================================


// ============================================ 删除课程分类 ====================================================

const clickDeleteCategory = async (id: number) => {
    const is = await useConfirm({
        message: '是否删除此分类'
    })

    if (!is) return

    deleteCourseCategory(id).then(() => {
        toast({
            message: '删除分类成功',
            type: 'success'
        })

        // 重新获取全部分类
        getSaveCourseCategoryList()
    }).catch(err => {
        console.log(err);

        toast({
            message: '删除失败',
            type: 'error'
        })
    })
}

// ============================================ 删除课程分类 ====================================================


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
        const toI = categoryList.value.findIndex(item => item.order === i)
        // 取出要跳转的值
        const ob = categoryList.value.splice(scope.$index, 1)[0]
        // 插入到指定位置
        categoryList.value.splice(toI, 0, ob)

        // 重新排序
        for (let index = 0; index < categoryList.value.length; index++) {
            categoryList.value[index].order = index + 1
        }

        return
    }

    // 获取当前行数据
    let currentRow = categoryList.value[scope.$index];
    // 获取跳转到的行数据
    let targetRow = categoryList.value.filter(item => item.order === i)[type]
    // 获取跳转到的行索引
    let targetRowIndex = categoryList.value.indexOf(targetRow)
    // 暂存
    let c = null

    // 修改排序
    targetRow.order = oldI

    c = targetRow
    categoryList.value[targetRowIndex] = currentRow
    categoryList.value[scope.$index] = c
}

// 确认修改排序
const confirmOrder = () => {
    const data = categoryList.value.map(item => ({
        id: item.id,
        order: item.order
    }))

    updateCourseCategoryOrder({ orders: data }).then(() => {
        toast({
            message: '修改排序成功',
            type: 'success'
        })

        getSaveCourseCategoryList()

        isSorting.value = false
    }).catch(err => {
        console.log(err);

        toast({
            message: '修改排序失败',
            type: 'error'
        })

        // 还原数据
        categoryList.value = JSON.parse(JSON.stringify(categoryListBackup.value))
        isSorting.value = false
    })
}

// 取消修改
const cancelOrder = () => {
    // 还原数据
    categoryList.value = JSON.parse(JSON.stringify(categoryListBackup.value))
    isSorting.value = false
}

// ============================== 排序 ===============================
</script>

<style scoped lang="scss">
.all-category {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    // 排序容器
    .all-category__order {
        display: flex;
        align-items: center;

        // 排序输入框
        .all-category__order__input {
            width: 30px;
            border: none;
            background-color: transparent;
        }

        // 排序按钮容器
        .all-category__order-btns-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 5px;
            margin-left: 10px;
            transform: scale(0.8);

            // 排序操作按钮
            .all-category__order-btn {
                width: 18px;
                height: 18px;
                margin: 0;
                font-size: 12px;
                padding: 0;
                background-color: transparent;
                border: var(--border-color-gray-deepest) solid 1px;
                border-radius: 3px;
                color: var(--text-color-gray-dark);
                cursor: pointer;
                transition: all var(--transition-duration-default);

                &:hover {
                    color: var(--text-color-primary);
                    border: 1px solid var(--primary-color-100);
                }

                &:disabled {
                    cursor: not-allowed;
                    opacity: 0.5;
                }
            }
        }
    }

    // 添加课程按钮
    .all-category__add {
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
        margin-top: 10px;

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
</style>