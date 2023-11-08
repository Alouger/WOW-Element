<template>
  <div
    class="wow-switch"
    :class="{
      [`wow-switch--${size}`]: size,
      'is-disabled': disabled,
      'is-checked': checked
    }"
    @click="switchValue"
  >
    <input
      class="wow-switch__input"
      type="checkbox"
      role="switch"
      :name="name"
      :disabled="disabled"
    />

    <div class="wow-switch__core">
      <div class="wow-switch__core-action"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SwitchProps, SwitchEmits } from './types'
import { ref, computed } from 'vue'

defineOptions({
  name: 'WowSwitch',
  inheritAttrs: false
})

const props = defineProps<SwitchProps>()
const emits = defineEmits<SwitchEmits>()

const switchValue = () => {
  if (props.disabled) return
  innerValue.value = !checked.value
  emits('update:modelValue', innerValue.value)
  emits('change', innerValue.value)
}
// 有一个状态，代表整个组件是否被选中，应该用一个props初始值创建一个响应式对象来代表内部变化的值
const innerValue = ref(props.modelValue)
// 代表整个组件是否被选中，布尔值类型
const checked = computed(() => innerValue.value)
</script>