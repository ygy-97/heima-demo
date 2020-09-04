<template>
  <div class="container">
    <el-card class="card-box">
      <!-- 头部面包屑 -->
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>数据统计</el-breadcrumb-item>
        <el-breadcrumb-item>数据报表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-card>

    <el-card>
      <div id="echarts" style="width:800px;height:400px"></div>
    </el-card>
  </div>
</template>

<script>
import echarts from "echarts";
import axios from "axios";
export default {
  data() {
    return {
      reportData: "",
    };
  },
  methods: {
    async getEcharts() {
      var myChart = echarts.init(document.getElementById("echarts"));
      let { data: res } = await axios.get("reports/type/1");
      if (res.meta.status !== 200) {
        return this.$message({
          center: true,
          message: "获取数据失败",
          type: "error",
        });
      }
      console.log('xxx',this.options)
      myChart.setOption(res.data);
    },

    // 得到数据
    async getData() {
      let { data: res } = await axios.get("reports/type/1");
      if (res.meta.status !== 200) {
        return this.$message({
          center: true,
          message: "获取数据失败",
          type: "error",
        });
      }
      this.options = res.data;
      console.log(this.options);
    },
  },
  created() {
    this.getData();
  },
  mounted() {
    this.getEcharts();
  },
};
</script>

<style scoped lang='less'>
</style>