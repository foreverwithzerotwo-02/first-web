<template>
    <div class="container user-wrapper">
        <!-- 用户信息展示 -->
        <div class="user-info-container">
            <!-- 左侧头像 -->
            <div class="left-avatar">
                <!-- 头像 -->
                <div class="avar" @click="isShowEditAvatarPopup = true">
                    <!-- 编辑遮罩 -->
                    <div class="edit-wrapper">编辑头像</div>

                    <img :src="store.info?.avatar || ''" alt="">

                    <!-- 头像边框 -->
                    <img src="../../../assets/avatar-border/fire_static.png" class="avatar-border" alt="">
                </div>
            </div>

            <!-- 右侧信息 -->
            <div class="right-info">
                <!-- 信息容器 -->
                <div class="info-container">
                    <!-- 标题 -->
                    <div class="info-title">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path
                                d="M3 6H21V18H3V6ZM2 4C1.44772 4 1 4.44772 1 5V19C1 19.5523 1.44772 20 2 20H22C22.5523 20 23 19.5523 23 19V5C23 4.44772 22.5523 4 22 4H2ZM13 8H19V10H13V8ZM18 12H13V14H18V12ZM10.5 10C10.5 11.3807 9.38071 12.5 8 12.5C6.61929 12.5 5.5 11.3807 5.5 10C5.5 8.61929 6.61929 7.5 8 7.5C9.38071 7.5 10.5 8.61929 10.5 10ZM8 13.5C6.067 13.5 4.5 15.067 4.5 17H11.5C11.5 15.067 9.933 13.5 8 13.5Z">
                            </path>
                        </svg>
                        <span>个人信息</span>
                    </div>

                    <!-- 用户名 -->
                    <div class="infor-item username">
                        <p>用户名</p>
                        <div class="content">
                            {{ store.info?.username || '暂无' }}
                        </div>
                    </div>

                    <!-- 昵称 -->
                    <div class="infor-item nickname">
                        <p>昵称</p>
                        <div class="content">
                            {{ store.info?.nickname || '暂无' }}
                        </div>
                    </div>

                    <!-- 个人签名 -->
                    <div class="infor-item bio">
                        <p>个人签名</p>
                        <div class="content">
                            {{ store.info?.bio || '暂无' }}
                        </div>
                    </div>

                    <!-- 邮箱 -->
                    <div class="infor-item email">
                        <p>邮箱</p>
                        <div class="content">
                            {{ store.info?.email || '暂无' }}
                        </div>
                    </div>

                    <!-- 个人积分 -->
                    <div class="infor-item pints">
                        <p>个人积分</p>
                        <div class="content">
                            <div class="desc">
                                <span v-if="currentLevel.maxPoints !== Infinity">{{ store.info?.points || 0 }} / {{
                                    currentLevel.maxPoints }}</span>

                                <div class="levelname-container">
                                    <span class="levelname">Lv {{ currentLevel.level }} ·</span>
                                    <span class="levelname">{{ currentLevel.name }}</span>

                                    <BadgeIcon variant="bronze" :size="25"></BadgeIcon>
                                </div>
                            </div>
                            <!-- 进度条 -->
                            <div class="progress">
                                <div class="bar">
                                    <div class="reached" :style="{
                                        width: progress + '%',
                                    }"></div>
                                </div>

                                <!-- 进度信息 -->
                                <div class="num">
                                    {{ progress }}%
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 编辑按钮 -->
                <div class="info-btn-container">
                    <button class="info-btn" @click="isShowUpdateUserInfoPopup = true"><svg
                            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path
                                d="M21 6.75736L19 8.75736V4H10V9H5V20H19V17.2426L21 15.2426V21.0082C21 21.556 20.5551 22 20.0066 22H3.9934C3.44476 22 3 21.5501 3 20.9932V8L9.00319 2H19.9978C20.5513 2 21 2.45531 21 2.9918V6.75736ZM21.7782 8.80761L23.1924 10.2218L15.4142 18L13.9979 17.9979L14 16.5858L21.7782 8.80761Z">
                            </path>
                        </svg>编辑资料</button>
                </div>
            </div>
        </div>

        <!-- 编辑头像弹窗 -->
        <PopUp v-model="isShowEditAvatarPopup" v-if="isShowEditAvatarPopup">
            <div class="edit-avatar-container">
                <!-- 标题 -->
                <h3 class="eac__title">编辑头像</h3>

                <!-- 编辑器 -->
                <div class="eac__editor" @click="triggerAvatarUpload">
                    <div class="eac__editor__img" v-if="editAvatarSrc">
                        <img :src="editAvatarSrc" alt=""></img>
                    </div>

                    <svg-icons name="addLargeLine" :size="30" v-else />
                </div>

                <!-- 按钮 -->
                <MyButton @click="updateAvatarFun">确认修改</MyButton>

                <input @change="handleAvatarFileChange" ref="avatarInput" type="file" :style="{ display: 'none' }">
            </div>
        </PopUp>

        <!-- 主体内容 -->
        <div class="main-wrapper">
            <!-- 左侧功能导航 -->
            <div class="function-navigation">
                <!-- 我的课程 -->
                <router-link to="/user/favorite-course" class="navigation-item">
                    <svg-icons name="bookmarkedLine" :size="20" />

                    我的课程
                </router-link>

                <!-- 我的课程 -->
                <router-link to="/user/forum" class="navigation-item">
                    <svg-icons name="newspaperLine" :size="20" />

                    我的论坛
                </router-link>

                <!-- 历史记录 -->
                <router-link to="/user/view-history" class="navigation-item">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path
                            d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12H4C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C9.25022 4 6.82447 5.38734 5.38451 7.50024L8 7.5V9.5H2V3.5H4L3.99989 5.99918C5.82434 3.57075 8.72873 2 12 2ZM13 7L12.9998 11.585L16.2426 14.8284L14.8284 16.2426L10.9998 12.413L11 7H13Z">
                        </path>
                    </svg>

                    历史记录
                </router-link>

                <!-- 设置页面 -->
                <router-link to="/user/setting" class="navigation-item">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path
                            d="M3.33946 17.0002C2.90721 16.2515 2.58277 15.4702 2.36133 14.6741C3.3338 14.1779 3.99972 13.1668 3.99972 12.0002C3.99972 10.8345 3.3348 9.824 2.36353 9.32741C2.81025 7.71651 3.65857 6.21627 4.86474 4.99001C5.7807 5.58416 6.98935 5.65534 7.99972 5.072C9.01009 4.48866 9.55277 3.40635 9.4962 2.31604C11.1613 1.8846 12.8847 1.90004 14.5031 2.31862C14.4475 3.40806 14.9901 4.48912 15.9997 5.072C17.0101 5.65532 18.2187 5.58416 19.1346 4.99007C19.7133 5.57986 20.2277 6.25151 20.66 7.00021C21.0922 7.7489 21.4167 8.53025 21.6381 9.32628C20.6656 9.82247 19.9997 10.8336 19.9997 12.0002C19.9997 13.166 20.6646 14.1764 21.6359 14.673C21.1892 16.2839 20.3409 17.7841 19.1347 19.0104C18.2187 18.4163 17.0101 18.3451 15.9997 18.9284C14.9893 19.5117 14.4467 20.5941 14.5032 21.6844C12.8382 22.1158 11.1148 22.1004 9.49633 21.6818C9.55191 20.5923 9.00929 19.5113 7.99972 18.9284C6.98938 18.3451 5.78079 18.4162 4.86484 19.0103C4.28617 18.4205 3.77172 17.7489 3.33946 17.0002ZM8.99972 17.1964C10.0911 17.8265 10.8749 18.8227 11.2503 19.9659C11.7486 20.0133 12.2502 20.014 12.7486 19.9675C13.1238 18.8237 13.9078 17.8268 14.9997 17.1964C16.0916 16.5659 17.347 16.3855 18.5252 16.6324C18.8146 16.224 19.0648 15.7892 19.2729 15.334C18.4706 14.4373 17.9997 13.2604 17.9997 12.0002C17.9997 10.74 18.4706 9.5632 19.2729 8.6665C19.1688 8.4405 19.0538 8.21822 18.9279 8.00021C18.802 7.78219 18.667 7.57148 18.5233 7.36842C17.3457 7.61476 16.0911 7.43414 14.9997 6.80405C13.9083 6.17395 13.1246 5.17768 12.7491 4.03455C12.2509 3.98714 11.7492 3.98646 11.2509 4.03292C10.8756 5.17671 10.0916 6.17364 8.99972 6.80405C7.9078 7.43447 6.65245 7.61494 5.47428 7.36803C5.18485 7.77641 4.93463 8.21117 4.72656 8.66637C5.52881 9.56311 5.99972 10.74 5.99972 12.0002C5.99972 13.2604 5.52883 14.4372 4.72656 15.3339C4.83067 15.5599 4.94564 15.7822 5.07152 16.0002C5.19739 16.2182 5.3324 16.4289 5.47612 16.632C6.65377 16.3857 7.90838 16.5663 8.99972 17.1964ZM11.9997 15.0002C10.3429 15.0002 8.99972 13.6571 8.99972 12.0002C8.99972 10.3434 10.3429 9.00021 11.9997 9.00021C13.6566 9.00021 14.9997 10.3434 14.9997 12.0002C14.9997 13.6571 13.6566 15.0002 11.9997 15.0002ZM11.9997 13.0002C12.552 13.0002 12.9997 12.5525 12.9997 12.0002C12.9997 11.4479 12.552 11.0002 11.9997 11.0002C11.4474 11.0002 10.9997 11.4479 10.9997 12.0002C10.9997 12.5525 11.4474 13.0002 11.9997 13.0002Z">
                        </path>
                    </svg>

                    设置
                </router-link>
            </div>

            <!-- 右侧内容展示 -->
            <div class="function-container">
                <router-view v-slot="{ Component }">
                    <transition name="fade-slide" mode="out-in">
                        <component :is="Component" :key="$route.fullPath" />
                    </transition>
                </router-view>
            </div>
        </div>

        <!-- 修改用户信息弹窗 -->
        <PopUp v-model="isShowUpdateUserInfoPopup" v-if="isShowUpdateUserInfoPopup">
            <!-- 错误提示 -->
            <div class="warring-wapper" v-if="isShowWarring">
                <div class="warring-info">{{ warringContent }}</div>
            </div>

            <!-- 编辑用户资料 -->
            <div class="update-userinfo-container">
                <!-- 标题 -->
                <div class="update-title">编辑资料</div>

                <!-- 表单容器 -->
                <div class="update-form">
                    <form class="form-container" action="">
                        <!-- 昵称 -->
                        <div class="form-item">
                            <div class="item-title">昵称</div>
                            <input class="item-input" placeholder="请输入昵称" v-model="updateUserInfoData.nickname"
                                type="text">
                        </div>

                        <!-- 用户名 -->
                        <div class="form-item">
                            <div class="item-title">用户名</div>
                            <input class="item-input" placeholder="请输入用户名" v-model="updateUserInfoData.username"
                                type="text">
                        </div>

                        <!-- 个性签名 -->
                        <div class="form-item">
                            <div class="item-title">个性签名</div>
                            <input class="item-input" placeholder="请输入个性签名" v-model="updateUserInfoData.bio"
                                type="text">
                        </div>
                    </form>
                </div>

                <!-- 提交按钮 -->
                <button class="form-btn" @click="updateUserInfoFun">修改资料</button>
            </div>
        </PopUp>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 引用用户状态库
