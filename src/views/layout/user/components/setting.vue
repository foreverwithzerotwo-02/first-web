<template>
    <div class="func-container">
        <!-- 标题 -->
        <div class="title">设置</div>

        <!-- 账户与安全 -->
        <div class="module-wrapper">
            <div class="module-title">账户与安全</div>

            <!-- 区域容器 -->
            <div class="module-container">
                <!-- 个人信息 -->
                <div class="small-func">
                    <div class="small-func-title">账户信息</div>

                    <div class="small-func-content account-container">
                        <label for="">账户</label>
                        <span class="bold-text">{{ store.info?.username || '' }}</span>
                    </div>

                    <div class="small-func-content account-container">
                        <label for="">密码</label>
                        <span class="bold-text" v-if="haveBeenChangePassword">{{ haveBeenChangePassword }} <i><svg
                                    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                    <path
                                        d="M12.0003 3C17.3924 3 21.8784 6.87976 22.8189 12C21.8784 17.1202 17.3924 21 12.0003 21C6.60812 21 2.12215 17.1202 1.18164 12C2.12215 6.87976 6.60812 3 12.0003 3ZM12.0003 19C16.2359 19 19.8603 16.052 20.7777 12C19.8603 7.94803 16.2359 5 12.0003 5C7.7646 5 4.14022 7.94803 3.22278 12C4.14022 16.052 7.7646 19 12.0003 19ZM12.0003 16.5C9.51498 16.5 7.50026 14.4853 7.50026 12C7.50026 9.51472 9.51498 7.5 12.0003 7.5C14.4855 7.5 16.5003 9.51472 16.5003 12C16.5003 14.4853 14.4855 16.5 12.0003 16.5ZM12.0003 14.5C13.381 14.5 14.5003 13.3807 14.5003 12C14.5003 10.6193 13.381 9.5 12.0003 9.5C10.6196 9.5 9.50026 10.6193 9.50026 12C9.50026 13.3807 10.6196 14.5 12.0003 14.5Z">
                                    </path>
                                </svg></i></span>
                        <span class="bold-text" v-else>****************** <i><svg xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24" fill="currentColor">
                                    <path
                                        d="M9.34268 18.7819L7.41083 18.2642L8.1983 15.3254C7.00919 14.8874 5.91661 14.2498 4.96116 13.4534L2.80783 15.6067L1.39362 14.1925L3.54695 12.0392C2.35581 10.6103 1.52014 8.87466 1.17578 6.96818L3.14386 6.61035C3.90289 10.8126 7.57931 14.0001 12.0002 14.0001C16.4211 14.0001 20.0976 10.8126 20.8566 6.61035L22.8247 6.96818C22.4803 8.87466 21.6446 10.6103 20.4535 12.0392L22.6068 14.1925L21.1926 15.6067L19.0393 13.4534C18.0838 14.2498 16.9912 14.8874 15.8021 15.3254L16.5896 18.2642L14.6578 18.7819L13.87 15.8418C13.2623 15.9459 12.6376 16.0001 12.0002 16.0001C11.3629 16.0001 10.7381 15.9459 10.1305 15.8418L9.34268 18.7819Z">
                                    </path>
                                </svg></i></span>
                    </div>

                    <div class="account-container">
                        <button class="little-btn" @click="openChangePasswordPopup">修改密码</button>
                    </div>
                </div>

                <!-- 安全设置 -->
                <div class="small-func">
                    <div class="small-func-title">安全设置</div>

                    <!-- 邮箱 -->
                    <div class="account-container">
                        <label for="">邮箱</label>
                        <span class="bold-text" v-if="store.info?.email">{{ store.info.email }}</span>
                        <span class="light-text" v-else>[ 未绑定 ]</span>
                        <button class="little-btn" v-if="store.info?.email">修改邮箱</button>
                        <button class="little-btn" v-else>绑定邮箱</button>
                    </div>

                    <!-- 手机号 -->
                    <div class="account-container">
                        <label for="">手机号</label>
                        <span class="light-text">[ 未绑定 ]</span>
                        <button class="little-btn">绑定手机</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- 个性化设置 -->
        <div class="module-wrapper">
            <div class="module-title">个性化设置</div>

            <!-- 区域容器 -->
            <div class="module-container">
                <!-- 个性化头像边框 -->
                <div class="small-func">
                    <div class="small-func-title">个性化头像边框</div>

                    <!-- 头像选择 -->
                    <div class="avar-border-list">
                        <div class="avar-border-item" v-for="value in avatarBorderList" :key="value.img">
                            <!-- 未解锁遮罩 -->
                            <div class="lock-wrapper">
                                <svg v-if="value.lock" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                    fill="currentColor">
                                    <path
                                        d="M19 10H20C20.5523 10 21 10.4477 21 11V21C21 21.5523 20.5523 22 20 22H4C3.44772 22 3 21.5523 3 21V11C3 10.4477 3.44772 10 4 10H5V9C5 5.13401 8.13401 2 12 2C15.866 2 19 5.13401 19 9V10ZM5 12V20H19V12H5ZM11 14H13V18H11V14ZM17 10V9C17 6.23858 14.7614 4 12 4C9.23858 4 7 6.23858 7 9V10H17Z">
                                    </path>
                                </svg>
                            </div>

                            <img :src="value.img" alt="">
                        </div>
                    </div>
                </div>
            </div>
        </div>


        <popup v-model="isShowModal" v-if="isShowModal">
            <!-- 错误提示 -->
            <div class="warring-wapper" v-if="isShowWarring">
                <div class="warring-info">{{ warringContent }}</div>
            </div>

            <!-- 修改密码 -->
            <div class="change-passwod-container">
                <!-- 标题 -->
                <h2 class="change-passwod-title">修改密码</h2>

                <!-- 表单 -->
                <div class="change-passwod-form">
                    <form class="form-container" action="">
                        <!-- 旧密码 -->
                        <div class="form-item">
                            <div class="item-title">旧密码</div>
                            <input class="item-input" v-model="changePasswordForm.old_password"
                                :type="isOpenPE ? 'text' : 'password'">
                            <!-- 密码眼睛 -->
                            <div class="eye-btn" @click="switchPEState">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                                    v-if="!isOpenPE">
                                    <path
                                        d="M9.34268 18.7819L7.41083 18.2642L8.1983 15.3254C7.00919 14.8874 5.91661 14.2498 4.96116 13.4534L2.80783 15.6067L1.39362 14.1925L3.54695 12.0392C2.35581 10.6103 1.52014 8.87466 1.17578 6.96818L3.14386 6.61035C3.90289 10.8126 7.57931 14.0001 12.0002 14.0001C16.4211 14.0001 20.0976 10.8126 20.8566 6.61035L22.8247 6.96818C22.4803 8.87466 21.6446 10.6103 20.4535 12.0392L22.6068 14.1925L21.1926 15.6067L19.0393 13.4534C18.0838 14.2498 16.9912 14.8874 15.8021 15.3254L16.5896 18.2642L14.6578 18.7819L13.87 15.8418C13.2623 15.9459 12.6376 16.0001 12.0002 16.0001C11.3629 16.0001 10.7381 15.9459 10.1305 15.8418L9.34268 18.7819Z">
                                    </path>
                                </svg>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" v-else>
                                    <path
                                        d="M12.0003 3C17.3924 3 21.8784 6.87976 22.8189 12C21.8784 17.1202 17.3924 21 12.0003 21C6.60812 21 2.12215 17.1202 1.18164 12C2.12215 6.87976 6.60812 3 12.0003 3ZM12.0003 19C16.2359 19 19.8603 16.052 20.7777 12C19.8603 7.94803 16.2359 5 12.0003 5C7.7646 5 4.14022 7.94803 3.22278 12C4.14022 16.052 7.7646 19 12.0003 19ZM12.0003 16.5C9.51498 16.5 7.50026 14.4853 7.50026 12C7.50026 9.51472 9.51498 7.5 12.0003 7.5C14.4855 7.5 16.5003 9.51472 16.5003 12C16.5003 14.4853 14.4855 16.5 12.0003 16.5ZM12.0003 14.5C13.381 14.5 14.5003 13.3807 14.5003 12C14.5003 10.6193 13.381 9.5 12.0003 9.5C10.6196 9.5 9.50026 10.6193 9.50026 12C9.50026 13.3807 10.6196 14.5 12.0003 14.5Z">
                                    </path>
                                </svg>
                            </div>
                        </div>
                        <!-- 新密码 -->
                        <div class="form-item">
                            <div class="item-title">新密码</div>
                            <input class="item-input" v-model="changePasswordForm.new_password"
                                :type="isOpenPE ? 'text' : 'password'">
                            <!-- 密码眼睛 -->
                            <div class="eye-btn" @click="switchPEState">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                                    v-if="!isOpenPE">
                                    <path
                                        d="M9.34268 18.7819L7.41083 18.2642L8.1983 15.3254C7.00919 14.8874 5.91661 14.2498 4.96116 13.4534L2.80783 15.6067L1.39362 14.1925L3.54695 12.0392C2.35581 10.6103 1.52014 8.87466 1.17578 6.96818L3.14386 6.61035C3.90289 10.8126 7.57931 14.0001 12.0002 14.0001C16.4211 14.0001 20.0976 10.8126 20.8566 6.61035L22.8247 6.96818C22.4803 8.87466 21.6446 10.6103 20.4535 12.0392L22.6068 14.1925L21.1926 15.6067L19.0393 13.4534C18.0838 14.2498 16.9912 14.8874 15.8021 15.3254L16.5896 18.2642L14.6578 18.7819L13.87 15.8418C13.2623 15.9459 12.6376 16.0001 12.0002 16.0001C11.3629 16.0001 10.7381 15.9459 10.1305 15.8418L9.34268 18.7819Z">
                                    </path>
                                </svg>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" v-else>
                                    <path
                                        d="M12.0003 3C17.3924 3 21.8784 6.87976 22.8189 12C21.8784 17.1202 17.3924 21 12.0003 21C6.60812 21 2.12215 17.1202 1.18164 12C2.12215 6.87976 6.60812 3 12.0003 3ZM12.0003 19C16.2359 19 19.8603 16.052 20.7777 12C19.8603 7.94803 16.2359 5 12.0003 5C7.7646 5 4.14022 7.94803 3.22278 12C4.14022 16.052 7.7646 19 12.0003 19ZM12.0003 16.5C9.51498 16.5 7.50026 14.4853 7.50026 12C7.50026 9.51472 9.51498 7.5 12.0003 7.5C14.4855 7.5 16.5003 9.51472 16.5003 12C16.5003 14.4853 14.4855 16.5 12.0003 16.5ZM12.0003 14.5C13.381 14.5 14.5003 13.3807 14.5003 12C14.5003 10.6193 13.381 9.5 12.0003 9.5C10.6196 9.5 9.50026 10.6193 9.50026 12C9.50026 13.3807 10.6196 14.5 12.0003 14.5Z">
                                    </path>
                                </svg>
                            </div>
                        </div>
                    </form>
                </div>

                <button class="form-btn" @click="handleChangePassword">确认修改</button>
            </div>
        </popup>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import '../fun.scss'

