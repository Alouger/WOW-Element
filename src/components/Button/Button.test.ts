import { describe, test, expect } from "vitest";
import { mount } from '@vue/test-utils'
import Button from './Button.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import Icon from '../Icon/Icon.vue'

describe('Button.vue', () => {
    test('basic button', () => {
        const wrapper = mount(Button, {
            props: {
                type: 'primary'
            },
            slots: {
                default: 'button'
            }
        })
        console.log(wrapper.html());
        // 1. 测试class是否正确
        expect(wrapper.classes()).toContain('wow-button--primary')
        // 2. 测试slot是否渲染我们传入的‘button’字样正确，也就是说我们现在要找里面具体的元素
        // 有两个办法，一个是用get，另一个是用find
        // 它们两个差不多，都会返回一个新的wrapper
        // 区别是get如果找不到的话，它会直接throw，也就是把这个测试直接给中断掉，而find会继续下去
        // 所以有一个简单规则是，。要么一直使用get。除非是有特殊情况比如要检查某个元素是否存在，这种情况就可以用find
        expect(wrapper.get('button').text()).toBe('button')
        // 3. 测试事件
        // button并没有任何自定义事件，我们用原生的click事件做一个讲解，在collapse组件会有深入点的内容
        // 下面来触发事件
        wrapper.get('button').trigger('click')
        // emitted()可以输出所有被触发的事件的名称
        console.log(wrapper.emitted());
        // toHaveProperty()  可以测试有没有对应的属性
        expect(wrapper.emitted()).toHaveProperty('click')
    })
    // 测试button是disabled状态的情况
    test('disabled', () => {
        const wrapper = mount(Button, {
            props: {
                disabled: true
            },
            slots: {
                default: 'disabled'
            }
        })
        // atrributes()可以拿到dom节点的属性
        // toBeDefined()用来确定属性是否存在
        expect(wrapper.attributes('disabled')).toBeDefined()
        // 除了用atrributes()，我们还可以拿到这个组件的原生节点，然后在原生的dom节点上来获取属性
        // element可以拿到真正的dom节点，不是对应的wrapper了
        expect(wrapper.find('button').element.disabled).toBeDefined()
        // 测试disabled状态的按钮被点击，是否会发射事件
        expect(wrapper.emitted()).not.toHaveProperty('click')
    })
    // 测试图标
    test('icon', () => {
        const wrapper = mount(Button, {
            props: {
                icon: 'arrow-up'
            },
            slots: {
                default: 'icon'
            },
            global: {
                stubs: ['FontAwesomeIcon']
            }
        })
        // 1. 测试组件是否存在
        // findComponent(组件名) 用来查找对应的组件
        const iconElement = wrapper.findComponent(FontAwesomeIcon)
        // 判断是否存在
        expect(iconElement.exists()).toBeTruthy()
        // 2. 测试icon属性是否正确，是否是arrow-up
        expect(iconElement.attributes('icon')).toBe('arrow-up')
    })
    // 测试loading状态的button
    test('loading', () => {
        const wrapper = mount(Button, {
            props: {
                loading: true
            },
            slots: {
                default: 'loading'
            },
            global: {
                // 我们来看看把我们二次封装好的Icon组件给stub掉，而不是stub掉FontAwesomeIcon，看看会有什么区别
                // 实际上这里stub掉Icon或者FontAwesomeIcon都是可以的
                stubs: ['Icon']
            }
        })
        console.log(wrapper.html());
        // const iconElement = wrapper.findComponent(FontAwesomeIcon)  报错，因为此时FontAwesomeIcon不存在了，我们stub掉的是Icon组件
        const iconElement = wrapper.findComponent(Icon)
        expect(iconElement.exists()).toBeTruthy()
        expect(iconElement.attributes('icon')).toBe('spinner')
        // 当处于loading时，也应该处于disabled状态，这个也要测试一下
        expect(wrapper.attributes('disabled')).toBeDefined()
    })
})