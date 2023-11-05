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
              {{ item.label }}
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

const props = defineProps<DropdownProps>()
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
}
defineExpose<DropdownInstance>({
  show: tooltipRef.value?.show,
  hide: tooltipRef.value?.hide
})
</script>
