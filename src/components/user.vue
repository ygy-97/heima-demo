<template>
  <div class="container">
    <el-card class="card-box">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-card>
    <main>
      <el-card>
        <div class="top">
          <el-input
            placeholder="请输入内容"
            v-model="seach"
            clearable
            @clear="getTableData(currentPage,size)"
          >
            <el-button slot="append" icon="el-icon-search" @click="getTableData(currentPage,size)"></el-button>
          </el-input>
          <el-button type="primary" @click="dialogFormVisible=!dialogFormVisible">添加用户</el-button>
        </div>
        <div class="center">
          <el-table :data="tableData" border>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="username" label="姓名"></el-table-column>
            <el-table-column prop="email" label="邮箱"></el-table-column>
            <el-table-column prop="mobile" label="电话"></el-table-column>
            <el-table-column prop="role_name" label="角色"></el-table-column>
            <el-table-column label="状态">
              <template slot-scope="scope">
                <!-- {{scope.row.mg_state}} -->
                <el-switch v-model="scope.row.mg_state" @change="changeState(scope.row)"></el-switch>
              </template>
            </el-table-column>
            <el-table-column prop="mg_state" label="操作" width="180">
              <template slot-scope="scope">
                <el-button-group>
                  <el-button
                    size="mini"
                    type="primary"
                    icon="el-icon-edit"
                    @click="changeUserEvent(scope.row)"
                  ></el-button>
                  <el-button
                    size="mini"
                    type="danger"
                    icon="el-icon-delete"
                    @click="deleteUser(scope.row)"
                  ></el-button>

                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="分配角色"
                    placement="top"
                    :enterable="false"
                  >
                    <el-button
                      size="mini"
                      type="warning"
                      icon="el-icon-s-tools"
                      @click="assignRoles(scope.row)"
                    ></el-button>
                  </el-tooltip>
                </el-button-group>
              </template>
            </el-table-column>
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

    <!-- 添加成员的弹出层 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisible" width="50%" @close="offDialog">
      <el-form :model="addUser" :rules="formRules" ref="addUserForm">
        <el-form-item label="用户名" prop="username">
          <el-input type="text" v-model="addUser.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" show-password v-model="addUser.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input type="text" v-model="addUser.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input type="text" v-model="addUser.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUserClick">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改成员的弹出层 -->
    <el-dialog title="修改用户" :visible.sync="dialogChangeVisible" @close="cancelEvent">
      <el-form :model="changeUser" ref="changeUserForm" :rules="changeUserRules">
        <el-form-item label="用户名" prop="username">
          <el-input type="text" disabled v-model="changeUser.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input type="text" v-model="changeUser.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input type="text" v-model="changeUser.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogChangeVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitData">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 分配角色 弹出层 -->
    <el-dialog title="分配角色" :visible.sync="dialogRoles" @close="offDialog1">
      <p>当前用户：{{rolesUser.username}}</p>
      <p>当前角色：{{rolesUser.role_name}}</p>
      <p>
        分配新角色：
        <el-select v-model="role" placeholder="请选择">
          <el-option
            v-for="item in rolesList"
            :key="item.id"
            :label="item.roleName"
            :value="item.id"
          ></el-option>
        </el-select>
      </p>
      <div slot="footer">
        <el-button @click="dialogRoles=false">取 消</el-button>
        <el-button type="primary" @click="setRole">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
