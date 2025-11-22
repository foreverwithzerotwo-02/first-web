import { defineStore } from "pinia";
import { getUserInfo } from "@/api/user"; // 你的获取用户信息接口
import type { UserInfo } from "@/api/user"; // 你的 TS 类型

export const useUserStore = defineStore("user", {
    state: () => ({
        access: '' as string,
        refresh: '' as string,
        isAuthenticated: false,
        info: null as UserInfo | null, // 用户信息
    }),
    actions: {
        // 保存 token
        setTokens(access: string, refresh: string) {
            this.access = access;
            this.refresh = refresh;
            this.isAuthenticated = true;
            localStorage.setItem("access", access);
            localStorage.setItem("refresh", refresh);
        },

        // 加载 token
        loadTokens() {
            const access = localStorage.getItem("access");
            const refresh = localStorage.getItem("refresh");
            if (access && refresh) {
                this.access = access;
                this.refresh = refresh;
                this.isAuthenticated = true;
            }
        },

        // 注销
        logout() {
            this.access = '';
            this.refresh = '';
            this.isAuthenticated = false;
            this.info = null;
            localStorage.removeItem("access");
            localStorage.removeItem("refresh");
        },

        // 新增：获取用户信息
        async fetchUserInfo() {
            if (!this.isAuthenticated) return null;

            try {
                const data = await getUserInfo(); // 通过 api 获取 UserInfo
                this.info = data;
                return data;
            } catch (err) {
                console.error('获取用户信息失败', err);
                this.info = null;
                return null;
            }
        },
    },
});
