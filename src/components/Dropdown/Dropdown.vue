<template>
    <div
      class = "wow-dropdown"
    >
    <Tooltip
      :trigger="trigger"
      :placement="placement"
      :popper-options="popperOptions"
      :open-delay="openDelay"
      :close-delay="closeDelay"
      @visible-change="visibleChange"
      ref="tooltipRef"
    >
      <slot />
      <template #content>
        <ul class="wow-dropdown__menu">
          <template v-for="item in menuOptions" :key="item.key">
            <li 
              v-if="item.divided"
              role="separator"
              class="divided-placeholder"
            />
            <li
              class="wow-dropdown__item"
              :class="{'is-disabled': item.disabled, 'is-divided': item.divided}"
              :id="`dropdown-item-${item.key}`"
              @click="itemClick(item)"
            >
              <!-- 我们用的2个花括号的语法进行包裹的时候，如果这里面是一个对象，它会把整个对象都直接展开，不会生成一个对应的节点 -->
              <!-- {{ item.label }} -->
              <RenderVnode :vNode="item.label"/>
            </li>
          </template>
        </ul>
      </template>
    </Tooltip>
    </div>
</template>

<script setup lang="ts">
import type { DropdownProps, DropdownInstance, DropdownEmits, MenuOption } from './types'
import Tooltip from '../Tooltip/Tooltip.vue'
import { ref } from 'vue'
import type { Ref } from 'vue'
import type { TooltipInstance } from '../Tooltip/types'
import RenderVnode from '../Common/RenderVnode'

const props = withDefaults(defineProps<DropdownProps>(), {
  hideAfterClick: true
})
const emits = defineEmits<DropdownEmits>()
const tooltipRef = ref() as Ref<TooltipInstance>

const visibleChange = (e: boolean) => {
  emits('visible-change', e)
}
const itemClick = (e: MenuOption) => {
  if (e.disabled) {
    return
  }
  emits('select', e)
  if (props.hideAfterClick) {
    tooltipRef.value.hide()
  }
}
defineExpose<DropdownInstance>({
  show: tooltipRef.value?.show,
  hide: tooltipRef.value?.hide
})
</script>
