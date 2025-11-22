<template>
    <div class="container post-edit-container">
        <!-- 标题 -->
        <h2 class="title">编辑帖子</h2>

        <!-- 顶部表单容器 -->
        <div class="post-form-wrapper">
            <!-- 表单 -->
            <form action="" class="form-container">
                <!-- 帖子标题 -->
                <div class="form-item">
                    <label>标题</label>
                    <input v-model="postData.title" class="form-input" placeholder="请输入帖子标题" type="text">
                </div>

                <!-- 帖子分类 -->
                <div class="form-item">
                    <label>分类</label>
                    <my-select class="form-select" v-model="postData.category" placeholder="请选择论坛分类">
                        <my-select-item :value="value.id + ''" :label="value.name + ''" v-for="value in allCategory"
                            :key="value.id"></my-select-item>
                    </my-select>
                </div>
            </form>
        </div>

        <!-- 帖子内容 -->
        <div class="post-editor-container">
            <my-editor v-model="postContent" :uplode-image-api="uplodePostImageFun"></my-editor>
        </div>

        <!-- 按钮容器 -->
        <div class="btn-container">
            <!-- 提交按钮 -->
            <button class="btn-item" :disabled="!isCanUseBtn" @click="submitPost()">确认修改</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'

import { useRouter } from 'vue-router';
const router = useRouter()

// 引入土司
import { toast } from '@/components/MyToast/toast';

const props = defineProps<{
    id: string
}>()

import { getForumCategories } from '@/api/admin/admin_forum';
import { uploadPostImage, updatePost, getPostDetail } from '@/api/forum';
// 获取帖子内容
const getPostDetailFun = () => {
    getPostDetail(props.id).then((res: any) => {
        postContent.value = JSON.parse(res.content)
        postData.category = res.category_id + ''
        postData.title = res.title

        isCanUseBtn.value = true
    }).catch(err => {
        console.log(err);
    })
}
// 获取论坛分类
const getForumCategoriesFun = () => {
    getForumCategories().then(res => {
        allCategory.value = res
    }).catch(err => {
        console.log(err);
    })
}
// 上传帖子插图
const uplodePostImageFun = async (image: File) => {
    const formData = new FormData()

    if (!props.id) {
        return toast({
            message: '未获取到编辑章节',
            type: 'error'
        })
    }

    formData.append('image', image)

    try {
        const response = await uploadPostImage(props.id, formData) as any

        return response.image_url
    } catch (error) {
        toast({
            message: '图片上传失败',
            type: 'error'
        });
        return null
    }
}

onMounted(() => {
    getForumCategoriesFun()
    getPostDetailFun()
})

// 是否能够处理提交
const isCanUseBtn = ref(false)

// 帖子内容
const postData = reactive({
    title: '',
    category: '',
    content: '',
    is_draft: false,
})

// 论坛分类
const allCategory = ref()

// 帖子内容
const postContent = ref('')

const submitPost = () => {
    if (!postData.title.trim()) {
        toast({
            message: '请输入帖子标题',
            type: 'error',
        })
        return;
    }
    // @ts-ignore
    if (postContent.value.content.length < 3) {
        toast({
            message: '输入的帖子内容可以更丰富一些哦',
            type: 'error',
        })
        return;
    }
    if (!postData.category) {
        toast({
            message: '请选择帖子分类',
            type: 'error',
        })
        return;
    }

    postData.content = JSON.stringify(postContent.value)

    updatePost(props.id, postData).then((res: any) => {
        toast({
            message: '修改成功',
            type: 'success',
        })

        router.push({
            name: 'fourm'
        })
    }).catch(err => {
        console.log(err);

        toast({
            message: '修改失败',
            type: 'error',
        })
    })
}
</script>

<style scoped lang="scss">
.post-edit-container {
    display: flex;
    flex-direction: column;
    gap: 20px;

    .title {
        margin-bottom: 10px;
    }

    // 帖子内容表单包装
    .post-form-wrapper {
        display: flex;
        justify-content: space-between;

        // 表单容器
        .form-container {
            display: flex;
            gap: 30px;
            flex: 1;

            // 表单项
            .form-item {
                display: flex;
                flex-direction: column;
                gap: 10px;
                flex: 1;

                &:focus-within label {
                    color: var(--text-color-primary);
                }

                label {
                    flex-shrink: 0;
                    font-size: 18px;
                    font-weight: bold;
                    transition: all var(--transition-duration-default);
                }

                .form-input {
                    flex: 1;
                    width: 100%;
                    padding: 8px 10px;
                    border: 1px solid var(--border-color-gray-deep);
                    box-sizing: border-box;
                    transition: all var(--transition-duration-default);
                    border-radius: 5px;

                    &:focus {
                        outline: none;
                        border: 1px solid var(--primary-color-100);
                    }
                }

                .my-select {
                    width: 100% !important;
                }
            }
        }
    }

    // 帖子富文本
    .post-editor-container {
        height: 100%;

        .my-editor__editor-container {
            overflow: visible;

            .my-editor__editor-container__content {
                overflow: visible;
            }
        }
    }

    // 按钮容器
    .btn-container {
        display: flex;
        align-items: center;
        gap: 20px;

        // 按钮项
        .btn-item {
            height: 40px;
            width: 120px;
            cursor: pointer;
            background-color: var(--primary-color-400);
            border-radius: 8px;
            border: 1px solid var(--primary-color-100);
            color: var(--text-color-gray-dark);
            transition: all var(--transition-duration-default);

            &:hover {
                transform: scale(1.05);
                background-color: var(--primary-color-300);
                color: var(--text-color-primary-deep);
            }

            &:disabled {
                cursor: no-drop;
                background-color: var(--primary-color-500);
                color: var(--text-color-gray-default);
                border: 1px solid var(--primary-color-200);

                &:hover {
                    transform: scale(1);
                    background-color: var(--primary-color-500);
                    color: var(--text-color-gray-default);
                }
            }
        }
    }
}
</style>