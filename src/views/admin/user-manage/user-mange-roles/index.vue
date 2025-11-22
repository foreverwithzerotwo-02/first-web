<template>
    <div class="user-manage-roles">
        <!-- 顶部区域 -->
        <div class="user-manage-roles__top-region">
            <!-- 标题 -->
            <h2 class="umr__tr__title">角色管理</h2>

            <!-- 搜索框和新增按钮 -->
            <div class="umr__tr__actions">
                <!-- 搜索框 -->
                <div class="umr__tr__search">
                    <el-input v-model="searchKeyword" placeholder="搜索角色名称" clearable @input="handleSearch"
                        @clear="handleSearch" class="umr__tr__search-input">
                        <template #prefix>
                            <el-icon>

                                <Search />

                            </el-icon>
                        </template>
                    </el-input>
                </div>

                <!-- 新增角色按钮 -->
                <el-button type="primary" @click="openAddRoleDrawer" class="umr__tr__add-btn">
                    <el-icon style="margin-right: 4px">

                        <Plus />

                    </el-icon>
                    新增角色
                </el-button>
            </div>
        </div>

        <!-- 角色列表表格内容区域 -->
        <div class="user-manage-roles__main-table">
            <el-table :data="roleList" border style="width: 100%; height: 100%;" stripe v-loading="loading"
                element-loading-text="加载中..." @sort-change="handleSortChange">
                <el-table-column prop="id" label="ID" width="80" align="center" sortable />
                <el-table-column prop="name" label="角色名称" min-width="200" sortable />
                <el-table-column prop="permissions" label="拥有的权限" min-width="300">
                    <template #default="scope">
                        <el-tag v-for="permission in scope.row.permissions" :key="permission.id" class="permission-tag"
                            size="small">
                            {{ permission.name || permission.codename }}
                        </el-tag>
                        <span v-if="!scope.row.permissions || scope.row.permissions.length === 0"
                            class="no-permissions">暂无权限</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center" fixed="right">
                    <template #default="scope">
                        <el-button link type="primary" size="small" @click="openEditRoleDrawer(scope.row)">
                            编辑
                        </el-button>
                        <el-button link type="danger" size="small" @click="handleDeleteRole(scope.row)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!-- 分页 -->
        <!-- <div class="user-manage-roles__pagination">
  <el-pagination v-model:current-page="pagination.page" v-model:page-size="pagination.pageSize"
  :page-sizes="[10, 20, 50, 100]" :total="pagination.total"
  layout="total, sizes, prev, pager, next, jumper" background @size-change="handleSizeChange"
  @current-change="handlePageChange" class="umr__pagination" />
  </div> -->

        <!-- 新增或编辑角色抽屉 -->
        <drawer v-model="isOpenRoleDrawer" :width="drawerWidth" placement="right" :title="drawerTitle">
            <my-form ref="roleFormRef" :form="roleFormData" :rules="roleFormRules" label-align="left">
                <my-form-item prop="name" label="角色名称" required>
                    <el-input v-model="roleFormData.name" placeholder="请输入角色名称（最多50个字符）" :maxlength="50" show-word-limit
                        clearable></el-input>
                </my-form-item>
                <my-form-item prop="permissions" label="拥有的权限">
                    <div class="permissions-container">
                        <el-checkbox-group v-model="roleFormData.permissionIds" class="permissions-group">
                            <el-checkbox v-for="permission in allPermissions" :key="permission.id"
                                :value="permission.code" class="permission-checkbox">
                                {{ permission.name }}
                            </el-checkbox>
                        </el-checkbox-group>
                        <div v-if="!allPermissions || allPermissions.length === 0" class="no-permissions-tip">
                            暂无权限选项
                        </div>
                    </div>
                </my-form-item>
                <my-form-item>
                    <el-button type="primary" @click="handleSubmitRole" class="submit-btn">提交</el-button>
                    <el-button @click="closeRoleDrawer" class="cancel-btn">取消</el-button>
                </my-form-item>
            </my-form>
        </drawer>
    </div>
</template>

<script setup lang="ts">
// 引入提示
import { toast } from '@/components/MyToast/toast'

// 引入api
import { list_roles, get_all_permissions, created_role, update_role, delete_role } from '@/api/user'

// 引入确认框
import { useConfirm } from '@/components/MyConfirmDialog/index'

