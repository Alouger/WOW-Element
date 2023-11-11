<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import Form from '@/components/Form/Form.vue'
import FormItem from '@/components/Form/FormItem.vue'
import Input from '@/components/Input/Input.vue'
import Button from '@/components/Button/Button.vue'
import { reactive } from 'vue'

const model = reactive({
  email: '',
  password: '',
})
const rules = {
  email: [{ type: 'string', require: true, trigger: 'blur'}],
  password: [{ type: 'string', require: true, trigger: 'blur'}],
}

</script>

<template>
<div>
  <Form :model="model" :rules="rules">
    <!-- prop="email"表示此Item希望从formContext取得email -->
    <FormItem label="the email" prop="email">
      <Input v-model="model.email"/>
    </FormItem>
    <FormItem label="the password" prop="password">
      <template #label="{ label }">
        <Button>{{label}}</Button>
      </template>
      <Input type="password" v-model="model.password"/>
    </FormItem>
    <div>
      <Button type="primary">Submit</Button>
      <Button >Reset</Button>
    </div>
  </Form>
  <p>
    form value:
    <pre>{{ model }}</pre>
  </p>
</div>
</template>

<style>

</style>