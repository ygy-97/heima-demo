<template>
  <div class="container">
    <header>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      </el-breadcrumb>
    </header>
    <main>
      <el-card>
        <div class="top">
          <el-input placeholder="请输入内容" v-model="input2">
             <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
          <el-button>添加用户</el-button>
        </div>
        <div class="center">
            
        </div>
        <div class="bottom"></div>
      </el-card>
    </main>
  </div>
</template>

<script>
export default {};
</script>

<style scoped lang='less'>
</style>