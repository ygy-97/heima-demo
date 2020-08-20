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
      <el-button>添加分类</el-button>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="date" label="分类名称" width="180"></el-table-column>
        <el-table-column prop="name" label="是否有效" width="180"></el-table-column>
        <el-table-column prop="address" label="排序"></el-table-column>
        <el-table-column label="操作">
            <template slot-scope="scope">
                <el-button>编辑</el-button>
                <el-button>删除</el-button>
            </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import axios from 'axios'
export default {
    data(){
        return{
            tableData:[],

        }
    },
    methods:{

        async getDataList(){
            // let {data:res} = await axios.get('goods')
        }
    }
};
</script>

<style scoped lang='less'>
</style>