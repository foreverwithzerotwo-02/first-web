import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        visible: false,          // 弹窗是否显示
        mode: 'login' as 'login' | 'register', // 当前模式
    }),

    actions: {
        openLogin() {
            this.visible = true
            this.mode = 'login'
        },
        openRegister() {
            this.visible = true
            this.mode = 'register'
        },
        close() {
            this.visible = false
        }
    }
})
