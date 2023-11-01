<template>
    <div
      class="wow-collapse"
    >
      <slot />
    </div>
</template>
<script setup lang="ts">
import { ref, provide, watch } from 'vue'
import type { NameType, CollapseProps, CollapseEmits } from './types'
import { collapseContextKey } from './types'
defineOptions({
    name: 'WowCollapse'
})
const props = defineProps<CollapseProps>()
const emits = defineEmits<CollapseEmits>()
// 可变化的响应式数组，代表打开的CollapseItem（使用item的name, 传入NameType作为泛型参数进行规定）
const activeNames = ref<NameType[]>(props.modelValue);
// 用watch进行监控更新
watch( () => props.modelValue, () => {
    activeNames.value = props.modelValue;
})
if (props.accordion && activeNames.value.length > 1) {
  console.warn('accordion mode should only have one active item');
}
// 点击CollapseItem的header时的回调, 传入参数是被点击的CollapseItem的name
const handleItemClick = (item: NameType) => {
  if (props.accordion) {
    // 如果点击的是已打开的item，就把activeNames清空
    // 如果点击的是其他未打开的item，就把activeNames只放置目前要打开的这个item
    activeNames.value = [ activeNames.value[0] == item ? '' : item];
  } else {
    // 先判断当前被点击的Item的name是否在数组activeNames中 (暂时未考虑手风琴的情况)
    const index = activeNames.value.indexOf(item);
    if (index > -1) { // > -1 表示存在
        // 存在，删除数组中对应的一项
        activeNames.value.splice(index, 1);
    } else {
        // 不存在， 插入对应的name
        activeNames.value.push(item);
    }
  }
  emits('update:modelValue', activeNames.value)
  emits('change', activeNames.value)
}
// 把activeNames和handleItemClick以接口CollapseContext规定的形式(在collapseContextKey的类型InjectionKey有规定)传递给子组件CollapseItem
// 语法：provide 导出数据，第一个参数是我们定义好的数据类型，第二个参数是对应数据类型的值
provide(collapseContextKey, {
    activeNames,
    handleItemClick
})
</script>