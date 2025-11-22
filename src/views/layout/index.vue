<template>
    <div class="layout">
        <!-- 顶部导航栏 -->
        <navgation-bar></navgation-bar>

        <!-- 展示位置 -->
        <div class="main">
            <router-view></router-view>
        </div>
    </div>
</template>

<script setup lang="ts">
import NavgationBar from '@/components/NavgationBar/index.vue'
</script>

<style scoped lang="scss">
.layout {
    display: flex;
    flex-direction: column;

    .main {
        width: 100%;
        box-sizing: border-box;
        // display: flex;
        // justify-content: center;
    }
}
</style>