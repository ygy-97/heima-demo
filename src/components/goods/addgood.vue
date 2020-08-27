<template>
  <div class="container">
    <el-card class="card-box">
      <!-- 头部面包屑 -->
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/goods' }">商品列表</el-breadcrumb-item>
        <el-breadcrumb-item>添加商品</el-breadcrumb-item>
      </el-breadcrumb>
    </el-card>

    <el-card>
      <el-alert
        title="添加商品信息"
        :active="2"
        finish-status="success"
        type="info"
        show-icon
        center
        :closable="false"
      ></el-alert>
      <!-- 步骤条 -->
      <el-steps :active="activeIndex" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!--form -> tabs -->
      <el-form :model="addForm" ref="addFormRef" :rules="rules" label-position="top">
        <el-tabs tab-position="left" @tab-click="tabChange" :before-leave="beforeLeave">
          <el-tab-pane label="基本信息">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input type="number" v-model="addForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input type="number" v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input type="number" v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              选择商品分类:
              <el-cascader
                v-model="addForm.goods_cat"
                :options="options"
                :props="{ expandTrigger: 'hover',value:'cat_id',label:'cat_name',children:'children' }"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数">
            <!-- 商品动态参数 -->
            <template v-if="paramsData.length>0">
              <p>{{paramsData[0].attr_vals}}</p>
            </template>
          </el-tab-pane>
          <el-tab-pane label="商品属性">
            <!-- <p>{{paramsData[0].attr_vals}}</p> -->
          </el-tab-pane>
          <el-tab-pane label="商品图片">
            <el-upload
              action="https://jsonplaceholder.typicode.com/posts/"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :before-remove="beforeRemove"
              multiple
              :limit="3"
              :on-exceed="handleExceed"
              :file-list="fileList"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容">商品内容</el-tab-pane>
          <el-tab-pane label="完成">完成</el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      activeIndex: 0, //激活的index
      addForm: {
        goods_name: "",
        goods_cat: [], //分类
        goods_price: "",
        goods_number: "",
        goods_weight: "",
        goods_introduce: "",
        pics: "",
        attrs: "",
      },
      rules: {
        goods_name: [
          { required: true, message: "商品名称不能为空", trigger: "blur" },
        ],
        goods_cat: [
          { required: true, message: "商品分类不能为空", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "商品价格不能为空", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "商品数量不能为空", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "商品重量不能为空", trigger: "blur" },
        ],
      },
      options: [], //联级选择数据源
      kidArr: [], //商品分类id
      paramsData: [],
    };
  },
  methods: {
    //tabs before-leave
    beforeLeave(activeIndex, oldIndex) {
      console.log(activeIndex, oldIndex);
      if (oldIndex == 0 && this.addForm.goods_cat.length == 0) {
        this.$message({
          type: "error",
          center: true,
          message: "请先选择商品分类",
        });
        return false;
      }
      return true;
    },
    //联级选择器
    handleChange(val) {
      //   console.log(this.addForm.goods_cat);
      if (val.length !== 3) {
        this.addForm.goods_cat = [];
        console.log(this.addForm.goods_cat);
      }
    },

    // 获取参数列表 动态静态参数
    async getDate(type) {
      let arr = this.addForm.goods_cat;
      let id = arr[arr.length - 1];
      let { data: res } = await axios.get(`categories/${id}/attributes`, {
        params: { sel: type },
      });
      if (res.meta.status !== 200) {
        return this.$message({
          type: "error",
          message: "数据获取失败",
          center: true,
        });
      }
      this.$message({
        type: "success",
        message: "数据获取成功",
        center: true,
      });
      this.paramsData = res.data;
      console.log("xs", res);
    },

    // tab切换
    tabChange(tab, event) {
      console.log(tab.index, this.addForm.goods_cat);
      if (this.addForm.goods_cat == 0) {
        return;
      }
      this.activeIndex = parseInt(tab.index);
      if (tab.index == 1) {
        //动态参数
        this.getDate("many");
      } else if (tab.index == 2) {
        this.getDate("only");
      }
    },

    // 联级选择器渲染数据
    async getListData() {
      let { data: res } = await axios.get("categories");
      console.log(res);
      if (res.meta.status !== 200) {
        return this.$message({
          message: "数据获取失败",
          center: true,
          type: "error",
        });
      }
      this.options = res.data;
    },
  },
  created() {
    this.getListData();
  },
};
</script>

<style scoped lang='less'>
.el-cascader {
  // width: 100%;
}
</style>