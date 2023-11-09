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
      <Transition :name="transition">
        <div
          v-if="isOpen"
          class="wow-tooltip__popper"
          ref="popperNode"
        >
          <slot name="content">
              {{ content }}
          </slot>
          <div id="arrow" data-popper-arrow></div>
        </div>
      </Transition>
    </div>
</template>

<script setup lang="ts">
import { createPopper } from '@popperjs/core'
import type { Instance } from '@popperjs/core'
import { TooltipProps, TooltipEmits, TooltipInstance } from "./types";
import { ref, watch, reactive, onUnmounted, computed } from 'vue'
import useClickOutside from '../../hooks/useClickOutside'
import { debounce } from 'lodash-es'

const props = withDefaults(defineProps<TooltipProps>(), {
  placement: 'bottom',
  trigger: 'hover',
  transition: 'fade',
  openDelay: 0,
  closeDelay: 0
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
// 为了观测open函数里的setTimeout回调被触发多少次，我们新建一个变量来监控一下，通过它我们可以更容易的发现问题
let openTimes = 0
// 目的和openTimes一样
let closeTimes = 0
const popperOptions = computed(() => {
  return {
    // 我们自己定的placement属性比popper.js的Options里的placement优先级低，所以放在前面
    placement: props.placement,
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: [0, 9]
        },
      }
    ],
    ...props.popperOptions
  }
})
// hover方式的触发回调函数
const open = () => {
  // setTimeout(() => {
  openTimes++
  console.log('open time', openTimes);
  isOpen.value = true
  emits('visible-change', true)
  // }, props.openDelay)
}
// hover方式的结束触发回调函数
const close = () => {
  closeTimes++
  console.log('close times', closeTimes);
  isOpen.value = false
  emits('visible-change', false)
}
// 上面open函数的debounce版本，有了这个后我们就可以把open函数里的setTimeout给去掉了
const openDebounce = debounce(open, props.openDelay)
// 上面open函数的debounce版本，有了这个后我们就可以把open函数里的setTimeout给去掉了
const closeDebounce = debounce(close, props.closeDelay)
const openFinal = () => {
  closeDebounce.cancel()
  openDebounce()
}
const closeFinal = () => {
  openDebounce.cancel()
  closeDebounce()
}
// 创建一个function，使得触发节点被点击后，能够对响应式变量isOpen进行取反，让浮层节点进行切换显示或隐藏
const togglePopper = () => {
    // 因为引入了openDelay和closeDelay，该函数要做相应的修改。利用上openDelay和closeDelay
    // isOpen.value = !isOpen.value
    // emits('visible-change', isOpen.value)
  if (isOpen.value) {
    closeFinal()
  } else {
    openFinal()
  }
}
const attachEvents = () => {
  if (props.trigger == 'hover') {
    events['mouseenter'] = openFinal
    outerEvents['mouseleave'] = closeFinal
  } else if (props.trigger == 'click') {
    events['click'] = togglePopper
  }
}
useClickOutside(popperContainerNode, () => {
  // 当为点击触发方式并且Tooltip浮层显示，还有非手动模式的时候才进行close()
  if (props.trigger == 'click' && isOpen.value && !props.manual) {
    closeFinal()
  }
  if (isOpen.value) {
    emits('click-outside', true)
  }
})
// 如果是手动模式下，应该是没有添加任何的events，也就是我们的hover和click应该都不会运作
if (!props.manual) {
  // 在setup的时候执行一次attachEvents，让这个函数内的事件绑定到模版上
  attachEvents()
}
// 用一个watch来监控props.manual，并且回调函数的参数传入isManual，表示是否启动了手动模式
watch(() => props.manual, (isManual) => {
  if (isManual) {
    // 如果isManual为true，也就是在手动模式下，要先把events和outerEvents里面的事件给清空掉
    events = {}
    outerEvents = {}
  } else {
    // 如果为false，不在手动模式下了，就重新绑定事件attachEvents()
    attachEvents()
  }
})
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
      popperInstance = createPopper(triggerNode.value, popperNode.value, popperOptions.value)
    } else {
      // 隐藏的时候，我们要把它给销毁掉，这个Instance上有对应的方法来销毁
      popperInstance?.destroy()
    }
  }
  // 我们要展示的popperNode是要等到dom节点生成以后才可以进行调用，所以我们要设置这个watch的触发时间，我们设为flush: post，这就是等dom节点生成
}, { flush: 'post'})

// 我们的popperInstance创建完毕后，但是在卸载的时候没有给它卸载掉，我们应该将其卸载，而不仅仅在隐藏的时候进行destroy
onUnmounted(() => {
  // 隐藏的时候，我们要把它给销毁掉，这个Instance上有对应的方法来销毁
  popperInstance?.destroy()
})

// 暴露手动模式下方法出去给用户，比如用户调用show或者hinde时，内部就会调用open或close
defineExpose<TooltipInstance>({
  'show': openFinal,
  'hide': closeFinal
})

</script>
