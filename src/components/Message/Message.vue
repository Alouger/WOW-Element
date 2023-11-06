<template>
  <div
    class="wow-message"
    :class="{
      [`wow-message--${type}`]: type,
      'is-close': showClose
    }"
    v-show="visible"
    role="alert"
  >
    <!-- 信息显示内容 -->
    <div class="wow-message__content">
      <!-- 如果不传slot，才会显示父组件传到该组件的props属性message的值 -->
      <!-- RenderVnode可以渲染简单的字符串string类型或者复杂的VNode类型 -->
      <slot>
        <RenderVnode :vNode="message" v-if="message"/>
      </slot>
    </div>
    <div class="wow-message__close" v-if="showClose">
      <!-- @click.stop 阻止冒泡 -->
      <Icon icon="xmark" @click.stop="visible = false"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MessageProps } from './types'
import RenderVnode from '../Common/RenderVnode'
import Icon from '../Icon/Icon.vue'
import { ref, onMounted } from 'vue'

const props = withDefaults(defineProps<MessageProps>(), {
  type: 'info',
  duration: 3000
});
// 控制message组件是否可见
const visible = ref(false)

const startTimer = () => {
  if (props.duration == 0) return
  setTimeout(() => {
    visible.value = false
  }, props.duration);
}
onMounted(() => {
  visible.value = true
  startTimer()
})
</script>

<style>
.wow-message {
  width: max-content;
  position: fixed;
  left: 50%;
  top: 20px;
  transform: translateX(-50%);
  border: 1px solid #0000FF;
}
</style>