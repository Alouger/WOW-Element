<template>
    <div
      class="wow-collapse-item"
      :class="{
        'is-disabled': disabled
      }"
    >
      <div class="wow-collapse-item__header" :class="{'is-disabled': disabled, 'is-active': isActive}" :id="`item-header-${name}`" @click="handleClick">
        <!-- 为了支持自定义标题，可以传入一个slot，然后可以渲染一个复杂的title样式，而不是单单给CollapseItem的title属性传入一个string -->
        <!-- slot是默认的，我们可能需要多个slot来自定义多个部分，所以我们使用带name属性的具名插槽 -->
        <!-- 在slot中间放入{{title}}, 相当于设置了一个默认值，当我们不传name=“title”的slot时，就会用CollapseItem的title属性值作为title -->
        <!-- 如果传了name=“title”的slot, 就覆盖掉默认值 -->
        <slot name="title">{{ title }}</slot>
        <Icon icon="angle-right" class="header-angle"/>
      </div>
      <!-- 动画组件 -->
      <Transition name="slide" v-on="transitionEvents">
        <div class="wow-collapse-item__wrapper" v-show="isActive">
            <div class="wow-collapse-item__content" :id="`item-content-${name}`">
                <!-- 该组件被使用时会被插入内容，所以用插槽slot -->
                <slot />
            </div>
        </div>
      </Transition>
    </div>
</template>

<script setup lang="ts">
import { inject, computed } from 'vue'
import type { CollapseItemProps } from "./types";
import { collapseContextKey } from './types'
import Icon from '../Icon/Icon.vue'
defineOptions({
    name: 'WowCollapseItem'
})
const props = defineProps<CollapseItemProps>()
// 子组件CollapseItem接收父组件provide的数据
const collapseContext = inject(collapseContextKey)
// 判断对应的content是否要显示，如果includes结果是包含的，说明item是打开的，否则是关闭的
const isActive = computed(() => collapseContext?.activeNames.value.includes(props.name))
// 对应的处理函数
const handleClick = () => {
    if (props.disabled) { return }
    collapseContext?.handleItemClick(props.name);
}
// 写一个对应事件的object，使用v-on直接赋给Transition
// string是key
const transitionEvents: Record<string, (el: HTMLElement) => void> = {
    beforeEnter(el) {
        el.style.height = '0px'
        el.style.overflow = 'hidden'
    },
    enter(el) {
        // 把对应的height设置成它这个元素的高度
        el.style.height = `${el.scrollHeight}px`
    },
    afterEnter(el) {
        // 因为此时动画结束了，我们要把height给删掉，不需要这个属性了，即置空
        el.style.height = ''
        // enter动画结束，马上将overflow重置
        el.style.overflow = ''
    },
    beforeLeave(el) { 
        el.style.height = `${el.scrollHeight}px`
        el.style.overflow = 'hidden'
    },
    leave(el) {
        el.style.height = '0px'
    },
    afterLeave(el) {
        el.style.height = ''
        el.style.overflow = ''
    }
}
</script>

<style>
.wow-collapse-item__header {
    font-size: 30px;
}
</style>