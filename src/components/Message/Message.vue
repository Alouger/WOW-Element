<template>
  <div
    class="wow-message"
    :class="{
      [`wow-message--${type}`]: type,
      'is-close': showClose
    }"
    v-show="visible"
    role="alert"
    ref="messageRef"
    :style="cssStyle"
  >
    <!-- 信息显示内容 -->
    <div class="wow-message__content">
      <!-- 如果不传slot，才会显示父组件传到该组件的props属性message的值 -->
      <!-- RenderVnode可以渲染简单的字符串string类型或者复杂的VNode类型 -->
      <slot>
        <!-- 为了更好的观测，我把这些间隔值输出出来看看 -->
        {{offset}} - {{topOffset}} - {{height}} - {{bottomOffset}}
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
import { ref, onMounted, watch, computed, nextTick, getCurrentInstance } from 'vue'
import { getLastInstance, getLastBottomOffset } from './method'

const props = withDefaults(defineProps<MessageProps>(), {
  type: 'info',
  duration: 3000,
  offset: 20
});
// 控制message组件是否可见
const visible = ref(false)
const messageRef = ref<HTMLDivElement>()


// 计算偏移高度
// 这个div的高度
const height = ref(0)
// 上一个实例的最下面的坐标数字，第一个是0
const lastOffset = computed(() => getLastBottomOffset(props.id))
// 这个元素应该使用的topOffset
const topOffset = computed(() => props.offset + lastOffset.value)
// 这个元素为下一个元素预留的offset，也就是它最低端的bottom的值
// 为了把这个bottomOffset暴露出去给下一个元素使用，也要放到defineExpose里
const bottomOffset = computed(() => height.value + topOffset.value)
const cssStyle = computed(() => ({
  top: topOffset.value + 'px'
}))

// 源代码里写的是function startTimer()
const startTimer = () => {
  if (props.duration == 0) return
  setTimeout(() => {
    visible.value = false
  }, props.duration);
}
onMounted(async () => {
  visible.value = true
  startTimer()
  await nextTick()  // 等DOM节点更新完毕
  // !是非空断言操作符   .getBoundingClientRect().height动态获取组件的高度
  height.value = messageRef.value!.getBoundingClientRect().height
})
watch(visible, (newValue) => {
  if (!newValue) {
    // 如果visible的newValue是false，直接调用onDestroy
    props.onDestroy()
  }
})
defineExpose({
  // 名称相同，只写一个
  bottomOffset
})
</script>

<style scoped>
.wow-message {
  width: max-content;
  position: fixed;
  left: 50%;
  top: 20px;
  transform: translateX(-50%);
  border: 1px solid #0000FF;
}
</style>