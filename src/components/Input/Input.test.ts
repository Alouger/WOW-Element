import { expect, describe, it } from "vitest";
import { mount } from '@vue/test-utils'
import Input from './Input.vue'

describe('Input', () => {
  it('基本展示', () => {
    // 针对动态 class，查看 classes 是否正确
    // 针对 v-if 是否渲染正确的标签以及内容
    // 针对 slots，是否渲染对应的 slots 内容
    const wrapper = mount(Input, {
      props: {
        size: 'small',
        type: 'text'
      },
      slots: {
        prepend: 'prepend',
        prefix: 'prefix'
      }
    })
    console.log(wrapper.html());
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
        type: 'textarea'
      }
    })
    expect(wrapper2.find('textarea').exists()).toBeTruthy()
  })
})