<template>
  <button
    @click="handleClick"
    :type="props.type"
    class="border px-4 py-2 text-xl hover:bg-slate-800 hover:text-white transition-colors duration-200 rounded"
  >
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    type?: 'button' | 'submit' | 'reset'
  }>(),
  {
    type: 'button'
  }
)

const emit = defineEmits<{
  (e: 'customClick'): void
}>()

const handleClick = () => {
  emit('customClick')
}
</script>
