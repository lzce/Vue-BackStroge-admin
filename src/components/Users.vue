<template>
  <div class="users">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 -->
    <div class="users-search">
      <div style="margin-top: 15px;">
        <el-input placeholder="请输入内容" v-model="searchValue">
          <template v-slot:append>
            <i class="el-icon-search"></i>
          </template>
        </el-input>
      </div>
      <el-button type="success" plain class="add-user">添加用户</el-button>
    </div>
    <!-- 用户列表 -->
    <el-table
      :data="userList"
      stripe
      style="width: 100%">
      <el-table-column
        prop="username"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱"
        width="180">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="电话">
      </el-table-column>
      <el-table-column
        label="用户状态">
        <template v-slot="{row}">
          <el-switch
            @change="changeState(row)"
            v-model="row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template v-slot="{row}">
          <el-button type="primary" icon="el-icon-edit" plain circle size="mini"></el-button>
          <el-button type="danger" icon="el-icon-delete" plain circle size="mini" @click="del(row)"></el-button>
          <el-button type="success" icon="el-icon-edit" plain round size="mini">分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      userList: [],
      searchValue: ''
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    // 获取用户列表数据
    async getUserList () {
      const { meta, data } = await this.$axios.get('users', {
        params: {
          query: '',
          pagenum: 1,
          pagesize: 10
        }
      })
      if (meta.status === 200) {
        this.userList = data.users
      }
    },

    // 改变用户状态
    async changeState ({ id, mg_state: mgState }) {
      const { meta } = await this.$axios.put(`users/${id}/state/${mgState}`)
      if (meta.status === 200) {
        this.$message.success('小可爱, 修改用户状态成功了呦😘')
        this.getUserList()
      }
    },

    // 点击删除按钮， 删除用户
    async del ({ id }) {
      try {
        await this.$confirm('小可爱, 你确定要删除此用户么😳', '温馨提示', { type: 'warning' })
        const { meta } = await this.$axios.delete(`users/${id}`)
        if (meta.status === 200) {
          this.$message.success('亲， 删除成功了呦🤡')
          this.getUserList()
        }
      } catch {
        this.$message.warning('嘻嘻嘻, 我就知道你还在犹豫哦🙊')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.users {
  .el-breadcrumb {
    padding: 15px 10px;
    background-color: #ddd;
  }

  .users-search {
    display: flex;
    align-items: center;
    .el-input {
      width: 300px;
      margin-bottom: 15px;
    }
    .add-user {
      margin-left: 30px;
    }
  }
}
</style>
