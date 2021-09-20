<template>
  <div>
    <h2>习题管理</h2>
    <div class="content_wrap">
      <el-button @click="addNewUnit" icon="el-icon-plus" style="float: left; border: none">添加新章节</el-button>
      <el-table
      :data="questionTitle">
        <el-table-column label="章节序号" prop="index"></el-table-column>
        <el-table-column label="章节名称" prop="name"></el-table-column>
        <el-table-column label="题目数量" prop="questions.length"></el-table-column>
        <el-table-column label="答题机会" prop="chance"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="naviToQuestionDetail(scope.row)">管理题目</el-button>
<!--            <el-button type="text" @click="deleteUnit(scope.row, scope.$index)">删除</el-button>-->
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog class="dialog" :visible.sync="newUnitDialog">
      <el-form>
        <el-form-item label="新章节序号（自动填入）" required>
          <el-input :value="questionTitle.length+1" disabled></el-input>
        </el-form-item>
        <el-form-item
            label="新章节名称"
            :rules="[
                { required: true, message: '请输入新章节名称', trigger: 'blur' },
          ]"
        >
          <el-input placeholder="输入新章节名称" v-model="newUnitName"></el-input>
        </el-form-item>
        <el-form-item label="答题机会" required>
          <el-input type="number" v-model="chance"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitNewUnit">添加</el-button>
          <el-button @click="newUnitDialog = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
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
      newUnitName: '',
      newUnitDialog: false,
      chance: 3,
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
    deleteUnit(row, index){
      this.$confirm('是否删除章节：'+row.name+"?", '提示').then(()=>{
        if (row.questions.length > 0) {
          this.$message.warning(row.name+'还有'+row.questions.length+'道题目!');
        } else {
          let homework = this.classInfo.homework;
          delete homework[row.name];
          // 不支持删除对象键值
          // homework[row.name] = null;
          console.log(homework)
          api.update({
            query: `db.collection("class").where({classid:'${this.classInfo.classid}'}).update({data:{homework:${JSON.stringify(homework)}}})`
          }).then(res=>{
            console.log(res.data);
            if (res.data.errmsg === 'ok' && res.data.modified == 1) {
              this.getClassInfo();
              this.$message.success('删除章节成功！');
            }else {
              this.$message.error('删除章节失败');
            }
          })
        }
      }).catch(()=>{})

    },
    getClassInfo() {
      api.query({
        query: `db.collection("class").where({classid:"${this.classid}"}).limit(1).get()`
      }).then(res=>{
        console.log(res.data)
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
    submitNewUnit(){
      // 只在class添加
      this.$loading();
      let homework = this.classInfo.homework;
      homework[this.newUnitName] = {
        questions: [],
        index: this.questionTitle.length+1,
        chance: 3,
        name: this.newUnitName
      }
      console.log(homework)
      api.update({
        query: `db.collection("class").where({classid:'${this.classInfo.classid}'}).update({data:{homework:${JSON.stringify(homework)}}})`
      }).then(res=>{
        console.log(res.data);
        if (res.data.errmsg === 'ok' && res.data.modified > 0) {
          this.$message.success('添加新章节成功');
          this.getClassInfo();
          this.chance = 3;
          this.newUnitName = '';
          this.newUnitDialog = false;
          this.$loading().close();
        }
      })
    },
    addNewUnit() {
      this.newUnitDialog = true;
    },
    naviToQuestionDetail(row) {
      // 不用window，会有刷新问题
      this.$router.push({
        name: 'questionDetail',
        params: {
          unitdata: row,
          classid: this.classInfo.classid,
          homework: this.classInfo.homework,
          // chance: row.chance,
          // name: row.name,
          // questions: row.questions,
          // classname: this.classname,
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
<style scoped lang="scss">
.el-dialog{
  div{
    &:hover{
      cursor: pointer;
    }
  }
}
</style>