import popup from './PopUp.vue';

// 引入自定义土司组件
import { toast } from '@/components/MyToast/toast'

// 引入api
import { changePassword } from '@/api/user'

// 引用用户状态库
import { useUserStore } from "@/stores/user";
const store = useUserStore();

// 头像框列表
import avatarBorder1 from '@/assets/avatar-border/fire_static.png'
import avatarBorderkeji from '@/assets/avatar-border/keji.png'
import avatarBorderaixin from '@/assets/avatar-border/aiuxinkeai.png'
import avatarBorderbingshuang from '@/assets/avatar-border/ningshuang.png'
const avatarBorderList = ref([
    {
        img: avatarBorder1,
        lock: false
    },
    {
        img: avatarBorderkeji,
        lock: true
    },
    {
        img: avatarBorderaixin,
        lock: true
    },
    {
        img: avatarBorderbingshuang,
        lock: true
    },
])

// 修改的密码
const haveBeenChangePassword = ref('')

// ================== 弹窗 ======================

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

// 密码眼是否打开
const isOpenPE = ref(false)

// 切换密码眼状态
const switchPEState = () => {
    isOpenPE.value = !isOpenPE.value
}

// 是否显示弹窗
const isShowModal = ref(false)

// 修改密码表单
const changePasswordForm = ref({
    old_password: '',
    new_password: ''
})

