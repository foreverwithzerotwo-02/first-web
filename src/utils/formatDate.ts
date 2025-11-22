/**
 * 日期格式化工具函数（支持相对时间）
 * @param dateInput 日期字符串 / Date 对象 / 时间戳
 * @param formatStr 格式字符串，如 "yyyy/MM", "yyyy-MM-dd HH:mm:ss"
 * @param relativeDays 超过多少天才显示为格式化日期（默认 7 天内用相对时间）
 * @returns 格式化后的字符串
 */
const formatDate = (
  dateInput: string | number | Date,
  formatStr = 'yyyy年MM月dd日 HH:mm',
  relativeDays = 7
): string => {
  if (!dateInput) return ''

  const date = new Date(dateInput)
  const now = new Date()

  const diffMs = now.getTime() - date.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)

  // 判断是否在 relativeDays 天内，显示相对时间
  if (diffDay < relativeDays) {
    if (diffSec < 60) return `${diffSec}秒前`
    if (diffMin < 60) return `${diffMin}分钟前`
    if (diffHour < 24) return `${diffHour}小时前`
    return `${diffDay}天前`
  }

  // 超过 relativeDays 就用格式化方式
  const map: Record<string, string> = {
    yyyy: date.getFullYear().toString(),
    MM: String(date.getMonth() + 1).padStart(2, '0'),
    dd: String(date.getDate()).padStart(2, '0'),
    HH: String(date.getHours()).padStart(2, '0'),
    mm: String(date.getMinutes()).padStart(2, '0'),
    ss: String(date.getSeconds()).padStart(2, '0'),
  }

  let result = formatStr
  for (const key in map) {
    result = result.replace(key, map[key])
  }

  return result
}

export default formatDate
