import { createApp } from 'vue'
// import './style.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import { useDark } from '@vueuse/core'

import App from './App.vue'
import { router } from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

createApp(App).use(router).use(ElementPlus).mount('#app')


useDark({ valueDark: 'dark', valueLight: 'light', storageKey: null })
