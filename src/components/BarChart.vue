<template>
<div class="index">
  <div ref="barChart" class="chart"></div>
</div>
</template>

<script>
export default {
  name: "BarChart",
  data(){
    return {
      barData: {
        title: { text: '各章节平均分' },
        tooltip: {},
        grid: {
          width: '90%',
          height: '60%'
        },
        xAxis: {
          data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"],
          axisLabel: {
            interval: 0,
            rotate: 20,
            formatter: function (value) {
              return value.split(' ').join('\n');
            },
          },
          offset: 8
        },
        yAxis: {},
        series: [{
          name: '平均分',
          type: 'bar',
          data: [5, 20, 36, 10, 10, 20],

        }]
      },
    }
  },
  props:{
    studentInfo: {
      type: Array,
    },
    questionInfo: {
      type: Array,
    },
    classname: {
      type: String
    },
  },
  mounted() {
    this.init();
    this.drawBar();
  },
  methods:{
    init(){
      this.barData.title.text = this.classname+' — '+this.barData.title.text;
      console.log(this.classname)
      this.barData.xAxis.data = this.questionInfo.map((item, index)=>{
        this.barData.series[0].data[index] = 0;
        return item.name;
      });
      this.studentInfo.forEach(item=>{
        this.barData.xAxis.data.forEach((unit, index)=>{
          this.barData.series[0].data[index] += item.score[unit] === undefined? 0: item.score[unit].score;
        })
      });
      this.barData.series[0].data.forEach((item, index)=>{
        this.barData.series[0].data[index] /= this.studentInfo.length;
      })
    },
    drawBar(){
      let myChart = this.$echarts.init(this.$refs.barChart)
      // 绘制图表
      myChart.setOption(this.barData);
    },
  },
}
</script>

<style scoped>
.chart{
  width: 100vmin;
  height: 80vmin;
  margin: auto;
}
</style>