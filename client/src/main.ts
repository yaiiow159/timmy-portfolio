import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from './store'
import i18n from './i18n'
import './style.css'


// Create and mount the app
const app = createApp(App)

// Use plugins
app.use(router)
app.use(pinia)
app.use(i18n)

app.mount('#app')
