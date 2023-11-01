<template>
    <div
      class="wow-collapse-item"
      :class="{
        'is-disabled': disabled
      }"
    >
      <div class="wow-collapse-item__header" :id="`item-header-${name}`">
        <!-- 为了支持自定义标题，可以传入一个slot，然后可以渲染一个复杂的title样式，而不是单单给CollapseItem的title属性传入一个string -->
        <!-- slot是默认的，我们可能需要多个slot来自定义多个部分，所以我们使用带name属性的具名插槽 -->
        <!-- 在slot中间放入{{title}}, 相当于设置了一个默认值，当我们不传name=“title”的slot时，就会用CollapseItem的title属性值作为title -->
        <!-- 如果传了name=“title”的slot, 就覆盖掉默认值 -->
        <slot name="title">{{ title }}</slot>
      </div>
      <div class="wow-collapse-item__content" :id="`item-content-${name}`">
        <!-- 该组件被使用时会被插入内容，所以用插槽slot -->
        <slot />
      </div>
    </div>
</template>

<script setup lang="ts">
import type { CollapseItemProps } from "./types";
defineOptions({
    name: 'WowCollapseItem'
})
defineProps<CollapseItemProps>()
</script>
