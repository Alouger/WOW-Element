<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import Form from '@/components/Form/Form.vue'
import FormItem from '@/components/Form/FormItem.vue'
import Input from '@/components/Input/Input.vue'
import Button from '@/components/Button/Button.vue'

</script>

<template>
<div>
  <Form>
    <FormItem label="the email">
      <Input />
    </FormItem>
    <FormItem label="the password">
      <template #label="{ label }">
        <Button>{{label}}</Button>
      </template>
      <Input type="password" />
    </FormItem>
    <div>
      <Button type="primary">Submit</Button>
      <Button >Reset</Button>
    </div>
  </Form>
</div>
</template>

<style>

</style>