// 引入抽屉组件
import Drawer from '@/components/Drawer/index.vue'

// 引入表单组件
import MyForm from '@/components/MyForm/index.vue'
import MyFormItem from '@/components/MyForm/MyFormItem/index.vue'
import type { FormRuleMap } from '@/components/MyForm/type'

import { onMounted, ref, computed, reactive } from 'vue';
import { Search, Plus } from '@element-plus/icons-vue';

// =================== 全局变量 ======================

// 角色列表数据
const roleList = ref<any[]>([])

// 所有权限列表（用于权限选择）
const allPermissions = ref<any[]>([])

// 搜索关键词
const searchKeyword = ref('')

// 加载状态
const loading = ref(false)

// 分页参数
const pagination = ref({
    page: 1,
    pageSize: 10,
    total: 0
})

// 搜索防抖定时器
let searchTimer: ReturnType<typeof setTimeout> | null = null

// =================== 角色列表相关 ======================

// 获取用户角色列表
const fetchUserRoles = async (keyword?: string) => {
    const res: any = await list_roles(keyword)

    roleList.value = res || []
}

// 获取全部权限信息
const fetchPermissions = async () => {
    const res: any = await get_all_permissions()
    console.log(res);


    allPermissions.value = res
}

// 获取角色列表
const fetchRoleList = async (resetPage = false) => {
    if (resetPage) {
        pagination.value.page = 1
    }

    loading.value = true
    try {
        const params: any = {
            page: pagination.value.page,
            page_size: pagination.value.pageSize
        }

        // 如果有搜索关键词，添加到参数中
        if (searchKeyword.value.trim()) {
            params.search = searchKeyword.value.trim()
        }

        fetchUserRoles(searchKeyword.value.trim())
    } catch (err: any) {
        console.error('获取角色列表失败:', err)
        toast({
            message: err?.response?.data?.message || '获取角色列表失败',
            type: 'error'
        })
        roleList.value = []
        pagination.value.total = 0
    } finally {
        loading.value = false
    }
}

// 获取所有权限列表
const fetchAllPermissions = async () => {
    try {
        fetchPermissions()
    } catch (err: any) {
        console.error('获取权限列表失败:', err)
    }
}

// 处理搜索
const handleSearch = () => {
    // 防抖处理
    if (searchTimer) {
        clearTimeout(searchTimer)
    }
    searchTimer = setTimeout(() => {
        fetchRoleList(true)
    }, 300)
}

// 处理分页大小变化
// const handleSizeChange = (size: number) => {
// pagination.value.pageSize = size
// fetchRoleList(true)
// }

// // 处理页码变化
// const handlePageChange = (page: number) => {
// pagination.value.page = page
// fetchRoleList()
// }

// 处理排序变化
const handleSortChange = ({ column, prop, order }: any) => {
    console.log('排序变化:', { column, prop, order })
    // TODO: 如果需要后端排序，可以在这里调用 API
    // 可以重新调用 fetchRoleList 并传递排序参数
}

// =================== 新增/编辑角色相关 ======================

// 表单容器引用
const roleFormRef = ref()

// 是否打开角色抽屉
const isOpenRoleDrawer = ref(false)

// 当前是新增还是编辑
const isAddMode = ref(true)

// 当前编辑的角色ID
const currentRoleId = ref<number | null>(null)

// 抽屉标题
const drawerTitle = computed(() => {
    return isAddMode.value ? '新增角色' : '编辑角色'
})

// 抽屉宽度
const drawerWidth = '500px'

// 角色表单数据
const roleFormData = reactive({
    name: '',
    permissionIds: [] as string[]
})

// 角色表单验证规则
const roleFormRules: FormRuleMap = reactive({
    name: [
        { required: true, message: '请输入角色名称' },
        { max: 50, message: '角色名称最多50个字符' }
    ]
})

// 打开新增角色抽屉
const openAddRoleDrawer = () => {
    isAddMode.value = true
    currentRoleId.value = null
    resetRoleForm()
    isOpenRoleDrawer.value = true
}

// 打开编辑角色抽屉
const openEditRoleDrawer = (role: any) => {
    isAddMode.value = false
    currentRoleId.value = role.id
    roleFormData.name = role.name || ''
    roleFormData.permissionIds = role.permissions?.map((p: any) => p.code) || []

    isOpenRoleDrawer.value = true
}

