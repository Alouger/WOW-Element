import { defineComponent } from 'vue';

// 这里我们没有采用ts的写法，因为我们这个组件比较简单，直接用object写法
const RenderVnode = defineComponent({
  props: {
    vNode: {
        // 可以传入string类型也可以传入object类型
        type: [String, Object],
        required: true
    }
  },
  setup(props) {
    return () => props.vNode
  }
})

export default RenderVnode