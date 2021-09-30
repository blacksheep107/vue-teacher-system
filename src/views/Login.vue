<template>
  <div>
    <el-form ref="form" class="el-form" :model="form" label-width="80px">
      <el-form-item label="账号">
        <el-input v-model="form.id"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input type="password" v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="login">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import api from '@/api/index.js';
import $store from '@/store.js';
export default {
  name:'Login',
  data(){
    return{
      form:{
        id:'',
        password:'',
      }
    }
  },
  methods:{
    login(){
      api.getAccessToken().then(res=>{
        $store.state.access_token = res.data.access_token;
        localStorage.setItem('access_token', res.data.access_token);
        api.query({
          query: `db.collection("teacher").where({id:"${this.form.id}"}).limit(1).get()`
        }).then(res=>{
          let obj = JSON.parse(res.data.data[0]);
          if (this.form.password = obj.password) {
            localStorage.setItem('userInfo', JSON.stringify(obj));
            this.$message.success('登录成功！');
            $store.state.userInfo = obj;
            this.$router.push('/index');
          } else {
            this.$message.error('账号或密码错误！');
          }
        }).catch(err=>{
          this.$message.error('账号或密码错误！');
        })
      })
    },
  }
}
</script>
<style scoped>
.el-form{
  width: 300px;
  place-content: center;
  position: absolute;
  transform: translate(-56%, -60%);
  left: 50%;
  top: 50%;
}
</style>
