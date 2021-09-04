<template>
  <div>
    <h2>习题管理</h2>
    <div class="content_wrap">
      <el-button @click="addNewUnit" icon="el-icon-plus" style="float: left; border: none">添加新章节</el-button>
      <el-table
      :data="questionTitle">
        <el-table-column label="章节名称" prop="name"></el-table-column>
        <el-table-column label="题目数量" prop="questions.length"></el-table-column>
        <el-table-column label="答题机会" prop="chance"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="naviToQuestionDetail(scope.row)">管理题目</el-button>
            <el-button type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
<!--      <div class="add_wrap">-->
<!--        <el-input placeholder="请输入新章节名称">-->
<!--          <el-button>添加</el-button>-->
<!--        </el-input>-->
<!--      </div>-->
    </div>
  </div>
</template>
<script>
import api from '@/api/index.js';
import $store from '@/store.js';
export default {
  name: 'questionDetail',
  data() {
    return {
      classname: '',
      classid: '',
      classInfo: {},
      questionTitle: [],
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      $store.state.access_token = this.$route.query.access_token;
      [this.classname, this.classid] = [this.$route.query.classname, this.$route.query.classid];
      this.getClassInfo();
    },
    getClassInfo() {
      api.query({
        query: `db.collection("class").where({classid:"${this.classid}"}).limit(1).get()`
      }).then(res=>{
        if (res.data.data.length==1) {
          let obj = JSON.parse(res.data.data[0]);
          console.log(obj);
          this.classInfo = obj;
          this.sortQuestionsTitle();
        }else {
          this.$message.error('不存在班级！');
        }
      })
    },
    addNewUnit() {
    },
    naviToQuestionDetail(row) {
      // 不用window，会有刷新问题
      this.$router.push({
        name: 'questionDetail',
        params: {
          chance: row.chance,
          name: row.name,
          questions: row.questions
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
    }
  },
}
</script>
