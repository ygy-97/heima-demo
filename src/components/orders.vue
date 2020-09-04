<template>
  <div class="container">
    <el-card class="card-box">
      <!-- 头部面包屑 -->
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>订单管理</el-breadcrumb-item>
        <el-breadcrumb-item>订单列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-card>

    <el-card>
      <el-input placeholder="请输入内容" v-model="ordersObj.query" class="input-with-select">
        <el-button slot="append" icon="el-icon-search" @click="searchData"></el-button>
      </el-input>

      <!-- 表格 -->
      <el-table :data="dataList" border stripe>
        <el-table-column prop="#" type="index"></el-table-column>
        <el-table-column prop="order_number" label="订单编号"></el-table-column>
        <el-table-column prop="order_price" label="订单价格" align="center"></el-table-column>
        <el-table-column prop="pay_status" label="是否付款" align="center">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.order_pay=='0'">未付款</el-tag>
            <el-tag type="success" v-else-if="scope.row.order_pay=='1'">支付宝</el-tag>
            <el-tag type="success" v-else-if="scope.row.order_pay=='2'">微信</el-tag>
            <el-tag type="success" v-else>银行卡</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" width="100" align="center"></el-table-column>
        <el-table-column prop="update_time" label="下单时间" width="170">
          <template slot-scope="scope">{{scope.row.update_time | formatTime}}</template>
        </el-table-column>
        <el-table-column prop="name" label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="dialogAddressVisible=true"
            ></el-button>
            <el-button
              size="mini"
              type="success"
              icon="el-icon-location"
              @click="getTimeStep(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页效果 -->
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="ordersObj.pagenum"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="ordersObj.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 物流进度弹出框 -->
    <el-dialog title="物流进度" :visible.sync="dialogTimeVisible" @close="clearData">
      <el-timeline :reverse="true">
        <el-timeline-item
          v-for="(item, index) in timeStep"
          :key="index"
          :timestamp="item.time"
        >{{item.context}}</el-timeline-item>
      </el-timeline>
    </el-dialog>

    <!-- 修改地址弹出框 -->
    <el-dialog title="修改地址" :visible.sync="dialogAddressVisible" @close="resetForm">
      <el-form ref="addressRef" :model="addressForm" :rules="addressRules">
        <el-form-item label="省市区/县" prop="add1" label-width="90px">
          <el-cascader v-model="addressForm.add1" :options="cityData" :props="{ expandTrigger: 'hover' }"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="add2" label-width="90px">
          <el-input v-model="addressForm.add2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogAddressVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogAddressVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
import cityData from "./citydata";
export default {
  data() {
    return {
      cityData,
      addressForm: {
        add1: "",
        add2: "",
      },
      addressRules: {
        add1: [{ required: true, message: "请选择省市区", trigger: "blur" }],
        add2: [{ required: true, message: "请输入地址", trigger: "blur" }],
      },
      dialogAddressVisible: false, //修改地址弹出框
      dialogTimeVisible: false, //物流进度弹出框
      ordersObj: {
        //订单数据列表
        query: "",
        pagenum: 1,
        pagesize: 5,
        user_id: "",
        pay_status: "",
        is_send: "",
        order_fapiao_title: "",
        order_fapiao_company: "",
        order_fapiao_content: "",
        consignee_addr: "",
      },
      total: 0,
      dataList: [],
      timeStep: [], //时间线物流信息
    };
  },
  filters: {
    formatTime(value) {
      let date = new Date(value);
      let year = date.getFullYear();
      let month = (date.getMonth() + 1 + "").padStart(2, 0);
      let day = (date.getDate() + "").padStart(2, 0);
      let hh = (date.getHours() + "").padStart(2, 0);
      let mm = (date.getMinutes() + "").padStart(2, 0);
      let ss = (date.getSeconds() + "").padStart(2, 0);
      return `${year}-${month}-${day} ${hh}:${mm}:${ss}`;
    },
  },
  methods: {
    resetForm(){
      this.$refs.addressRef.resetFields();
    },

    // 物流弹出层关闭时，清空数据
    clearData() {
      this.timeStep = [];
    },

    //   物流信息数据
    async getTimeStep(row) {
      this.dialogTimeVisible = true;
      console.log(row);
      let id = 1106975712662;
      let { data: res } = await axios.get("kuaidi/" + id); //查看物流信息
      console.log(res);
      if (res.meta.status !== 200) {
        return this.$message({
          message: "获取物流信息失败",
          center: true,
          type: "error",
        });
      }
      this.$message({
        message: "获取物流信息成功",
        center: true,
        type: "success",
      });
      this.timeStep = res.data;
      this.dialogTimeVisible = true;
      console.log(this.timeStep);
    },

    // 搜索按钮查询
    searchData() {
      this.getDataList();
    },

    //   当前页面改变
    handleCurrentChange(pagenum) {
      this.ordersObj.pagenum = pagenum;
      this.getDataList();
    },
    // 每页条数改变
    handleSizeChange(val) {
      this.ordersObj.pagesize = val;
      this.getDataList();
    },

    //   获取表格数据
    async getDataList() {
      let { data: res } = await axios.get("orders", { params: this.ordersObj });
      console.log(res);
      if (res.meta.status !== 200) {
        return this.$message({
          message: "获取订单数据失败",
          type: "error",
          center: true,
        });
      }
      this.$message({
        message: "获取订单数据成功",
        type: "success",
        center: true,
      });
      this.dataList = res.data.goods;
      this.total = res.data.total;
      this.ordersObj.pagenum = parseInt(res.data.pagenum);
    },
  },
  created() {
    this.getDataList();
  },
};
</script>

<style scoped lang='less'>
.container {
  min-width: 900px;
}
.el-input {
  width: 100%;
  margin-bottom: 10px;
}
.el-cascader {
  width: 100%;
}
.el-pagination {
  margin-top: 10px;
  text-align: center;
}
</style>