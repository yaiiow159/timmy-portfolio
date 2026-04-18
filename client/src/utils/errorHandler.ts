import { useNotificationStore } from '@/store/notificationStore'
import i18n from '@/i18n'

export enum ErrorContext {
  ADMIN = 'admin',
  PUBLIC = 'public',
  AUTH = 'auth'
}

export interface ErrorHandlerOptions {
  context: ErrorContext
  showNotification?: boolean
  customMessage?: string
  duration?: number
}


export function handleError(
  error: any,
  options: ErrorHandlerOptions
): string {
  const { context, showNotification = true, customMessage, duration = 5000 } = options
  const notificationStore = useNotificationStore()
  const t = i18n.global.t

  let errorMessage = customMessage || error.response?.data?.msg || error.message || t('errors.general')

  if (showNotification) {
    if (context === ErrorContext.ADMIN) {
      const isAdminRoute = window.location.pathname.startsWith('/admin')
      if (!isAdminRoute) {
        console.error('Admin error suppressed in public context:', errorMessage)
        return errorMessage
      }
    }

    if (context === ErrorContext.PUBLIC) {
      const isAdminRoute = window.location.pathname.startsWith('/admin')
      if (isAdminRoute) {
        console.error('Public error suppressed in admin context:', errorMessage)
        return errorMessage
      }
    }

    notificationStore.addNotification({
      type: 'error',
      message: errorMessage,
      duration
    })
  }

  return errorMessage
}

export function handleSuccess(
  message: string,
  options: Partial<ErrorHandlerOptions> = {}
): void {
  const { showNotification = true, duration = 3000 } = options
  const notificationStore = useNotificationStore()

  if (showNotification) {
    notificationStore.addNotification({
      type: 'success',
      message,
      duration
    })
  }
}


export function isAdminContext(): boolean {
  return window.location.pathname.startsWith('/admin')
}


export function isAuthContext(): boolean {
  return window.location.pathname.startsWith('/auth')
}
