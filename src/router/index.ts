import { createRouter, createWebHistory } from 'vue-router';
import NProgress from 'nprogress'

// 引入用户状态库
import { useUserStore } from '@/stores/user'
// 引入登录状态库
import { useAuthStore } from '@/stores/useAuthStore'

// 引入全部路由
import { routes } from './routes';

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// 路由切换时开始进度条
router.beforeEach((to, from, next) => {
    const userStore = useUserStore()
    const authStore = useAuthStore()

    // 检查匹配链里是否有 requiresAuth
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

    if (requiresAuth && !userStore.isAuthenticated) {
        // 弹出登录组件
        authStore.visible = true

        // 如果有 from.path 并且不是初始页面，则返回上一个页面，否则跳首页
        const redirectPath = from.path && from.path !== '/' ? from.fullPath : '/'
        next({ path: redirectPath })
    } else {
        NProgress.start()
        next()
    }
})

// 路由加载完成后结束进度条
router.afterEach(() => {
    NProgress.done()
})

export default router;