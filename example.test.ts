// 创建一个对应的测试用例就要用一个test函数
// expect是断言库
import { expect, test, describe, vi, Mocked } from 'vitest'
import { testFn, request } from './utils'
import axios from 'axios'
import exp from 'constants'

// 用了下面这行代码后，axios就不是原始的axios了，而是vi模拟出来的axios
vi.mock('axios')
// 但用了上面这行代码后，模拟的axios会缺失一些原始的函数方法，所以要用下面这行代码进行类型断言
const mockedAxios = axios as Mocked<typeof axios>

test('test common matcher', () => {
  const name = 'wow'
  expect(name).toBe('wow')
  expect(2+2).toBe(4);
  expect(2 + 2).not.toBe(5)
})

test('test to be true or false', () => {
  expect(1).toBeTruthy()
  expect(0).toBeFalsy()
})

test('test number', () => {
  expect(4).toBeGreaterThan(3)
  expect(2).toBeLessThan(3)
})

test('test object', () => {
    // expect({name: 'wow'}).toBe({name: 'wow'})  不会通过测试，需要用toEqual
    expect({name: 'wow'}).toEqual({name: 'wow'})
})

// 回调测试 callback test
describe('functions', () => {
  test('create a mock function', () => {
    // 先创建一个可监控的函数
    const callback = vi.fn()
    testFn(12, callback)
    expect(callback).toHaveBeenCalled()
    expect(callback).toHaveBeenCalledWith(12)
  })

  // 这是监控对象上的一个方法，即执行一些代码后，监控这个方法是否被调用
  test('spy on method', () => {
    const obj = {
        getName: () => 1
    }
    const spy = vi.spyOn(obj, 'getName')
    obj.getName()
    expect(spy).toHaveBeenCalled();
    obj.getName()
    expect(spy).toHaveBeenCalledTimes(2)
  })
  test('mock third party module', async () => {
    mockedAxios.get.mockImplementation(() => Promise.resolve({data: 123}))
    const result = await request()
    expect(result).toBe(123)
  })
})