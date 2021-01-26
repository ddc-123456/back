<template>
  <div class="container">
    <div ref="bar" class="bar"></div>
    <div ref="pie" class="bar"></div>
  </div>
</template>

<script>
  // 引入 ECharts 主模块
  const echarts = require('echarts/lib/echarts');
  // 引入柱状图
  require('echarts/lib/chart/bar');
  //引入南瓜图
  require('echarts/lib/chart/pie')
  // 引入提示框和标题组件
  require('echarts/lib/component/tooltip');
  require('echarts/lib/component/title');

  export default {
    name: "index",
    mounted() {
      this.barEChartsInit();
    },
    methods: {

      barEChartsInit() {
        const myChartBar = echarts.init(this.$refs.bar);

        myChartBar.setOption({
          title: {
            text: 'ECharts 入门示例'
          },
          tooltip: {},
          xAxis: {
            data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
          },
          yAxis: {},
          series: [{
            name: '销量',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20]
          }]
        });

        const myChartPie = echarts.init(this.$refs.pie);
        myChartPie.setOption({
          backgroundColor: '#2c343c',
          visualMap: {
            show: false,
            min: 80,
            max: 600,
            inRange: {
              colorLightness: [0, 1]
            }
          },
          series: [
            {
              name: '访问来源',
              type: 'pie',
              radius: '55%',
              data: [
                {value: 235, name: '视频广告'},
                {value: 274, name: '联盟广告'},
                {value: 310, name: '邮件营销'},
                {value: 335, name: '直接访问'},
                {value: 400, name: '搜索引擎'}
              ],
              roseType: 'angle',
              label: {
                normal: {
                  textStyle: {
                    color: 'rgba(255, 255, 255, 0.3)'
                  }
                }
              },
              labelLine: {
                normal: {
                  lineStyle: {
                    color: 'rgba(255, 255, 255, 0.3)'
                  }
                }
              },
              itemStyle: {
                normal: {
                  color: '#c23531',
                  shadowBlur: 200,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        }
      )

        window.addEventListener("resize", function () {
          myChartBar.resize();
          myChartPie.resize();
        });
      }
    }
  }
</script>

<style lang="scss" scoped>
  .container {
    .bar {
      width: 50vw;

    }
  }
</style>
