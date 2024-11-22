import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePermissionStore = defineStore('permission', () => {
  const permissions = ref([])
  const roles = ref([])

  // 设置用户权限
  function setPermissions(perms) {
    permissions.value = perms
  }

  // 检查权限
  function hasPermission(perm) {
    return permissions.value.includes(perm)
  }

  // 检查是否有任意一个权限
  function hasAnyPermission(perms) {
    return perms.some(perm => permissions.value.includes(perm))
  }

  return {
    permissions,
    roles,
    setPermissions,
    hasPermission,
    hasAnyPermission
  }
}) 