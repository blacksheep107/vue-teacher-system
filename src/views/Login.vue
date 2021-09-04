<template>
  <div>
    <el-form ref="form" class="el-form" :model="form" label-width="80px">
      <el-form-item label="用户名">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="login">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import api from '@/api/index.js';
export default {
  name:'Login',
  data(){
    return{
      form:{
        name:'',
        password:'',
      }
    }
  },
  methods:{
    login(){
      api.getAccessToken().then(res=>{
        this.$store.state.access_token = res.data.access_token;

      })
    },
  }
}
</script>
<style scoped>
.el-form{
  width: 400px;
  place-content: center;
  position: absolute;
  top: 20%;
  left: calc(50% - 200px);
}
</style>