import api from "../http/api";
export default {
  data() {
    let regTel = /^1[35789]\d{9}$/;
    let regEmail = /^[A-Za-z0-9]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
    let checkmobile = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("手机号不能为空"));
      } else {
        if (!regTel.test(value)) {
          return callback("请输入合法的11位手机号");
        } else {
          callback();
        }
      }
    };
    let checkemail = (rule, value, callback) => {
      if (!regEmail.test(value)) {
        return callback("请输入正确格式的邮箱");
      } else {
        callback();
      }
    };

    return {
      currentPage: 1, //当前页数
      size: 5, //一页几条
      total: 0, //总页数
      tableData: [],
      seach: "", //查询
      addUser: {
        //添加成员对象
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      changeUser: {}, //要修改的对象
      rolesUser: {}, //分配角色
      role: "", //el-select选中的角色id
      rolesList: [], //角色数据列表
      dialogFormVisible: false, //添加用户弹出层
      dialogChangeVisible: false, //改变用户弹出层
      dialogRoles: false, //改变用户弹出层
      formRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 2, max: 10, message: "长度在2-10个字符之间", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 16,
            message: "长度在6-16个字符之间",
            trigger: ["blur", "change"],
          },
        ],
        email: [
          // { required: true, message: "请输入邮箱", trigger: "blur" },
          { type: "email", message: "请输入正确的邮箱格式", trigger: "blur" },
        ],
        mobile: [
          // { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkmobile, trigger: "blur" },
        ],
      },
      changeUserRules: {
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { type: "email", message: "请输入正确的邮箱格式", trigger: "blur" },
          { validator: checkemail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkmobile, trigger: "blur" },
        ],
      },
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

    // 关闭添加成员的弹出层
    offDialog() {
      this.$refs.addUserForm.resetFields();
    },

    //关闭分配角色 弹出层 
    offDialog1() {
      this.role = '';
      this.rolesList = [];
    },

    // 添加成员
    addUserClick() {
      this.$refs.addUserForm.validate(async (valid) => {
        console.log(valid);
        if (!valid) {
          return;
        }
        let { data: res } = await api.addUser(this.addUser);
        console.log(res, "xxxxx");
        if (res.meta.status !== 201) {
          this.$message({
            message: "添加用户失败",
            center: true,
            type: "error",
          });
        } else {
          this.$message({
            message: "添加用户成功",
            center: true,
            type: "success",
          });
          this.getTableData(this.currentPage, this.size);
        }

        this.$refs.addUserForm.resetFields();
        this.dialogFormVisible = false;
      });
    },

    // 点击弹出 修改弹出层
    changeUserEvent(obj) {
      this.dialogChangeVisible = true;
      this.changeUser = obj;
      console.log(this.changeUser);
    },

    // 删除用户
    async deleteUser(obj) {
      console.log();
      let flag = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      // console.log(flag);

      //点击确认
      if (flag == "confirm") {
        let { data: res } = await api.deletePerson(obj.id);
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
        this.getTableData(this.currentPage, this.size);
      } else {
        this.$message({
          type: "success",
          center: true,
          message: "已取消删除",
        });
      }
    },

    // 分配角色
    async assignRoles(obj) {
      this.currentUser = obj;
      console.log(obj);
      // 获取角色列表
      let { data: res } = await axios.get("roles");
      if (res.meta.status !== 200) {
        return this.$message({
          type: "error",
          message: "获取角色列表失败",
          center: true,
        });
      }
      this.$message({
        type: "success",
        message: "获取角色列表成功",
        center: true,
      });
      // 获取数据添加到rolesList
      res.data.forEach((item) => {
        let obj = { id: item.id, roleName: item.roleName };
        this.rolesList.push(obj);
      });
      this.dialogRoles = true;
      this.rolesUser = obj;
    },
    // 确定按钮 设置角色
    async setRole() {
      // 分配用户角色
      if (!this.role) {
        return this.$message({
          type: "error",
          message: "请选择要分配的角色",
          center: true,
        });
      }
      let { data: res } = await api.getRole(this.rolesUser.id, this.role);
      if (res.meta.status !== 200) {
        return this.$message({
          type: "error",
          message: "设置角色失败",
          center: true,
        });
      }

      this.$message({
        type: "success",
        message: "设置角色成功",
        center: true,
      });
      this.getTableData(this.currentPage, size);
      this.dialogChangeVisible = false;
      console.log(res1, "xxx");
    },

    // 修改用户信息 取消按钮事件
    cancelEvent() {
      // this.dialogChangeVisible = false;
      this.$refs.changeUserForm.resetFields();
    },

    // 修改用户信息 确定按钮事件
    submitData() {
      console.log(this.changeUser);
      this.$refs.changeUserForm.validate(async (valid, xx) => {
        console.log(valid, xx);
        if (!valid) {
          //未通过验证
          return false;
        } else {
          let { id, email, mobile } = this.changeUser;
          let obj = { id, email, mobile };
          let { data: res } = await api.submitData(obj);
          if (res.meta.status !== 200) {
            this.$message({
              message: "修改用户数据失败",
              center: true,
              type: "danger",
            });
          } else {
            this.$message({
              message: "修改用户数据成功",
              center: true,
              type: "success",
            });
          }
          this.dialogChangeVisible = false;
          // console.log(res);
        }
      });
    },

    // 修改用户状态
    async changeState(obj) {
      let { data: res } = await api.updataUser(obj.id, obj.mg_state);
      if (res.meta.status !== 200) {
        obj.mg_state = !obj.mg_state;
        return this.$message({
          message: "修改用户状态失败",
          type: "error",
          center: true,
        });
      }
      this.$message({
        message: "修改数据成功",
        type: "success",
        center: true,
      });
    },

    // 获取table数据
    async getTableData(currentPage, size) {
      let { data: res } = await api.getUserList(currentPage, size, this.seach);
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