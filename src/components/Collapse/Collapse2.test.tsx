import { describe, expect, test, vi } from "vitest";
import { h } from 'vue'
import { mount } from '@vue/test-utils'
import Collapse from './Collapse.vue'
import CollapseItem from './CollapseItem.vue'
import exp from "constants";
describe('Collapse.vue', () => {
    test('basic collapse', async () => {
        const wrapper = mount(Collapse, {
            props: {
                'modelValue': ['a']
            },
            slots: {
                default:
                (<>
                    <CollapseItem name="a" title="title a">
                        content a
                    </CollapseItem>
                    <CollapseItem name="b" title="title b">
                        content b
                    </CollapseItem>
                    <CollapseItem name="c" title="title c" disabled>
                        content c
                    </CollapseItem>
                </>
                )
            },
            global: {
                stubs: ['Icon']
            },
            attachTo: document.body
        })
        console.log(wrapper.html());
        // findAll()相比find()可以查询多个结果，返回的是一个数组，这里我们来查找wow-collapse-item__header这个类
        const headers = wrapper.findAll('.wow-collapse-item__header')
        const contents = wrapper.findAll('.wow-collapse-item__wrapper')
        
        // 长度
        expect(headers.length).toBe(3)
        expect(contents.length).toBe(3)

        // 测试文本
        const firstHeader = headers[0]
        const secondHeader = headers[1]
        expect(firstHeader.text()).toBe('title a')
        
        // 测试内容
        const firstContent = contents[0]
        const secondContent = contents[1]
        const disabledContent = contents[2]
        // isVisible是针对v-show的, CollapseItem.vue里我们写的是v-show="isActive"
        expect(firstContent.isVisible()).toBeTruthy()
        expect(secondContent.isVisible()).toBeFalsy()
        expect(firstContent.text()).toBe('content a')

        // 测试行为————点击  这里是一个异步的过程，要加async和await。添加以后，后面的逻辑就是dom更新以后的，我们就是要等dom更新了我们才开始测试
        await firstHeader.trigger('click')
        expect(firstContent.isVisible()).toBeFalsy()
        await secondHeader.trigger('click')
        expect(secondContent.isVisible()).toBeTruthy()
        expect(wrapper.emitted()).toHaveProperty('change')
        const changeEvent = wrapper.emitted('change') as any[]
        console.table(changeEvent)
        expect(changeEvent).toHaveLength(2)

        expect(changeEvent[0]).toEqual([[]])
        expect(changeEvent[1]).toEqual([['b']])
        // 测试disabled
        const disableHeader = headers[2]
        // 测试disabled的header有没有相应的class
        expect(disableHeader.classes()).toContain('is-disabled')
        await disableHeader.trigger('click')
        expect(disabledContent.isVisible()).toBeFalsy()
    })
})