<template>
    <i class="wow-icon">
      <font-awesome-icon v-bind="$props"/>
    </i>
</template>

<script setup lang="ts">
import type { IconProps } from "./types";
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
defineOptions({
    name: 'WowIcon',
    // 把透传停止掉，因为$props可以拿到所有的属性，但是$props会默认添加到根组件上面的，所以我们要把透传停止掉，这样就不会透传到根组件上面了，也就是<i>标签
    inheritAttrs: false
})
defineProps<IconProps>()
</script>