// 关闭角色抽屉
const closeRoleDrawer = () => {
    isOpenRoleDrawer.value = false
    resetRoleForm()
}

// 重置角色表单
const resetRoleForm = () => {
    roleFormData.name = ''
    roleFormData.permissionIds = []
}

// 提交角色（新增或编辑）
const handleSubmitRole = async () => {
    // 表单验证
    if (roleFormRef.value) {
        const isValid = await roleFormRef.value.validate()
        if (!isValid) {
            return
        }
    }

    try {
        if (isAddMode.value) {
            // TODO: 调用新增角色 API
            await created_role({
                name: roleFormData.name,
                permissions: roleFormData.permissionIds
            })
            toast({
                message: '角色创建成功',
                type: 'success'
            })
        } else {
            if (!currentRoleId.value) {
                console.log('未获取到角色id');

                return
            }
            console.log({
                name: roleFormData.name,
                permissions: roleFormData.permissionIds
            });


            // TODO: 调用编辑角色 API
            await update_role(currentRoleId.value, {
                name: roleFormData.name,
                permissions: roleFormData.permissionIds
            })
            toast({
                message: '角色更新成功',
                type: 'success'
            })
        }

        closeRoleDrawer()
        await fetchRoleList()
    } catch (err: any) {
        console.error('操作失败:', err)
        toast({
            message: err?.response?.data?.message || '操作失败',
            type: 'error'
        })
    }
}

// =================== 删除角色相关 ======================

// 处理删除角色
const handleDeleteRole = async (role: any) => {
    const isConfirm = await useConfirm({
        title: '确认删除',
        message: `确定要删除角色 "${role.name}" 吗？此操作不可恢复。`,
        confirmText: '删除',
        cancelText: '取消'
    })

    if (!isConfirm) {
        return
    }

    try {
        // TODO: 调用删除角色 API
        await delete_role(role.id)
        toast({
            message: '角色删除成功',
            type: 'success'
        })
        await fetchRoleList()
    } catch (err: any) {
        console.error('删除角色失败:', err)
        toast({
            message: err?.response?.data?.message || '删除角色失败',
            type: 'error'
        })
    }
}

// =================== 生命周期 ======================

onMounted(() => {
    fetchRoleList()
    fetchAllPermissions()
})
</script>

