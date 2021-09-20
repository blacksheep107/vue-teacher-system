<template>
  <div>
    <h2>学生管理</h2>
    <el-tabs v-model="activeTab" @tab-click="tabChange">
      <el-tab-pane label="完成情况" name="1"></el-tab-pane>
      <el-tab-pane label="柱状图" name="2"></el-tab-pane>
    </el-tabs>
    <el-table
    :data="studentInfo"
    stripe
    v-if="tab == 1 && classInfo.homework!==undefined"
    style="width: 100%"
    :default-sort = "{prop: 'studentid', order: 'ascending'}"
    >
      <el-table-column label="学号"
                       prop="studentid"
                       sortable
                       :sort-orders="['ascending', 'descending', null]"></el-table-column>
      <el-table-column label="姓名" prop="name"></el-table-column>
<!--      <el-table-column v-for="(item, index) in Object.keys(classInfo.homework)" :label="item.split(' ').join('\n')+'\n（10分）'">-->
<!--          <template slot-scope="scope">-->
<!--            <span>{{Object.keys(scope.row.score)[index]==undefined?0:scope.row.score[Object.keys(scope.row.score)[index]].score}}</span>-->
<!--          </template>-->
<!--      </el-table-column>-->
      <el-table-column
          v-for="(item, index) in questionTitle"
          :label="item.name.split(' ').join('\n')+'\n（10分）'"
          sortable
          :sort-method="(a,b)=>sortScore(a,b,item.name)"
      >
        <template slot-scope="scope">
          <span>{{scope.row.score[item.name]==undefined?0:scope.row.score[item.name].score}}</span>
        </template>
      </el-table-column>
    </el-table>
    <BarChart :studentInfo="studentInfo" :questionInfo="questionTitle" :classname="classInfo.classname" v-else-if="tab==2"></BarChart>
  </div>
</template>
<script>
import api from '@/api/index.js';
import $store from '@/store.js';
import BarChart from "../components/BarChart";
export default {
  name: 'studentDetail',
  components: {BarChart},
  data() {
    return {
      classname: '',
      classid: '',
      classInfo: {},
      studentInfo: [],
      questionTitle: [],  // 按index排序后的所有单元名称
      activeTab: '1',
      tab: '1',
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    tabChange(tab){
      this.tab = tab.name;
    },
    init() {
      if (localStorage['classInfo'] === undefined || localStorage['studentInfo'] === undefined) {
        this.$loading();
        $store.state.access_token = this.$route.query.access_token;
        [this.classname, this.classid] = [this.$route.query.classname, this.$route.query.classid];
        this.getClassInfo();
      } else {
        this.classInfo = JSON.parse(localStorage['classInfo']);
        this.studentInfo = JSON.parse(localStorage['studentInfo']);
        this.sortQuestionsTitle();
      }
    },
    sortScore(a, b, name){
      if (a.score[name] == undefined||a.score[name].score === undefined) a.score[name]={
        chance: 3,
        score: 0
      };
      if (b.score[name] == undefined||b.score[name].score === undefined) b.score[name] = {
        chance: 3,
        score: 0
      };
      let key = a.score[name].score-b.score[name].score;
      if (key == 0) return b.studentid-a.studentid;
      return a.score[name].score-b.score[name].score;
    },
    getClassInfo() {
      api.query({
        query: `db.collection("class").where({classid:"${this.classid}"}).limit(1).get()`
      }).then(res=>{
        if (res.data.data.length>0) {
          this.classInfo = JSON.parse(res.data.data);
          localStorage.setItem('classInfo', res.data.data);
          this.sortQuestionsTitle();
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
        localStorage.setItem('studentInfo', JSON.stringify(arr));
        // this.sortQuestionsTitle();
        this.$loading().close();
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