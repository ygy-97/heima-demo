<template>
  <div class="container">
    <el-card class="card-box">
      <!-- 头部面包屑 -->
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-card>

    <el-card>
      <!-- 搜索 添加 -->
      <el-row :gutter="20">
        <el-col :span="14">
          <el-input clearable @clear="searchList" placeholder="请输入内容" v-model="searchObj.query">
            <template slot="append">
              <el-button icon="el-icon-search" @click="searchList"></el-button>
            </template>
          </el-input>
        </el-col>
        <el-col :span="10">
          <el-button type="primary" @click="showAddDiolog">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- 表格区域 -->
      <el-table :data="tableData" border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量"></el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="180"></el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="showChangeDialog(scope.row)">编辑</el-button>
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="deleteGood(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 底部分页 -->
      <el-pagination background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="searchObj.pagenum"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="5"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 添加商品弹出层 -->
    <el-dialog title="添加商品" :visible.sync="dialogVisible">
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑商品弹出层 -->
    <el-dialog title="编辑商品" :visible.sync="dialogChangeVisible">
      <el-form :data="changeItem">
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogChangeVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogChangeVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      dialogVisible: false, //添加商品弹出层flag
      dialogChangeVisible: false,
      tableData: [], //table 展示的内容
      changeItem:{},//要改变的商品对象
      searchObj: {
        query: "", //查询参数
        pagenum: 1, //页码
        pagesize: 5, //每页显示条数
      },
      //   currentPage: 1, //当前页码
      total: 0, //总条数
    };
  },
  methods: {
    // 弹出层显示
    showAddDiolog() {
      this.dialogVisible = true;
    },
    // 编辑弹出层显示
    async showChangeDialog(obj) {
      this.dialogChangeVisible = true;
      let {data:res} =await axios.get('goods/'+obj.goods_id);
      this.changeItem = res;
      console.log(res)
    },

    // 搜索
    searchList() {
      this.getDataList();
    },

    // 删除商品
    async deleteGood(obj) {
      let flag = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (flag == "confirm") {
        let { data: res } = await axios.delete("goods/" + obj.goods_id);
        if (res.meta.status !== 200) {
          return this.$message({
            type: "error",
            message: "删除失败!",
            center: true,
          });
        }
        this.$message({
          type: "success",
          message: "删除成功!",
          center: true,
        });
        this.getDataList();
      } else {
        this.$message({
          type: "info",
          message: "已取消删除",
          center: true,
        });
      }
    },

    //   每页条数改变
    handleSizeChange(size) {
      this.searchObj.pagesize = size;
      this.getDataList();
    },
    // 当前页数改变
    handleCurrentChange(val) {
      this.searchObj.pagenum = val;
      this.getDataList();
    },

    //   获取要展示的数据
    async getDataList() {
      let { data: res } = await axios.get("goods", { params: this.searchObj });
      if (res.meta.status !== 200) {
        return this.$message({
          center: true,
          message: "获取商品列表失败",
          type: "error",
        });
      }
      // this.$message({
      //   center: true,
      //   message: "获取商品列表成功",
      //   type: "success",
      // });

      res.data.goods.forEach((item) => {
        let date = new Date(item.add_time);
        item.add_time = this.format(item.add_time);
      });

      this.tableData = res.data.goods;
      this.total = res.data.total;
      this.currentPage = res.data.pagenum;
      console.log(res);
    },

    // 时间格式处理
    add0(m) {
      return m < 10 ? "0" + m : m;
    },
    format(shijianchuo) {
      //shijianchuo是整数，否则要parseInt转换
      var time = new Date(shijianchuo);
      var y = time.getFullYear();
      var m = time.getMonth() + 1;
      var d = time.getDate();
      var h = time.getHours();
      var mm = time.getMinutes();
      var s = time.getSeconds();
      return (
        y +
        "-" +
        this.add0(m) +
        "-" +
        this.add0(d) +
        " " +
        this.add0(h) +
        ":" +
        this.add0(mm) +
        ":" +
        this.add0(s)
      );
    },
  },
  created() {
    this.getDataList();
  },
};
</script>

<style scoped lang='less'>
.el-pagination {
  margin-top: 10px;
  text-align: center;
}
.el-table {
  margin-top: 10px;
}
</style>