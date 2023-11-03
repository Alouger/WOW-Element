// 这是ts的一个特殊写法，加了这个reference types就会对定义进行一个重载，重载到vitest里面一个特定的ts类型
/// <reference types="vitest" />

// 接下来把vite.config.ts的内容粘贴过来，并做一些修改，比如原本的resolve就不需要
// 然后就可以添加一些测试独有的配置了
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import VueMacros from 'unplugin-vue-macros'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    VueMacros.vite({
      plugins: {
        vue: vue(),
        vueJsx: vueJsx(),
      }
    })
  ],
  // 这个test来自reference types
  test: {
    // 把全局打开
    globals: true,
    // 选择一个要支持的dom环境，jsdom是一个对应的js库，可以在js中模拟一个对应的dom对象然后完成一些操作
    environment: 'jsdom'
  }
})
