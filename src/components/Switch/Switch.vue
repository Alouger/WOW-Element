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
      ref="input"
      :name="name"
      :disabled="disabled"
      @keydown.enter="switchValue"
    />

    <div class="wow-switch__core">
      <div class="wow-switch__core-inner">
        <span v-if="activeText || inactiveText" class="wow-switch__core-inner-text">
          {{ checked ? activeText : inactiveText}}
        </span>
      </div>
      <div class="wow-switch__core-action"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SwitchProps, SwitchEmits } from './types'
import { ref, computed, onMounted, watch } from 'vue'

defineOptions({
  name: 'WowSwitch',
  inheritAttrs: false
})

const props = withDefaults(defineProps<SwitchProps>(), {
  activeValue: true,
  inactiveValue: false,
})
const emits = defineEmits<SwitchEmits>()
// 有一个状态，代表整个组件是否被选中，应该用一个props初始值创建一个响应式对象来代表内部变化的值
const innerValue = ref(props.modelValue)
const input = ref<HTMLInputElement>() 

// 代表整个组件是否被选中，布尔值类型
const checked = computed(() => innerValue.value === props.activeValue)
const switchValue = () => {
  if (props.disabled) return
  // 当前是被选中时，checked.value = true，要给反值inactiveValue
  // 没被选中，checked.value = false，给activeValue
  const newValue = checked.value ? props.inactiveValue : props.activeValue
  innerValue.value = newValue
  emits('update:modelValue', newValue)
  emits('change', newValue)
}
onMounted(() => {
  // input.value有可能是undefined，要用非空断言操作符
  // 我们要完成switch和input(checkbox形式)的联动，所以要先给input设一个值，设为当前我们选中的值
  input.value!.checked = checked.value
})
// 除了最开始的onMounted阶段要给input.value.checked赋已选中的值，我们还要监控后续checked的变换，使它的变化也改变input.value!.checked
watch(checked, (val) => {
  input.value!.checked = val
})
// 这是对modelValue的修正，我们要watch外部传入modelValue的情况，如果外部传入值时，我们也要对内部的值innerVlue.value进行修改
watch(() => props.modelValue, (newValue) => {
  innerValue.value = newValue
})
</script>