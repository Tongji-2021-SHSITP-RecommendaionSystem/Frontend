import "fomantic-ui/dist/semantic.min.js"
import "fomantic-ui/dist/semantic.min.css"
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

createApp(App).use(router).mount('#app')
