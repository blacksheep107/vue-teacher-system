<template>
  <div>
    <h2>{{name}}</h2>
    <el-button @click="addQuestions" icon="el-icon-plus" style="float: left; border: none">添加题目</el-button>
    <el-table
    :data="questionsDetail">
      <el-table-column label="类型">
        <template slot-scope="scope">
          <span>{{scope.row.type}}</span>
        </template>
      </el-table-column>
      <el-table-column label="难度">
        <template slot-scope="scope">
          <span>{{levelarr[scope.row.level]}}</span>
        </template>
      </el-table-column>
      <el-table-column label="分值" prop="point"></el-table-column>
      <el-table-column label="题目" prop="content"></el-table-column>
      <el-table-column label="已完成学生数" prop="studentsdid.length"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="questionDialogOpen(scope.row)" type="text">题目详情</el-button>
          <el-button type="text">完成状态</el-button>
          <el-button type="text">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="questionDialogShown">
      <el-form label-position="left">
        <el-form-item label="类型" prop="form.type">
          <el-tag class="type" effect="dark" type="success">{{form.type}}</el-tag>
        </el-form-item>
        <el-form-item label="分值">
          <el-input v-model="form.point"></el-input>
        </el-form-item>
        <el-form-item label="题目">
          <el-input type="textarea" autosize v-model="form.content"></el-input>
        </el-form-item>
        <el-form-item v-if="form.pictures!==undefined&&form.pictures.length>0" label="图片">
          <el-image
              v-for="item in form.pictures"
              style="width: 100px;height: 100px;"
              :src="item"
              :fit="fill"></el-image>
        </el-form-item>
        <el-form-item v-if="form.type=='单选题'||form.type=='多选题'" label="选项">
          <el-input v-for="item in form.choosecontent" v-model="item.content" class="choose-content">
            <template slot="prepend">{{item.value}}</template>
            <template slot="suffix">
              <el-radio v-if="form.type=='单选题'" style="line-height: 40px;" :label="item.value" v-model="form.answer">{{''}}</el-radio>
              <el-checkbox v-else style="line-height: 40px;" :label="item.value" v-model="form.answer">{{''}}</el-checkbox>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item v-else label="填空题答案">
          <el-input v-for="item in form.answer" v-model="item.value" class="choose-content"></el-input>
        </el-form-item>
        <el-form-item label="解析">
          <el-input v-model="form.analysis" type="textarea" autosize></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="changeQuestion" type="primary">修改</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog :visible.sync="addQuestionDialog">
      <el-form>
        <el-form-item label="题目类型">
          <el-select v-model="addForm.type">
            <el-option v-for="item in questionTypes" :label="item" :key="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分值">
          <el-input v-model="addForm.point"></el-input>
        </el-form-item>
        <el-form-item label="题目内容">
          <el-input type="textarea" autosize v-model="addForm.content"></el-input>
        </el-form-item>
        <el-form-item v-if="addForm.type=='单选题'" label="答案">

        </el-form-item>
        <el-form-item label="解析">
          <el-input type="textarea" autosize v-model="addForm.analysis"></el-input>
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
      chance: 0,
      name: '',
      questions: [],
      questionsDetail: [],
      levelarr: {
        'easy': '易',
        'medium': '中',
        'hard': '难'
      },
      form: {},
      oldForm: {},  // 重置用
      addForm: {
        type: '单选题',
        point: 1,
        content: '',
        analysis: '',
      },
      questionTypes: [
          '单选题',
          '多选题',
          '填空题'
      ],
      questionDialogShown: false,
      addQuestionDialog: false,
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      [this.chance, this.name, this.questions] = [this.$route.params.chance, this.$route.params.name, this.$route.params.questions];
      this.getAllQuestions();
    },
    resetForm() {
      this.form = JSON.parse(JSON.stringify(this.oldForm));
    },
    changeQuestion() {
      this.$confirm('确定修改题目？','提示').then(()=>{
        console.log(this.form);
      })
    },
    questionDialogOpen(row) {
      this.questionDialogShown = true;
      this.form = JSON.parse(JSON.stringify(row));
      this.oldForm = JSON.parse(JSON.stringify(row));
    },
    addQuestions() {
      this.form = {};
      this.oldForm = {};
      this.addQuestionDialog = true;

    },
    getAllQuestions() {
      this.questions.forEach(item=>{
        this.getQuestion(item);
      })
    },
    getQuestion(id) {
      api.query({
        query: `db.collection("questions").doc("${id}").get()`
      }).then(res=>{
        let obj = JSON.parse(res.data.data);
        console.log(obj);
        let tmp = obj.type;
        if (tmp == 'fillblank') {
          obj.type = '填空题';
          for (let i=0;i<obj.answer.length;i++) {
            let str = obj.answer[i];
            obj.answer[i] = {
              value: str
            }
          }
        } else if (obj.choosenum>1) {
          obj.type = '多选题';
        } else {
          obj.type = '单选题';
        }
        this.questionsDetail.push(obj);
      })
    },
  }
}
</script>
<style scoped>
.choose-content{
  margin-top: 10px;
}
.type{
  margin-left: -300px;
}
</style>