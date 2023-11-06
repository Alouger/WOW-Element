import { onMounted, onBeforeUnmount, isRef, watch, unref } from 'vue'
import type { Ref } from 'vue'

export default function useEventListener(
  // 在哪个上面添加监听器, 一般类型为Element类型，但我们选择更通用的类型EventTarget
  // EventTarget接口由可以接收事件、并且可以创建侦听器的对象实现。Element及其子项、document和windows是最常见的事件目标
  // onMounted前会是null类型，所以也要加上null 
  target: Ref<EventTarget | null> | EventTarget,
  // 事件名称
  event: string,
  // 
  handler: (e: Event) => any
) {
    // 先判断target是否是ref类型，因为addEventListener没有ref类型相关的方法
    if (isRef(target)) {
      // 此时target类型为Ref<EventTarget | null>
      // value和oldValue的类型都是EventTarget | null
      watch(target, (value, oldValue) => {
        // 当oldValue为null类型时，不仅可以从null变成EventTarget类型，还可以从EventTarget变成其他EventTarget
        // 所以先给oldValue解绑
        oldValue?.removeEventListener(event, handler)
        value?.addEventListener(event, handler)
      })
    } else {
      // onMounted时添加
      onMounted(() => {
        target.addEventListener(event, handler)
      })
    }
    // 在卸载销毁前删除掉监听器
    onBeforeUnmount(() => {
      // unref用于获取ref或者reactive对应的值，如果target是一个ref，就返回它的值，否则就会返回它本身
      // 所以用了unref后target的类型就变成了 EventTarget | null 
      // 用问号?去掉类型为null的情况
      unref(target)?.removeEventListener(event, handler)
  })
}