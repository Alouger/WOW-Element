<template>
  <form class="wow-form">
    <slot />
  </form>
</template>

<script setup lang="ts">
import type { FormProps } from './types'

defineOptions({
  name: 'WowForm'
})

defineProps<FormProps>()

</script>
