<script setup lang="ts">
// 测试Button
import Button from './components/Button/Button.vue'
import type { ButtonInstance } from './components/Button/types'
import { ref, onMounted } from 'vue'
import Collapse from './components/Collapse/Collapse.vue'
import Item from './components/Collapse/CollapseItem.vue'

// 我们预设name为a的collapseItem是打开的
const openedValue = ref(['a']);

// 通过ref拿到button的dom节点，注意模板中的ref属性值要和我们script中的变量名一样
// 一开始buttonRef会是null类型，所以要用联合类型加上null
const buttonRef = ref<ButtonInstance | null>(null)
onMounted(() => {
  if (buttonRef.value) {
    // ref自动解包
    console.log('buttonRef', buttonRef.value.ref);
  }
  setTimeout(() => {
    openedValue.value = ['a', 'b']
  }, 2000);
})
const testClick = () => {
  alert(123);
}
</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
    </div>
  </header>

  <main>
    <Button ref="buttonRef" @click="testClick">Test Button</Button>
    <Button plain>Plain Button</Button>
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
    <Button size="small">Small</Button>

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
