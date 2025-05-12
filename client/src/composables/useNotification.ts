import { ref } from 'vue';

type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface Notification {
  id: number;
  message: string;
  type: NotificationType;
  timeout: number;
}

const notifications = ref<Notification[]>([]);
let nextId = 1;

export function useNotification() {
  const showNotification = (message: string, type: NotificationType = 'info', timeout = 5000) => {
    const id = nextId++;
    const notification: Notification = {
      id,
      message,
      type,
      timeout
    };
    
    notifications.value.push(notification);
    
    if (timeout > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, timeout);
    }
    
    return id;
  };
  
  const removeNotification = (id: number) => {
    const index = notifications.value.findIndex(n => n.id === id);
    if (index !== -1) {
      notifications.value.splice(index, 1);
    }
  };
  
  return {
    notifications,
    showNotification,
    removeNotification
  };
}
