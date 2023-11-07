import { expect, describe, it } from "vitest";
import { mount } from '@vue/test-utils'
import Input from './Input.vue'

// describe 此函数接受名称和函数，用于将相关测试组合在一起。当您为具有多个测试点（例如逻辑和外观）的组件编写测试时，它会派上用场。
// it 这个函数代表被测试的实际代码块。它接受一个字符串，该字符串通常是测试用例的名称或描述
// expect 此函数用于测试值或创建断言，内部包含一个测试的值 ，后接一个判断的条件
describe('Input', () => {
  it('基本展示', () => {
    // 针对动态 class，查看 classes 是否正确
    // 针对 v-if 是否渲染正确的标签以及内容
    // 针对 slots，是否渲染对应的 slots 内容
    const wrapper = mount(Input, {
      props: {
        size: 'small',
        type: 'text',
        modelValue: ''
      },
      slots: {
        prepend: 'prepend',
        prefix: 'prefix'
      }
    })
    // console.log(wrapper.html());
    // 测试动态class
    expect(wrapper.classes()).toContain('wow-input--small')
    expect(wrapper.classes()).toContain('is-prepend')
    // 测试是否渲染正确的标签和节点
    expect(wrapper.find('input').exists()).toBeTruthy()
    expect(wrapper.get('input').attributes('type')).toBe('text')
    // 测试slots节点是否存在
    expect(wrapper.find('.wow-input__prepend').exists()).toBeTruthy()
    expect(wrapper.get('.wow-input__prepend').text()).toBe('prepend')
    expect(wrapper.find('.wow-input__prefix').exists()).toBeTruthy()
    expect(wrapper.get('.wow-input__prefix').text()).toBe('prefix')

    // 测试textarea
    const wrapper2 = mount(Input, {
      props: {
        type: 'textarea',
        modelValue: ''
      }
    })
    expect(wrapper2.find('textarea').exists()).toBeTruthy()
  })

  it('支持v-model', async () => {
    const wrapper = mount(Input, {
      props: {
        modelValue: 'test',
        'onUpdate:modelValue': (e: any) => wrapper.setProps({ modelValue: e})
      }
    })
    // 测试初始值
    // wrapper.get('input') 得到input这个wrapper
    const input = wrapper.get('input')
    console.log("input", input);
    console.log("input.element", input.element);
    console.log("input.element.value", input.element.value);
    // input.element 是得到input这个DOM节点
    // console.log("input.element.value", input.element.value);
    expect(input.element.value).toBe('test')

    // 测试更新值  把input的值更新为'update'
    await input.setValue('update')
    // 先看wrapper上的modelValue是否更新了
    expect(wrapper.props('modelValue')).toBe('update')
    // 再来看看DOM元素上的值是否更新
    expect(input.element.value).toBe('update')

    // 还有种情况是v-model的异步更新，也就是外侧把这个props进行更新
    await wrapper.setProps({modelValue: 'prop update'})
    // 再来看看DOM元素上的值是否更新
    expect(input.element.value).toBe('prop update')
  })
})