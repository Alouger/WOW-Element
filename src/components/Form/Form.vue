<template>
  <form class="wow-form">
    <slot />
    <button @click.prevent="validate">Validate All</button>
  </form>
</template>

<script setup lang="ts">
import type { ValidateFieldsError } from 'async-validator'
import type { FormProps, FormItemContext, FormContext, FormValidateFailure, FormInstance } from './types'
import { formContextKey } from './types'
import { provide } from 'vue'

defineOptions({
  name: 'WowForm'
})

const props = defineProps<FormProps>()

const fields: FormItemContext[] = []
const addField: FormContext['addField'] = (field) => {
  fields.push(field)
}
const removeField: FormContext['removeField'] = (field) => {
  if (field.prop) {
    fields.splice(fields.indexOf(field), 1)
  }
}

// 整体进行表单验证的函数，应该是返回Promise
const validate = async () => {
  // 初始化错误信息的object，然后根据实际运行的结果一点点填充上去
  let validationErrors: ValidateFieldsError = {}
  //我们可能会想到用Promise.all，但是这个方法会在任何一个输入的promise被拒绝的时候就返回了，不会一个个全部都执行完毕，如果我们第一条promise就出错，后面的第二第三条promise都不会运行了
  for (const field of fields) {
    try {
      // 在整体验证的情况下，所有的rule都应该是被验证的，跟这个trigger没关系，所以传入的参数是空字符串
      await field.validate('')  
    } catch (e) {
      const error = e as FormValidateFailure  
      validationErrors = {
        ...validationErrors,
        ...error.fields
      }
    }
  }
  if (Object.keys(validationErrors).length === 0) return true
  return Promise.reject(validationErrors)
}

// 传递给FormItem
// provide(formContextKey, props)
provide(formContextKey, {
  ...props,
  addField,
  removeField
})

// 因为我们要把整体验证的validate函数暴露出去
defineExpose<FormInstance>({
  validate
})
</script>
