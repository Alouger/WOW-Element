// import './assets/main.css'
// 导入我们写的css
import { createApp } from 'vue'
import App from './App.vue'
// import App from './App2.vue'
import './styles/index.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(fas)

createApp(App).mount('#app')
