<template>
    <div class="auth-wrapper">
        <div class="auth-container">
            <!-- 错误提示 -->
            <div class="warring-wapper" v-if="isShowWarring">
                <div class="warring-info">{{ warringContent }}</div>
            </div>

            <!-- 关闭按钮 -->
            <div class="close-btn" @click="authStore.close">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path
                        d="M10.5859 12L2.79297 4.20706L4.20718 2.79285L12.0001 10.5857L19.793 2.79285L21.2072 4.20706L13.4143 12L21.2072 19.7928L19.793 21.2071L12.0001 13.4142L4.20718 21.2071L2.79297 19.7928L10.5859 12Z">
                    </path>
                </svg>
            </div>

            <!-- 动画 -->
            <div>
                <!-- From Uiverse.io by Praashoo7 -->
                <div class="card">
                    <img src="https://uiverse.io/astronaut.png" alt="" class="image" />
                    <!-- <div class="heading">We're on Social Media</div> -->
                </div>

            </div>

            <!-- 表单容器 -->
            <div class="auth-form-wrapper">

                <!-- 标题 -->
                <div class="title">
                    <span v-if="authStore.mode === 'register'">轻松注册，畅享学习</span>
                    <span v-else>欢迎回来，立即登录</span>
                </div>

                <!-- 注册表单容器 -->
                <div class="login-register-container" v-if="authStore.mode === 'register'">
                    <form class="form-container" action="">
                        <!-- 账号 -->
                        <div class="form-item">
                            <div class="item-title">账号</div>
                            <input class="item-input" v-model="registerForm.username" type="text">
                        </div>
                        <!-- 邮箱 -->
                        <div class="form-item">
                            <div class="item-title">邮箱</div>
                            <input class="item-input" v-model="registerForm.email" type="text">
                        </div>
                        <!-- 密码 -->
                        <div class="form-item">
                            <div class="item-title">密码</div>
                            <input class="item-input" v-model="registerForm.password"
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
                        <!-- 确认密码 -->
                        <div class="form-item">
                            <div class="item-title">密码确认</div>
                            <input class="item-input" v-model="registerForm.password2"
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

                    <!-- 按钮 -->
                    <button class="form-btn" @click="handleRegister">注册</button>

                    <!-- 切换登录 -->
                    <div class="switch-auth">
                        已有账号？
                        <span class="switch-text" @click="switchAuthState('login')">点击登录</span>
                    </div>
                </div>

                <!-- 登录表单容器 -->
                <div class="login-register-container" v-else>
                    <form class="form-container" action="">
                        <!-- 账号 -->
                        <div class="form-item">
                            <div class="item-title">账号</div>
                            <input class="item-input" v-model="loginForm.username" type="text">
                        </div>
                        <!-- 密码 -->
                        <div class="form-item">
                            <div class="item-title">密码</div>
                            <input class="item-input" v-model="loginForm.password"
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

                    <!-- 按钮 -->
                    <button class="form-btn" @click="handleLogin">登录</button>

                    <!-- 切换登录 -->
                    <div class="switch-auth">
                        还未拥有有账号？
                        <span class="switch-text" @click="switchAuthState('register')">点击注册</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts" name="AuthModal">
import { onUnmounted, ref, watch } from 'vue';
import { lockScroll, unlockScroll } from '@/utils/scrollLock';

// 引入登录注册状态库
import { useAuthStore } from '@/stores/useAuthStore'
const authStore = useAuthStore()
// 引用用户状态库
import { useUserStore } from "@/stores/user";
const store = useUserStore();

// 引入自定义土司组件
import { toast } from '@/components/MyToast/toast'

// 引入api
import { register, login } from '@/api/user'

watch(() => authStore.visible, (newVal) => {
    if (newVal) lockScroll();
    else unlockScroll();
}, { immediate: true });
onUnmounted(() => {
    unlockScroll();
})

// 点击切换登录注册状态
const switchAuthState = (m: 'login' | 'register') => {
    authStore.mode = m
}

// 密码眼是否打开
const isOpenPE = ref(false)

// 切换密码眼状态
const switchPEState = () => {
    isOpenPE.value = !isOpenPE.value
}

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

// 注册表单数据
const registerForm = ref({
    username: "",
    email: "",
    password: "",
    password2: ""
})

// 登录表单数据
const loginForm = ref({
    username: "",
    password: ""
})

// 注册提交
function handleRegister() {
    const { username, email, password, password2 } = registerForm.value

    if (!username || username.length < 3) {
        showWarringTip("账号至少 3 个字符")
        return
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailPattern.test(email)) {
        showWarringTip("请输入有效的邮箱")
        return
    }

    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*]{8,}$/
    if (!passwordPattern.test(password)) {
        showWarringTip("密码至少 8 位，且必须包含字母和数字")
        return
    }

    if (password !== password2) {
        showWarringTip("两次密码不一致")
        return
    }

    register(registerForm.value).then(() => {
        // 成功后自动登录
        login({ username: registerForm.value.username, password: registerForm.value.password }).then(async (res) => {
            if (res.access && res.refresh) {
                authStore.close()
                toast({ message: '注册成功', type: 'success' })
                store.setTokens(res.access, res.refresh)
                // 获取用户信息
                await store.fetchUserInfo()
            }
        }).catch(err => {
            console.log(err);
            showWarringTip("自动登录失败")
        })
    }).catch(err => {
        console.log(err);

        // === 后端密码复杂度错误的处理 ===
        if (err.response?.data?.password) {
            // 假设后端返回的是 { password: ["密码必须包含大写字母"] }
            const msg = Array.isArray(err.response.data.password)
                ? err.response.data.password[0]
                : err.response.data.password
            showWarringTip(msg)
        } else if (err.response?.data?.detail) {
            // JWT 或登录失败时常见字段
            showWarringTip(err.response.data.detail)
        } else {
            showWarringTip("注册失败，请检查输入")
        }
    })
}

