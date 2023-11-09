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
        v-model="innerValue"
        :disabled="disabled"
        :placeholder="placeholder"
      />
      <template #content>
        <ul class="wow-select__menu">
          <template v-for="(item, index) in options" :key="index">
            <li
              class="wow-select__menu-item"
              :class="{'is-disabled': item.disabled}"
              :id="`select-item-${item.value}`"
            >
              {{ item.label }}
            </li>
          </template>
        </ul>
      </template>
    </Tooltip>
  </div>
</template>

<script setup lang="ts">
import type { SelectProps, SelectEmits, SelectOption } from './types'
import Tooltip from '../Tooltip/Tooltip.vue'
import Input from '../Input/Input.vue'
import { ref } from 'vue'
import type { Ref } from 'vue'
import type { TooltipInstance } from '../Tooltip/types'

defineOptions({
  name: 'WowSelect'
})

const props = defineProps<SelectProps>()
const emits = defineEmits<SelectEmits>()
const innerValue = ref('')
const tooltipRef = ref() as Ref<TooltipInstance>

// 创建代表dropdown状态，是否被打开的变量
const isDropdownShow = ref(false)
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
</script>