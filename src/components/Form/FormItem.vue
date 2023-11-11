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
    {{ innerValue }} - {{ itemRules}}
    <button @click.prevent="validate">Validate</button>
  </div>
</template>

<script setup lang="ts">
import { inject, computed } from 'vue'
import Schema from 'async-validator'
import { isNil } from 'lodash-es'
import { formContextKey } from './types'
import type { FormItemProps } from './types'

defineOptions({
  name: 'WowFormItem'
})

const props = defineProps<FormItemProps>()
// 拿到Form组件传过来的formContext后我们还需要在FormItem上设置一个属性，让用户去决定我们到底要使用哪个数据和规则
const formContext = inject(formContextKey)

// 我们从formContext取得的对应的值
const innerValue = computed(() => {
  const model = formContext?.model
  // 要从model上取数据，先来做一些判断
  // 条件：传过来的数据model是存在的，并且FormItem标签获得的属性里prop是有值的，FormItem标签的prop在model中不是null或undefined
  // 要注意的是如果model[props.prop]是空字符串或者为零的话，都不会执行这个if分支的逻辑
  // 但对于我们这个场景，空字符串和零都是很合理的值，所以我们不能仅仅判断是否存在，我们用isNil进行处理
  // isNil() 可以检查传入参数值是null或者undefined
  if (model && props.prop && !isNil(model[props.prop])) {
    return model[props.prop]
  } else {
    return null
  }
})

// 和innerValue类似，从formContext取得的对应的值
const itemRules = computed(() => {
  const rules = formContext?.rules
  if (rules && props.prop && rules[props.prop]) {
    return rules[props.prop]
  } else {
    return []
  }
})

const validate = () => {
  const modelName = props.prop
  console.log("props.prop", props.prop);
  if (modelName) {
    const validator = new Schema({
      [modelName]: itemRules.value
    })
    console.log("validator", validator);
    console.log("itemRules.value", itemRules.value);
    validator.validate({ [modelName]: innerValue.value })
      .then(() => {
        console.log('no error')
      })
      .catch(e => {
        console.log(e.errors)
      })
  }
}
</script>
