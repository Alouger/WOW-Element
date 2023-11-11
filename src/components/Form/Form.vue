<template>
  <form class="wow-form">
    <slot />
    <button @click.prevent="validate">Validate All</button>
  </form>
</template>

<script setup lang="ts">
import type { FormProps, FormItemContext } from './types'
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

const validate = () => {
  console.log("fields", fields);
}

// 传递给FormItem
// provide(formContextKey, props)
provide(formContextKey, {
  ...props,
  addField,
  removeField
})
</script>
