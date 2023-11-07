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
          v-model="innerValue"
          @input="handleInput"
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
        v-model="innerValue"
        @input="handleInput"
      />
    </template>

  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { InputProps, InputEmits } from './types'

defineOptions({
  name: 'WowInput'
})
const props = withDefaults(defineProps<InputProps>(), { type: 'text' })
const emits = defineEmits<InputEmits>()
const innerValue = ref(props.modelValue)

const handleInput = () => {
  emits('update:modelValue', innerValue.value)
}

// 解决v-model的异步更新问题：当我们把props.modelValue用ref转化成一个本地值的时候，也就是innerValue
// 就要注意当外部的props.modelValue更新的时候，我们内部的innerValue也要相应的变化
watch(() => props.modelValue, (newValue) => {
  innerValue.value = newValue
})
</script>
