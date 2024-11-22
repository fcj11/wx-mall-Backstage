// 日期格式化
export function formatDate(date, fmt = 'YYYY-MM-DD HH:mm:ss') {
  // ...实现日期格式化
}

// 金额格式化
export function formatMoney(amount, decimals = 2) {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: decimals
  }).format(amount)
}

// 防抖函数
export function debounce(func, wait) {
  let timeout
  return function (...args) {
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(this, args), wait)
  }
}

// 节流函数
export function throttle(func, wait) {
  let previous = 0
  return function (...args) {
    const now = Date.now()
    if (now - previous > wait) {
      func.apply(this, args)
      previous = now
    }
  }
} 