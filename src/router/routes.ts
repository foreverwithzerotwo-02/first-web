import type { RouteRecordRaw } from 'vue-router'

export const routes: Array<RouteRecordRaw> = [
    {
        path: '/ceshi',
        component: () => import('@/views/ceshi/index.vue')
    },
    {
        name: 'layout',
        path: '/',
        component: () => import('@/views/layout/index.vue'),
        children: [
            // 主页面
            {
                name: 'home',
                path: '',
                component: () => import('@/views/layout/home/index.vue')
            },
            // 用户页面
            {
                name: 'user',
                path: '/user',
                meta: {
                    // 需要登录
                    requiresAuth: true
                },
                redirect: '/user/favorite-course',
                component: () => import('@/views/layout/user/index.vue'),
                children: [
                    // 收藏课程页面
                    {
                        name: 'favorite-course',
                        path: 'favorite-course',
                        component: () => import('@/views/layout/user/components/favorite-course.vue')
                    },
                    // 发布帖子页面
                    {
                        name: 'fourm',
                        path: 'forum',
                        component: () => import('@/views/layout/user/components/forum.vue')
                    },
                    // 浏览历史
                    {
                        name: 'view-history',
                        path: 'view-history',
                        component: () => import('@/views/layout/user/components/view-history.vue')
                    },
                    // 设置页面
                    {
                        name: 'user-setting',
                        path: 'setting',
                        component: () => import('@/views/layout/user/components/setting.vue')
                    },
                ]
            },
            // 学习页面
            {
                name: 'study',
                path: 'study',
                component: () => import('@/views/layout/study/index.vue'),
                children: [
                    {
                        name: 'study-home',
                        path: '',  // 默认展示内容
                        component: () => import('@/views/layout/study/home/index.vue')
                    },
                    {
                        name: 'study-course-intro',
                        path: 'course-intro/:id/:category_id',
                        component: () => import('@/views/layout/study/course-intro/index.vue'),
                        props: true,
                    },
                    {
                        name: 'study-course-lesson',
                        path: 'course-lesson/:id/:chapter_id/:category_id',
                        component: () => import('@/views/layout/study/course-lessons/index.vue'),
                        props: true,
                    }
                ]
            },

            // 论坛页面
            {
                name: 'forum',
                path: 'forum',
                component: () => import('@/views/layout/forum/index.vue'),
                children: [
                    // 主页面
                    {
                        name: 'forum-home',
                        path: '',  // 默认展示内容
                        component: () => import('@/views/layout/forum/home/index.vue')
                    },

                    // 创建帖子
                    {
                        name: 'post-create',
                        path: '/post-create',
                        component: () => import('@/views/layout/forum/post-create/index.vue'),
                        meta: {
                            // 需要登录
                            requiresAuth: true
                        },
                    },

                    // 修改帖子
                    {
                        name: 'post-edit',
                        path: '/post-edit/:id',
                        component: () => import('@/views/layout/forum/post-edit/index.vue'),
                        props: true,
                        meta: {
                            // 需要登录
                            requiresAuth: true
                        },
                    },

                    // 帖子页面
                    {
                        name: 'post',
                        path: '/post/:id',
                        component: () => import('@/views/layout/forum/post/index.vue'),
                        props: true,
                    },
                ]
            },
        ]
    },

    // ======================================== 后台管理 ========================================

    {
        name: 'admin',
        path: '/admin',
        component: () => import('@/views/admin/index.vue'),
        meta: {
            // 供面包屑
            breadcrumb: '首页'
        },
        children: [
            // ----------------------------- 首页 -----------------------------------
            {
                name: 'admin-home',
                path: '',
                component: () => import('@/views/admin/home/index.vue'),
                meta: {
                    // 供面包屑
                    // breadcrumb: '首页'
                },
            },

            // ------------------- 学习后台管理页面 -------------------
            // 展示全部课程表格
            {
                name: 'admin-study-all-course',
                path: 'study-all-course',
                component: () => import('@/views/admin/study/all-course/index.vue'),
                meta: {
                    // 供面包屑
                    breadcrumb: '全部课程'
                },
                children: [
                    // 全部章节
                    {
                        name: 'admin-study-course-all-chapter',
                        path: 'all-chapter/:course_id',
                        props: true,
                        component: () => import('@/views/admin/study/all-course/all-chapter/index.vue'),
                        meta: {
                            // 供面包屑
                            breadcrumb: '课程章节'
                        },
                    },
                ]
            },

            // 全部课程分类
            {
                name: 'admin-study-all-category',
                path: 'study-all-category',
                component: () => import('@/views/admin/study/all-category/index.vue'),
                meta: {
                    // 供面包屑
                    breadcrumb: '全部课程分类'
                },
            },

            // ----------------------------- 论坛后台管理页面 -----------------------------------
            {
                name: 'admin-forum-category',
                path: 'forum-category',
                component: () => import('@/views/admin/forum/forum-category/index.vue'),
                meta: {
                    // 供面包屑
                    breadcrumb: '论坛分类'
                },
            },

            // ----------------------------- 图标 -----------------------------------
            {
                name: 'admin-icons',
                path: 'icons',
                component: () => import('@/views/admin/icons/index.vue'),
                meta: {
                    // 供面包屑
                    breadcrumb: '图标'
                },
            },

            // ----------------------------- 用户管理 -----------------------------------
            // 管理用户角色身份
            {
                name: 'admin-user-manage-user-role',
                path: 'user-manage-user-role',
                component: () => import('@/views/admin/user-manage/user-manage-user-role/index.vue'),
                meta: {
                    // 供面包屑
                    breadcrumb: '用户身份管理'
                },
            },

            // 身份管理
            {
                name: 'admin-user-manage-roles',
                path: 'user-manage-roles',
                component: () => import('@/views/admin/user-manage/user-mange-roles/index.vue'),
                meta: {
                    // 供面包屑
                    breadcrumb: '角色管理'
                },
            },

            // 权限管理
            {
                name: 'admin-user-manage-permission',
                path: 'user-manage-permission',
                component: () => import('@/views/admin/user-manage/user-manage-permission/index.vue'),
                meta: {
                    // 供面包屑
                    breadcrumb: '权限管理'
                },
            },
        ]
    },

    // ======================================== 后台管理 ========================================
]