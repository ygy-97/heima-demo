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
            <!-- <template v-if="paramsData.length>0"> -->
            <el-form-item
              :label="item.attr_name"
              :key="item.attr_id"
              v-for="item in paramsManyData"
            >
              <el-checkbox-group :key="item.attr_id" v-model="item.attr_vals">
                <el-checkbox :label="it" :key="i" v-for="(it,i) in item.attr_vals"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <!-- </template> -->
          </el-tab-pane>
          <el-tab-pane label="商品属性">
            <el-form-item
              :label="item.attr_name"
              :key="item.attr_id"
              v-for="(item) in paramsOnlyData"
            >
              <el-input v-model="''+item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片">
            <el-upload
              action="http://timemeetyou.com:8889/api/private/v1/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="successFile"
              list-type="picture"
              :headers="headers"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容">
            <!-- 富文本编辑器 -->
            <quill-editor ref="myQuillEditor" v-model="addForm.goods_introduce"></quill-editor>
          </el-tab-pane>
          <el-tab-pane label="完成">
            <el-button type="primary" @click="addGood">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览  -->
    <el-dialog title="图片预览" :visible.sync="dialogVisible" width="50%" @close="dialogVisible=false">
      <el-image :src="prevUrl"></el-image>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      prevUrl: "", //图片预览路径
      dialogVisible: false, //弹出层
      headers: { Authorization: sessionStorage.getItem("token") }, //上传图片请求头设置
      activeIndex: 0, //激活的index
      addForm: {
        goods_name: "",
        goods_cat: [], //分类
        goods_price: 1,
        goods_number: 1,
        goods_weight: 1,
        goods_introduce: "",
        pics: [],
        attrs: [],
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
      paramsManyData: [], //many
      paramsOnlyData: [], //Only
    };
  },
  methods: {
    // 添加商品
    addGood() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (valid) {
          //校验成功
          let data = JSON.stringify(this.addForm);
          data = JSON.parse(data);
          data.goods_cat = data.goods_cat.join(",");

          // 动态参数
          this.paramsManyData.forEach((item) => {
            data.attrs.push({
              attr_id: item.attr_id,
              attr_value: item.attr_vals.join(" "),
            });
          });

          // 静态属性
          this.paramsOnlyData.forEach((item) => {
            data.attrs.push({
              attr_id: item.attr_id,
              attr_value: item.attr_vals,
            });
          });
          // console.log(this.paramsOnlyData)
          // console.log('zxxxx',data.attrs)
          // return;
          console.log(data)
          let { data: res } = await axios.post("goods", data);
          console.log(res);
          if (res.meta.status !== 201) {
            return this.$message({
              message: "商品创建失败",
              center: true,
              type: "error",
            });
          }
          this.$message({
            message: "商品创建成功",
            center: true,
            type: "success",
          });
          this.$router.push("/goods");
        } else {
          this.$message({
            message: "请填写表单必填项",
            center: true,
            type: "error",
          });
        }
      });
    },

    //图片预览功能
    handlePreview(file) {
      this.prevUrl = file.response.data.url;
      this.dialogVisible = true;
      console.log(file);
    },
    // 文件列表移除文件
    handleRemove(file, fileList) {
      console.log("xx", file);
      let path = file.response.data.tmp_path;
      this.addForm.pics.forEach((item, index) => {
        if (item.pic == path) {
          this.addForm.pics.splice(index, 1);
        }
      });
      console.log(this.addForm.pics);
    },
    // 文件上传成功
    successFile(response, file, fileList) {
      console.log("res", response);

      this.addForm.pics.push({ pic: response.data.tmp_path });
      console.log(this.addForm.pics);
    },
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
      let flag = type == "many" ? "动态参数" : "静态参数";
      this.$message({
        type: "success",
        message: flag + "获取成功",
        center: true,
      });
      if (type == "many") {
        res.data.forEach((item) => {
          item.attr_vals =
            item.attr_vals.length == 0 ? [] : item.attr_vals.split(" ");
        });
        this.paramsManyData = res.data;
      } else {
        this.paramsOnlyData = res.data;
      }
      console.log("xs", res.data);
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
.el-checkbox {
  margin: 10px;
}
.quill-editor {
  height: 200px !important;
  margin-bottom: 100px !important;
}
</style>