<template>
  <div
    class="wow-select"
    :class="{'is-disabled': disabled}"
    @click="toggleDropdown"
  >
    <!-- 为了完成自定义，我们把Tooltip设为手动模式 manual -->
    <Tooltip
      placement="bottom-start"
      ref="tooltipRef"
      manual
    >
      <Input
        v-model="states.inputValue"
        :disabled="disabled"
        :placeholder="placeholder"
      />
      <template #content>
        <ul class="wow-select__menu">
          <template v-for="(item, index) in options" :key="index">
            <li
              class="wow-select__menu-item"
              :class="{
                'is-disabled': item.disabled,
                'is-selected': states.selectedOption?.value == item.value
                }"
              :id="`select-item-${item.value}`"
              @click.stop="itemSelect(item)"
            >
              {{ item.label }}
              <!-- 如果被选中就显示，这个span只是用来测试 -->
              <span v-if="states.selectedOption?.value == item.value">Selected!!</span>
            </li>
          </template>
        </ul>
      </template>
    </Tooltip>
  </div>
</template>

<script setup lang="ts">
import type { SelectProps, SelectEmits, SelectOption, SelectStates } from './types'
import Tooltip from '../Tooltip/Tooltip.vue'
import Input from '../Input/Input.vue'
import { ref, reactive } from 'vue'
import type { Ref } from 'vue'
import type { TooltipInstance } from '../Tooltip/types'

defineOptions({
  name: 'WowSelect'
})

// value参数是v-model传过来的值
const findOption = (value: string) => {
  const option = props.options.find(option => option.value == value)
  // 没找到就返回null
  return option ? option : null
}

const props = defineProps<SelectProps>()
const emits = defineEmits<SelectEmits>()
const tooltipRef = ref() as Ref<TooltipInstance>
// 创建代表dropdown状态，是否被打开的变量
const isDropdownShow = ref(false)
// 我们希望刚开始的时候能对option进行一个查找
const initialOption = findOption(props.modelValue)
// 因为有了states里的inputValue，所以我们就不需要innerValue了
// const innerValue = ref(initialOption ? initialOption.label : '')
const states = reactive<SelectStates>({
  // 和innerValue一样
  inputValue: initialOption ? initialOption.label : '',
  // 把initialOption作为selectOption的初始值
  selectedOption: initialOption
})

// 控制打开或关闭dropdown
const controlDropdown = (show: boolean) => {
  // 使用Tooltip暴露的函数
  if (show) {
    tooltipRef.value.show()
  } else {
    tooltipRef.value.hide()
  }
  isDropdownShow.value = show
  emits('visible-change', show)
}
// 控制是否触发 controlDropdown， 并且是select组件的点击回调
const toggleDropdown = () => {
  if (props.disabled) return
  if (isDropdownShow.value) {
    controlDropdown(false)
  } else {
    controlDropdown(true)
  }
}
const itemSelect = (e: SelectOption) => {
  if (e.disabled) return
//   innerValue.value = e.label
  states.inputValue = e.label
  states.selectedOption = e
  // 注意，这里发射的值是e.value，不是label
  emits('change', e.value)
  emits('update:modelValue', e.value)
  // 点击行为后，我们要把dropdown关闭掉
  controlDropdown(false)
}
</script>