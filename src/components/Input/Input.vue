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
      'is-focus': isFocus
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
          v-bind="attrs"
          :type="showPassword ? (passwordVisible ? 'text' : 'password') : type"
          :disabled="disabled"
          :readonly="readonly"
          :autocomplete="autocomplete"
          :placeholder="placeholder"
          :autofocus="autofocus"
          :form="form"
          v-model="innerValue"
          @input="handleInput"
          @change="handleChange"
          @focus="handleFocus"
          @blur="handleBlur"
          ref="inputRef"
        />
        <!-- suffix slot -->
        <span v-if="$slots.suffix || showClear || showPasswordArea" class="wow-input__suffix">
          <slot name="suffix"/>
          <Icon
            icon="circle-xmark"
            v-if="showClear"
            class="wow-input__clear"
            @click="clear"
          />
          <Icon
            icon="eye"
            v-if="showPasswordArea && passwordVisible"
            class="wow-input__password"
            @click="togglePasswordVisible"
          />
          <Icon
            icon="eye-slash"
            v-if="showPasswordArea && !passwordVisible"
            class="wow-input__password"
            @click="togglePasswordVisible"
          />
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
        v-bind="attrs"
        :disabled="disabled"
        :readonly="readonly"
        :autocomplete="autocomplete"
        :placeholder="attrs.placeholder"
        :autofocus="autofocus"
        :form="form"
        v-model="innerValue"
        @input="handleInput"
        @change="handleChange"
        @focus="handleFocus"
        @blur="handleBlur"
        ref="inputRef"
      />
    </template>

  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, useAttrs } from 'vue'
import type { Ref } from 'vue'
import type { InputProps, InputEmits } from './types'
import Icon from '../Icon/Icon.vue'

defineOptions({
  name: 'WowInput',
  // 不继承属性
  inheriteAttrs: false
})
const props = withDefaults(defineProps<InputProps>(), { type: 'text', autocomplete: 'off' })
const emits = defineEmits<InputEmits>()
const attrs = useAttrs()
const innerValue = ref(props.modelValue)
// 控制是否是focus状态
const isFocus = ref(false)
// 控制是否为密码可见或不可见
const passwordVisible = ref(false)
const inputRef = ref() as Ref<HTMLInputElement>

// 两个感叹号!!可以把变量转换成布尔值
// 该变量控制是否显示清空的Icon
const showClear = computed(() => 
  props.clearable &&
  !props.disabled &&
  !!innerValue.value &&
  isFocus.value
)
const showPasswordArea = computed(() => 
  props.showPassword &&
  !props.disabled &&
  !!innerValue.value
)
const togglePasswordVisible = () => {
  passwordVisible.value = !passwordVisible.value
}
const handleInput = () => {
  emits('update:modelValue', innerValue.value)
  emits('input', innerValue.value)
}
const handleChange = () => {
  emits('change', innerValue.value)
}
const handleFocus = (event: FocusEvent) => {
  isFocus.value = true
  emits('focus', event)
}
const handleBlur = (event: FocusEvent) => {
  isFocus.value = false
  emits('blur', event)
}
// 点击清空Icon后，清空内容
const clear = () => {
  innerValue.value = ''
  emits('update:modelValue', '')
  emits('clear')
  emits('input', '')
  emits('change', '')
}
// 解决v-model的异步更新问题：当我们把props.modelValue用ref转化成一个本地值的时候，也就是innerValue
// 就要注意当外部的props.modelValue更新的时候，我们内部的innerValue也要相应的变化
watch(() => props.modelValue, (newValue) => {
  innerValue.value = newValue
})
defineExpose({
  refInstance: inputRef
})
</script>
