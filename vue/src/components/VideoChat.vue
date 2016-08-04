<template>
  <div id="videoChatWrapper">
    <video id="localVideo" muted></video>
    <video id="remoteVideo" muted></video>
  </div>
</template>

<script>
  export default {
    
  }
</script>

<style scoped>
  #videoChatWrapper {
    width: 100%;
    height: 100%;

    background-color: black;

    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
  }
</style>