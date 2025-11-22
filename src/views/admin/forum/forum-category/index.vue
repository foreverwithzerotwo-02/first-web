<template>
    <div class="forum-category">
        <!-- 标题 -->
        <h2 class="model-title">论坛分类标签</h2>

        <!-- 分类标签列表 -->
        <ul class="category-list">

            <li class="category-list-item" v-for="(value, index) in allForumCategory">
                <!-- 工具 -->
                <ul class="tool-container">
                    <!-- 删除 -->
                    <li class="delete tool-item" @click="deletecCategory(value.id, index)">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path
                                d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM18 8H6V20H18V8ZM9 11H11V17H9V11ZM13 11H15V17H13V11ZM9 4V6H15V4H9Z">
                            </path>
                        </svg>
                    </li>

                    <!-- 修改 -->
                    <li class="edit tool-item" @click="openUpdateDrawer(value, index)">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path
                                d="M6.41421 15.89L16.5563 5.74785L15.1421 4.33363L5 14.4758V15.89H6.41421ZM7.24264 17.89H3V13.6473L14.435 2.21231C14.8256 1.82179 15.4587 1.82179 15.8492 2.21231L18.6777 5.04074C19.0682 5.43126 19.0682 6.06443 18.6777 6.45495L7.24264 17.89ZM3 19.89H21V21.89H3V19.89Z">
                            </path>
                        </svg>
                    </li>
                </ul>

                <!-- 白点装饰 -->
                <span class="white-dot"></span>

                <!-- 分类名称 -->
                <span class="name">{{ value.name }}</span>

                <!-- 时间 -->
                <p class="time">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path
                            d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM13 12H17V14H11V7H13V12Z">
                        </path>
                    </svg>
                    <span>{{ categoryCreateDate(value.created_at) }}</span>
                </p>
            </li>

            <!-- 添加按钮 -->
            <li class="category-list-add" @click="openDrawer('add')">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path
                        d="M11 11V7H13V11H17V13H13V17H11V13H7V11H11ZM12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20Z">
                    </path>
                </svg>
            </li>
        </ul>

        <!-- 新增或更新容器 -->
        <drawer v-model="isOpenAddUpdateDrawer" placement="right" width="400px" title="新增或修改分类">
            <my-form ref="addFormRef" :form="addOrUpdateCategoryFormDate" :rules="addOrUpdateCategoryFormRule"
                label-align="left">
                <my-form-item prop="name" label="分类名称" required>
                    <my-input v-model="addOrUpdateCategoryFormDate.name"></my-input>
                </my-form-item>
                <my-form-item prop="description" label="分类简介">
                    <my-input v-model="addOrUpdateCategoryFormDate.description" type="textarea"></my-input>
                </my-form-item>
                <my-form-item>
                    <my-button :onClick="addOrUpdateCategoryData">提交</my-button>
                </my-form-item>
            </my-form>
        </drawer>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'

// 引入格式化日期工具函数
import formatDate from '@/utils/formatDate'

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

// 引入api
import { addForumCategory, getForumCategories, updateForumCategories, deleteForumCategories } from '@/api/admin/admin_forum'
const getForumCategoriesFun = () => {
    getForumCategories().then(res => {
        allForumCategory.value = res
    }).catch(err => {
        console.log(err);
    })
}

onMounted(() => {
    getForumCategoriesFun()
})

// =================== 全局变量 ======================

// 全部论坛分类
const allForumCategory = ref()

// 分类创建时间
const categoryCreateDate = (date: string) => {
    return formatDate(date, 'yyyy/MM/dd')
}

// =================== 全局变量 ======================

// ---------- 论坛分类变量 ----------

// 新增表单容器
const addFormRef = ref()

// 是否打开抽屉
const isOpenAddUpdateDrawer = ref(false)

// 新增还是修改
const isAddOrUp = ref<'add' | 'update'>('add')

// 存放新增表单数据
const addOrUpdateCategoryFormDate = reactive<{
    name: string,
    description: string
}>({
    name: '',
    description: ''
})

// 存放新增表单验证规则
const addOrUpdateCategoryFormRule = reactive<FormRuleMap>({
    name: [{ required: true, message: '请记录分类名称' }],
})

// 更新数据
let updateCategoryInfo = {
    id: 0,
    index: 0
}

// ---------- 论坛分类变量 ----------

// ====================== 论坛分类函数 ==============================

// 打开抽屉
const openDrawer = (type: 'add' | 'update') => {
    isAddOrUp.value = type
    isOpenAddUpdateDrawer.value = true
}

// 关闭抽屉
const closeDrawer = () => {
    isOpenAddUpdateDrawer.value = false

    addOrUpdateCategoryFormDate.name = ''
    addOrUpdateCategoryFormDate.description = ''

    updateCategoryInfo = {
        id: 0,
        index: 0
    }
}

