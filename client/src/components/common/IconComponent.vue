<template>
  <component :is="iconComponent" v-bind="$attrs" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  DocumentTextIcon,
  CodeBracketIcon,
  ChatBubbleLeftIcon,
  BellIcon,
  ArrowRightIcon
} from '@heroicons/vue/24/outline'

const props = defineProps<{
  type?: string
  name?: string
}>()

const iconComponent = computed(() => {
  if (props.name === 'arrow-right') return ArrowRightIcon
  
  switch (props.type) {
    case 'document':
      return DocumentTextIcon
    case 'code':
      return CodeBracketIcon
    case 'chat':
      return ChatBubbleLeftIcon
    default:
      return BellIcon
  }
})
</script> 