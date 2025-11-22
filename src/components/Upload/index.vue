<template>
    <div class="upload">
        <!-- 方框 -->
        <div class="upload__box">
            <!-- 上传提示 -->
            <div class="upload__box--tip" @click="handleClick" v-if="!imageSrc">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path
                        d="M13.0001 10.9999L22.0002 10.9997L22.0002 12.9997L13.0001 12.9999L13.0001 21.9998L11.0001 21.9998L11.0001 12.9999L2.00004 13.0001L2 11.0001L11.0001 10.9999L11 2.00025L13 2.00024L13.0001 10.9999Z">
                    </path>
                </svg>
                <span>点击此处上传</span>
            </div>

            <!-- 存放图片 -->
            <div class="upload__box__img" v-else>
                <!-- 遮罩 -->
                <div class="upload__box__img--mask" @click="clickResetImage">
                    <span>重新上传</span>
                </div>
                <img :src="imageSrc" alt="">
            </div>
        </div>

        <!-- 文件输入 -->
        <input ref="fileInput" type="file" style="display: none;" @change="handleFileChange" />
    </div>
</template>

<script setup lang="ts" name="Upload">
import { onMounted, ref } from 'vue'

const props = defineProps<{
    // 用户上传文件时调用
    onFileChange: Function,
    // 默认上传的图片路径
    defaultImageUrl?: string,
}>()

onMounted(async () => {
    // 如果有默认图片路径，则先转为文件返回给父元素
    if (props.defaultImageUrl) {
        imageSrc.value = props.defaultImageUrl

        const imgFile = await imageUrlToFile(props.defaultImageUrl)

        console.log(imgFile);


        props.onFileChange(imgFile)
    }
})

// 文件输入框的引用
const fileInput = ref<HTMLInputElement | null>(null)

// 存放图片路径
const imageSrc = ref<string | null>(null)

// ========================== 工具函数 =================================

// 将图片url转为文件形式
async function imageUrlToFile(url: string, fileName?: string) {
    const response = await fetch(url)
    const blob = response.blob()

    // 获取类型
    const mimeType = (await blob).type
    const extension = mimeType.split('/')[1]

    // 如果没有扩展名，默认使用通用扩展名
    const randomFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${extension}`

    return new File([(await blob)], fileName ? fileName : randomFileName, { type: mimeType })
}

// ========================== 工具函数 =================================

// 点击上传方框时触发文件输入框的点击事件
const handleClick = () => {
    if (fileInput.value) {
        fileInput.value.click()
    }
}

// 点击重新上传
const clickResetImage = () => {
    handleClick()
}

// 监听文件输入框的变化事件
const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement

    if (target.files && target.files.length > 0) {
        // 触发父组件的 change 事件，并传递文件列表
        const file = target.files[0]

        // 将文件返回给父元素
        if (props.onFileChange) {
            props.onFileChange(file)
        }

        // 使用 FileReader 将文件转换为 Base64
        const reader = new FileReader()
        reader.onload = () => {
            imageSrc.value = reader.result as string // 将结果赋值给 imageSrc
        }
        reader.readAsDataURL(file) // 读取文件为 Data URL
    } else {
        imageSrc.value = null

        if (props.onFileChange) {
            props.onFileChange(null)
        }
    }
}
</script>

<style scoped lang="scss">
.upload {
    max-width: 100%;

    // 方框
    &__box {
        position: relative;
        width: 200px;
        max-width: 100%;
        height: 200px;
        border-radius: 5px;
        border: 1px dashed var(--border-color-gray-dark);
        box-sizing: border-box;
        transition: all 0.3s;

        // 鼠标悬停时的样式
        &:hover {
            border-color: var(--primary-color-100);
            color: var(--text-color-primary);

            & .upload__box--tip svg {
                color: var(--text-color-primary);
            }

            & .upload__box--tip span {
                color: var(--text-color-primary);
            }
        }

        // 上传提示
        &--tip {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 10px;
            width: 100%;
            height: 100%;
            cursor: pointer;

            svg {
                width: 25px;
                height: 25px;
                color: var(--text-color-gray-default);
                transition: all 0.3s;
            }

            span {
                font-size: 14px;
                transition: all 0.3s;
                color: var(--text-color-gray-default);
            }
        }

        // 存放图片
        .upload__box__img {
            position: absolute;
            width: 100%;
            height: 100%;
            border-radius: 5px;
            overflow: hidden;
            cursor: pointer;

            &:hover {
                .upload__box__img--mask {
                    opacity: 1;
                }
            }

            // 遮罩
            .upload__box__img--mask {
                position: absolute;
                width: 100%;
                height: 100%;
                left: 0;
                top: 0;
                z-index: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                background-color: var(--background-color-black-transparent);
                font-size: 20px;
                color: var(--text-color-white-default);
                transition: all var(--transition-duration-slow);
                opacity: 0;
            }

            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
        }
    }
}
</style>