<style scoped lang="scss">
.user-manage-roles {
    padding: 24px;
    height: 100%;
    max-height: 100%;
    display: flex;
    flex-direction: column;
    background-color: var(--background-color-white);
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    overflow: hidden;
    min-height: 0;
    box-sizing: border-box;

    // 顶部区域
    .user-manage-roles__top-region {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 24px;
        padding-bottom: 16px;
        border-bottom: 1px solid var(--border-color-gray-default);
        flex-shrink: 0;
        box-sizing: border-box;

        // 标题
        .umr__tr__title {
            font-size: 24px;
            font-weight: 600;
            color: var(--text-color-gray-dark);
            margin: 0;
        }

        // 操作区域
        .umr__tr__actions {
            display: flex;
            align-items: center;
            gap: 16px;

            // 搜索框
            .umr__tr__search {
                width: 320px;

                .umr__tr__search-input {
                    :deep(.el-input__wrapper.is-focus) {
                        box-shadow: 0 0 5px var(--primary-color-100);
                        border: 1px solid var(--primary-color-200);
                    }

                    :deep(.el-input__prefix) {
                        color: var(--text-color-gray-light);

                        .el-icon {
                            color: var(--text-color-gray-light);
                        }
                    }

                    :deep(.el-input__suffix) {
                        .el-input__clear {
                            color: var(--text-color-gray-light);

                            &:hover {
                                color: var(--text-color-primary-deep);
                            }
                        }
                    }
                }
            }

            // 新增按钮
            .umr__tr__add-btn {
                background-color: var(--text-color-primary-deep) !important;
                border-color: var(--text-color-primary-deep) !important;
                color: var(--background-color-white) !important;
                transition: all var(--transition-duration-default);

                &:hover {
                    background-color: var(--text-color-primary) !important;
                    border-color: var(--text-color-primary) !important;
                }
            }
        }
    }

    // 角色列表表格内容区域
    .user-manage-roles__main-table {
        flex: 1;
        min-height: 0;
        overflow: auto;
        margin-bottom: 16px;

        :deep(.el-table) {
            border-radius: 8px;
            overflow: hidden;
            --el-table-border-color: var(--border-color-gray-default);
            --el-table-header-bg-color: var(--primary-color-600);
            --el-table-row-hover-bg-color: var(--primary-color-500);
            --el-table-tr-bg-color: var(--background-color-white);

            .el-table__header {
                th {
                    background-color: var(--background-color-gray-light) !important;
                    color: var(--text-color-gray-dark);
                    font-weight: 600;
                    border-color: var(--border-color-gray-default);

                    // 激活状态的排序图标
                    &.ascending {
                        color: var(--text-color-primary-light);

                        .caret-wrapper {
                            .sort-caret {
                                &.ascending {
                                    border-bottom-color: var(--text-color-primary-light);
                                }
                            }
                        }
                    }

                    &.descending {
                        color: var(--text-color-primary-light);

                        .caret-wrapper {
                            .sort-caret {
                                &.descending {
                                    border-top-color: var(--text-color-primary-light);
                                }
                            }
                        }
                    }
                }
            }

            .el-table__body {
                tr {
                    &:hover {
                        background-color: var(--primary-color-500) !important;
                    }
                }

                td {
                    border-color: var(--border-color-gray-default);
                }
            }

            // 表格边框
            &::before {
                background-color: var(--border-color-gray-default);
            }
        }

        // 权限标签
        .permission-tag {
            margin-right: 8px;
            margin-bottom: 4px;
            background-color: var(--primary-color-400);
            color: var(--text-color-primary-deep);
            border-color: var(--text-color-primary);
        }

        .no-permissions {
            color: var(--text-color-gray-light);
            font-size: 12px;
        }

        // 操作按钮样式
        :deep(.el-button--link) {
            &.el-button--primary {
                color: var(--text-color-primary-deep);

                &:hover {
                    color: var(--text-color-primary);
                }
            }

            &.el-button--danger {
                color: var(--warn-color-100);

                &:hover {
                    color: var(--warn-color-200);
                }
            }
        }
    }

    // 分页器
    .user-manage-roles__pagination {
        display: flex;
        justify-content: flex-end;
        padding-top: 16px;
        border-top: 1px solid var(--border-color-gray-default);
        flex-shrink: 0;
        box-sizing: border-box;

        .umr__pagination {
            --el-pagination-button-color: var(--text-color-gray-dark);
            --el-pagination-hover-color: var(--text-color-primary-deep);
            --el-pagination-bg-color: var(--background-color-white);
            --el-pagination-button-disabled-color: var(--text-color-gray-light);
            --el-pagination-button-disabled-bg-color: var(--background-color-white);

            :deep(.el-pagination__total) {
                color: var(--text-color-gray-default);
                font-weight: 500;
            }

            :deep(.el-pagination__sizes) {
                .el-select {
                    .el-input__inner {
                        border-radius: 6px;
                        border-color: var(--border-color-gray-default);
                        color: var(--text-color-gray-dark);

                        &:hover {
                            border-color: var(--text-color-primary) !important;
                        }

                        &:focus {
                            border-color: var(--text-color-primary-deep) !important;
                            box-shadow: 0 0 0 2px var(--primary-color-400) !important;
                        }
                    }
                }
            }

            :deep(.el-pager) {
                li {
                    border-radius: 6px;
                    margin: 0 2px;
                    transition: all var(--transition-duration-default);
                    color: var(--text-color-gray-dark);
                    background-color: var(--background-color-white);

                    &:hover {
                        color: var(--text-color-primary-deep) !important;
                        background-color: var(--primary-color-500) !important;
                    }

                    &.is-active {
                        background-color: var(--primary-color-100) !important;
                        color: var(--text-color-primary-deep) !important;
                        font-weight: 600;
                    }
                }
            }

            :deep(.btn-prev),
            :deep(.btn-next) {
                border-radius: 6px;
                transition: all var(--transition-duration-default);
                color: var(--text-color-gray-dark);
                background-color: var(--background-color-white);

                &:hover {
                    color: var(--text-color-primary-deep) !important;
                    background-color: var(--primary-color-500) !important;
                }

                &:disabled {
                    color: var(--text-color-gray-light) !important;
                    background-color: var(--background-color-white) !important;
                }
            }

            :deep(.el-input__wrapper.is-focus) {
                box-sizing: border-box;
                box-shadow: 0 0 2px var(--primary-color-100);
                border: 1px solid var(--primary-color-200);
                transition: all var(--transition-duration-default);
            }
        }
    }

    // 权限设置容器
    .permissions-container {
        width: 100%;

        .permissions-group {
            display: flex;
            flex-direction: column;
            gap: 12px;
            max-height: 300px;
            overflow-y: auto;
            padding: 12px;
            border: 1px solid var(--border-color-gray-default);
            border-radius: 6px;

            .permission-checkbox {
                :deep(.el-checkbox__label) {
                    color: var(--text-color-gray-dark);
                }

                :deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
                    background-color: var(--text-color-primary-deep);
                    border-color: var(--text-color-primary-deep);
                }

                :deep(.el-checkbox__input.is-checked + .el-checkbox__label) {
                    color: var(--text-color-primary-deep);
                }
            }
        }

        .no-permissions-tip {
            color: var(--text-color-gray-light);
            text-align: center;
            padding: 20px;
        }
    }

    // 表单输入框样式
    :deep(.el-input) {
        .el-input__wrapper {
            border-radius: 6px;
            border-color: var(--border-color-gray-default);
            transition: all var(--transition-duration-default);

            &:hover {
                border-color: var(--text-color-primary);
            }

            &.is-focus {
                border-color: var(--text-color-primary-deep) !important;
                box-shadow: 0 0 0 2px var(--primary-color-400) !important;
            }
        }

        .el-input__inner {
            color: var(--text-color-gray-dark);
        }

        .el-input__count {
            color: var(--text-color-gray-light);
        }
    }

    // 表单按钮样式
    .submit-btn {
        background-color: var(--text-color-primary-deep) !important;
        border-color: var(--text-color-primary-deep) !important;
        color: white !important;

        &:hover {
            background-color: var(--text-color-primary) !important;
            border-color: var(--text-color-primary) !important;
        }
    }

    .cancel-btn {
        color: var(--text-color-gray-dark);
        border-color: var(--border-color-gray-default);

        &:hover {
            color: var(--text-color-primary-deep);
            border-color: var(--text-color-primary);
        }
    }
}