import { useUserStore } from "@/stores/user";
const store = useUserStore();

import SvgIcons from '@/components/Icons/index.vue'
import MyButton from '@/components/MyButton/index.vue'

// 引入等级图标
import BadgeIcon from "./BadgeIcon.vue";

// 引入弹窗组件
import PopUp from "./components/PopUp.vue";

// 引入api
import { updateUserInfo, updateAvatar } from '@/api/user'

// 引入土司组件
import { toast } from '@/components/MyToast/toast'

// ============ 编辑头像 ==================

// 编辑头像弹窗是否打开
const isShowEditAvatarPopup = ref(false)

// 头像路径
const editAvatarSrc = ref('')

// 头像输入框
const avatarInput = ref()

// 存放图片文件
let avatarFile: File | null = null;

/** 手动触发 input */
const triggerAvatarUpload = () => {
    avatarInput.value?.click();
};

/** 处理文件变化 */
const handleAvatarFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    // 检查是否为图片
    if (!file.type.startsWith("image/")) {
        toast({ message: '请上传图片作为头像', type: 'error' })
        return;
    }

    // 生成预览 URL
    editAvatarSrc.value = URL.createObjectURL(file);

    avatarFile = file
};

// 上传图片
const updateAvatarFun = () => {
    if (!avatarFile) {
        toast({ message: '请先上传头像', type: 'error' })
        return;
    }

    const formData = new FormData()
    formData.append('avatar', avatarFile)

    updateAvatar(formData).then(() => {
        store.fetchUserInfo()
        isShowEditAvatarPopup.value = false

        toast({ message: '修改成功', type: 'success' })
    }).catch(err => {
        console.log(err);

        toast({ message: '修改失败，请重试', type: 'error' })
    })
}

