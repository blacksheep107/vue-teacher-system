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
          <el-button @click="questionDialogOpen(scope.row, scope.$index)" type="text">题目详情</el-button>
          <el-button @click="finishStatue(scope.row)" type="text">完成状态</el-button>
          <el-button @click="deleteQuestion(scope.row)" type="text">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="questionDialogShown">
      <el-form label-position="left">
        <el-form-item label="类型" class="type" prop="form.type">
          <el-tag effect="dark" type="success">{{form.type}}</el-tag>
        </el-form-item>
        <el-form-item label="难度" class="type" prop="form.level">
          <el-tag effect="dark" type="warning">{{levelarr[form.level]}}</el-tag>
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
              style="width: 120px;height: 120px;"
              :src="item"
              fit="fill"></el-image>
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
            <el-button @click="changeQuestion()" type="primary">修改</el-button>
            <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog :visible.sync="addQuestionDialog">
      <el-form>
        <el-form-item label="题目类型">
          <el-select v-model="addForm.type" @change="changeType">
            <el-option v-for="item in questionTypes" :label="item" :key="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="题目难度">
          <el-select v-model="addForm.level">
            <el-option v-for="item in levelList" :label="item.label" :key="item.value" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分值">
          <el-input v-model="addForm.point"></el-input>
        </el-form-item>
        <el-form-item label="题目内容">
          <el-input type="textarea" autosize v-model="addForm.content"></el-input>
        </el-form-item>
        <el-form-item label="图片">
          <el-upload
              action="#"
              list-type="picture"
              :auto-upload="false"
              :file-list="addForm.fileList"
              :on-change="changeFiles"
              :on-remove="removeFile"
              multiple
          >
            <el-button>点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item v-if="addForm.type=='单选题'" label="单选题答案">
          <el-button @click="addNewRadioAnswer" icon="el-icon-plus" style="border: none">添加答案</el-button>

          <el-input v-for="(item, index) in radioAnsArr" v-model="item.content" class="choose-content">
            <template slot="prepend">{{item.value}}</template>
            <template slot="suffix">
              <div class="radio-suffix">
                <el-radio :label="index" v-model="addForm.answer">{{''}}</el-radio>
                <i class="el-icon-error delIcon" @click="deleteRadio(index)"></i>
              </div>
            </template>
          </el-input>

        </el-form-item>
        <el-form-item v-else-if="addForm.type=='多选题'" label="多选题答案">
          <el-button @click="addNewCheckAnswer" icon="el-icon-plus" style="border: none">添加答案</el-button>

          <el-input v-for="(item, index) in checkAnsArr" v-model="item.content" class="choose-content">
            <template slot="prepend">{{String.fromCharCode(65+index)}}</template>
            <template slot="suffix">
              <div class="radio-suffix">
                <el-checkbox :label="index" v-model="addForm.answer[index]">{{''}}</el-checkbox>
                <i class="el-icon-error delIcon" @click="deleteCheck(index)"></i>
              </div>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item v-else-if="addForm.type=='填空题'" label="填空题答案">
          <el-button @click="addNewBlankAnswer" icon="el-icon-plus" style="border: none">添加答案</el-button>

          <el-input v-for="(item, index) in blankAnsArr" v-model="item.content" class="choose-content">
            <template slot="prepend">答案{{index+1}}</template>
            <template slot="suffix">
              <div class="blank-suffix">
                <i class="el-icon-error delIcon" @click="deleteBlank(index)"></i>
              </div>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="解析">
          <el-input type="textarea" autosize v-model="addForm.analysis"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="addQuestion" type="primary">添加</el-button>
          <el-button @click="resetAddForm">重置</el-button>
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
      classname: '',
      questions: [],
      questionsDetail: [],
      levelarr: {
        'easy': '易',
        'medium': '中',
        'hard': '难'
      },
      levelList: [
        {
          value: 'easy',
          label: '易'
        },
        {
          value: 'medium',
          label: '中'
        },
        {
          value: 'hard',
          label: '难'
        },
      ],
      form: {},
      oldForm: {},  // 重置用
      addForm: {
        type: '单选题',
        point: 1,
        content: '',
        analysis: '',
        level: 'easy',
        // radioAnswer: '',
        // checkAnswer: [],
        // fillAnswer: [],
        answer: '',
        fileList: [],
      },
      oldAddForm: {},
      radioAnsArr: [
        {
          content: '',
          value: 'A',
        },
        {
          content: '',
          value: 'B',
        }
      ],
      checkAnsArr: [
        {
          content: '',
          value: 'A'
        },
        {
          content: '',
          value: 'B'
        }
      ],
      blankAnsArr: [
        {
          content: ''
        },
      ],
      questionTypes: [
          '单选题',
          '多选题',
          '填空题'
      ],
      questionDialogShown: false,
      addQuestionDialog: false,
      formIndex: 0,
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    changeFiles(file){
      this.addForm.fileList.push(file)
    },
    deleteQuestion(row){
      // 先查数据库，可能有添加后立刻删除情况
      console.log(row);
      let _id = row._id;
      this.$confirm('是否删除题目？','提示').then(()=> {
        this.$loading();
        this.refreshQuestions().then((data) => {
          let promiseArr = [this.deleteQuestionInClass(data.homework, row.unitname, _id),
            this.deleteQuestionSelf(_id)
          ];
          Promise.all(promiseArr).then(() => {
            this.questions.splice(this.questions.findIndex((item)=>{
              return item === _id;
            }),1);
            this.questionsDetail.splice(this.questionsDetail.findIndex(item=>{
              return item._id === _id;
            }),1);
            this.$message.success('删除题目成功');
            this.$loading().close();
          }).catch(err=>{
            this.$message.error('删除题目失败！')
          })
        })
      }).catch(()=>{});
    },
    refreshQuestions(){
      return new Promise(resolve => {
        api.query({
          query: `db.collection("class").where({classid:"${this.$route.params.classid}"}).get()`
        }).then(res=>{
          let data = JSON.parse(res.data.data[0]);
          this.questions = data.homework[this.name].questions;
          resolve(data);
        })
      })
    },
    deleteQuestionInClass(data, unitname, id){
      data[unitname].questions.splice(data[unitname].questions.findIndex((item)=>{
        return item === id;
      }), 1);
      console.log(data);
      return new Promise(resolve => {
        api.update({
          query: `db.collection("class").where({classid:'${this.$route.params.classid}'}).update({data:{homework:${JSON.stringify(data)}}})`
        }).then(res=>{
          let data = res.data;
          if (data.errmsg === 'ok') {
            resolve();
          }
        })
      })
    },
    deleteQuestionSelf(id){
      // 在questions里删除实体
      return new Promise(resolve => {
        api.deleteRecord({
          query: `db.collection("questions").doc("${id}").remove()`
        }).then(res=>{
          console.log(res.data);
          if (res.data.errmsg === 'ok' && res.data.deleted == 1) {
            resolve();
          }
        })
      })
    },
    uploadPictures(){
      let picUrls = [];
      return new Promise(resolve => {
        let count = this.addForm.fileList.length;
        if (count == 0) resolve(0);
        this.addForm.fileList.forEach(item=>{
          api.uploadFile({
            path:item.name
          }).then(res=>{
            console.log(res.data);
            let data = res.data;
            let formData = new FormData();
            formData.append("key",item.name);
            formData.append("Signature",data.authorization);
            formData.append("x-cos-security-token",data.token);
            formData.append("x-cos-meta-fileid",data.cos_file_id);
            formData.append("file",item.raw);
            api.fileUrl(res.data.url, formData).then(res1=>{
              console.log(res1);
              if (res1.status == 204) {
                // this.$message.success('上传图片'+item.name+'成功');
                picUrls.push(res.data.file_id);
                count--;
                if (count == 0) {
                  this.addForm.pictures = picUrls;
                  resolve();
                }
              }
            })
          })
        })
      })
    },
    addQuestion(){
      this.$loading();
      console.log(this.addForm)
      this.uploadPictures().then((res)=>{
        // 上传图片完成
        if (res!==0) {
          this.$message.success('所有图片上传完成');
        }
        let submitForm = JSON.parse(JSON.stringify(this.addForm));
        submitForm.unitname = this.name;
        submitForm.studentsdid = [];
        submitForm.classname = this.classname;
        delete submitForm.fileList;
        if (submitForm.type === '单选题') {
          submitForm.answer = String.fromCharCode(65+submitForm.answer);
          submitForm.choosecontent = this.radioAnsArr;
          submitForm.choosenum = 1;
          submitForm.type = 'choose';
        } else if (submitForm.type === '多选题') {
          let ans = [];
          for (let i=0;i<submitForm.answer.length;i++) {
            if (submitForm.answer[i]) {
              ans.push(String.fromCharCode(65+i));
            }
          }
          submitForm.answer = ans;
          submitForm.choosecontent = this.checkAnsArr;
          submitForm.choosenum = submitForm.answer.length;
          submitForm.type = 'choose';
          submitForm.isorder = false;
        } else if (submitForm.type === '填空题'){
          submitForm.type = 'fillblank';
          submitForm.answer = this.blankAnsArr.map(item=>item.content);
          submitForm.blanknum = submitForm.answer.length;
        }
        console.log(submitForm);
        this.addToServer(submitForm);
      })
    },
    addToServer(submitForm) {
      api.add({
        query: `db.collection("questions").add({data:${JSON.stringify(submitForm)}})`
      }).then(res=>{
        console.log(res.data);
        if (res.data.errmsg === 'ok') {
          let id = res.data.id_list[0];
          let data = JSON.parse(JSON.stringify(this.$route.params.homework));
          data[this.name].questions.push(id);
          api.update({
            query: `db.collection("class").where({classid:'${this.$route.params.classid}'}).update({data:{homework:${JSON.stringify(data)}}})`
          }).then(res1=>{
            if (res1.data.errmsg === 'ok') {
              this.questions.push(id);
              this.getQuestion(id);
              this.$message.success('添加成功');
              this.addQuestionDialog = false;
              this.$loading().close();
            }
          })
        }
      })
    },
    finishStatue(row){
      let url = this.$router.resolve({
        path: '/finishStatus',
        query: {
          studentsdid: row.studentsdid,
        }
      });
      window.open(url.href, '_blank');
    },
    resetAddForm(){
      this.form = JSON.parse(JSON.stringify(this.oldAddForm));
    },
    removeFile(file, fileList){
      this.addForm.fileList = fileList;
    },
    init() {
      this.$loading();
      [this.chance, this.name, this.questions, this.classname] =
          [this.$route.params.unitdata.chance, this.$route.params.unitdata.name,
            this.$route.params.unitdata.questions,this.$route.params.unitdata.classname];
      this.oldAddForm = JSON.parse(JSON.stringify(this.addForm))
      this.getAllQuestions().then(()=>{
        this.$loading().close();
      });
    },
    changeType() {
      if (this.addForm.type == '单选题') {
        this.addForm.answer = '';
      }else if(this.addForm.type=='多选题') {
        this.addForm.answer = [false, false];
      }else if(this.addForm.type == '填空题') {
        this.addForm.answer = [''];
      }
    },
    deleteRadio( index) {
      this.radioAnsArr.splice(index,1);
    },
    addNewRadioAnswer() {
      this.radioAnsArr.push({
        value: String.fromCharCode(65+this.radioAnsArr.length),
        content: ''
      });
    },
    addNewCheckAnswer() {
      this.checkAnsArr.push({
        value: String.fromCharCode(65+this.checkAnsArr.length),
        content: ''
      });
      this.addForm.answer.push(false);
    },
    addNewBlankAnswer() {
      this.blankAnsArr.push({
        content: ''
      });
    },
    deleteBlank(index) {
      this.blankAnsArr.splice(index, 1);
    },
    deleteCheck(index) {
      this.checkAnsArr.splice(index,1);
      this.addForm.answer.splice(index, 1);
    },
    resetForm() {
      this.$confirm('是否重置？','提示').then(()=>{
        this.form = JSON.parse(JSON.stringify(this.oldForm));
      })
    },
    changeQuestion() {
      this.$confirm('确定修改题目？','提示').then(()=>{
        this.$loading();
        console.log(this.form);
        api.update({
          query: `db.collection("questions").doc('${this.form._id}').update({data:${JSON.stringify(this.form)}})`
        }).then(res=>{
          console.log(res.data)
          if (res.data.errmsg === 'ok' && res.data.modified === 1) {
            this.getAllQuestions().then(()=>{
              this.questionDialogShown = false;
              this.$message.success('修改成功');
              this.$loading().close();
            });
          }
        })
      }).catch(()=>{})
    },
    questionDialogOpen(row, index) {
      this.questionDialogShown = true;
      this.form = JSON.parse(JSON.stringify(row));
      this.oldForm = JSON.parse(JSON.stringify(row));
      this.formIndex = index; // 正在修改的题目下标
    },
    addQuestions() {
      this.form = {};
      this.oldForm = {};
      this.addQuestionDialog = true;
    },
    getAllQuestions() {
      return new Promise(async resolve => {
        this.questionsDetail = [];
        for (let i = 0; i < this.questions.length; i++) {
          let item = this.questions[i];
          await this.getQuestion(item);
        }
        resolve();
      })
    },
    getQuestion(id) {
      return new Promise(resolve => {
        api.query({
          query: `db.collection("questions").doc("${id}").get()`
        }).then(res=>{
          let obj = JSON.parse(res.data.data);
          console.log(obj);
          let data = obj;
          if (typeof data.pictures == 'string') {
            data.pictures = [data.pictures];
          }
          if (Array.isArray(data.pictures)) {
            api.batchdownloadfile({
              'file_list':
                data.pictures.map(item=>{
                  return {
                    fileid: item,
                    'max_age': 7200
                  }
                })
            }).then(res=>{
              console.log(res.data);
              let data = res.data;
              if (data.errmsg == 'ok') {
                obj.pictures = data.file_list.map(item=>{
                  return item['fileid'];
                });
              }else {
                this.$message.error('获取图片失败！');
              }
            })
          }
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
          resolve();
        }).catch(err=>{
          this.$message.error('请求失败！');
          this.$loading().close();
        })
      })

    },
  }
}
</script>
<style scoped lang="scss">
/deep/.el-dialog{
  min-width: 22rem;
}
.choose-content{
  margin-top: 10px;
}
.type{
  text-align: start;
}
.delIcon{
  font-size: 20px;
  margin-right: 20px;
  &:hover{
    cursor: pointer;
    color: red;
  }
}
.radio-suffix{
  height: 40px;
  line-height: 40px;
  display: flex;
  flex-direction: row;
  align-items: center;
  min-width: 94px;
  justify-content: space-between;
}
.blank-suffix{
  height: 40px;
  line-height: 40px;
  display: flex;
  flex-direction: row;
  align-items: center;
}
</style>
