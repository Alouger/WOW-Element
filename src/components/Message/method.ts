// h用来生成VNode
import { render, h, shallowReactive } from 'vue'
import type { CreateMessageProps, MessageContext } from './types'
import MessageConstructor from './Message.vue'
import useZIndex from '../../hooks/useZIndex'

// 创建id，每次调用createMessage，自动加1，作为新的id
let seed = 1
// 该变量存储多个创建好的Message组件实例，初始为空数组
const instances: MessageContext[] = shallowReactive([])

export const createMessage = (props: CreateMessageProps) => {
  const { nextZIndex } = useZIndex()
    // 创建id
  const id = `message_${seed++}`
  // 先创建一个container，因为我们用render函数的话，其第二个参数要传入DOM节点
  const container = document.createElement('div')
  const destroy = () => {
    // 删除数组中的实例
    const idx = instances.findIndex(instance => instance.id == id)
    // 如果没找到对应id的实例，直接return
    if (idx == -1) return
    // 根据id删除数组中的实例
    instances.splice(idx, 1)
    render(null, container)
  }
  // 手动调用删除，其实就是手动的调整组件中的visible的值
  // visible是通过expose传出来的
  const manualDestroy = () => {
    const instance = instances.find(instance => instance.id == id)
    if (instance) {
      instance.vm.exposed!.visible.value = false
    }
  }
  // 重新包装props，让它自动获取一些新的属性。newProps会被传入到Message.vue中
  const newProps = {
    ...props,
    id,
    zIndex: nextZIndex(),
    onDestroy: destroy
  }
  const vnode = h(MessageConstructor, newProps)
  render(vnode, container)
  
  // 虽然渲染完毕了，但这个dom节点还没有真正插入到我们的文档当中，现在来进行插入
  // 为了直接插入message组件，而不用一个div包裹着，我们还要调用firstElementChild
  // 但是会报错：类型“Element | null”的参数不能赋给类型“Node”的参数。不能将类型“null”分配给类型“Node”。
  // 也就是appendChild希望传入的是Element类型，但是我们的firstElementChild返回的是一个联合类型Element | null
  // 所以我们要去掉null类型，用到了非空断言操作符，在后面加一个感叹号就行，这个操作符会告诉ts，这个变量不会是none或者undefined
  // 这是一个类型断言的快捷方式
  document.body.appendChild(container.firstElementChild!)
  // 获取内部实例
  const vm = vnode.component!

  // 创建这次新建的message组件的实例，然后把此实例push到instances变量里
  const instance = {
    id,
    vnode,
    // 内部实例
    vm,
    props: newProps,
    destroy: manualDestroy
  }
  instances.push(instance)
  // return创建好的instance，好处在于后期再实例上添加一些对应的属性和方法，都可以返回到这个实例中，供这个对应的调用者进行一个调用
  return instance
}

// 跟我们的需求相关，我们只需要拿到上一个创建好的instance
export const getLastInstance = () => {
    // 拿到数组的最后一项
    return instances.at(-1)
}

// 该函数是计算前一个组件的bottom offset
export const getLastBottomOffset = (id: string) => {
  // 我们要查找这个instance的id等于我们传入的id
  const idx = instances.findIndex(instance => instance.id == id)
  if (idx <= 0) {
    return 0 // 说明没找到，是当前的instance是instances数组里的第一项，返回0
  } else {
    // 找到了，说明是前面已经有生成了的组件
    // 获取前一个组件
    const prev = instances[idx - 1]
    return prev.vm.exposed!.bottomOffset.value
  }
  return 0
}