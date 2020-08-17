<template>
  <div class="container">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <main>
      <el-card>
        <div class="top">
          <el-input placeholder="请输入内容" v-model="seach">
            <el-button slot="append" icon="el-icon-search" @click="queryUser(seach)"></el-button>
          </el-input>
          <el-button type="primary">添加用户</el-button>
        </div>
        <div class="center">
          <el-table :data="tableData" border>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="username" label="姓名"></el-table-column>
            <el-table-column prop="email" label="邮箱"></el-table-column>
            <el-table-column prop="mobile" label="电话"></el-table-column>
            <el-table-column prop="role_name" label="角色"></el-table-column>
            <el-table-column prop="mg_state" label="状态"></el-table-column>
            <el-table-column prop="mg_state" label="操作"></el-table-column>
          </el-table>
        </div>
        <div class="bottom">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[5, 10, 20, 30]"
            :page-size="100"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </el-card>
    </main>
  </div>
</template>

<script>
import api from "../http/api";
export default {
  data() {
    return {
      currentPage: 1, //当前页数
      size: 5, //一页几条
      total: 0, //总页数
      tableData: [],
      seach: "", //查询
    };
  },
  methods: {
    //   size改变
    handleSizeChange(size) {
      this.size = size;
      this.getTableData(this.currentPage, size);
      console.log(size);
    },
    // 当前页改变
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.getTableData(currentPage, this.size);
    },

    // 通过id查询
    async queryUser(id) {
      let { data: res } = await api.getUserById(id);
      // if(res.meta.status==400){
      //     this.$message({
      //         message:res.meta.msg
      //     })
      // }
    //   this.getTableData(1, 5);
      console.log(res);
    },

    // 获取table数据
    async getTableData(currentPage, size) {
      let { data: res } = await api.getUserList(currentPage, size);
      this.$message({
        message: res.meta.msg,
        type: "success",
        center: true,
      });
      this.tableData = res.data.users;
      this.total = res.data.total;
    //   console.log("xxx", res);
    },
  },
  created() {
    this.getTableData(1, 5);
  },
};
</script>

<style scoped lang='less'>
.container {
  main {
    .el-card {
      box-shadow: none;
      .top {
        // margin-bottom: 10px;
        .el-input {
          width: 75%;
          .el-button {
            margin: 0;
          }
        }
        .el-button {
          margin-left: 10px;
        }
      }
      .center {
        margin: 10px 0;
      }
      .bottom {
        .el-pagination {
          text-align: center;
        }
      }
    }
  }
}
</style>