// ============ 编辑头像 ==================

// =================================== 修改用户信息 ========================================

// 弹窗是否打开
const isShowUpdateUserInfoPopup = ref(false)

// 错误提示是否打开
const isShowWarring = ref(false)
// 错误提示内容
const warringContent = ref('')

// 显示错误提示
const showWarringTip = (content: string) => {
    warringContent.value = content
    isShowWarring.value = true

    setTimeout(() => {
        isShowWarring.value = false
        warringContent.value = ''
    }, 2000)
}

const updateUserInfoData = ref({
    username: store.info?.username || '',
    nickname: store.info?.nickname || '',
    bio: store.info?.bio || null,
})

// 校验函数：至少修改一个
const hasChanges = computed(() => {
    return (
        updateUserInfoData.value.username !== store.info?.username ||
        updateUserInfoData.value.nickname !== store.info?.nickname ||
        updateUserInfoData.value.bio !== store.info?.bio
    )
})

// 修改用户信息
const updateUserInfoFun = () => {
    if (!hasChanges.value) {
        showWarringTip("请至少修改一项信息")
        return
    }

    updateUserInfo(updateUserInfoData.value).then(() => {
        isShowUpdateUserInfoPopup.value = false

        if (store.info) {
            store.info.username = updateUserInfoData.value.username
            store.info.nickname = updateUserInfoData.value.nickname
            store.info.bio = updateUserInfoData.value.bio || ''
        }
        toast({ message: '修改成功', type: 'success' })
    }).catch(err => {
        if (err.response.data.error === '用户名已被占用') {
            showWarringTip("该用户名已被占用")
        }
        console.log(err, '=========');
    })
}

