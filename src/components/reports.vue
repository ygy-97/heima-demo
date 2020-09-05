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
      <div class="echart">
        <div id="line"></div>
        <div id="pie"></div>
      </div>
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
    async getLine() {
      var myChart = echarts.init(document.getElementById("line"));
      let { data: res } = await axios.get("reports/type/1");
      if (res.meta.status !== 200) {
        return this.$message({
          center: true,
          message: "获取数据失败",
          type: "error",
        });
      }
      console.log("xxx", this.options);
      myChart.setOption(res.data);
    },
    getPie() {
      let myChart = echarts.init(document.getElementById("pie"));
      let option = {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)",
        },
        legend: {
          orient: "vertical",
          left: 10,
          data: ["华东", "华南", "华北", "西部", "其他"],
        },
        series: [
          {
            name: "来源",
            type: "pie",
            radius: ["50%", "70%"],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "30",
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: true,
            },
            label: {
              show: true,
              position: "outside",
            },
            data: [
              { value: 335, name: "华东" },
              { value: 310, name: "华南" },
              { value: 234, name: "华西" },
              { value: 135, name: "华北" },
              { value: 1548, name: "其他" },
            ],
          },
        ],
      };
      myChart.setOption(option);
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
    this.getLine();
    this.getPie();
  },
};
</script>

<style scoped lang='less'>
.echart {
  display: flex ;
  justify-content: space-around;
  align-items: center;
  // border: 1px solid red;
  #line {
    flex:1;
    width: 50%;
    height: 300px;
  }
  #pie {
    flex: 1;
    width: 50%;
    height: 300px;
  }
}
.el-card{
  margin-top: 10px;
}
</style>