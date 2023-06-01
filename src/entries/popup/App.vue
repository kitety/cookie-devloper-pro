<script setup lang="ts">
import HelloWorld from '@/components/HelloWorld.vue'
onMounted(() => {
  console.log('mounted')
})
</script>

<template>
  <div>111</div>
  <el-row class="mb-4">
    <el-button>Default</el-button>
  </el-row>
  <HelloWorld msg="Vite + Vue + Popup" />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
