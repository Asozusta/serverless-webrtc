<template>
  <div id="app">
    <chat></chat>
  </div>
</template>

<script>
  console.log("app");
  
  import Chat from './components/Chat'

  export default {
    components: {
      Chat
    }
  }
</script>

<style>
  body {
      padding: 0;
      margin: 0;
  }
  html, body, #app {
      width: 100%;
      height: 100%;
  }
</style>
