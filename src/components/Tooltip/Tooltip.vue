<template>
    <div
      class="wow-tooltip"
      ref="popperContainerNode"
      v-on="outerEvents"
    >
      <div
        class="wow-tooltip__trigger"
        ref="triggerNode"
        v-on="events"
      >
        <!-- 这里是个默认的slot，哪个节点触发就写在这里面 -->
        <slot />
      </div>
      <div
        v-if="isOpen"
        class="wow-tooltip__popper"
        ref="popperNode"
      >
        <slot name="content">
            {{ content }}
        </slot>
      </div>
    </div>
</template>

<script setup lang="ts">
import { createPopper } from '@popperjs/core'
import type { Instance } from '@popperjs/core'
import { TooltipProps, TooltipEmits } from "./types";
import { ref, watch, reactive } from 'vue'
import useClickOutside from '../../hooks/useClickOutside'

const props = withDefaults(defineProps<TooltipProps>(), {
  placement: 'bottom',
  trigger: 'hover'
})
const emits = defineEmits<TooltipEmits>()
// 该响应式变量用来控制浮层节点的显示与隐藏
const isOpen = ref(false)
// 创建两个DOM节点
const popperNode = ref<HTMLElement>()
const triggerNode = ref<HTMLElement>()
// 这是给父层元素wow-tooltip的Dom节点
const popperContainerNode = ref<HTMLElement>()
// 新建浮层的实例，网页打开是初始类型可能是null，所以用联合类型，Instance是popperjs提供的类型
let popperInstance: Instance | null = null
// v-on可以接受一个object作为参数，对object中的每一项都可以作为对应的事件回调
let events: Record<string, any> = reactive({})
let outerEvents: Record<string, any> = reactive({})
// 创建一个function，使得触发节点被点击后，能够对响应式变量isOpen进行取反，让浮层节点进行切换显示或隐藏
const togglePopper = () => {
    isOpen.value = !isOpen.value
    emits('visible-change', isOpen.value)
}
// hover方式的触发回调函数
const open = () => {
  isOpen.value = true
  emits('visible-change', true)
}
// hover方式的结束触发回调函数
const close = () => {
  isOpen.value = false
  emits('visible-change', false)
}
const attachEvents = () => {
  if (props.trigger == 'hover') {
    events['mouseenter'] = open
    outerEvents['mouseleave'] = close
  } else if (props.trigger == 'click') {
    events['click'] = togglePopper
  }
}
useClickOutside(popperContainerNode, () => {
  // 当为点击触发方式并且Tooltip浮层显示的时候才进行close()
  if (props.trigger == 'click' && isOpen.value) {
    close()
  }
})
// 在setup的时候执行一次attachEvents，让这个函数内的事件绑定到模版上
attachEvents()
watch(() => props.trigger, (newTrigger, oldTrigger) => {
  if (newTrigger != oldTrigger) {
    // trigger方式改变了，先把事件列表清空，因为变量events和outerEvents里面是写入一些事件了的
    events = {}
    outerEvents = {}
    // 绑定一下
    attachEvents()
  }
})
// 用watch在显示或隐藏的同时就可以创建对应的popper实例
watch(isOpen, (newValue) => {
  if (newValue) {
    if (triggerNode.value && popperNode.value) {
      popperInstance = createPopper(triggerNode.value, popperNode.value, {
        placement: props.placement
      })
    } else {
      // 隐藏的时候，我们要把它给销毁掉，这个Instance上有对应的方法来销毁
      popperInstance?.destroy()
    }
  }
  // 我们要展示的popperNode是要等到dom节点生成以后才可以进行调用，所以我们要设置这个watch的触发时间，我们设为flush: post，这就是等dom节点生成
}, { flush: 'post'})
</script>
