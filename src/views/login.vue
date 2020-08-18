<template>
  <div class="container">
    <div class="login">
      <img src="../assets/img/logo.png" alt />

      <!-- form -->
      <div class="login-box">
        <el-form label-width="80px" ref="loginForm" :rules="loginFormRules" :model="loginForm">
          <el-form-item label="用户名" prop="username">
            <el-input
              type="text"
              v-model="loginForm.username"
              prefix-icon="el-icon-user"
            ></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              type="password"
              show-password
              v-model="loginForm.password"
              prefix-icon="el-icon-lock"
            ></el-input>
          </el-form-item>
        </el-form>
        <div class="login-btn">
          <el-button type="primary" @click="login('loginForm')">登录</el-button>
          <el-button type="info" @click="formReset('loginForm')">重置</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "../http/api";
import axios from "../http";
export default {
  data() {
    return {
      loginForm: {
        username: "admin",
        password: "123456",
      },
      loginFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 2, max: 16, message: "请输入2-16位字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 2, max: 16, message: "请输入2-16位密码", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    //重置表单
    formReset(dom) {
      console.log(this);
      this.$refs[dom].resetFields();
    },
    login(dom) {
      this.$refs[dom].validate(async (valid) => {
        if (!valid) {
          return;
        }
        let { data: res } = await api.login(this.loginForm);
        if (res.meta.status == 200) {
          //成功
          this.$message({
            message: "恭喜你，登录成功",
            type: "success",
          });
          sessionStorage.setItem("token", res.data.token);
          console.log('token',sessionStorage.getItem('token'))
          this.$router.push("/home");
        } else {
          this.$message({
            message: "登录失败，请检查用户名和密码",
            type: "error",
            center: true,
          });
        }
        // console.log(res);
      });
    },
  },
};
</script>

<style scoped lang='less'>
.container {
  width: 100vw;
  height: 100vh;
  background-color: #2b4b6b;
  display: flex;
  justify-content: center;
  align-items: center;
  .login {
    width: 500px;
    height: 300px;
    background-color: #fff;
    border-radius: 10px;
    position: relative;
    img {
      position: absolute;
      left: 50%;
      top: 0;
      transform: translate(-50%, -50%);
      width: 100px;
      height: 100px;
      background-color: #eee;
      border-radius: 50%;
      border: 5px solid #fff;
      box-shadow: 0px 0px 5px 5px #fff;
    }
    .login-box {
      width: 80%;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      .login-btn {
        display: flex;
        justify-content: flex-end;
        .el-button {
        }
      }
    }
  }
}
</style>