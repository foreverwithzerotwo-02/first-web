<script setup lang="ts">
// 登录注册组件
import AuthModal from '@/components/AuthModal/index.vue'
// 引入登录注册状态库
import { useAuthStore } from '@/stores/useAuthStore'
const authStore = useAuthStore()
// 引用用户状态库
import { useUserStore } from "@/stores/user";
const store = useUserStore();

store.loadTokens(); // 初始化时加载
store.fetchUserInfo()
</script>

<template>
    <router-view></router-view>

    <!-- 登录注册组件 -->
    <auth-modal v-if="authStore.visible"></auth-modal>
</template>

<style>
.el-table__body tr:hover>td,
.el-table__body tr:hover {
    background-color: #e6e6e6 !important;
    transition: all var(--transition-duration-default);
}

.el-table__row--striped>td {
    background-color: #f5f5f5 !important;
}

.el-table {
    --el-table-border-color: var(--border-color-gray-default);
    border-radius: 2px;
}
</style>
