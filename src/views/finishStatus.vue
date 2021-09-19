<template>
<div>
  <h2>学生完成情况</h2>
  <el-menu default-active="1" mode="horizontal" @select="handleSelect">
    <el-menu-item index="1">完成表格</el-menu-item>
    <el-menu-item index="2">正确率饼图</el-menu-item>
  </el-menu>
  <el-table
  :data="studentsdid">
    <el-table-column label="学号" prop="studentid"></el-table-column>
    <el-table-column label="姓名" prop="studentname"></el-table-column>
    <el-table-column label="是否正确" prop="isRight"></el-table-column>
  </el-table>
</div>
</template>

<script>
import $store from '@/store.js';
export default {
  name: "finishStatus",
  data(){
    return {
      studentsdid: [],
    }
  },
  mounted() {
    this.init();
  },
  methods:{
    init(){
      console.log(localStorage)
      this.studentsdid = this.$route.query.studentsdid; // 数组为空是undefined
    },
    handleSelect(key){

    },
  },
}
</script>

<style scoped lang="scss">

</style>