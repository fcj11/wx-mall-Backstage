import { ElMessage } from 'element-plus'

export class ErrorHandler {
  static handle(error, vm, info) {
    console.error('Error:', error)
    console.error('Vue Instance:', vm)
    console.error('Info:', info)

    // 发送错误到日志服务器
    this.sendErrorLog({
      error: error.message,
      stack: error.stack,
      info,
      url: window.location.href,
      timestamp: new Date().toISOString()
    })

    // 显示用户友好的错误消息
    ElMessage.error('系统出现错误，请稍后重试')
  }

  static sendErrorLog(errorInfo) {
    // 实现错误日志上报逻辑
  }
} 