// =================================== 修改用户信息 ========================================

// =================== 用户等级 ========================

import { computed } from "vue";

// 定义等级和称号
const levels = [
    { level: 1, name: "启蒙学徒", minPoints: 0, maxPoints: 99 },
    { level: 2, name: "进阶学士", minPoints: 100, maxPoints: 299 },
    { level: 3, name: "卓越学者", minPoints: 300, maxPoints: 599 },
    { level: 4, name: "智慧导师", minPoints: 600, maxPoints: 999 },
    { level: 5, name: "学术大师", minPoints: 1000, maxPoints: 1999 },
    { level: 6, name: "星辰智者", minPoints: 2000, maxPoints: 4999 },
    { level: 7, name: "永恒贤者", minPoints: 5000, maxPoints: Infinity },
];

// 动态渐变（根据等级变化）
const gradient = computed(() => {
    const gradients = [
        "linear-gradient(90deg, #93C5FD, #3B82F6)", // Lv1 蓝色
        "linear-gradient(90deg, #6EE7B7, #10B981)", // Lv2 绿色
        "linear-gradient(90deg, #FCD34D, #F59E0B)", // Lv3 金色
        "linear-gradient(90deg, #FCA5A5, #EF4444)", // Lv4 红色
        "linear-gradient(90deg, #C4B5FD, #8B5CF6)", // Lv5 紫色
        "linear-gradient(90deg, #F9A8D4, #EC4899)", // Lv6 粉色
        "linear-gradient(90deg, #FDE047, #F59E0B)", // Lv7 光辉金
    ];

    return gradients[(currentLevel.value.level - 1) % gradients.length];
});

// 计算当前等级
const currentLevel = computed(() => {
    return levels.find(l => store.info?.points || 0 >= l.minPoints && store.info?.points || 0 <= l.maxPoints) || levels[0];
});

// 计算进度百分比
const progress = computed(() => {
    const level = currentLevel.value;
    if (level.maxPoints === Infinity) return 100; // 满级

    return Math.round(
        (((store.info?.points || 0) - level.minPoints) / (level.maxPoints - level.minPoints)) * 100
    )
});

// =================== 用户等级 ========================
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

