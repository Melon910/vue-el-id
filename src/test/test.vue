<template>
  <div>
    <!-- 我是注释 -->
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" :class="`logo`" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" v-for="(item,i) of sss" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <HelloWorld msg="传入的内容" />
</template>

<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-scgipt-setup.html#script-setup
const msg = 'Hello Vite + Vue 3!';
</script>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
