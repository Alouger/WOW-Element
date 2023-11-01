<template>
    <button
      ref="_ref"
      class="wow-button"
      :class="{
        // 当type存在时，会动态变化模版字符串
        [`wow-button--${type}`]: type,
        [`wow-button--${size}`]: size,
        'is-plain': plain,
        'is-round': round,
        'is-circle': circle,
        'is-disabled': disabled
      }"
      :disabled="disabled"
      :autofocus="autofocus"
      :type="nativeType"
    >
      <!-- 设置slot，会用span包裹一下, 不用span也可以 -->
      <span>
        <slot />
      </span>
    </button>
</template>

<script setup lang="ts">
import { ref } from 'vue' 
// 注明type 表明导入的是类型，不是实现代码
import type { ButtonProps } from './types';
// 有了vue macros后，不用把组件属性单独写在一个script里了，可以和setup在同一个scrip
defineOptions({
  name: 'WowButton'
})
// 给nativeType设默认值
withDefaults(defineProps<ButtonProps>(), {
  nativeType: 'button'
})
const _ref = ref<HTMLButtonElement>()
// 暴露组件实例
defineExpose({
  ref: _ref
})
</script>

<!-- 删掉scoped -->
<style scoped>

</style>