.user-wrapper {
    // height: calc(100vh - var(--header-height));
    // overflow: hidden;
    display: flex;
    flex-direction: column;
    gap: 30px;

    /* 用户信息展示 */
    .user-info-container {
        width: 100%;
        height: 260px;
        justify-content: center;
        display: flex;
        gap: 100px;
        box-sizing: border-box;
        padding: 0 100px;
        // background-color: rgb(216, 216, 216);
        box-shadow: 0 0 15px rgba(0, 0, 0, 0.466) inset;
        overflow: hidden;
        border-radius: 20px;

        // 左侧头像
        .left-avatar {
            height: 100%;
            display: flex;
            align-items: center;
            user-select: none;

            .avar {
                width: 150px;
                height: 150px;
                border-radius: 50%;
                position: relative;
                cursor: pointer;

                &:hover .edit-wrapper {
                    opacity: 1;
                }

                // 编辑遮罩
                .edit-wrapper {
                    position: absolute;
                    top: 0;
                    left: 0;
                    z-index: 1;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(22, 22, 22, 0.385);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 18px;
                    font-weight: bold;
                    transition: all var(--transition-duration-default);
                    opacity: 0;
                    border-radius: 50%;
                }

                img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    border-radius: 50%;
                }

                // 头像边框
                .avatar-border {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    transform: scale(2) translateY(-3px);
                    pointer-events: none; // 防止挡住编辑事件
                    z-index: 1; // 边框在头像之上，但遮罩之下
                }
            }
        }

        // 右侧信息
        .right-info {
            display: flex;
            flex: 1;
            gap: 100px;

            // 信息容器
            .info-container {
                display: flex;
                flex-direction: column;
                justify-content: center;

                // 标题
                .info-title {
                    display: flex;
                    align-items: center;
                    font-size: 19px;
                    margin-bottom: 10px;
                    font-weight: bold;
                    gap: 10px;
                    color: var(--text-color-primary-deep);

                    svg {
                        width: 28px;
                        height: 28px;
                    }
                }

                .infor-item {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-size: 15px;
                    margin: 7px 0;

                    p {
                        margin: 0;
                        width: 70px;
                        font-weight: bold;
                    }

                    .content {
                        display: flex;
                        flex-direction: column;
                        gap: 2px;

                        // 内容描述
                        .desc {
                            display: flex;
                            align-items: center;
                            justify-content: space-between;

                            // 等级名称容器
                            .levelname-container {
                                height: 100%;
                                display: flex;
                                align-items: center;

                                // 等级名称
                                .levelname {
                                    color: rgb(103, 14, 163);
                                }
                            }
                        }

                        // 进度条
                        .progress {
                            width: 260px;
                            display: flex;
                            position: relative;
                            align-items: center;
                            gap: 7px;

                            .bar {
                                position: relative;
                                width: 100%;
                                height: 10px;
                                border-radius: 10px;
                                box-shadow: 0 0 10px rgba(189, 189, 189, 0.492);
                                background-color: rgb(89, 89, 89);

                                .reached {
                                    height: 100%;
                                    position: absolute;
                                    left: 0;
                                    top: 0;
                                    border-radius: 10px;
                                    background-color: rgb(88, 217, 101);
                                    box-shadow: 0 0 10px rgba(113, 243, 93, 0.819);
                                }
                            }
                        }
                    }
                }
            }

            // 更改信息按钮容器
            .info-btn-container {
                width: 200px;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;

                // 按钮
                .info-btn {
                    width: 120px;
                    height: 44px;
                    background-color: transparent;
                    border-radius: 6px;
                    transition: all var(--transition-duration-default);
                    border: 2px solid var(--border-color-gray-deepest);
                    color: var(--text-color-gray-dark);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    padding: 0 7px;
                    justify-content: center;
                    gap: 10px;

                    &:hover {
                        border: 2px solid var(--primary-color-100);
                        color: var(--text-color-primary);
                        transform: scale(1.05);
                    }

                    svg {
                        width: 20px;
                        height: 20px;
                    }
                }
            }
        }
    }

    // 编辑头像弹窗
    .edit-avatar-container {
        padding: 30px 70px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;

        // 标题
        .eac__title {
            margin: 0;
            font-size: 22px;
        }

        // 编辑器
        .eac__editor {
            width: 200px;
            height: 200px;
            border: 1px dashed var(--border-color-gray-deeper);
            transition: all var(--transition-duration-default);
            border-radius: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            position: relative;
            cursor: pointer;
            margin-bottom: 10px;
            color: var(--text-color-gray-default);

            &:hover {
                border: 1px dashed var(--primary-color-100);
                color: var(--text-color-primary);

                .eac__editor__img::after {
                    opacity: 1;
                }
            }

            .eac__editor__img {
                width: 100%;
                height: 100%;
                position: relative;

                &::after {
                    position: absolute;
                    content: '';
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: var(--background-color-gray-transparent-light);
                    z-index: 1;
                    opacity: 0;
                    transition: all var(--transition-duration-default);
                }

                img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
            }
        }
    }

    // 主体内容
    .main-wrapper {
        width: 100%;
        display: flex;
        gap: 20px;

        // 左侧功能导航
        .function-navigation {
            width: 240px;
            flex-shrink: 0;

            // 导航项
            .navigation-item {
                width: 100%;
                height: 40px;
                display: flex;
                align-items: center;
                border-radius: 10px;
                font-size: 15px;
                cursor: pointer;
                box-sizing: border-box;
                padding: 0 14px;
                transition: all var(--transition-duration-default);
                gap: 10px;

                &:hover {
                    background-color: var(--primary-color-300);
                    color: var(--text-color-primary-deep);
                }

                svg {
                    width: 20px;
                    height: 20px;
                }
            }

            // 选择样式
            .router-link-active {
                background-color: var(--primary-color-300);
                color: var(--text-color-primary-deep);
            }
        }

        // 右侧功能容器
        .function-container {
            flex: 1;
            position: relative;
        }
    }

    // 错误提示
    .warring-wapper {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 99;
        display: flex;
        align-items: center;
        justify-content: center;

        .warring-info {
            padding: 7px 10px;
            background-color: var(--background-color-black-deep);
            color: var(--text-color-white-light);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            border-radius: 5px;
            animation: identifier .5s;

            @keyframes identifier {
                0% {
                    transform: translateY(100%);
                    opacity: 0;
                }

                100% {
                    transform: translateY(0%);
                    opacity: 1;
                }
            }
        }
    }

    // 编辑用户信息容器
    .update-userinfo-container {
        width: 450px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 25px;
        padding: 10px;

        // 标题
        .update-title {
            font-size: 22px;
            font-weight: bold;
        }

        // 更新资料表单
        .update-form {
            width: 100%;
            user-select: none;
            display: flex;
            flex-direction: column;
            gap: 15px;

            // 表单容器
            .form-container {
                display: flex;
                flex-direction: column;
                gap: 8px;
                width: 100%;

                // 表单项
                .form-item {
                    width: 100%;
                    height: 40px;
                    border: 1px solid var(--border-color-gray-dark);
                    // border-bottom: 1px solid var(--border-color-gray-dark);
                    display: flex;
                    border-radius: 6px;
                    align-items: center;
                    box-sizing: border-box;
                    padding: 10px 20px;
                    font-size: 14px;
                    color: var(--text-color-gray-dark);
                    transition: all var(--transition-duration-default);

                    &:hover {
                        border: 1px solid var(--primary-color-100);

                        .item-title {
                            color: var(--text-color-primary);
                        }
                    }

                    &:focus-within {
                        border: 1px solid var(--primary-color-100);

                        .item-title {
                            color: var(--text-color-primary);
                        }
                    }

                    // 表单项标题
                    .item-title {
                        width: 60px;
                        line-height: 20px;
                        transition: all var(--transition-duration-default);
                    }

                    // 输入框
                    .item-input {
                        flex: 1;
                        margin-left: 15px;
                        line-height: 20px;
                        border: none;
                        outline: none;
                        box-sizing: border-box;
                        padding: 0;
                    }

                    // 密码眼
                    .eye-btn {
                        cursor: pointer;

                        &:hover {
                            color: var(--text-color-primary);
                        }

                        svg {
                            width: 20px;
                            height: 20px;
                            transition: all var(--transition-duration-default);
                        }
                    }
                }
            }
        }

        // 按钮
        .form-btn {
            width: 100%;
            height: 40px;
            border-radius: 6px;
            cursor: pointer;
            background-color: transparent;
            border: 1px solid var(--border-color-gray-deep);
            transition: all var(--transition-duration-default);

            &:hover {
                border: 1px solid var(--primary-color-100);
                color: var(--text-color-primary);
                transform: scale(1.02);
            }
        }
    }
}
</style>