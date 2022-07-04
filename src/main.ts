import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import locale from 'element-plus/lib/locale/lang/zh-cn'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)



app.use(router)
app.use(store)
app.use(ElementPlus, { locale })

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
router.isReady().then(() => app.mount("#app"))
