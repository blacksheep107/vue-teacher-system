<template>
  <div>
    <div class="header">
      <h1>班级管理</h1>
    </div>
    <el-dialog width="20rem" title="添加班级" :visible.sync="addClassShow">
      <el-form ref="newClassFrom" style="width: auto;">
        <el-form-item label="班级编号">
          <el-input v-model="newClassFrom.classid" placeholder="请输入新班级编号（用于学生加入班级）"></el-input>
        </el-form-item>
        <el-form-item label="班级名称">
          <el-input v-model="newClassFrom.classname" placeholder="请输入新班级名称"></el-input>
        </el-form-item>
      </el-form>
      <template slot="footer">
        <el-button type="primary" @click="addNewClass">添加</el-button>
        <el-button>取消</el-button>
      </template>
    </el-dialog>
    <div class="tools">
      <el-button icon="el-icon-plus" @click="addClassShow = !addClassShow">添加班级</el-button>
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
        addClassShow: false,
        newClassFrom: {
          classid: '',
          classname: ''
        },
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
      addNewClass(){
        this.$loading();
        api.query({
          query: `db.collection("class").where({classid:"${this.newClassFrom.classid}"}).get()`
        }).then(res=>{
          if (res.data.data.length>0) {
            this.$message.info('已有相同班级编号！');
            this.$loading().close();
          } else {
            let tmp = {};
            Object.assign(tmp, JSON.parse(JSON.stringify(this.newClassFrom)), {
              homework: {},
              questions: [],
              students: [],
              teacherid: $store.state.userInfo.id
            });
            api.add({
              query: `db.collection("class").add({data:${JSON.stringify(tmp)}})`
            }).then(res=>{
              if (res.data.errmsg==='ok') {
                let userInfo = JSON.parse(localStorage.userInfo);
                api.update({
                  query: `db.collection("teacher").where({id:'${userInfo.id}'}).update({data:{class:db.command.push(${JSON.stringify(this.newClassFrom)})}})`
                }).then(res=>{
                  if (res.data.errmsg==='ok') {
                    this.$message.success('添加班级成功');
                    userInfo.class.push(JSON.parse(JSON.stringify(this.newClassFrom)));
                    $store.state.userInfo.class.push(JSON.parse(JSON.stringify(this.newClassFrom)));
                    localStorage.setItem('userInfo', JSON.stringify(userInfo));
                  }
                  this.$loading().close();
                  this.addClassShow = false;
                  this.$refs.newClassFrom.resetFields();
                })
              }
            })
          }
        })

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
