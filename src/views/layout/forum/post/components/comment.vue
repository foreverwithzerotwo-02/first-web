<template>
    <div class="comment-container">
        <!-- 名称 -->
        <h2>评论</h2>

        <!-- 回复帖子 -->
        <div v-if="!replyingTo" class="cc__reply-container">
            <!-- 标题 -->
            <h3>发表评论</h3>

            <!-- 评论区域 -->
            <div class="cc__comment-area" v-if="userStore.isAuthenticated">
                <!-- 输入框 -->
                <my-input v-model="commentContent" class="ca__imput" type="textarea"
                    placeholder="快快输入自己的感想吧"></my-input>

                <!-- 发布区域 -->
                <div class="cc__publish-area">
                    <my-button @click="createCommentFun">发布评论</my-button>
                </div>
            </div>

            <!-- 提示登录 -->
            <div class="cc__tip-login" v-else>
                快快登录，发表自己的看法吧
            </div>
        </div>

        <!-- 评论 -->
        <div class="cc__comment-wrapper" v-if="allComment?.length > 0">
            <!-- 内容 -->
            <div class="cc__comment-container" v-for="value in allComment" :key="value.id">
                <!-- 头像 -->
                <div class="cw__avatar">
                    <img :src="value.user_info.avatar" alt="">
                </div>

                <!-- 评论内容 -->
                <div class="cw__comment-content-container" :id="'comment-' + value.id">
                    <!-- 用户名 -->
                    <div class="ccc__author-name">{{ value.user_info.nickname || '匿名用户' }}</div>

                    <!-- 评论内容 -->
                    <div class="ccc__content">{{ value.content }}</div>

                    <!-- 评论操作 -->
                    <ul class="ccc__action">
                        <!-- 发布时间 -->
                        <li>
                            <svg-icons name="time" :size="17" />

                            <span>{{ commentCreateTime(value.created_at) }}</span>
                        </li>
                        <!--  点赞 -->
                        <li>
                            <svg-icons name="thumbUpLine" :size="17" />

                            赞
                        </li>

                        <!-- 评论 -->
                        <li class="action__item" @click="switchReplyingTo(value.id)">
                            <svg-icons name="chatAiLine" :size="17" />

                            评论
                        </li>
                    </ul>

                    <!-- 更多评论 -->
                    <div class="ccc__comment-more-container" id="comment-" v-if="value.replies.length > 0">

                        <ul class="ccc__comment-more-box">
                            <!-- 名称 -->
                            <li class="cmb__area-name">回复</li>

                            <!-- 二级评论 -->
                            <li class="cmb__level-two" v-for="value2 in value.replies" :key="value2.id">
                                <!-- 头像 -->
                                <div class="lt__avatar">
                                    <img :src="value2.user_info.avatar" alt="">
                                </div>

                                <!-- 内容 -->
                                <div class="lt__content">
                                    <!-- 作者名称 -->
                                    <div class="content-name">{{ value2.user_info.nickname || '匿名用户' }}</div>

                                    <!-- 评论内容 -->
                                    <div class="content-text">{{ value2.content }}</div>

                                    <!-- 评论操作 -->
                                    <ul class="ccc__action">
                                        <!-- 发布时间 -->
                                        <li>
                                            <svg-icons name="time" :size="17" />

                                            <span>{{ commentCreateTime(value2.created_at) }}</span>
                                        </li>
                                        <!--  点赞 -->
                                        <li>
                                            <svg-icons name="thumbUpLine" :size="17" />

                                            赞
                                        </li>

                                        <!-- 评论 -->
                                        <li>
                                            <svg-icons name="chatAiLine" :size="17" />

                                            回复
                                        </li>
                                    </ul>
                                </div>
                            </li>

                            <!-- 总共几条 -->
                            <li class="cmb__comment-count">
                                {{ `共${value.replies.length}条回复` }}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <!-- 无评论状态 -->
        <div class="cc__no-have-comment" v-else>
            暂无评论，快快发表自己的看法吧
        </div>

        <!-- 回复区域 -->
        <teleport v-if="replyingTo" :to="`#comment-${replyingTo}`">
            <div class="cc__reply-container">
                <!-- 标题 -->
                <h3>发表评论</h3>

                <!-- 评论区域 -->
                <div class="cc__comment-area">
                    <!-- 输入框 -->
                    <my-input v-model="commentContent" class="ca__imput" type="textarea"
                        placeholder="快快输入自己的感想吧"></my-input>

                    <!-- 发布区域 -->
                    <div class="cc__publish-area">
                        <my-button @click="createCommentFun">发布评论</my-button>
                        <my-button @click="closeReplying">关闭</my-button>
                    </div>
                </div>
            </div>
        </teleport>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import SvgIcons from '@/components/Icons/index.vue';

// 格式化时间
import formatDate from '@/utils/formatDate'

// 引入用户信息状态库
import { useUserStore } from '@/stores/user';
const userStore = useUserStore()

import MyInput from '@/components/MyInput/index.vue'
import MyButton from '@/components/MyButton/index.vue'
import { toast } from '@/components/MyToast/toast';

// 对应api
import { createComment, getComments } from '@/api/forum';
// 获取评论
const getCommentsFun = () => {
    getComments(props.postId).then(res => {
        allComment.value = res
    }).catch(err => {
        console.log(err);
    })
}

