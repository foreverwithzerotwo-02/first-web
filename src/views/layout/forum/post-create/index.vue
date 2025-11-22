<template>
    <div class="container post-create">
        <!-- 标题 -->
        <h2 class="title">创建帖子</h2>

        <!-- 顶部表单容器 -->
        <div class="post-form-wrapper">
            <!-- 表单 -->
            <form action="" class="form-container">
                <!-- 帖子标题 -->
                <div class="form-item">
                    <label>标题</label>
                    <input v-model="addPostValue.title" class="form-input" placeholder="请输入帖子标题" type="text">
                </div>

                <!-- 帖子分类 -->
                <div class="form-item">
                    <label>分类</label>
                    <my-select class="form-select" v-model="addPostValue.category" placeholder="请选择论坛分类">
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
            <button class="btn-item" :disabled="!isCanUseBtn" @click="submitPost()">发布帖子</button>

            <!-- 保存草稿 -->
            <button class="btn-item" :disabled="!isCanUseBtn" @click="submitPost(true)">保存草稿</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';

import { useRouter, onBeforeRouteLeave } from 'vue-router';
const router = useRouter()
onBeforeRouteLeave((_to, _from, next) => {
    const answer = window.confirm('您有未保存的内容，确定要离开吗？')
    if (answer) {
        next()
    } else {
        next(false)
    }
})

window.addEventListener('beforeunload', function (event) {
    event.preventDefault();
    // 某些浏览器需要显式设置 returnValue
    event.returnValue = '您有未保存的内容，确定要离开吗？';
});

// 引入土司
import { toast } from '@/components/MyToast/toast';
// 引入确认弹出框
import { useConfirm } from '@/components/MyConfirmDialog';

import MyEditor from '@/components/MyEditor/index.vue'
import MySelect from '@/components/MySelect/index.vue'
import MySelectItem from '@/components/MySelect/MySelectItem/index.vue'

// 引入api
import { getForumCategories } from '@/api/admin/admin_forum';
import { createPost, getPostDrafts, deletePost, uploadPostImage, updatePost } from '@/api/forum';
// 新建帖子
const createPostFun = () => {
    createPost(addPostValue).then((res: any) => {
        addPostValue.id = res.id

        isCanUseBtn.value = true
    }).catch(err => {
        console.log(err);

        toast({ message: '哦NO，好像出错了，请尝试重新进入', type: 'error' })
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
// 获取帖子草稿
const getPostDraftsFun = () => {
    getPostDrafts().then(async (res: any) => {
        // 判断是否有草稿，没有新建初始
        if (res.length <= 0) {
            // 新建初始草稿
            createPostFun()

            return
        }

        // 是否继续编辑
        let is = false

        // 有值再询问，没有直接继续
        if (res[0].title || res[0].category || res[0].content) {
            is = await useConfirm({ message: '是否继续编辑上一次的草稿', confirmText: '删除', cancelText: '继续', title: '继续编辑' })
        }

        if (!is) {
            // 继续编辑
            addPostValue.id = res[0].id
            addPostValue.title = res[0].title
            postContent.value = res[0].content ? JSON.parse(res[0].content) : ''
            addPostValue.category = res[0].category + ''
        } else {
            // 删除草稿，重新新建
            deletePost(res[0].id).then(() => {
                // 新建
                createPostFun()
            }).catch(err => {
                console.log(err);

                toast({ message: '哦NO，好像出错了，请尝试重新进入', type: 'error' })
            })
        }

        isCanUseBtn.value = true
    }).catch(err => {
        console.log(err);
    })
}
// 上传帖子插图
const uplodePostImageFun = async (image: File) => {
    const formData = new FormData()

    if (!addPostValue.id) {
        return toast({
            message: '未获取到编辑章节',
            type: 'error'
        })
    }

    formData.append('image', image)

    try {
        const response = await uploadPostImage(addPostValue.id, formData) as any

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

    getPostDraftsFun()
})

// 是否能够处理提交
const isCanUseBtn = ref(false)

// 帖子富文本内容
const postContent = ref('')

// 添加帖子内容表单
const addPostValue = reactive({
    id: null,
    title: '',
    content: '',
    category: '',
    is_draft: true,
})

// 全部分类
const allCategory = ref()

// 清空内容
const clearPostValue = () => {
    addPostValue.title = ''
    addPostValue.content = ''
    addPostValue.category = ''
    addPostValue.is_draft = true

    postContent.value = ''
}

// 提交按钮
const submitPost = (is_draft = false) => {
    if (!addPostValue.title.trim()) {
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
    if (!addPostValue.category) {
        toast({
            message: '请选择帖子分类',
            type: 'error',
        })
        return;
    }

    addPostValue.content = JSON.stringify(postContent.value)

    if (!is_draft) addPostValue.is_draft = false

    if (!addPostValue.id) {
        toast({
            message: '哦NO，出错了，请重试',
            type: 'error',
        })

        return
    }


    updatePost(addPostValue.id, addPostValue).then((res: any) => {
        toast({
            message: is_draft ? '保存草稿成功' : '发布成功',
            type: 'success',
        })

        if (!is_draft) {
            clearPostValue()

            // 重新新建草稿
            // createPostFun()

            // 跳转至帖子
            router.push({
                name: 'post',
                params: {
                    id: res.id
                }
            })
        }
    }).catch(err => {
        console.log(err);

        toast({
            message: is_draft ? '保存草稿失败' : '发布失败',
            type: 'error',
        })
    })
}
</script>

<style scoped lang="scss">
.post-create {
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