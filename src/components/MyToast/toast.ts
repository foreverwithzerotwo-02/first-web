import { ref, createApp, h } from 'vue'
import MyToast from './index.vue'

export interface Toast {
  id: number
  message: string
  duration?: number
  type?: 'success' | 'error' | 'warning' | 'info'
  // 是否要悬浮暂停
  pauseOnHover?: boolean
  // 销毁组件计时器
  timeoutId?: ReturnType<typeof setTimeout>
  // 剩余时间-暂停销毁用
  remaining: number
  // 开始时间-暂停销毁用
  startTime: number
  // 是否开启了销毁-子组件暂停动画用
  isPaused?: boolean
  // 暂停销毁函数
  pause?: () => void
  // 重启销毁函数
  resume?: () => void
  // 点击立即销毁函数
  close: () => void
}

const toasts = ref<Toast[]>([])
let mounted = false

function ensureContainerMounted() {
  if (mounted) return

  const container = document.createElement('div')
  document.body.appendChild(container)

  const app = createApp({
    render: () => h(MyToast, { toasts: toasts.value }) // ✅ 注意这里
  })

  app.mount(container)
  mounted = true
}

export function toast({ message, duration = 5000, pauseOnHover = false, type = 'info' }: Omit<Toast, 'id' | 'startTime' | 'remaining' | 'close'>) {
  ensureContainerMounted()

  const id = Date.now()

  // 记录启动时间--暂停销毁用
  const startTime = Date.now()
  // 初始化剩余时间--暂停销毁用
  let remaining = duration

  // 创建传入给子组件的对象
  const toastObj = ref<Toast>({
    id,
    type,
    message,
    duration,
    startTime,
    remaining,
    pauseOnHover,
    close: removeToast
  })

  // 销毁函数
  function removeToast() {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  // 如果用户启用移入暂停销毁
  if (pauseOnHover) {
    // 暂停销毁函数
    toastObj.value.pause = () => {
      // 计算剩余时间
      toastObj.value.remaining -= Date.now() - toastObj.value.startTime

      // 暂停销毁
      clearTimeout(toastObj.value.timeoutId)

      // 已暂停
      toastObj.value.isPaused = true
    }
    // 重启销毁函数
    toastObj.value.resume = () => {
      // 记录开始时间
      toastObj.value.startTime = Date.now()
      // 开启销毁
      toastObj.value.timeoutId = setTimeout(removeToast, toastObj.value.remaining)

      // 已开启
      toastObj.value.isPaused = false
    }
  }

  toastObj.value.timeoutId = setTimeout(removeToast, duration)

  toasts.value.push(toastObj.value) // ✅ 使用 push 添加在末尾
}

