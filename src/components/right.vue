<template>
  <div class="container">
    <el-card class="card-box">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>权限列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-card>
    <el-card>
      <el-table :data="dataList" style="width: 100%" border stripe >
        <el-table-column type="index" label="#" align='center'></el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column label="权限等级">
          <template slot-scope="scope">
            <!-- {{scope.row.level}} -->
            <el-tag  v-if="scope.row.level==0">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.level==1">二级</el-tag>
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import api from "../http/api";
export default {
  data() {
    return {
      dataList: [],
    };
  },
  methods: {
    async getRights(type) {
      let { data: res } = await api.allRightList(type);
      console.log(res);
      if (res.meta.status !== 200) {
        return this.$message({
          message: "获取权限列表失败",
          center: true,
          type: "error",
        });
      }
      this.$message({
        message: "获取权限列表成功",
        center: true,
        type: "success",
      });
      this.dataList = res.data;
    },
  },
  created() {
    this.getRights("list");
  },
};
</script>

<style scoped lang='less'>
</style>