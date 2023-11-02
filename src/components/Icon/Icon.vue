<template>
    <i class="wow-icon" :class="{[`wow-icon--${type}`] : type}" :style="customStyles">
      <font-awesome-icon v-bind="filteredProps"/>
    </i>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { omit } from 'lodash-es'
import type { IconProps } from "./types";
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
defineOptions({
    name: 'WowIcon',
    // 把透传停止掉，因为$props可以拿到所有的属性，但是$props会默认添加到根组件上面的，所以我们要把透传停止掉，这样就不会透传到根组件上面了，也就是<i>标签
    inheritAttrs: false
})
const props = defineProps<IconProps>()
// omit 省略，忽略的意思，这里要把我们新加的自定义属性type和color过滤掉，把原生属性给<font-awesome-icon>
const filteredProps = computed(() => omit(props, ['type', 'color']))
const customStyles = computed(() => {
  return props.color ? { color: props.color } : {}
})
</script>
