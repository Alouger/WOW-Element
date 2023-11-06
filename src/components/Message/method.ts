// h用来生成VNode
import { render, h } from 'vue'
import type { MessageProps } from './types'
import MessageConstructor from './Message.vue'

export const createMessage = (props: MessageProps) => {
  // 先创建一个container，因为我们用render函数的话，其第二个参数要传入DOM节点
  const container = document.createElement('div')
  const vnode = h(MessageConstructor, props)
  render(vnode, container)
  
  // 虽然渲染完毕了，但这个dom节点还没有真正插入到我们的文档当中，现在来进行插入
  // 为了直接插入message组件，而不用一个div包裹着，我们还要调用firstElementChild
  // 但是会报错：类型“Element | null”的参数不能赋给类型“Node”的参数。不能将类型“null”分配给类型“Node”。
  // 也就是appendChild希望传入的是Element类型，但是我们的firstElementChild返回的是一个联合类型Element | null
  // 所以我们要去掉null类型，用到了非空断言操作符，在后面加一个感叹号就行，这个操作符会告诉ts，这个变量不会是none或者undefined
  // 这是一个类型断言的快捷方式
  document.body.appendChild(container.firstElementChild!)

}