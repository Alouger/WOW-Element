import { expect, describe, test, vi } from "vitest";
import { nextTick } from 'vue'
import { createMessage, closeAll } from './method'
import exp from "constants";

export const rAF = async () => {
  return new Promise((res) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(async() => {
        res(null)
        await nextTick()
      })
    })
  })
}

function getTopValue(element: Element) {
  const styles = window.getComputedStyle(element)
  const topValue = styles.getPropertyValue('top') // 返回的是字符串 19px
  return Number.parseFloat(topValue)
}

describe('createMessage', () => {
    test('调用方法应该创建对应的Message组件', async () => {
      const instance = createMessage({ message: 'hello world', duration: 0})
      // 等待动画结束
      await rAF()
      console.log('html', document.body.innerHTML);
      // 不需要和vue test uitls还有mount对应的组件打交道，直接用原始的dom方法来完成测试，只用测试是否存在就好了，内部的逻辑可以写在组件上面进行测试的
      expect(document.querySelector('.wow-message')).toBeTruthy()
      instance.destroy()
      await rAF()
      console.log('html2', document.body.innerHTML);
      // 测试销毁后应该不存在
      expect(document.querySelector('.wow-message')).toBeFalsy()
    })
    test('多次调用方法应该创建多个实例', async () => {
      const instance1 = createMessage({ message: 'hello world', duration: 0})
      const instance2 = createMessage({ message: 'hello world 2', duration: 0})
      await rAF()
      const elements = document.querySelectorAll('.wow-message')
      expect(elements.length).toBe(2)
    //   closeAll()
      instance1.destroy()
      instance2.destroy()
      await rAF()
      const elements1 = document.querySelectorAll('.wow-message')
      console.log("elements.length", elements1.length);
      expect(document.querySelector('.wow-message')).toBeFalsy()
    })
    test('创建多个实例应该设置正确的offset', async () => {
      createMessage({ message: 'hello world', duration: 0, offset: 100})
      createMessage({ message: 'hello world 2', duration: 0, offset: 50})
      await rAF()
      const elements = document.querySelectorAll('.wow-message')
      expect(elements.length).toBe(2)
      const firstElementTop = getTopValue(elements[0])
      const secondElementTop = getTopValue(elements[1])
      // https://github.com/jsdom/jsdom/issues/1590
      // 在JS-dom 中，对应的 height 返回为零
      expect(firstElementTop).toBe(100)
      expect(secondElementTop).toBe(150)
    })
})