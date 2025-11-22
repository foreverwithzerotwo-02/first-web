<template>
    <div class="user-mange-role">
        <!-- 顶部区域 -->
        <div class="user-mange-role__top-region">
            <!-- 标题 -->
            <h2 class="umr__tr__title">角色管理</h2>

            <!-- 搜索框 -->
            <div class="umr__tr__search">
                <el-input v-model="searchKeyword" placeholder="搜索用户名或昵称" clearable @input="handleSearch"
                    @clear="handleSearch" class="umr__tr__search-input">
                    <template #prefix>
                        <el-icon>
                            <Search />
                        </el-icon>
                    </template>
                </el-input>
            </div>
        </div>

        <!-- 用户列表表格内容区域 -->
        <div class="user-mange-role__main-user-info-table">
            <el-table :data="userList" border style="width: 100%" stripe v-loading="loading"
                element-loading-text="加载中..." @sort-change="handleSortChange">
                <el-table-column prop="id" label="ID" width="80" align="center" sortable />
                <el-table-column prop="username" label="用户名" min-width="180" />
                <el-table-column prop="nickname" label="昵称" min-width="150" />
                <el-table-column prop="role_name" label="用户身份" width="200" align="center">
                    <template #default="scope">
                        <div class="umr__muit__item-container">
                            <el-select v-model="scope.row.role_name[0]" placeholder="选择身份" size="small"
                                @change="(val: string) => handleRoleChange(scope.row.id, val)" class="umr__role-select">
                                <el-option v-for="role in roleOptions" :key="role.id" :label="role.name"
                                    :value="role.id" />
                            </el-select>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="created_at" label="创建时间" width="180" align="center" sortable
                    :sort-method="sortByDate">
                    <template #default="scope">
                        <span>{{ formatDate(scope.row.created_at) }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="updated_at" label="更新时间" width="180" align="center" sortable
                    :sort-method="sortByDate">
                    <template #default="scope">
                        <span>{{ formatDate(scope.row.updated_at) }}</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!-- 分页 -->
        <div class="user-mange-role__pagination">
            <el-pagination v-model:current-page="pagination.page" v-model:page-size="pagination.pageSize"
                :page-sizes="[10, 20, 50, 100]" :total="pagination.total"
                layout="total, sizes, prev, pager, next, jumper" background @size-change="handleSizeChange"
                @current-change="handlePageChange" class="umr__pagination" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { list_users, list_roles, update_roles } from '@/api/user'

// 格式化日期
import formatDate from '@/utils/formatDate'

// 引入提示
import { toast } from '@/components/MyToast/toast'

import { onMounted, ref } from 'vue';
import { Search } from '@element-plus/icons-vue';

// 用户角色选项
const roleOptions = ref<any[]>([])

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

// 用户列表数据
const userList = ref<any[]>([])

// 搜索防抖定时器
let searchTimer: ReturnType<typeof setTimeout> | null = null

// 分页获取全部用户列表
const fetchUserList = async (resetPage = false) => {
    if (resetPage) {
        pagination.value.page = 1
    }

    loading.value = true
    try {
        const params: any = {
            page: pagination.value.page,
            page_size: pagination.value.pageSize
        }

        // 如果有搜索关键词，添加到参数中（根据实际API调整）
        if (searchKeyword.value.trim()) {
            params.search = searchKeyword.value.trim()
        }

        const res: any = await list_users(params)

        console.log(res, params);

        userList.value = res.results || []

        pagination.value.total = res.count || 0
    } catch (err: any) {
        console.error('获取用户列表失败:', err)
        toast({
            message: err?.response?.data?.message || '获取用户列表失败',
            type: 'error'
        })
        userList.value = []
        pagination.value.total = 0
    } finally {
        loading.value = false
    }
}

// 获取用户角色列表
const fetchUserRoles = async () => {
    const res: any = await list_roles()

    roleOptions.value = res || []
}

// 处理搜索
const handleSearch = () => {
    // 防抖处理
    if (searchTimer) {
        clearTimeout(searchTimer)
    }
    searchTimer = setTimeout(() => {
        console.log(1);

        fetchUserList(true)
    }, 300)
}

// 处理分页大小变化
const handleSizeChange = (size: number) => {
    pagination.value.pageSize = size
    fetchUserList(true)
}

// 处理页码变化
const handlePageChange = (page: number) => {
    pagination.value.page = page
    fetchUserList()
}

// 处理角色变更
const handleRoleChange = async (userId: number, newRole: string) => {
    try {
        await update_roles(userId, [Number(newRole)])
        toast({
            message: '用户角色更新成功',
            type: 'success'
        })
        // 刷新列表
        await fetchUserList()
    } catch (err: any) {
        console.error('更新用户角色失败:', err)
        toast({
            message: err?.response?.data?.message || '更新用户角色失败',
            type: 'error'
        })
    }
}

// 日期排序方法
const sortByDate = (a: any, b: any) => {
    // 处理空值情况
    if (!a && !b) return 0
    if (!a) return 1
    if (!b) return -1

    const dateA = new Date(a).getTime()
    const dateB = new Date(b).getTime()

    // 处理无效日期
    if (isNaN(dateA) && isNaN(dateB)) return 0
    if (isNaN(dateA)) return 1
    if (isNaN(dateB)) return -1

    return dateA - dateB
}

// 处理排序变化（可选，如果需要后端排序可以在这里处理）
const handleSortChange = ({ column, prop, order }: any) => {
    // 如果需要后端排序，可以在这里调用 API
    // 当前使用前端排序，所以可以留空或者添加日志
    console.log('排序变化:', { column, prop, order })
}

onMounted(() => {
    fetchUserList()
    fetchUserRoles()
})
</script>

<style scoped lang="scss">
.user-mange-role {
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
    .user-mange-role__top-region {
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

        // 搜索框
        .umr__tr__search {
            width: 320px;

            .umr__tr__search-input {
                :deep(.el-input__wrapper.is-focus) {
                    box-shadow: 0 0 5px var(--primary-color-100);
                    border: 1px solid var(--primary-color-200);
                }

                // 清除按钮
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
    }

    // 用户列表表格内容区域
    .user-mange-role__main-user-info-table {
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

        // 表格项容器
        .umr__muit__item-container {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;

            .umr__role-select {
                width: 100%;
                --el-select-border-color-hover: var(--text-color-primary);
                --el-select-input-focus-border-color: var(--text-color-primary-deep);

                :deep(.el-input__inner) {
                    border-radius: 6px;
                    border: 1px solid var(--border-color-gray-default);
                    transition: all var(--transition-duration-default);
                    color: var(--text-color-gray-dark);

                    &:hover {
                        border-color: var(--text-color-primary) !important;
                    }

                    &:focus {
                        border-color: var(--text-color-primary-deep) !important;
                        box-shadow: 0 0 0 2px var(--primary-color-400) !important;
                    }
                }

                // 下拉箭头
                :deep(.el-select__caret) {
                    color: var(--text-color-gray-light);
                }

                // 下拉选项样式
                :deep(.el-select-dropdown) {
                    --el-select-dropdown-border-color: var(--border-color-gray-default);
                }
            }

            // Select 下拉选项
            :deep(.el-select-dropdown__item) {
                color: var(--text-color-gray-dark);

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
    }

    // 分页器
    .user-mange-role__pagination {
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
                        background-color: var(--primary-color-300) !important;
                        color: var(--text-color-primary) !important;
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
                box-shadow: 0 0 2px var(--primary-color-100);
                border: 1px solid var(--primary-color-200);
                transition: all var(--transition-duration-default);
            }
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
.el-select__wrapper.is-focused {
    box-shadow: 0 0 5px var(--primary-color-100);
    border: 1px solid var(--primary-color-200);
}

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
</style>