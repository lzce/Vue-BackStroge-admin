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
        <el-input placeholder="请输入内容" v-model="query" @keyup.enter.native="search">
          <template v-slot:append>
            <i class="el-icon-search" @click="search"></i>
          </template>
        </el-input>
      </div>
      <el-button type="success" plain class="add-user" @click="showAdd">添加用户</el-button>
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
          <el-button type="primary" icon="el-icon-edit" plain circle size="mini" @click="showEdit(row)"></el-button>
          <el-button type="danger" icon="el-icon-delete" plain circle size="mini" @click="del(row, $event)"></el-button>
          <el-button type="success" icon="el-icon-edit" plain round size="mini" @click="showAssign(row)">分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- pagination -->
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[1, 2, 3, 4, 5]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

    <!-- 添加用户的模态框 -->
    <el-dialog title="添加用户" :visible.sync="addVisible" width="37%">
      <el-form :model="addForm" ref="addForm" :rules="rules">
        <el-form-item label="用户名" label-width="80px" prop="username">
          <el-input v-model="addForm.username" autocomplete="off" placeholder="请输入用户名呦😘"></el-input>
        </el-form-item>
        <el-form-item label="密 码" label-width="80px" prop="password">
          <el-input v-model="addForm.password" placeholder="请输入密码呦😘"></el-input>
        </el-form-item>
        <el-form-item label="邮 箱" label-width="80px" prop="email">
          <el-input v-model="addForm.email" placeholder="请输入邮箱呦😘"></el-input>
        </el-form-item>
        <el-form-item label="手机" label-width="80px" prop="mobile">
          <el-input v-model="addForm.mobile" placeholder="请输入手机号码呦😘" @keyup.enter.native="add"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelAdd">取 消</el-button>
        <el-button type="primary" @click="add">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改用户的模态框 -->
    <el-dialog title="修改用户" :visible.sync="editVisible" width="37%">
      <el-form :model="editForm" ref="editForm" :rules="rules">
        <el-form-item label="用户名" label-width="80px">
          <el-tag type="info">{{ editForm.username }}</el-tag>
        </el-form-item>
        <el-form-item label="邮 箱" label-width="80px" prop="email">
          <el-input v-model="editForm.email" placeholder="请输入邮箱呦😘"></el-input>
        </el-form-item>
        <el-form-item label="手机" label-width="80px" prop="mobile">
          <el-input v-model="editForm.mobile" placeholder="请输入手机号码呦😘" @keyup.enter.native="edit"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="edit">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 分配角色的模态框 -->
    <el-dialog title="分配角色" :visible.sync="assignVisible" width="37%">
      <el-form :model="assignForm" ref="editForm" :rules="rules">
        <el-form-item label="用户名" label-width="80px">
          <el-tag type="info">{{ assignForm.username }}</el-tag>
        </el-form-item>
        <el-form-item label="角色列表" label-width="80px">
          <el-select v-model="assignForm.rid" placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="assignVisible = false">取 消</el-button>
        <el-button type="primary" @click="assign">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 用户列表数据
      userList: [],
      rolesList: [],
      // 添加模态框的数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editForm: {
        username: '',
        email: '',
        mobile: null
      },
      assignForm: {
        username: '',
        id: null,
        rid: null
      },
      total: null,
      query: '',
      pagenum: 1,
      pagesize: 3,
      //  模态框的默认隐藏
      addVisible: false,
      editVisible: false,
      assignVisible: false,
      // 校验规则
      rules: {
        username: [
          { required: true, message: '亲，用户名不能为空', trigger: ['blur', 'change'] },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: ['blur', 'change'] }
        ],
        password: [
          { required: true, message: '亲，密码不能为空', trigger: ['blur', 'change'] },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: ['blur', 'change'] }
        ],
        email: [
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        mobile: [
          { pattern: /^1\d{10}$/, message: '请输入合法的手机号码', trigger: ['blur', 'change'] }
        ]
      }
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
          query: this.query,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      })
      if (meta.status === 200) {
        this.userList = data.users
        this.total = data.total
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
    async del ({ id }, e) {
      try {
        await this.$confirm('小可爱, 你确定要删除此用户么😳', '温馨提示', { type: 'warning' })
        const { meta } = await this.$axios.delete(`users/${id}`)
        if (meta.status === 200) {
          this.$message.success('亲， 删除成功了呦🤡')
          this.getUserList()
        }
      } catch {
        this.$message.warning('嘻嘻嘻, 我就知道你还在犹豫哦🙊')
      } finally {
        // 点击删除, 高亮不会消失的bug
        // console.log(e)
        e.target.blur()
        e.target.parentNode.blur()
      }
    },
    // 分页的处理函数
    handleCurrentChange (val) {
      this.pagenum = val
      this.getUserList()
    },
    handleSizeChange (val) {
      this.pagesize = val
      this.getUserList()
    },
    // 搜索功能
    search () {
      this.getUserList()
    },
    // 添加用户
    cancelAdd () {
      this.addVisible = false
      this.$refs.addForm.resetFields()
    },
    showAdd () {
      this.addVisible = true
    },
    async add () {
      try {
        await this.$refs.addForm.validate()
        const { meta } = await this.$axios.post('users', this.addForm)
        console.log(meta)
        if (meta.status === 201) {
          // 隐藏模态框, 重置表单, 重新渲染页面
          this.$message.success('小可爱, 添加成功了呦🚀')
          this.addVisible = false
          // console.log('哈哈哈')
          this.$refs.addForm.resetFields()
          // 跳转到添加的用户界面
          this.total++
          this.pagenum = Math.ceil(this.total / this.pagesize)
          this.getUserList()
        }
      } catch {
        this.$message.warning('小可爱, 要输入正确的信息哦😶')
      }
    },
    // 修改用户
    showEdit (row) {
      this.editVisible = true
      this.editForm = { ...row }
    },
    async edit () {
      const { id, email, mobile } = this.editForm
      try {
        await this.$refs.editForm.validate()
        const { meta } = await this.$axios.put(`users/${id}`, { email, mobile })
        if (meta.status === 200) {
          // 修改成功
          this.$message.success('小可爱, 修改成功啦😝')
          this.editVisible = false
          this.getUserList()
          this.$refs.editForm.resetFields()
        }
      } catch {
        this.$message.warning('小可爱, 你的输入有误呦🐷')
      }
    },
    // 分配角色
    async showAssign (row) {
      this.assignVisible = true
      const { id, username } = row
      this.assignForm.username = username
      this.assignForm.id = id

      // 角色列表数据
      const { meta, data } = await this.$axios.get('roles')
      if (meta.status === 200) {
        this.rolesList = data
      }

      // 获取角色身上的 rid
      const res = await this.$axios.get(`users/${id}`)
      if (res.meta.status === 200) {
        // console.log(res.data)
        if (res.data.rid === -1) {
          this.assignForm.rid = ''
        } else {
          this.assignForm.rid = res.data.rid
        }
      }
    },
    async assign () {
      if (!this.assignForm.rid) {
        return this.$message.warning('小可爱, 你要选择一个角色哦😝')
      }
      const { id, rid } = this.assignForm
      const { meta } = await this.$axios.put(`users/${id}/role`, { rid })
      if (meta.status === 200) {
        this.$message.success('小可爱, 分配成功了呦🚀')
        this.assignVisible = false
        this.getUserList()
        this.$refs.assignForm.resetFields()
      } else {
        this.$message.success('小可爱, 网络好像出现了点问题呦🚀')
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
