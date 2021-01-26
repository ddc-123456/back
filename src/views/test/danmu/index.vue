<template>
  <div class="container">
    <h1>视频弹幕</h1>
    <div class="video-wrapper">
      <canvas id="J_danmuCanvas"></canvas>
      <video
        src="https://video.pearvideo.com/mp4/short/20210106/cont-1714882-15562968-hd.mp4"
        id="J_danmuVideo" controls></video>
    </div>
    <div class="tool-box">
      <input type="text" class="danmu-input" id="J_danmuInput">
      <button class="danmu-btu" id="J_danmuButton">发送弹幕</button>
      <input type="color" id="color-input">
    </div>
  </div>
</template>

<script>
  import initDanmu from './js'

  export default {
    name: "index",
    mounted() {
      initDanmu();
    }
  }
</script>

<style scoped>
  body {
    margin: 0;
  }

  .container {
    width: 1000px;
    margin: 0 auto;
  }

  .video-wrapper {
    position: relative;
  }

  .video-wrapper video {
    width: 100%;
  }

  .video-wrapper canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .container .tool-box {
    height: 38px;
    margin-top: 15px;
  }

  input,
  button {
    outline: none;
    border: none;
    vertical-align: middle;
    box-sizing: border-box;
  }

  .container input,
  .container button {
    height: 100%;
    margin-right: 15px;
    border-radius: 5px;
  }

  .container .danmu-input {
    width: 300px;
    border: 1px solid #ccc;
  }

  .container .danmu-btu {
    color: #fff;
    background-color: orange;
  }
</style>