const props = defineProps<{
    postId: number
}>()

onMounted(() => {
    getCommentsFun()
})


// ------------------------- 评论区 变量 -------------------------------

// 回复区域去的位置
const replyingTo = ref<number | null>(null);

// 全部评论
const allComment = ref()

// ------------------------- 评论区 变量 -------------------------------

// ========================================= 评论区 函数 ================================================

// 发布时间
const commentCreateTime = (date: string) => {
    return formatDate(date, 'yyyy-MM-dd HH:mm')
}

// 切换回复区域位置
const switchReplyingTo = (id: number) => {
    if (!userStore.isAuthenticated) {
        toast({ message: '请先登录', type: 'error' })
        return
    }

    replyingTo.value = id
}

// 关闭回去区域
const closeReplying = () => {
    replyingTo.value = null
}

// ========================================= 评论区 函数 ================================================


// ---------------------- 联系后端操作评论 变量 ----------------------------------

// 评论内容
const commentContent = ref('')

// ---------------------- 联系后端操作评论 变量 ----------------------------------

// ======================================= 联系后端操作评论 函数 =====================================================

// 创建评论
const createCommentFun = () => {
    if (!commentContent.value) {
        toast({ message: '请输入评论内容', type: 'error' })

        return
    }

    const args: [number, string, number?] = [props.postId, commentContent.value]

    if (replyingTo.value) {
        args.push(replyingTo.value)
    }

    createComment(...args)
        .then(res => {
            commentContent.value = ''

            allComment.value.push(res)

            toast({ message: '评论成功', type: 'success' })
        })
        .catch(err => console.log(err))
}

// ======================================= 联系后端操作评论 函数 =====================================================
</script>

<style scoped lang="scss">
ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.comment-container {
    width: 100%;
    margin: 20px 0;

    // 回复容器
    .cc__reply-container {
        width: 100%;
        display: flex;
        gap: 30px;
        margin: 40px 0 20px;
        box-sizing: border-box;

        h3 {
            margin: 0;
            flex-shrink: 0;
        }

        // 评论区域
        .cc__comment-area {
            flex: 1;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            gap: 10px;

            // 输入框
            :deep(.my-input__inner) {
                min-height: 120px;
                width: 100%;
            }

            // 发布区域
            .cc__publish-area {
                display: flex;
                justify-content: flex-end;
                gap: 20px;
            }
        }

        // 提示登录
        .cc__tip-login {
            flex: 1;
            height: 150px;
            border: 1px solid var(--border-color-gray-deeper);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            border-radius: 10px;
        }
    }

    // 评论区
    .cc__comment-wrapper {
        display: flex;
        flex-direction: column;
        padding: 10px;
        gap: 50px;

        .cc__comment-container:not(:last-of-type) .cw__comment-content-container {
            border-bottom: 1px solid var(--border-color-gray-deeper);
            padding-bottom: 35px;
        }

        .cc__comment-container {
            display: flex;
            align-items: flex-start;
            gap: 20px;
        }

        // 头像
        .cw__avatar {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            overflow: hidden;

            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
        }

        // 评论内容容器
        .cw__comment-content-container {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 12px;

            // 用戶名
            .ccc__author-name {
                font-weight: bold;
            }

            // 评论操作
            .ccc__action {
                display: flex;
                align-items: center;
                gap: 20px;
                font-size: 14px;

                // 操作按钮
                .action__item {
                    cursor: pointer;

                    &:hover {
                        text-decoration: underline;
                        color: var(--text-color-primary-deep);
                    }
                }
            }

            // 更多评论容器
            .ccc__comment-more-container {
                display: flex;
                flex-direction: column;
            }

            // 更多评论
            .ccc__comment-more-box {
                width: 100%;
                padding: 25px 20px;
                background-color: var(--background-color-gray-light-more);
                border-radius: 10px;
                box-sizing: border-box;
                display: flex;
                flex-direction: column;
                gap: 20px;

                // 区域名称
                .cmb__area-name {
                    font-size: 20px;
                    font-weight: bold;
                    margin-bottom: 10px;
                }

                // 二级评论
                .cmb__level-two {
                    display: flex;
                    gap: 20px;

                    // 头像
                    .lt__avatar {
                        width: 40px;
                        height: 40px;
                        border-radius: 50%;
                        overflow: hidden;

                        img {
                            width: 100%;
                            height: 100%;
                            object-fit: cover;
                        }
                    }

                    // 内容
                    .lt__content {
                        flex: 1;
                        display: flex;
                        flex-direction: column;
                        gap: 10px;
                        padding-bottom: 20px;
                        border-bottom: 1px solid var(--border-color-gray-deeper);
                    }

                    &:last-of-type .lt__content {
                        border-bottom: none;
                        padding-bottom: 0;
                    }
                }

                // 回复总数
                .cmb__comment-count {
                    text-decoration: underline;
                    color: var(--text-color-primary-deep);
                    font-size: 14px;
                    margin-top: 20px;
                }
            }
        }
    }

    // 暂无评论
    .cc__no-have-comment {
        width: 100%;
        height: 200px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
    }
}
</style>