<template>
  <div class="container">
    <el-card class="card-box">
      <!-- 头部面包屑 -->
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-card>

    <!-- 主体内容 -->
    <el-card>
      <el-button type="primary" @click="dialogVisible = true">添加角色</el-button>
      <el-table :data="rolesList" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row :class="['bd-bottom',index==0?'bd-top':'']" v-for="(item,index) in scope.row.children" :key="item.id">
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag>{{item.authName}}</el-tag>
              </el-col>

              <!-- 二三级权限 -->
              <!-- <el-col :span="19" v-for="it in item.children" :key="it.id">
                <el-tag type="success">{{it.authName}}</el-tag>
                <el-col v-for="it1 in it.children" :key="it1.id">
                  <el-tag type="warning">{{it1.authName}}</el-tag>
                </el-col>
              </el-col> -->
            </el-row>
            <pre>{{scope.row}}</pre>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作" width="290px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="changeUserEvent(scope.row)"
            >编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="deleteUser(scope.row)"
            >删除</el-button>
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-s-tools"
              @click="getRole(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加角色弹出层 -->
    <el-dialog title="添加角色" :visible.sync="dialogVisible" width="50%" @close="cancel">
      <el-form :model="user" label-width="80px" ref="addUserForm" :rules="addFormRules">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="user.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="user.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑角色弹出层 -->
    <el-dialog title="修改角色" :visible.sync="dialogChangeVisible" @close="cancel1">
      <el-form :model="changeUser" label-width="80px" ref="changeUserForm" :rules="addFormRules">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="changeUser.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="changeUser.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogChangeVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitChange">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      rolesList: [],
      dialogVisible: false, //添加角色弹出层
      dialogChangeVisible: false, //修改角色弹出层
      user: {
        //添加角色
        roleName: "",
        roleDesc: "",
      },
      changeUser: {
        //修改 通过id查询赋值
        roleId: "",
        roleName: "",
        roleDesc: "",
      },
      addFormRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          { min: 2, max: 10, message: "长度在2-10个字符之间", trigger: "blur" },
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
          { min: 2, max: 10, message: "长度在2-10个字符之间", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    // 添加角色 弹出层取消
    cancel() {
      this.$refs.addUserForm.resetFields();
    },
    // 修改角色 弹出层取消
    cancel1() {
      this.$refs.changeUserForm.resetFields();
    },

    // 添加角色 确定按钮
    addUser() {
      this.$refs.addUserForm.validate(async (valid) => {
        console.log(valid);
        if (!valid) {
          return;
        }
        let { data: res } = await axios.post("roles", this.user);
        if (res.meta.status !== 201) {
          return this.$message({
            center: true,
            message: "添加角色失败",
            type: "error",
          });
        }
        this.$message({
          center: true,
          message: "添加角色成功",
          type: "success",
        });
        this.dialogVisible = false;
        this.getrolesList();
        console.log(res);
      });
    },
    // 修改角色 确定按钮
    submitChange() {
      this.$refs.changeUserForm.validate(async (valid) => {
        if (!valid) {
          return;
        }
        let { roleName, roleDesc, roleId: id } = this.changeUser;
        let { data: res } = await axios.put("roles/" + id, {
          roleName,
          roleDesc,
          id,
        });
        if (res.meta.status !== 200) {
          return this.$message({
            center: true,
            type: "error",
            message: "修改角色信息失败",
          });
        }
        this.$message({
          center: true,
          type: "success",
          message: "修改角色信息成功",
        });
        this.dialogChangeVisible = false;
        this.getrolesList();
        console.log(res);
      });
    },

    // 编辑角色按钮
    async changeUserEvent(obj) {
      let { data: res } = await axios.get("roles/" + obj.id);
      if (res.meta.status !== 200) {
        return this.$message({
          center: true,
          message: "获取角色失败",
          type: "error",
        });
      }
      this.dialogChangeVisible = true;
      this.changeUser = res.data;
      // console.log(res);
    },
    // 分配权限
    getRole() {},
    // 删除角色
    async deleteUser(obj) {
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
        //点击确认
        let { data: res } = await axios.delete("roles/" + obj.id);
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
        this.getrolesList();
      } else {
        this.$message({
          type: "info",
          center: true,
          message: "已取消删除",
        });
      }
    },
    // 获取角色列表
    async getrolesList() {
      let { data: res } = await axios.get("roles");
      if (res.meta.status !== 200) {
        return this.$message({
          center: true,
          message: "获取角色列表失败",
          type: "error",
        });
      }
      this.rolesList = res.data;
      // this.$message({
      //   center: true,
      //   message: "获取角色列表成功",
      //   type: "success",
      // });
      // console.log(res);
    },
  },
  created() {
    this.getrolesList();
  },
};
</script>

<style scoped lang='less'>
.container {
  .el-card {
    .el-button {
      margin-bottom: 10px;
    }
    .el-table{
      .el-tag{
        margin: 10px;
      }
    }
  }
}

.bd-top{
  border-top: 1px solid red;
}
.bd-bottom{
  border-bottom: 1px solid red;
}
</style>