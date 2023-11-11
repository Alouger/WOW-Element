<template>
  <form class="wow-form">
    <slot />
  </form>
</template>

<script setup lang="ts">
import type { FormProps } from './types'
import { formContextKey } from './types'
import { provide } from 'vue'

defineOptions({
  name: 'WowForm'
})

const props = defineProps<FormProps>()
// 传递给FormItem
provide(formContextKey, props)
</script>
