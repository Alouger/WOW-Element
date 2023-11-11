<template>
  <div
    class="wow-form-item"
  >
    <label class="wow-form-item__label">
      <!-- 具名插槽, 通过这个插槽我们可以实现对label的自定义 -->
      <slot name="label" :label="label">
        {{ label }}
      </slot>
      <!-- {{ label }} -->
    </label>
    <div class="wow-form-item__content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormItemProps } from './types'

defineOptions({
  name: 'WowFormItem'
})

defineProps<FormItemProps>()
</script>
