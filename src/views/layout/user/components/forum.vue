<template>
    <div class="func-container">
        <!-- 内容分类标签容器 -->
        <el-tabs v-model="activeName" class="demo-tabs">
            <el-tab-pane label="个人动态" name="first">
                <!-- 帖子容器 -->
                <div class="posts-wrapper">
                    <div class="pw__post-container" v-if="allUserPosts?.results?.length > 0"
                        v-for="(value, index) in allUserPosts?.results" :key="value.id">
                        <!-- 个人头像 -->
                        <div class="pc__avatar">
                            <img :src="userStore.info?.avatar || ''" alt="">
                        </div>

                        <!-- 帖子内容 -->
                        <div class="pc__post-detail-wrapper">
                            <!-- 用户名 -->
                            <div class="pdw__user-name">
                                <span>{{ userStore.info?.nickname || '' }}</span>

                                <!-- 帖子操作按钮容器 -->
                                <div class="un__tool-container">
                                    <!-- 按钮项 -->
                                    <!-- 编辑 -->
                                    <div class="tool-item edit" @click="goToEditPost(value.id)">
                                        <svg-icons name="editLine" :size="20" />
                                        <span>编辑</span>
                                    </div>
                                    <!-- 删除 -->
                                    <div class="tool-item delete" @click="deletePostFun(value.id, index)">
                                        <svg-icons name="deleteBinLine" :size="20" />
                                        <span>删除</span>
                                    </div>
                                </div>
                            </div>

                            <!-- 帖子状态 -->
                            <div class="pdw__state">
                                <!-- 发布时间 -->
                                <div class="state__time">
                                    <p class="time">
                                        <svg-icons name="time" />
                                        <span>{{ postCreateTime(value.created_at) }}</span>
                                    </p>
                                    <span>•</span>
                                    <span>{{ value.is_draft ? '草稿' : '已发布' }}</span>
                                </div>
                            </div>

                            <!-- 帖子内容 -->
                            <div class="pdw__content-container" @click="goToPostView(value.id)">
                                <!-- 帖子标题 -->
                                <div class="cc__title">
                                    {{ value.title }}
                                </div>

                                <!-- 帖子内容 -->
                                <div class="cc__text">{{ getSummary(value.content, 120) }}</div>
                            </div>

                            <!-- 帖子其他内容 -->
                            <div class="pdw__other-box">
                                <!-- 点赞 -->
                                <div class="box-item">
                                    <svg-icons name="thumbUpLine" :size="17" />
                                    <span>{{ value.like_count }}</span>
                                </div>

                                <!-- 收藏 -->
                                <div class="box-item">
                                    <svg-icons name="bookmarkLine" :size="17" />
                                    <span>{{ value.favorite_count }}</span>
                                </div>

                                <!-- 评论数 -->
                                <div class="box-item">
                                    <svg-icons name="chatAiLine" :size="17" />
                                    <span>{{ value.reply_count }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 没有内容 -->
                    <div class="pw__not-content" v-else>
                        您还未发表内容，快去发布帖子吧
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane label="Config" name="second">Config</el-tab-pane>
            <el-tab-pane label="Role" name="third">Role</el-tab-pane>
            <el-tab-pane label="Task" name="fourth">Task</el-tab-pane>
        </el-tabs>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router';
const router = useRouter()

import SvgIcons from '@/components/Icons/index.vue';

// 格式化时间
import formatDate from '@/utils/formatDate'

import { useConfirm } from '@/components/MyConfirmDialog';
import { toast } from '@/components/MyToast/toast';

// 引入api
import { getUserPosts, deletePost } from '@/api/forum';
// 获取个人帖子
const getUserPostsFun = () => {
    getUserPosts().then(res => {
        allUserPosts.value = res
    })
}

// 引入用户信息状态库
import { useUserStore } from '@/stores/user';
const userStore = useUserStore()

onMounted(() => {
    getUserPostsFun()
})

// ---------------- 全局变量 ---------------

const activeName = ref('first')

// ---------------- 全局变量 ---------------

// ======================================= 全局函数 ==============================================

// 发布时间
const postCreateTime = (date: string) => {
    return formatDate(date, 'yyyy-MM-dd HH:mm')
}

// ======================================= 全局函数 ==============================================


// --------------- 发布的帖子 变量 --------------------

// 全部帖子
const allUserPosts = ref()

// --------------- 发布的帖子 变量 --------------------

// =================================== 发布帖子 函数 ==========================================

// 提取文本内容
function extractText(node: any): string {
    if (!node) return ''
    if (node.type === 'text') return node.text
    if (node.content) return node.content.map(extractText).join('')
    return ''
}

// 获取帖子内容摘要
function getSummary(content: string, length = 100): string {
    try {
        const obj = JSON.parse(content)
        const text = extractText(obj)
        return text.length > length ? text.slice(0, length) + '...' : text
    } catch (e) {
        return ''
    }
}

// 跳转至帖子
const goToPostView = (id: number) => {
    router.push({
        name: 'post',
        params: {
            id
        }
    })
}

// 跳转至编辑帖子
const goToEditPost = (id: number) => {
    router.push({
        name: 'post-edit',
        params: {
            id
        }
    })
}

// 删除帖子
const deletePostFun = async (id: number, index: number) => {
    const is = await useConfirm({ message: '是否要删除该帖子' })
    if (!is) return

    deletePost(id).then(() => {
        toast({ message: '删除成功', type: 'success' })

        allUserPosts.value.results.splice(index, 1)
    }).catch(err => {
        console.log(err);

        toast({ message: '删除失败，请重试', type: 'error' })
    })
}

// =================================== 发布帖子 函数 ==========================================
</script>

<style scoped lang="scss">
.demo-tabs {
    position: sticky;
    top: 0;

    :deep(.el-tabs__item) {
        font-size: 20px;
    }

    .posts-wrapper {
        padding: 10px 0;
        display: flex;
        flex-direction: column;
        gap: 25px;

        // 个人动态帖子
        .pw__post-container {
            display: flex;
            gap: 20px;
            border: 1px solid var(--border-color-gray-dark);
            padding: 27px 20px;
            border-radius: 10px;

            // 个人头像
            .pc__avatar {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                overflow: hidden;
                flex-shrink: 0;

                img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
            }

            // 帖子内容
            .pc__post-detail-wrapper {
                display: flex;
                flex-direction: column;
                gap: 12px;
                flex: 1;

                // 用户名
                .pdw__user-name {
                    font-size: 18px;
                    font-weight: bold;
                    color: rgb(255, 129, 150);
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    box-sizing: border-box;

                    // 操作工具容器
                    .un__tool-container {
                        display: flex;
                        gap: 20px;
                        color: var(--text-color-gray-default);

                        .tool-item {
                            display: flex;
                            align-items: center;
                            gap: 6px;
                            font-size: 16px;
                            cursor: pointer;
                            transition: all var(--transition-duration-default);

                            &.edit:hover {
                                color: rgb(255, 129, 150);
                            }

                            &.delete:hover {
                                color: red;
                            }
                        }
                    }
                }

                // 帖子状态
                .pdw__state {
                    display: flex;
                    gap: 15px;
                    color: var(--text-color-gray-default);

                    // 发布时间
                    .state__time {
                        display: flex;
                        gap: 12px;
                        font-size: 14px;

                        .time {
                            margin: 0;
                            display: flex;
                            align-items: center;
                            gap: 6px;
                        }
                    }
                }

                // 帖子内容
                .pdw__content-container {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    box-sizing: border-box;
                    padding: 0 15px;
                    border-left: 2px solid var(--border-color-gray-dark);
                    cursor: pointer;
                    transition: all var(--transition-duration-default);
                    margin: 10px 0;

                    &:hover {
                        color: var(--text-color-primary);
                        text-decoration: underline;
                    }

                    // 标题
                    .cc__title {
                        font-weight: bold;
                        font-size: 18px;
                    }

                    // 帖子内容
                    .cc__text {
                        line-height: 22px;
                    }
                }

                // 其他内容
                .pdw__other-box {
                    display: flex;
                    justify-content: space-between;
                    box-sizing: border-box;
                    padding-right: 100px;
                    margin-top: 10px;

                    .box-item {
                        display: flex;
                        align-items: center;
                        gap: 5px;
                        transition: all var(--transition-duration-default);
                        cursor: pointer;

                        &:hover {
                            color: var(--text-color-primary-deep);
                        }
                    }
                }
            }
        }

        // 无内容
        .pw__not-content{
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 200px;
            font-size: 20px;
        }
    }
}
</style>