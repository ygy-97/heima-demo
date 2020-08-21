<template>
  <div class="container">
    <el-card class="card-box">
      <!-- 头部面包屑 -->
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品分类</el-breadcrumb-item>
      </el-breadcrumb>
    </el-card>

    <el-card>
      <el-button class="mb" type="primary">添加分类</el-button>
      <!-- <el-table
        :data="tableData"
        border
      >
        <el-table-column type="index" prop="#"></el-table-column>
        <el-table-column prop="cat_name" label="分类名称" width="180"></el-table-column>
        <el-table-column prop="cat_deleted" label="是否有效" width="180"></el-table-column>
        <el-table-column prop="cat_level" label="排序"></el-table-column>
        <el-table-column label="操作" width="190">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
          </template>
        </el-table-column>
      </el-table>-->

      <tree-table
        :data="tableData"
        border
        :columns="columns"
        show-index
        index-text="#"
        :expand-type="false"
        :selection-type="false"
      >
        <template slot="temp1" slot-scope="scope">
          <i v-if="!scope.row.cat_deleted" class="el-icon-success bg-green"></i>
          <i v-else class="el-icon-error bg-red"></i>
        </template>
        <template slot="temp2" slot-scope="scope">
          <!-- {{scope.row.cat_level}} -->
          <el-tag v-if="scope.row.cat_level==0">一级</el-tag>
          <el-tag v-if="scope.row.cat_level==1" type="success">二级</el-tag>
          <el-tag v-if="scope.row.cat_level==2" type="warning">三级</el-tag>
        </template>
        <template slot="temp3" slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit" @click="editData(scope.row)">编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="deleteData(scope.row)"
          >删除</el-button>
        </template>
      </tree-table>

      <!-- 底部分页 -->
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="searchObj.pagenum"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="5"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      tableData: [],
      searchObj: {
        type: 3, //查询参数
        pagenum: 1, //页码
        pagesize: 5, //每页显示条数
      },
      total: 0,
      // 为table指定列的定义
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          prop: "cat_deleted",
          label: "是否有效",
          type: "template",
          template: "temp1",
        },
        {
          prop: "cat_level",
          label: "排序",
          type: "template",
          template: "temp2",
        },
        {
          label: "操作",
          width: "190",
          type: "template",
          template: "temp3",
        },
      ],
    };
  },
  methods: {
    // 编辑
    editData(obj) {},
    // 删除
    async deleteData(obj) {
      let flag = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);

      console.log(flag);
      if (flag == "confirm") {
        let { data: res } = await axios.delete("categories/" + obj.cat_id);
        if (res.meta.status !== 200) {
          return this.$message({
            center: true,
            message: "删除数据失败",
            type: "error",
          });
        }
        this.$message({
          center: true,
          message: "删除数据成功",
          type: "success",
        });
        this.getDataList();
      } else {
        this.$message({
          center: true,
          message: "取消删除数据成功",
          type: "info",
        });
      }
    },

    // 商品分类数据列表
    async getDataList() {
      let { data: res } = await axios({
        url: "categories",
        params: this.searchObj,
      });
      if (res.meta.status !== 200) {
        return this.$message({
          center: true,
          message: "获取商品分类失败",
          type: "error",
        });
      }
      this.$message({
        center: true,
        message: "获取商品分类成功",
        type: "success",
      });
      this.tableData = res.data.result;
      console.log(this.tableData);
      this.total = res.data.total;
    },
    // 每页显示条数
    handleSizeChange(size) {
      this.searchObj.pagesize = size;
      this.getDataList();
    },
    // 当前页改变
    handleCurrentChange(currentPage) {
      this.searchObj.pagenum = currentPage;
      this.getDataList();
    },
  },
  created() {
    this.getDataList();
  },
};
</script>

<style scoped lang='less'>
.container {
  min-width: 776px;
}
.bg-green {
  color: #67c23a;
}
.bg-red {
  color: #f56c6c;
}
.mb {
  margin-bottom: 10px;
}
</style>