<template>
  <div id="app">
    <home></home>
    <!-- <my-footer></my-footer> -->
  </div>
</template>

<script>
  import Home from './components/Home'

  export default {
    components: {
      Home
    }
  }
</script>

<style>
  html, body, #app {
      width: 100%;
      height: 100%;

      overflow: hidden;

      padding: 0;
      margin: 0;
  }

  .fade-transition {
    transition: opacity .3s ease;
  }
  .fade-enter, .fade-leave {
    opacity: 0;
  }
</style>
