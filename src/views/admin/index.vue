<template>
    <div class="admin">
        <!-- 左侧导航部分 -->
        <sidebar v-model="isOpenSidebar">
            <my-menu>
                <my-menu-item index="1" to="/admin" :is-home="true">
                    <template #icon>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path
                                d="M19 21H5C4.44772 21 4 20.5523 4 20V11L1 11L11.3273 1.6115C11.7087 1.26475 12.2913 1.26475 12.6727 1.6115L23 11L20 11V20C20 20.5523 19.5523 21 19 21ZM6 19H18V9.15745L12 3.7029L6 9.15745V19ZM8 15H16V17H8V15Z">
                            </path>
                        </svg>
                    </template>

                    首页
                </my-menu-item>

                <!-- 学习 -->
                <my-sub-menu titel="学习" index="2">
                    <template #icon>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path
                                d="M13 21V23H11V21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3H9C10.1947 3 11.2671 3.52375 12 4.35418C12.7329 3.52375 13.8053 3 15 3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H13ZM20 19V5H15C13.8954 5 13 5.89543 13 7V19H20ZM11 19V7C11 5.89543 10.1046 5 9 5H4V19H11Z">
                            </path>
                        </svg>
                    </template>

                    <my-menu-item index="2-1" to="/admin/study-all-course">全部课程</my-menu-item>

                    <my-menu-item index="2-2" to="/admin/study-all-category">全部课程分类</my-menu-item>
                </my-sub-menu>

                <!-- 论坛 -->
                <my-sub-menu titel="论坛" index="3">
                    <template #icon>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path
                                d="M6.45455 19L2 22.5V4C2 3.44772 2.44772 3 3 3H21C21.5523 3 22 3.44772 22 4V18C22 18.5523 21.5523 19 21 19H6.45455ZM5.76282 17H20V5H4V18.3851L5.76282 17ZM11 10H13V12H11V10ZM7 10H9V12H7V10ZM15 10H17V12H15V10Z">
                            </path>
                        </svg>
                    </template>

                    <my-menu-item index="3-1" to="/admin/forum-category">论坛分类</my-menu-item>
                </my-sub-menu>

                <!-- 用户管理 -->
                <my-sub-menu titel="用户管理" index="5">
                    <template #icon>
                        <svg-icons name="userSettingsLine" :size="20" />
                    </template>

                    <my-menu-item index="5-1" to="/admin/user-manage-user-role">用户身份管理</my-menu-item>
                    <my-menu-item index="5-2" to="/admin/user-manage-roles">角色管理</my-menu-item>
                    <my-menu-item index="5-3" to="/admin/user-manage-permission">权限管理</my-menu-item>
                </my-sub-menu>

                <!-- 图标 -->
                <my-menu-item index="4" to="/admin/icons">
                    <template #icon>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path
                                d="M12 6C12.8284 6 13.5 5.32843 13.5 4.5C13.5 3.67157 12.8284 3 12 3C11.1716 3 10.5 3.67157 10.5 4.5C10.5 5.32843 11.1716 6 12 6ZM9 10H11V18H9V20H15V18H13V8H9V10Z">
                            </path>
                        </svg>
                    </template>

                    图标
                </my-menu-item>
            </my-menu>
        </sidebar>

        <!-- 主要内容展示 -->
        <div class="main">
            <!-- 导航栏 -->
            <div class="main__navbar">
                <!-- 左侧 -->
                <div class="main__navbar__left">
                    <!-- 控制侧边栏按钮 -->
                    <div class="main__navbar__left__sidebar-btn" v-tip="'隐藏侧边栏'"
                        @click="isOpenSidebar = !isOpenSidebar">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path
                                d="M21 3C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3H21ZM7 5H4V19H7V5ZM20 5H9V19H20V5Z">
                            </path>
                        </svg>
                    </div>

                    <!-- 面包屑 -->
                    <div class="main__navbar__left__bread">
                        <breadcrumb>
                            <breadcrumb-item v-for="r in breadcrumbs" :to="r.path">{{ r.name }}</breadcrumb-item>
                        </breadcrumb>
                    </div>
                </div>
            </div>

            <!-- 主要内容展示容器 -->
            <div class="main__navbar--container">
                <router-view v-slot="{ Component }">
                    <transition name="fade-slide" mode="out-in">
                        <component :is="Component" :key="$route.fullPath" />
                    </transition>
                </router-view>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import MyMenu from '@/components/MyMenu/index.vue'
import MySubMenu from '@/components/MyMenu/MySubMenu/index.vue'
import MyMenuItem from '@/components/MyMenu/MyMenuItem/index.vue'
import Sidebar from '@/components/Sidebar/index.vue'
// 引入图标
import SvgIcons from '@/components/Icons/index.vue'
// 引入面包屑组件
import Breadcrumb from '@/components/Breadcrumb/index.vue'
import BreadcrumbItem from '@/components/Breadcrumb/BreadcrumbItem/index.vue'
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()

// 侧边栏是否打开
const isOpenSidebar = ref(false)

// 当前全部面包屑路径
const breadcrumbs = computed(() => {
    return route.matched.map(r => ({
        name: r.meta.breadcrumb,
        path: r.path.includes(':') ? route.path : r.path, // 动态路径使用当前路径
    }))
})
</script>

<style scoped lang="scss">
.fade-slide-enter-from {
    opacity: 0;
    transform: translateX(-30px);
}

.fade-slide-enter-active {
    transition: all .5s ease;
}

.fade-slide-enter-to {
    opacity: 1;
    transform: translateX(0);
}

.fade-slide-leave-from {
    opacity: 1;
    transform: translateX(0);
}

.fade-slide-leave-active {
    transition: all 0.5s ease;
    position: absolute;
    /* 关键：避免新旧页面叠在一起顶开布局 */
    width: 100%;
}

.fade-slide-leave-to {
    opacity: 0;
    transform: translateX(30px);
}


.admin {
    width: 100dvw;
    height: 100dvh;
    display: flex;
    padding: 10px;
    box-sizing: border-box;

    // 主要展示容器
    .main {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;

        // 导航栏
        .main__navbar {
            height: 40px;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-shrink: 0;

            // 左侧容器
            .main__navbar__left {
                display: flex;
                align-items: center;
                height: 100%;

                // 控制侧边栏按钮
                .main__navbar__left__sidebar-btn {
                    display: none;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                    cursor: pointer;
                    margin-right: 15px;
                    width: 23px;
                    height: 23px;

                    &:hover {
                        svg {
                            color: var(--text-color-primary);
                        }
                    }

                    svg {
                        transition: all var(--transition-duration-default);
                        width: 100%;
                        height: 100%;
                    }
                }
            }
        }

        .main__navbar__left__bread {
            padding: 0 20px;
            box-sizing: border-box;
        }

        // 主要内容展示容器
        .main__navbar--container {
            position: relative;
            flex: 1;
            width: 100%;
            overflow: hidden;
            padding: 0 20px;
            box-sizing: border-box;
        }
    }
}

@media (max-width: 768px) {
    .admin {

        // 主要内容展示
        .main {

            // 导航栏
            .main__navbar {

                // 左侧容器
                .main__navbar__left {

                    // 控制侧边栏按钮
                    .main__navbar__left__sidebar-btn {
                        display: flex;
                    }
                }
            }
        }
    }
}
</style>