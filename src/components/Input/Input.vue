<template>
  <div
    class="wow-input"
    :class="{
      [`wow-input--${type}`]: type,
      [`wow-input--${size}`]: size,
      'is-disabled': disabled,
      'is-prepend': $slots.prepend,
      'is-append': $slots.append,
      'is-prefix': $slots.prefix,
      'is-suffix': $slots.suffix,
    }"
  >
    <!-- type = input时 -->
    <template v-if="type != 'textarea'">
      <!-- prepend slot -->
      <div v-if="$slots.prepend" class="wow-input__prepend">
        <slot name="prepend"/>
      </div>
      <div class="wow-input__wrapper">
        <!-- prefix slot -->
        <span v-if="$slots.prefix" class="wow-input__prefix">
          <slot name="prefix"/>
        </span>
        <input
          class="wow-input__inner"
          :type="type"
          :disabled="disabled"
        />
        <!-- suffix slot -->
        <span v-if="$slots.suffix" class="wow-input__suffix">
          <slot name="suffix"/>
        </span>
      </div>
      <!-- append slot -->
      <div v-if="$slots.append" class="wow-input__append">
        <slot name="append"/>
      </div>
    </template>

    <!-- type = textarea时 -->
    <template v-else>
      <textarea
        class="wow-textareaa__wrapper"
        :disabled="disabled"
      />
    </template>

  </div>
</template>

<script setup lang="ts">
import type { InputProps } from './types'

defineOptions({
  name: 'WowInput'
})
withDefaults(defineProps<InputProps>(), { type: 'text' })
</script>
