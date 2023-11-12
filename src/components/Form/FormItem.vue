<template>
  <div
    class="wow-form-item"
    :class="{
      'is-error': validateStatus.state === 'error',
      'is-success': validateStatus.state === 'success',
      'is-loading': validateStatus.loading,
      'is-required': isRequired
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
      <slot :validate="validate" />
      <div class="wow-form-item__error-msg" v-if="validateStatus.state === 'error'">
        {{ validateStatus.errorMsg }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, computed, reactive, provide, onMounted, onUnmounted } from 'vue'
import Schema from 'async-validator'
import { isNil } from 'lodash-es'
import { formContextKey, formItemContextKey } from './types'
import type { FormItemProps, FormValidateFailure, FormItemContext, ValidateStatusProp, FormItemInstance } from './types'

defineOptions({
  name: 'WowFormItem'
})

const props = defineProps<FormItemProps>()
// 拿到Form组件传过来的formContext后我们还需要在FormItem上设置一个属性，让用户去决定我们到底要使用哪个数据和规则
const formContext = inject(formContextKey)
const validateStatus: ValidateStatusProp = reactive({
  // 显示验证状态：成功，失败，初始
  state: 'init',
  // 验证失败反馈的错误信息
  errorMsg: '',
  // validate函数里是一个异步过程，我们可能会有一些自定义请求，比如远程服务器发送请求检查用户名是否被占用等情况，所以需要一个loading状态
  loading: false
})

// 为了实现重置状态功能，在组件在页面中挂载的时候要记录下最初值，也就是这个initialValue，这样在重置的时候就可以直接把最初值赋值过来
let initialValue: any = null
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
// 筛选一下规则
const getTriggeredRules = (trigger?: string) => {
  const rules = itemRules.value;
  if (rules) {
    return rules.filter(rule => {    
      // 如果rule里没有trigger或者trigger没有传过来, 说明这条规则是需要被验证的
      // 如果trigger为空字符串''，则if(trigger)为false，if(!trigger)为true
      if (!rule.trigger || !trigger) return true
      return rule.trigger && rule.trigger === trigger
    })
  } else {
    return []
  }
}

const isRequired = computed(() => {
  return itemRules.value.some(rule => rule.required)
})

const validate = async (trigger?: string) => {
  const modelName = props.prop
  const triggeredRules = getTriggeredRules(trigger)
  // 没有任何规则的时候
  if (triggeredRules.length === 0) {
    return true
  }
  if (modelName) {
    const validator = new Schema({
    //   [modelName]: itemRules.value
      [modelName]: triggeredRules
    })
    validateStatus.loading = true
    // 该函数应该返回的是Promise，这样在Form组件中循环调用各个FormItem的验证函数更方便
    // validator.validate本身返回的类型就带有Promise，直接return就好
    return validator.validate({ [modelName]: innerValue.value })
      .then(() => {
        validateStatus.state = 'success'
      })
      .catch((e: FormValidateFailure) => {
        // 解构出errors
        const { errors } = e
        validateStatus.state = 'error'
        // 这里的message有可能是undefined，所以有加个 || ''
        validateStatus.errorMsg = (errors && errors.length > 0) ? errors[0].message || '' : ''
        console.log(e.errors);
        // 不return下面这行代码的话，在Form组件循环调用各个FormItem的验证函数时有catch到error的话，这个error是不会被展示出来的，但是我们又需要这个错误信息errorMsg，所以需要手动返回一下这个错误
        return Promise.reject(e)
      })
      .finally(() => {
        validateStatus.loading = false
      })
  }
}

// 重置状态功能
const clearValidate = () => {
  // 恢复validateStatus到最初的状态
  validateStatus.state = 'init'
  validateStatus.errorMsg = ''
  validateStatus.loading = false
}

// 重置状态功能: 恢复到最初的值
const resetField = () => {
  clearValidate()
  const model = formContext?.model
  if (model && props.prop && !isNil(model[props.prop])) {
    model[props.prop] = initialValue
  }
}

const context: FormItemContext = {
  validate,
  prop: props.prop || '',
  clearValidate,
  resetField
}
provide(formItemContextKey, context)

onMounted(() => {
  if (props.prop) {
    formContext?.addField(context)
    // 在组件在页面中挂载的时候要记录下最初值，也就是这个initialValue，这样在重置的时候就可以直接把最初值赋值过来
    initialValue = innerValue.value
  }
})

onUnmounted(() => {
  formContext?.removeField(context)
})

defineExpose<FormItemInstance>({
  validateStatus,
  validate,
  resetField,
  clearValidate
})
</script>
