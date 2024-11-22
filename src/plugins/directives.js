export const permission = {
  mounted(el, binding) {
    const { value } = binding
    const permissionStore = usePermissionStore()
    
    if (value && !permissionStore.hasPermission(value)) {
      el.parentNode?.removeChild(el)
    }
  }
}

export const loading = {
  mounted(el, binding) {
    if (binding.value) {
      el.classList.add('is-loading')
    }
  },
  updated(el, binding) {
    if (binding.value !== binding.oldValue) {
      el.classList.toggle('is-loading')
    }
  }
} 