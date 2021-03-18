import "fomantic-ui/dist/semantic.min.js"
import "fomantic-ui/dist/semantic.min.css"
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App);
(document as any).global = {};
app.use(router);
app.mount("#app");