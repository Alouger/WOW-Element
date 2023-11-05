import { onMounted, onUnmounted } from 'vue'
import type { Ref } from 'vue'
// 我们要想到应该是要加一个点击事件来触发整个外侧的点击，我们不能到某一个对应的节点上，而是除Tooltip以外的区域都要添加上这个点击事件
// 所以我们应该是往document上添加事件

// 我们要确定它是在哪个区域外侧，所以我们自然要传入一个对应的dom节点，这个应该是一个响应式的dom节点，所以要用Ref包裹一下
// Ref代表小写的ref的返回值
// 一般页面启动时会先是undefined或者null类型，所以用联合类型作为泛型参数
// 第二个参数是当我们点击到外侧的时候要执行的一个回调函数
const useClickOutside = (elementRef: Ref<undefined | HTMLElement>, callback: (e: MouseEvent) => void) => {
  const handler = (e: MouseEvent) => {
    // 对elementRef做类型收窄，确定其value是存在的
    // 还要确定被点击的Dom节点是否存在，也就是e.target
    if (elementRef.value && e.target) {
      // Node.contains()方法返回一个布尔值，表示一个节点是否是给定节点的后代，即该节点本身、其直接子节点(childNodes)、子节点的直接子节点等。
      // e.target的类型是EventTarget，我们要用断言进行类型缩小，变成HTMLElement
      if (!elementRef.value.contains(e.target as HTMLElement)) {
        // 判断为不包含，即点击在外侧，就执行回调函数
        // 具体来说：如果点击的这个元素没有contain目标ref上的元素，就执行传入的callback
        callback(e)
      }
    }
  }
  // 给document上绑定click事件，在点击document内部的元素的时候，通过事件冒泡，事件就会到达document上绑定的回调函数上
  onMounted(() => {
    document.addEventListener('click', handler)
  })
  onUnmounted(() => {
    document.removeEventListener('click', handler)
  })
}

export default useClickOutside