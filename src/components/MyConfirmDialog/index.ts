import { createApp, h, ref } from 'vue'
import type { Ref } from 'vue'
import MyConfirmDialog from './index.vue'

export interface ComfirmType {
    // 介绍要删除什么
    message?: string
    // 当前要干嘛，标题
    title?: string
    // 确认文本
    confirmText?: string
    // 取消文本
    cancelText?: string
    // 容器是否关闭
    visable: Ref<boolean>
    // 是否需要判断
    dicision?: boolean
}

export function useConfirm({ message, title, confirmText, cancelText, dicision }: Omit<ComfirmType, 'visable'>) {
    return new Promise<boolean>(resolve => {
        const visable = ref(true)

        // 传入的对象
        let optionObj: ComfirmType = {
            message,
            title: title ?? '删除确认',
            confirmText: confirmText ?? '确认',
            cancelText: cancelText ?? '取消',
            visable,
            dicision: dicision ?? true,
        }

        // 创建挂载容器
        const container = document.createElement('div')
        document.body.appendChild(container)

        // 存放组件关闭执行的函数
        let resolveLater: (() => void) | null = null

        // 销毁组件
        const cleanup = () => {
            container.remove()
            app.unmount()
        }

        // 打开组件
        function handleConfirm() {
            // 关闭容器
            optionObj.visable.value = false

            // 存入执行函数
            resolveLater = () => resolve(true)
        }
        // 关闭组件
        function handleCencel() {
            // 关闭容器
            optionObj.visable.value = false

            // 存入执行函数
            resolveLater = () => resolve(false)
        }
        // 动画结束后执行
        function handleAfterLeave() {
            cleanup()

            resolveLater?.()
        }

        // 创建应用
        const app = createApp({
            render() {
                return h(MyConfirmDialog, {
                    ...optionObj,
                    onConfirm: handleConfirm,
                    onCancel: handleCencel,
                    onAfterLeave: handleAfterLeave
                })
            }
        })
        // 挂载应用
        app.mount(container)
    })
}