// 登录提交
function handleLogin() {
    const { username, password } = loginForm.value

    if (!username) {
        showWarringTip("请输入账号")
        return
    }

    if (!password) {
        showWarringTip("请输入密码")
        return
    }

    login(loginForm.value).then(async (res) => {
        if (res.access && res.refresh) {
            authStore.close()
            store.setTokens(res.access, res.refresh)
            // 获取用户信息
            const i = await store.fetchUserInfo()
            toast({ message: `欢迎回来，${i?.username}`, type: 'success' })
        }
    }).catch(err => {
        console.log(err);
        showWarringTip("账号或密码不正确，请重试")
    })
}
</script>

<style scoped lang="scss">
.auth-wrapper {
    width: 100vw;
    height: 100vh;
    background-color: var(--background-color-gray-transparent-light);
    z-index: 10000;
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    backdrop-filter: blur(2px);

    .auth-container {
        width: 420px;
        max-width: 90vw;
        display: flex;
        align-items: center;
        background-color: var(--background-color-white);
        box-sizing: border-box;
        border-radius: 10px;
        user-select: none;
        position: relative;
        box-shadow: 0 0 15px var(--background-color-black-transparent-dark);

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

        // 关闭按钮
        .close-btn {
            width: 20px;
            height: 20px;
            position: absolute;
            right: 20px;
            top: 15px;
            cursor: pointer;

            &:hover {
                color: var(--text-color-primary);
            }

            svg {
                width: 100%;
                height: 100%;
                transition: all var(--transition-duration-default);
            }
        }

        .auth-form-wrapper {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 20px;
            width: 100%;
            padding: 30px 40px;
            gap: 18px;
            box-sizing: border-box;

            // 标题
            .title {
                font-size: 22px;

            }

            // 注册表单容器
            .login-register-container {
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

                // 切换登录注册状态
                .switch-auth {
                    display: flex;
                    justify-content: center;
                    font-size: 12px;

                    .switch-text {
                        cursor: pointer;
                        text-decoration: underline;
                        transition: all var(--transition-duration-default);

                        &:hover {
                            color: var(--text-color-primary);
                        }
                    }
                }
            }
        }
    }
}

.card {
    position: absolute;
    top: 0;
    left: 0;
    width: 200px;
    transform: translateX(-85%);
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: rgb(0, 0, 0);
    font-family: Montserrat;
    font-weight: bold;
    // padding: 1em 2em 1em 1em;
    border-radius: 20px;
    z-index: 1;
    row-gap: 1em;
}

.card img {
    width: 12em;
    margin-right: 1em;
    animation: move 10s ease-in-out infinite;
    z-index: 5;
}

.image:hover {
    cursor: -webkit-grab;
    cursor: grab;
}

.icons svg {
    width: 20px;
    height: 20px;
}

.card:hover::before {
    height: 100%;
    margin-left: -4.25em;
}

.card::after {
    content: "";
    position: absolute;
    inset: 2px;
    border-radius: 20px;
    transition: all 0.4s ease-in-out;
    z-index: -1;
}

.heading {
    z-index: 2;
    transition: 0.4s ease-in-out;
}

.card:hover .heading {
    letter-spacing: 0.025em;
}

.image:active {
    cursor: -webkit-grabbing;
    cursor: grabbing;
}

.instagram svg,
.x svg,
.discord svg {
    transition: 0.3s ease-in-out;
}

.instagram:hover svg {
    scale: 1.4;
}

.x:hover svg,
.discord:hover svg {
    scale: 1.25;
}

@keyframes shootingStar {
    0% {
        transform: translateX(0) translateY(0);
        opacity: 1;
    }

    50% {
        transform: translateX(-55em) translateY(0);
        opacity: 1;
    }

    70% {
        transform: translateX(-70em) translateY(0);
        opacity: 0;
    }

    100% {
        transform: translateX(0) translateY(0);
        opacity: 0;
    }
}

@keyframes move {
    0% {
        transform: translateX(0em) translateY(0em);
    }

    25% {
        transform: translateY(-1em) translateX(-1em);
        rotate: -10deg;
    }

    50% {
        transform: translateY(1em) translateX(-1em);
    }

    75% {
        transform: translateY(-1.25em) translateX(1em);
        rotate: 10deg;
    }

    100% {
        transform: translateX(0em) translateY(0em);
    }
}

@keyframes glowing-stars {
    0% {
        opacity: 0;
    }

    50% {
        opacity: 1;
    }

    100% {
        opacity: 0;
    }
}
</style>