// 加载动画样式
:deep(.el-loading-mask) {
    background-color: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(2px);

    .el-loading-spinner {
        .circular {
            .path {
                stroke: var(--text-color-primary-deep);
            }
        }

        .el-loading-text {
            color: var(--text-color-primary-deep);
        }
    }
}
</style>

<style lang="scss">
// 全局样式：Select 下拉框（挂载在 body 上，需要全局样式）
.el-select-dropdown {
    --el-select-dropdown-border-color: var(--border-color-gray-default);
    --el-select-dropdown-bg-color: var(--background-color-white);
    border-color: var(--border-color-gray-default) !important;
    background-color: var(--background-color-white) !important;

    .el-select-dropdown__item {
        color: var(--text-color-gray-dark) !important;

        &:hover {
            background-color: var(--primary-color-500) !important;
            color: var(--text-color-primary-deep) !important;
        }

        &.selected {
            background-color: var(--primary-color-400) !important;
            color: var(--text-color-primary-deep) !important;
            font-weight: 600;
        }

        &.is-selected {
            background-color: var(--primary-color-400) !important;
            color: var(--text-color-primary-deep) !important;
            font-weight: 600;
        }
    }
}

// 全局样式：Checkbox（挂载在 body 上，需要全局样式）
.el-checkbox {
    --el-checkbox-checked-bg-color: var(--text-color-primary-deep);
    --el-checkbox-checked-border-color: var(--text-color-primary-deep);
    --el-checkbox-input-border-color-hover: var(--text-color-primary);

    .el-checkbox__input.is-checked .el-checkbox__inner {
        background-color: var(--text-color-primary-deep) !important;
        border-color: var(--text-color-primary-deep) !important;
    }

    .el-checkbox__input.is-checked+.el-checkbox__label {
        color: var(--text-color-primary-deep) !important;
    }

    .el-checkbox__label {
        color: var(--text-color-gray-dark) !important;
    }
}
</style>