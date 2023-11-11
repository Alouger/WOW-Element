<template>
  <div
    class="wow-form-item"
    :class="{
      'is-error': validateStatus.state === 'error',
      'is-success': validateStatus.state === 'success',
      'is-loading': validateStatus.loading
    }"
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
      <div class="wow-form-item__error-msg" v-if="validateStatus.state === 'error'">
        {{ validateStatus.errorMsg }}
      </div>
    </div>
    {{ innerValue }} - {{ itemRules}}
    <button @click.prevent="validate">Validate</button>
  </div>
</template>

<script setup lang="ts">
import { inject, computed, reactive } from 'vue'
import Schema from 'async-validator'
import { isNil } from 'lodash-es'
import { formContextKey } from './types'
import type { FormItemProps, FormValidateFailure } from './types'

defineOptions({
  name: 'WowFormItem'
})

const props = defineProps<FormItemProps>()
// 拿到Form组件传过来的formContext后我们还需要在FormItem上设置一个属性，让用户去决定我们到底要使用哪个数据和规则
const formContext = inject(formContextKey)
const validateStatus = reactive({
  // 显示验证状态：成功，失败，初始
  state: 'init',
  // 验证失败反馈的错误信息
  errorMsg: '',
  // validate函数里是一个异步过程，我们可能会有一些自定义请求，比如远程服务器发送请求检查用户名是否被占用等情况，所以需要一个loading状态
  loading: false
})

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
  if (modelName) {
    const validator = new Schema({
      [modelName]: itemRules.value
    })
    validateStatus.loading = true
    validator.validate({ [modelName]: innerValue.value })
      .then(() => {
        validateStatus.state = 'success'
      })
      .catch((e: FormValidateFailure) => {
        // 解构出errors
        const { errors } = e
        validateStatus.state = 'error'
        // 这里的message有可能是undefined，所以有加个 || ''
        validateStatus.errorMsg = (errors && errors.length > 0) ? errors[0].message || '' : ''
      })
      .finally(() => {
        validateStatus.loading = false
      })
  }
}
</script>
