<template>
  <div>
    <div class="header">
      <h1>班级管理</h1>
    </div>
    <div class="tools">
      <el-button icon="el-icon-plus">添加班级</el-button>
    </div>
    <div class="class">
      <el-table
      :data="classInfo"
      stripe
      style="width: 100%">
        <el-table-column prop="classid" label="班级id"></el-table-column>
        <el-table-column prop="classname" label="班级名称"></el-table-column>
        <el-table-column label="管理" width="200">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="naviToStudent(scope.row)">学生</el-button>
            <el-button type="text" size="small" @click="naviToQuestions(scope.row)">习题</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import api from '@/api/index.js';
import $store from '@/store.js';

  export default {
    name:'index',
    data(){
      return{
        classInfo: [],
      }
    },
    mounted() {
      this.init();
    },
    methods:{
      naviToStudent(row){
        localStorage.removeItem('classInfo');
        localStorage.removeItem('studentInfo');
        let url = this.$router.resolve({
          path: '/studentDetail',
          query: {
            classid: row.classid,
            classname: row.classname,
            access_token: $store.state.access_token
          }
        });
        window.open(url.href, '_blank');
      },
      naviToQuestions(row) {
        let url = this.$router.resolve({
          path: '/unitsDetail',
          query: {
            classid: row.classid,
            classname: row.classname,
            access_token: $store.state.access_token
          }
        });
        window.open(url.href, '_blank');
      },
      init() {
        this.classInfo = $store.state.userInfo.class;
      },
    }
  }
</script>
<style scoped lang="scss">
.el-form{
  width: 400px;
  place-content: center;
}
.link {
  color: blue;
  &:hover{
    cursor: pointer;
  }
}
.tools{
  .el-button{
    border: none;
    float: left;
  }
}
</style>
