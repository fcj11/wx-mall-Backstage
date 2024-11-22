import { createI18n } from 'vue-i18n'

const messages = {
  zh: {
    message: {
      hello: '你好',
      // ... 其他翻译
    }
  },
  en: {
    message: {
      hello: 'Hello',
      // ... 其他翻译
    }
  }
}

export const i18n = createI18n({
  locale: 'zh',
  fallbackLocale: 'en',
  messages
}) 