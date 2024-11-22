export class Cache {
  static set(key, value, expireMinutes = 30) {
    const item = {
      value,
      timestamp: new Date().getTime(),
      expire: expireMinutes * 60 * 1000
    }
    localStorage.setItem(key, JSON.stringify(item))
  }

  static get(key) {
    const item = localStorage.getItem(key)
    if (!item) return null

    const { value, timestamp, expire } = JSON.parse(item)
    if (new Date().getTime() - timestamp > expire) {
      localStorage.removeItem(key)
      return null
    }
    return value
  }
} 