// 打开密码弹窗
const openChangePasswordPopup = () => {
    isShowModal.value = true
}

// 修改密码
const handleChangePassword = () => {
    const { new_password, old_password } = changePasswordForm.value

    if (!old_password) {
        showWarringTip("请输入旧密码")
        return
    }

    if (!new_password) {
        showWarringTip("请输入新密码")
        return
    }

    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*]{8,}$/
    if (!passwordPattern.test(new_password)) {
        showWarringTip("新密码至少 8 位，且必须包含字母和数字")
        return
    }

    if (new_password === old_password) {
        showWarringTip("您的新密码与旧密码重复了")
        return
    }

    changePassword(changePasswordForm.value).then(() => {
        isShowModal.value = false

        toast({ message: '密码修改成功', type: 'success' })

        haveBeenChangePassword.value = new_password
    }).catch(err => {
        console.log(err);

        showWarringTip("密码错误，请输入正确的密码")
    })
}

// ================== 弹窗 ======================
</script>

<style scoped lang="scss">
.account-container {
    display: flex;
    flex-direction: column;
    margin: 15px 0;
    gap: 5px;

    svg {
        width: 20px;
        height: 20px;
        margin-left: 10px;
        cursor: pointer;
        transition: all var(--transition-duration-default);

        &:hover {
            color: var(--text-color-primary);
        }
    }
}

// 个性化头像列表
.avar-border-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr)); // 每个框 80px
    gap: 20px;
    padding: 10px;
    box-sizing: border-box;

    .avar-border-item {
        aspect-ratio: 1/1;
        position: relative;
        cursor: pointer;
        transition: all var(--transition-duration-default);

        &:hover {
            transform: scale(1.03);

            .lock-wrapper {
                opacity: 1;
            }
        }

        // 锁遮罩
        .lock-wrapper {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            z-index: 1;
            background-color: rgba(137, 137, 137, 0.487);
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: all var(--transition-duration-default);
            border-radius: 50%;

            svg {
                width: 25px;
                height: 25px;
                color: rgb(248, 248, 248);
            }
        }

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transform: scale(1.2);
        }
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

// 修改密码
.change-passwod-container {
    width: 400px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;

    // 标题
    .change-passwod-title {
        margin: 10px 0;
    }

    // 表单容器
    .change-passwod-form {
        width: 100%;
        user-select: none;
        display: flex;
        flex-direction: column;
        gap: 10px;

        // 表单容器
        .form-container {
            display: flex;
            flex-direction: column;
            gap: 6px;

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
</style>