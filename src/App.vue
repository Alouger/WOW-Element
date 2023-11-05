<script setup lang="ts">
// 测试Button
import Button from './components/Button/Button.vue'
import type { ButtonInstance } from './components/Button/types'
import { ref, onMounted } from 'vue'
import { createPopper } from '@popperjs/core'
import type { Instance } from '@popperjs/core'
import type { TooltipInstance } from './components/Tooltip/types'
import Collapse from './components/Collapse/Collapse.vue'
import Item from './components/Collapse/CollapseItem.vue'
import Icon from './components/Icon/Icon.vue'
import Alert from './components/Alert/Alert.vue'
import Tooltip from './components/Tooltip/Tooltip.vue'
import type { Options } from '@popperjs/core'
import Dropdown from './components/Dropdown/Dropdown.vue'
import type { MenuOption } from './components/Dropdown/types'

// 我们预设name为a的collapseItem是打开的
const openedValue = ref(['a']);

// 通过ref拿到button的dom节点，注意模板中的ref属性值要和我们script中的变量名一样
// 一开始buttonRef会是null类型，所以要用联合类型加上null
const buttonRef = ref<ButtonInstance | null>(null)
const tooltipRef = ref<TooltipInstance | null>(null)
const size = ref<any>('3x')
// 创建触发方式的一个变量
const trigger = ref<any>('hover')
// popper参数
const options: Patial<Options> = { placement: 'right-end', strategy: 'fixed'}
// Dropdown的options变量
const dropdownOptions: MenuOption[] =  [
  {key: 1, label: 'item1'},
  {key: 2, label: 'item2', disabled: true},
  {key: 3, label: 'item3', divided: true},
  {key: 4, label: 'item4'},
]
// 创建两个由Tooltip暴露的方法
const open = () => {
  tooltipRef.value?.show()
}
const close = () => {
  tooltipRef.value?.hide()
}
onMounted(() => {
  if (buttonRef.value) {
    // ref自动解包
    console.log('buttonRef', buttonRef.value.ref);
  }
  setTimeout(() => {
    openedValue.value = ['a', 'b']
    size.value ='2xl'
    // trigger.value = 'hover'
  }, 2000);
})
const testClick = () => {
  alert(123);
}
</script>

<template>
  <header>
  <Dropdown placement="bottom" :trigger="trigger" :menu-options="dropdownOptions">
    <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125"/>
  </Dropdown>

  <Tooltip placement="right" :trigger="trigger" ref="tooltipRef" :popper-options="options" :open-delay="1000" :closeDelay="1000">
    <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125"/>
    <template #content>
      <h1>Hello tooltip</h1>
    </template>
  </Tooltip>
  </header>
  <Alert title="abc" type="success" effect="light" closeable/>
  <Alert title="abc" description="123" type="success" effect="light" closeable/>
  <Alert title="abc" description="123" type="success" effect="light" closeable showIcon/>
  <Alert title="abc" description="123" type="info" effect="light" closeable showIcon/>
  <Alert title="abc" description="123" type="warning" effect="light" closeable showIcon/>
  <Alert title="abc" description="123" type="danger" effect="light" closeable showIcon/>
  <Alert title="abc" type="success" effect="light" closeable showIcon/>
  <Alert title="abc" type="info" effect="light" closeable showIcon/>
  <Alert title="abc" type="warning" effect="light" closeable showIcon/>
  <Alert title="abc" type="danger" effect="light" closeable showIcon/>

  <Icon icon="arrow-up" :size="size" type="danger" color="#0e7a0d" />
  <main>
    <Button ref="buttonRef" @click="open">Test Button</Button>
    <Button plain @click="close">Plain Button</Button>
    <Button round>Round Button</Button>
    <Button circle>VK</Button>
    <Button disabled>Disabled Button</Button><br/><br/>
    <Button type="primary">Primary</Button>
    <Button type="success">Success</Button>
    <Button type="info">Info</Button>
    <Button type="warning">Warning</Button>
    <Button type="danger">Danger</Button><br/><br/>
    <Button type="primary" plain>Primary plain</Button>
    <Button type="success" plain>Success plain</Button>
    <Button type="info" plain>Info plain</Button>
    <Button type="warning" plain>Warning plain</Button>
    <Button type="danger" plain>Danger plain</Button><br/><br/>
    <Button size="large">Large</Button>
    <Button size="small">Small</Button><br/><br/>
    <Button size="large" loading>Loading</Button>
    <Button size="large" icon="arrow-up">Icon</Button><br/><br/>

    <Collapse v-model="openedValue" accordion>
      <Item name="a">
        <!-- v-slot的缩写是#, 这里相当于<template v-slot:title> -->
        <template #title>
          <h1>nice title</h1>
        </template>
        <h1>headline title</h1>
        <div>this is content a aaa</div>
      </Item>
      <Item name="b" title="nice title b item b">
        <div>this is bbbbb test</div>
      </Item>
      <Item name="c" title="nice cccc" disabled>
        <div>this is cccc test</div>
      </Item>
    </Collapse>
    {{ openedValue }}
  </main>
</template>

<style scoped>
  header {
    line-height: 1.5;
  }

  .logo {
    display: block;
    margin: 0 auto 2rem;
  }

  @media (min-width: 1024px) {
    header {
      display: flex;
      place-items: center;
      padding-right: calc(var(--section-gap) / 2);
    }

    .logo {
      margin: 0 2rem 0 0;
    }

    header .wrapper {
      display: flex;
      place-items: flex-start;
      flex-wrap: wrap;
    }
  }
</style>