// 提交表单
const addOrUpdateCategoryData = async () => {
    if (!addFormRef.value) return

    // 判断表单是否符合规则
    const isContinue = await addFormRef.value.validate()
    if (!isContinue) return

    if (isAddOrUp.value === 'add') {
        addForumCategory(addOrUpdateCategoryFormDate).then((res: any) => {
            allForumCategory.value.push({
                id: res.id,
                name: res.name,
                description: res.description,
                created_at: res.created_at,
            })

            toast({ message: '创建分类成功', type: 'success' })

            closeDrawer()
        }).catch((err: any) => {
            console.log(err);

            toast({ message: '创建分类失败，注意名称不能重复', type: 'error' })
        })
    } else if (isAddOrUp.value === 'update') {
        updateForumCategories(updateCategoryInfo.id, addOrUpdateCategoryFormDate).then((res: any) => {
            allForumCategory.value[updateCategoryInfo.index].name = res.name
            allForumCategory.value[updateCategoryInfo.index].description = res.description

            toast({ message: '修改分类成功', type: 'success' })

            closeDrawer()
        }).catch((err: any) => {
            console.log(err);

            toast({ message: '修改分类失败，注意名称不能重复', type: 'error' })
        })
    }
}

// 删除分类
const deletecCategory = async (id: number, index: number) => {
    const is = await useConfirm({ message: '是否要删除该分类' })

    if (!is) return

    deleteForumCategories(id).then(() => {
        toast({ message: '删除成功', type: 'success' })

        allForumCategory.value.splice(index, 1)
    }).catch(err => {
        console.log(err);

        toast({ message: '删除失败，请重试', type: 'error' })
    })
}

// 打开修改分类
const openUpdateDrawer = (value: any, index: number) => {
    updateCategoryInfo.id = value.id
    updateCategoryInfo.index = index

    addOrUpdateCategoryFormDate.description = value.description
    addOrUpdateCategoryFormDate.name = value.name

    isAddOrUp.value = 'update'
    isOpenAddUpdateDrawer.value = true
}

// ====================== 论坛分类函数 ==============================
</script>

<style scoped lang="scss">
ul {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
        list-style: none;
    }
}

.forum-category {
    width: 100%;
    position: relative;

    // 分类标签列表
    .category-list {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        gap: 15px;
        color: var(--text-color-gray-dark);
        box-sizing: border-box;
        padding: 6px 20px;

        // 分类列表项
        .category-list-item {
            position: relative;
            height: 40px;
            padding: 0 20px 0 17px;
            background-color: var(--primary-color-300);
            border-radius: 20px 5px 5px 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            cursor: pointer;
            transition: all var(--transition-duration-default);
            overflow: hidden;

            &:hover {
                transform: scaleX(1.05);
                background-color: var(--primary-color-200);

                .name {
                    color: var(--text-color-primary-deep);
                }

                .tool-container {
                    opacity: 1;
                }
            }

            // 工具栏
            .tool-container {
                opacity: 0;
                position: absolute;
                width: 100%;
                height: 100%;
                background-color: var(--background-color-black-transparent-dark);
                backdrop-filter: blur(1px);
                display: flex;
                align-items: center;
                justify-content: space-around;
                transition: all var(--transition-duration-default);

                .tool-item {
                    width: 28px;
                    height: 28px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    transition: all var(--transition-duration-default);

                    svg {
                        width: 18px;
                        height: 18px;
                    }
                }

                .delete {
                    color: rgb(255, 51, 51);
                    background-color: var(--background-color-gray-dark);

                    &:hover {
                        color: var(--text-color-white-default);
                        background-color: rgb(255, 51, 51);
                    }
                }

                .edit {
                    color: rgb(51, 235, 255);
                    background-color: var(--background-color-black-deep);

                    &:hover {
                        color: var(--text-color-gray-dark);
                        background-color: rgb(51, 235, 255);
                    }
                }
            }

            // 白色圆点
            .white-dot {
                width: 20px;
                height: 20px;
                background-color: white;
                border-radius: 50%;
            }

            // 分类名
            .name {
                transition: all var(--transition-duration-default);
                color: var(--text-color-gray-dark);
                font-size: 15px;
            }

            // 时间
            .time {
                font-size: 13px;
                display: flex;
                align-items: center;
                gap: 2px;
                margin: 0;
                color: var(--text-color-gray-light);

                svg {
                    width: 16px;
                    height: 16px;
                }
            }
        }

        // 添加标签按钮
        .category-list-add {
            background-color: var(--primary-color-300);
            display: flex;
            align-items: center;
            padding: 0 30px;
            border-radius: 20px;
            cursor: pointer;
            transition: all var(--transition-duration-default);

            &:hover {
                transform: scaleX(1.1);
                background-color: var(--primary-color-200);
                color: var(--text-color-primary-deep);
            }

            svg {
                width: 24px;
                height: 24px;
            }
        }
    }
}
</style>