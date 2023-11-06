import type { VNode, ComponentInternalInstance } from 'vue'

export interface MessageProps {
  // 这里message为可选，因为除了我们通过props传入message属性值以外，组件本身还有默认slot的后备内容？
  // VNode我们用来支持message的复杂类型
  message?: string | VNode;
  // 多长时间后message消失，如果设为0，就代表message永不消失
  duration?: number;
  showClose?: boolean;
  type?: 'success' | 'info' | 'warning' | 'danger'
  // 必选
  onDestroy: () => void;
  id: string;
  // 组件之间的间隔
  offset?: number;
  zIndex: number;
  transitionName?: string;
}

// omit忽略掉onDestroy这个属性和id，不需要传入，因为id是createMessage函数里自动生成的id
export type CreateMessageProps = Omit<MessageProps, 'onDestroy' | 'id' | 'zIndex'>

export interface MessageContext {
  // 我们希望有id属性，可以甄别不同的message组件实例
  id: string;
  vnode: VNode;
  // 得到的内部实例
  vm: ComponentInternalInstance;
  props: MessageProps;
  destory: () => void;
}