<template>
  <Transition name="wow-alert-fade">
    <div
      class="wow-alert"
      :class="{
        [`wow-alert__${type}`]: type,
        [`wow-alert__${effect}`]: effect,
      }"
      :title="title"
      :description="description"
      :closeable="closeable"
      :center="center"
      :showIcon="showIcon"
      :closeText="closeText"
      v-show="visible"
    >
      <div v-if="showIcon" class="wow-alert__icon" :class="{largeIcon: description}">
        <Icon v-if="type == 'success'" icon="circle-check"  type="success"/>
        <Icon v-if="type == 'info'" icon="circle-info"  type="info"/>
        <Icon v-if="type == 'warning'" icon="circle-exclamation"  type="warning"/>
        <Icon v-if="type == 'danger'" icon="circle-xmark"  type="danger"/>
      </div>
      <div class="wow-alert__content">
        <span class="wow-alert__title" v-if="title" :class="{boldTitle: description}">
          <slot name="title">{{ title }}</slot>
        </span> 
        <p class="wow-alert__description" v-if="description">
          <slot name="description">{{ description }}</slot>
        </p>
      </div>
      <div class="wow-alert__close" @click="close">
        <Icon icon="xmark" class="header-angle" v-if="closeable"/>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Icon from '../Icon/Icon.vue'
import type { AlertProps, AlertEvents } from './types';

defineOptions({
  name: 'WowAlert'
})

defineProps<AlertProps>();

const emits = defineEmits<AlertEvents>();

const visible = ref(true);
const close = () => {
  visible.value = false;
  emits('close')
}
</script>

<style scoped>
.boldTitle {
  font-weight: bold;
}
.largeIcon {
  font-size: 28px;
}
</style>