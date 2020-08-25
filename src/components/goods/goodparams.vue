<template>
  <div class="container">
    <el-card class="card-box">
      <!-- 头部面包屑 -->
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>参数列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-card>
    <el-card>
      <el-alert title="注意：只允许为第三级分类设置相关参数！" show-icon :closable="false" type="warning"></el-alert>
      <el-row>
        <span class="text">选择商品分类:</span>
        <el-cascader v-model="value" :options="kidsList" :props="props" @change="handleChange"></el-cascader>
      </el-row>

      <el-row>
        <el-tabs value="first" @tab-click="handleClick">
          <el-tab-pane label="动态参数" name="first">
            <el-button
              type="primary"
              size="mini"
              :disabled="flag?false:true"
              @click="dialogVisible=true"
            >添加参数</el-button>
            <el-table :data="tableData" border>
              <el-table-column type="expand">
                <template slot-scope="scope">
                  <el-tag
                    :key="tag.id"
                    v-for="tag in scope.row.attr_vals"
                    closable
                    :disable-transitions="false"
                    @close="handleClose(scope.row,tag)"
                  >{{tag}}</el-tag>
                  <el-input
                    class="tagInput"
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)"
                  ></el-input>
                  <el-button
                    v-else
                    class="button-new-tag"
                    size="small"
                    @click="showInput(scope.row)"
                  >+ New Tag</el-button>
                </template>
              </el-table-column>
              <el-table-column type="index" label="#"></el-table-column>
              <el-table-column prop="attr_name" label="参数名称"></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button size="mini" type="primary" @click="showDialog(scope.row)">修改</el-button>
                  <el-button size="mini" type="danger" @click="deleteDt(scope.row,'many')">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>

          <el-tab-pane label="静态属性" name="second">
            <el-button
              type="primary"
              size="mini"
              :disabled="flag?false:true"
              @click="dialogVisible=true"
            >添加参数</el-button>
            <el-table :data="tableData" border>
              <el-table-column type="expand">
                <template slot-scope="scope">
                  <el-tag
                    :key="tag"
                    v-for="tag in scope.row.attr_vals"
                    closable
                    :disable-transitions="false"
                    @close="handleClose(scope.row)"
                  >{{tag}}</el-tag>
                  <el-input
                    class="tagInput"
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)"
                  ></el-input>
                  <el-button
                    v-else
                    class="button-new-tag"
                    size="small"
                    @click="showInput(scope.row)"
                  >+ New Tag</el-button>
                </template>
              </el-table-column>
              <el-table-column type="index" label="#"></el-table-column>
              <el-table-column prop="attr_name" label="参数名称"></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button size="mini" type="primary" @click="showDialog(scope.row)">修改</el-button>
                  <el-button size="mini" type="danger" @click="deleteDt(scope.row,'many')">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </el-row>
    </el-card>

    <!-- 添加动态 静态 参数 -->
    <el-dialog :title="'添加'+textName" :visible.sync="dialogVisible" @close="closeText">
      <el-form :model="form" ref="form" :rules="rules" label-width="80px">
        <el-form-item label="参数名称" prop="attr_name">
          <el-input v-model="form.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams(type)">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改动态 静态 参数 -->
    <el-dialog :title="'修改'+textName" :visible.sync="dialogDtVisible">
      <el-form :model="form1" ref="form1" :rules="rules" label-width="80px">
        <el-form-item label="参数名称" prop="attr_name">
          <el-input v-model="form1.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="dialogDtVisible = false">取 消</el-button>
        <el-button type="primary" @click="changeParams(type)">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      flag: false, //设置添加参数是否可以点击
      dialogVisible: false, //添加动态+静态参数弹出层
      dialogDtVisible: false, //修改动态+静态参数弹出层
      kidsList: [], //商品分类数据
      value: [], //连级选择器  id Arr
      props: {
        //级联配置参数
        expandTrigger: "hover",
        // checkStrictly:false,
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      tableData: [], //表格数据
      form: {
        //添加动态参数或者静态属性
        attr_name: "",
      },
      form1: {
        //修改动态参数或者静态属性
        attr_name: "",
      },
      rules: {
        attr_name: [{ required: true, message: "名称不能为空" }],
      },
      tabIndex: "0", //切换tab的index值
    };
  },
  computed: {
    textName() {
      return this.tabIndex == "0" ? "动态参数" : "静态属性";
    },
    type() {
      return this.tabIndex == "0" ? "many" : "only";
    },
  },
  methods: {
    // 标签项删除
    handleClose(obj, tag) {
      let i = obj.attr_vals.indexOf(obj.attr_name);
      obj.attr_vals.splice(i, 1);
      let data = {
        attr_name: obj.attr_name,
        attr_sel: obj.attr_sel,
        attr_vals: obj.attr_vals.join(" "),
      };

      let id = this.value[this.value.length - 1];
      this.editParams(id, obj.attr_id, data);
      console.log(obj, tag, i, obj.attr_vals);
    },

    // 点击按钮显示文本框
    showInput(obj) {
      obj.inputVisible = true;
      console.log(obj);
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    // 标签项添加
    async handleInputConfirm(obj) {
      if (obj.inputValue.trim() === "") {
        obj.inputVisible = false;
        obj.inputValue = "";
        return;
      }
      console.log("xxx", obj);
      let inputValue = obj.inputValue;
      if (inputValue) {
        // this.dynamicTags.push(inputValue);
        obj.attr_vals.push(inputValue.trim());
      }

      let data = {
        attr_name: obj.attr_name,
        attr_sel: obj.attr_sel,
        attr_vals: obj.attr_vals.join(" "),
      };
      let id = this.value[this.value.length - 1];
      this.editParams(id, obj.attr_id, data);
      obj.inputVisible = false;
      obj.inputValue = "";
    },

    // 编辑提交参数 包括添加 删除
    async editParams(id, attrId, data) {
      let { data: res } = await axios.put(
        `categories/${id}/attributes/${attrId}`,
        data
      );
      if (res.meta.status !== 200) {
        return this.$message({
          center: true,
          message: "更改数据项失败",
          type: "error",
        });
      }

      this.$message({
        center: true,
        message: "更改数据项成功",
        type: "success",
      });
    },

    //弹出层关闭 移除校验结果
    closeText() {
      this.$refs.form.resetFields();
    },

    // tab切换
    handleClick(tab, event) {
      console.log(tab.index);
      this.tabIndex = tab.index;
      if (this.value.length > 0) {
        //value arr大于0
        let id = this.value[this.value.length - 1];

        this.getParamsList(id, this.type); //获取数据
      }
      console.log(tab, event);
    },

    // 删除动态many  静态only 参数
    async deleteDt(obj, type) {
      let flag = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          center: true,
        }
      ).catch((err) => err);
      if (flag == "confirm") {
        //确认按钮
        let id = this.value[this.value.length - 1];
        let { data: res } = await axios.delete(
          `categories/${id}/attributes/${obj.attr_id}`
        );
        if (res.meta.status !== 200) {
          return this.$message({
            type: "error",
            message: "删除数据失败",
            center: true,
          });
        }
        this.$message({
          type: "success",
          message: "删除数据成功",
          center: true,
        });
        this.getParamsList(id, this.type); //获取数据
      } else {
        //取消按钮
        this.$message({
          type: "info",
          message: "已取消删除",
          center: true,
        });
      }
    },

    //多级选择完触发事件
    handleChange(val) {
      // console.log(val, this.value);
      if (val.length < 3) {
        this.value = [];
        this.tableData = [];
        this.flag = false;
        return;
      }
      let id = val[val.length - 1];
      this.flag = true;
      this.getParamsList(id, this.type); //获取数据
    },

    // 参数列表 type [only,many]
    async getParamsList(id, type) {
      let { data: res } = await axios.get("categories/" + id + "/attributes", {
        params: { sel: type },
      });
      console.log(res);
      if (res.meta.status !== 200) {
        return this.$message({
          center: true,
          type: "error",
          message: "获取参数列表失败",
        });
      }
      res.data.forEach((item) => {
        // if (type == "many") {
        //   item.attr_vals = item.attr_vals ? item.attr_vals.split(",") : [];
        // } else {
        //   item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
        // }
        item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
        item.inputVisible = false; //tag 文本框的显示与隐藏
        item.inputValue = ""; //标签value
      });
      console.log("tableDate", res.data);
      this.tableData = res.data;
    },

    // 添加动态参数 many或者静态属性  only
    async addParams(type) {
      console.log(this.value);
      let id = this.value[this.value.length - 1];
      let data = {
        attr_name: this.form.attr_name,
        attr_sel: type,
      };
      let { data: res } = await axios.post(
        "categories/" + id + "/attributes",
        data
      );
      if (res.meta.status !== 201) {
        return this.$message({
          type: "error",
          center: true,
          message: "创建参数失败",
        });
      }
      this.$message({
        type: "success",
        center: true,
        message: "创建参数成功",
      });

      this.dialogVisible = false;
      // this.dialogVisible1 = false;
      let val = this.value;
      console.log(val);
      this.getParamsList(val[val.length - 1], type);

      console.log(res);
    },
    // 展示dialog 动态修改参数
    async showDialog(obj) {
      console.log(obj);
      let id = this.value[this.value.length - 1];
      let attrId = obj.attr_id;
      let { data: res } = await axios.get(
        `categories/${id}/attributes/${attrId}`
      );
      console.log(res);
      if (res.meta.status !== 200) {
        return this.$message({
          type: "error",
          center: true,
          message: "修改失败",
        });
      }
      this.form1 = res.data;
      this.dialogDtVisible = true;
    },

    //修改参数
    changeParams(obj, type) {
      this.$refs.form1.validate(async (valid) => {
        if (valid) {
          //校验成功才发请求
          let id = this.value[this.value.length - 1];
          let attrId = this.form1.attr_id;
          let attr_sel = this.tabIndex == "0" ? "many" : "only";
          let data = {
            attr_name: this.form1.attr_name,
            attr_sel,
          };
          this.editParams(id, attrId, data);
          this.getParamsList(id, this.type); //获取数据
          this.dialogDtVisible = false;
        }
      });
    },

    // 商品分类数据列表
    async getGoodsData() {
      let { data: res } = await axios.get("categories/");
      if (res.meta.status !== 200) {
        return this.$message({
          center: true,
          type: "error",
          message: "分类数据列表获取失败",
        });
      }
      this.kidsList = res.data;
      console.log(res);
    },
  },
  created() {
    this.getGoodsData(); //获取下拉菜单分类数据
  },
};
</script>

<style scoped lang='less'>
.el-alert {
  margin-bottom: 10px;
}
.text {
  font-size: 15px;
  margin-right: 10px;
}
.el-button {
  margin-bottom: 10px;
}
.el-tag {
  margin: 5px;
}
.tagInput {
  width: 100px;
}
</style>