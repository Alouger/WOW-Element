<template>
    <div
      class="wow-collapse-item"
      :class="{
        'is-disabled': disabled
      }"
    >
      <div class="wow-collapse-item__header" :id="`item-header-${name}`" @click="handleClick">
        <!-- 为了支持自定义标题，可以传入一个slot，然后可以渲染一个复杂的title样式，而不是单单给CollapseItem的title属性传入一个string -->
        <!-- slot是默认的，我们可能需要多个slot来自定义多个部分，所以我们使用带name属性的具名插槽 -->
        <!-- 在slot中间放入{{title}}, 相当于设置了一个默认值，当我们不传name=“title”的slot时，就会用CollapseItem的title属性值作为title -->
        <!-- 如果传了name=“title”的slot, 就覆盖掉默认值 -->
        <slot name="title">{{ title }}</slot>
      </div>
      <div class="wow-collapse-item__content" :id="`item-content-${name}`" v-show="isActive">
        <!-- 该组件被使用时会被插入内容，所以用插槽slot -->
        <slot />
      </div>
    </div>
</template>

<script setup lang="ts">
import { inject, computed } from 'vue'
import type { CollapseItemProps } from "./types";
import { collapseContextKey } from './types'
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
</script>

<style>
.wow-collapse-item__header {
    font-size: 30px;
}
</style>