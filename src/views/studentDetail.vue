<template>
  <div>
    <h2>学生管理</h2>
    <el-table
    :data="studentInfo"
    stripe
    :v-loading="isLoading"
    v-if="classInfo.homework!==undefined"
    style="width: 100%">
      <el-table-column label="学号" prop="studentid"></el-table-column>
      <el-table-column label="姓名" prop="name"></el-table-column>
<!--      <el-table-column v-for="(item, index) in Object.keys(classInfo.homework)" :label="item.split(' ').join('\n')+'\n（10分）'">-->
<!--          <template slot-scope="scope">-->
<!--            <span>{{Object.keys(scope.row.score)[index]==undefined?0:scope.row.score[Object.keys(scope.row.score)[index]].score}}</span>-->
<!--          </template>-->
<!--      </el-table-column>-->
      <el-table-column v-for="(item, index) in questionTitle" :label="item.name.split(' ').join('\n')+'\n（10分）'">
        <template slot-scope="scope">
          <span>{{scope.row.score[item.name]==undefined?0:scope.row.score[item.name].score}}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import api from '@/api/index.js';
import $store from '@/store.js';
export default {
  name: 'studentDetail',
  data() {
    return {
      classname: '',
      classid: '',
      classInfo: {},
      studentInfo: [],
      isLoading: false,
      questionTitle: [],  // 按index排序后的所有单元名称
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.isLoading = true;
      $store.state.access_token = this.$route.query.access_token;
      [this.classname, this.classid] = [this.$route.query.classname, this.$route.query.classid];
      this.getClassInfo();
    },
    getClassInfo() {
      api.query({
        query: `db.collection("class").where({classid:"${this.classid}"}).limit(1).get()`
      }).then(res=>{
        if (res.data.data.length>0) {
          this.classInfo = JSON.parse(res.data.data);
          this.getLotsStudentInfo();
        }else {
          this.$message.error('不存在班级！');
        }
      })
    },
    sortQuestionsTitle() {
      let tmp = Object.keys(this.classInfo.homework).map(item=>{
        return Object.assign(this.classInfo.homework[item],{name: item});
      });
      tmp.sort(function (a,b) {
        return a.index-b.index;
      });
      this.questionTitle = tmp;
    },
    getLotsStudentInfo() {
      let tmp = this.classInfo.students;
      let arr = [];
      new Promise(resolve => {
        let count = 0;
        for (let i=0;i<tmp.length;i++) {
          this.getStudentInfo(tmp[i]).then(res=>{
            arr.push(res);
            count++;
            if (count == tmp.length-1)  resolve();
          })
        }
      }).then(()=>{
        this.studentInfo = arr;
        this.sortQuestionsTitle();
        this.isLoading = false;
      })


    },
    getStudentInfo(studentid) {
      return new Promise(resolve => {
        api.query({
          query: `db.collection("users").where({studentid:"${studentid}"}).limit(1).get()`
        }).then(res=>{
          if (res.data.errcode==0&&res.data.data.length==1){
            let obj = JSON.parse(res.data.data[0]);
            // console.log(obj)
            // this.studentInfo.push(obj);
            resolve(obj);
          }
        })
      })

    },
  },
}
</script>
<style>
.el-table th>.cell {
  display: inline-block;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  position: relative;
  vertical-align: middle;
  padding-left: 10px;
  padding-right: 10px;
  width: 100%;
  white-space: break-spaces;
  text-align: justify;
}
</style>