<template>
    <div
      class="wow-tooltip"
    >
      <div
        class="wow-tooltip__trigger"
        ref="triggerNode"
        @click="togglePopper"
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
import { ref, watch } from 'vue'

const props = withDefaults(defineProps<TooltipProps>(), {
  placement: 'bottom'
})
const emits = defineEmits<TooltipEmits>()
// 该响应式变量用来控制浮层节点的显示与隐藏
const isOpen = ref(false)
// 创建两个DOM节点
const popperNode = ref<HTMLElement>()
const triggerNode = ref<HTMLElement>()
// 新建浮层的实例，网页打开是初始类型可能是null，所以用联合类型，Instance是popperjs提供的类型
let popperInstance: Instance | null = null
// 创建一个function，使得触发节点被触发后，能够对响应式变量isOpen进行取反，让浮层节点进行切换显示或隐藏
const togglePopper = () => {
    isOpen.value = !isOpen.value
    emits('visible-change', isOpen.value)
}
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
