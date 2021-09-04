<template>
  <div>
    <h2>{{name}}</h2>
    <el-button @click="addQuestions" icon="el-icon-plus" style="float: left; border: none">添加题目</el-button>
    <el-table
    :data="questions">
    </el-table>
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
    addQuestions() {},
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

      })
    },
  }
}
</script>