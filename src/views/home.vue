<template>
  <el-container>
    <!-- 头部区 -->
    <el-header>
      <div class="login">
        <img src="../assets/img/logo.png" alt="logo" />
        <span>商城后台管理系统</span>
      </div>
      <el-button type="info" @click="checkout">退出</el-button>
    </el-header>

    <!-- 头部以下 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="flag?'60px':'200px'">
        <div class="togglebtn" @click="toggleNav">|||</div>
        <el-menu
          :default-active="leftNav.length>0?leftNav[0].path:''"
          class="el-menu-vertical-demo"
          background-color="#333744"
          text-color="#fff"
          unique-opened
          :collapse="flag"
          :collapse-transition="false" router
        >
          <el-submenu :index="item.id+''" v-for="(item) in leftNav" :key="item.id">
            <template slot="title">
              <i class="iconfont" :class="icon[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <template v-if="item.children.length>0">
              <el-menu-item :index="item1.path" v-for="(item1) in item.children" :key="item1.id">
                <i class="iconfont icon-tijikongjian"></i>
                <span>{{item1.authName}}</span>
              </el-menu-item>
            </template>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
          <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import api from "../http/api";
export default {
  data() {
    return {
      leftNav: [],
      icon: {
        "125": "icon-user",
        "103": "icon-3702mima",
        "101": "icon-shangpin",
        "102": "icon-danju",
        "145": "icon-baobiao",
      },
      flag: false, //左侧导航栏是否收缩
    };
  },
  created() {
    this.getLeftNav();
  },
  methods: {
    //   获得左侧导航栏数据
    async getLeftNav() {
      let { data: res } = await api.getLeftNav();
      this.leftNav = res.data;
      console.log(res);
    },
    // 登出
    checkout() {
      sessionStorage.removeItem("token");
      this.$router.push("/login");
    },
    // 导航栏切换
    toggleNav() {
      this.flag = !this.flag;
    },
  },
};
</script>

<style scoped lang='less'>
.el-container {
  .el-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #333;
    .login {
      display: flex;
      justify-content: space-between;
      align-items: center;
      // border: 1px solid red;
      img {
        width: 50px;
        height: 50px;
        background-color: #fff;
        border-radius: 50%;
      }
      span {
        margin-left: 15px;
        color: #fff;
      }
    }
    .el-button {
    }
  }
  .el-container {
    height: calc(100vh - 60px);
    .el-aside {
      background-color: #333744;
      .togglebtn {
        background-color: #999;
        text-align: center;
        letter-spacing: 2px;
        color: #fff;
        height: 24px;
        cursor: pointer;
      }
      .el-menu {
        border: none;
        color: #fff;
        .iconfont {
          margin-right: 10px;
          width: 18px;
          height: 18px;
        }
      }
    }
  }
}
</style>