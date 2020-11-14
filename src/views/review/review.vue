<template>
  <div>
    <h1>审核</h1>
    <div>
      <span>{{message}}</span>
    </div>
  </div>
</template>

<script>
  let _this = {}
  export default {
    name: "review",
    data() {
      return {
        message: 123
      }
    },
    methods: {
      async run() {
        // 打开一个 web socket  这里端口号和上面监听的需一致
        const ws = new WebSocket('ws://localhost:3000/');

        // Web Socket 已连接上，使用 send() 方法发送数据
        ws.onopen = await function () {
          // 这里用一个延时器模拟事件
          // setInterval(function () {
          //   ws.send('客户端消息');
          // }, 2000);
        }
        // 这里接受服务器端发过来的消息
        ws.onmessage = await function (e) {
          // console.log(e.data)
          _this.message = e.data
          console.log(_this)
        }
      },
    },
    mounted() {
      this.run()
    },
    beforeCreate() {
      _this = this
    }
  }
</script>

<style scoped>

</style>
