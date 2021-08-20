<template>
  <h1>{{ name }}</h1>
</template>

<script lang="ts">
import Vue, { defineComponent, toRefs, reactive } from 'vue'
export default defineComponent({
  setup(){
    const state = reactive({
      name: '孙华鹏' as string
    })
    return {
      ...toRefs(state)
    }
  }
})
</script>
