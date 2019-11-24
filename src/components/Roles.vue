<template>
  <div class="roles">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加角色 -->
    <el-button type="success" class="addRole" @click="showAdd">添加角色</el-button>
    <!-- 角色列表 -->
    <el-table :data="roleList">
      <el-table-column type="expand">
        <template v-slot="{row}">
          <p v-show="row.children.length === 0">此角色暂时没有任何权限哦</p>
          <el-row v-for="l1 in row.children" :key="l1.id" class="l1">
            <el-col :span="6">
              <el-tag @close="del(row, l1.id)" closable>{{ l1.authName }}</el-tag>
            </el-col>
            <el-col :span="18">
              <el-row v-for="l2 in l1.children" :key="l2.id">
                <el-col :span="6">
                  <el-tag @close="del(row, l2.id)" closable type="warning">{{ l2.authName }}</el-tag>
                </el-col>
                <el-col :span="18">
                  <el-tag closable class="l3" v-for="l3 in l2.children" :key="l3.id" type="success" @close="del(row, l3.id)">{{ l3.authName }}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="描述" prop="roleDesc"></el-table-column>
      <el-table-column label="操作">
        <template v-slot="{row}">
          <el-button icon="el-icon-edit" size="mini" plain type="primary" @click="showEdit(row)" circle></el-button>
          <el-button icon="el-icon-delete" size="mini" plain type="danger" circle @click="delRole(row.id, $event)"></el-button>
          <el-button icon="el-icon-edit" size="mini" plain type="success" round @click="showAssign(row)">分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分配角色模态框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="assignVisible">
      <el-tree
        ref="tree"
        default-expand-all
        :data="rightsList"
        :props="props"
        show-checkbox
        node-key="id">
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="assignVisible = false">取 消</el-button>
        <el-button type="primary" @click="assign">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加角色 -->
    <el-dialog title="添加角色" :visible.sync="addFormVisible">
      <el-form :model="addForm" ref="addForm" :rules="rules" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName" placeholder="请输入角色名称" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc" @keyup.enter.native="add" placeholder="请输入角色描述"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="add">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改角色 -->
    <el-dialog title="修改角色" :visible.sync="editFormVisible">
      <el-form :model="editForm" ref="editForm" :rules="rules" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName" placeholder="请输入角色名称" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc" @keyup.enter.native="edit" placeholder="请输入角色描述"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="edit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      roleId2: '',
      roleId: '',
      roleList: [], // 角色列表数据
      assignVisible: false,
      rightsList: [], // tree的数据
      props: { // tree的配置
        label: 'authName',
        children: 'children'
      },
      addFormVisible: false,
      editFormVisible: false,
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      editForm: {
        roleName: '',
        roleDesc: ''
      },
      rules: {
        roleName: [
          { required: true, message: '角色名不能为空哦', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  created () {
    this.getRoleList()
  },
  methods: {
    async getRoleList () {
      const { meta, data } = await this.$axios.get('roles')
      if (meta.status === 200) {
        // console.log(data)
        this.roleList = data
      }
    },
    // 删除权限
    async del (row, rightId) {
      const { meta, data } = await this.$axios.delete(`roles/${row.id}/rights/${rightId}`)
      if (meta.status === 200) {
        row.children = data
      }
    },
    // 分配权限
    async showAssign (row) {
      this.roleId = row.id
      this.assignVisible = true
      const { meta, data } = await this.$axios.get('rights/tree')
      if (meta.status === 200) {
        // console.log(data)
        this.rightsList = data
      }
      // 设置数据的回显
      const ids = []
      row.children.forEach(l1 => {
        l1.children.forEach(l2 => {
          l2.children.forEach(l3 => {
            ids.push(l3.id)
          })
        })
      })
      // 回显id
      this.$refs.tree.setCheckedKeys(ids)
    },
    async assign () {
      this.assignVisible = false
      // 获取选中的id
      const id1 = this.$refs.tree.getCheckedKeys()
      const id2 = this.$refs.tree.getHalfCheckedKeys()
      const rids = [ ...id1, ...id2 ].join(',')
      // this.$refs.tree.resetFields()
      // console.log(rids)
      const { meta } = await this.$axios.post(`roles/${this.roleId}/rights`, { rids })
      // console.log(meta)
      if (meta.status === 200) {
        this.$message.success('小可爱, 你分配权限成功了呦🚀')
        this.getRoleList()
      }
    },
    // 添加角色
    showAdd () {
      this.addFormVisible = true
    },
    async add () {
      try {
        await this.$refs.addForm.validate()
        const { meta } = await this.$axios.post('roles', this.addForm)
        if (meta.status === 201) {
          this.addFormVisible = false
          this.$message.success('小可爱, 你添加角色成功啦')
          this.getRoleList()
          this.$refs.addForm.resetFields()
        }
      } catch {
        this.$message.warning('小可爱, 你输入的信息有误哦')
      }
    },
    // 删除权限
    async delRole (id, e) {
      try {
        await this.$confirm('小可爱, 你确定要删除这个角色么', '来自小可爱的温馨提示', { type: 'warning' })
        const { meta } = await this.$axios.delete(`roles/${id}`)
        if (meta.status === 200) {
          this.$message.success('小可爱, 删除成功啦')
          this.getRoleList()
        }
      } catch {
        this.$message.error('嘻嘻嘻, 就知道你还不想删除呢')
      } finally {
        e.target.blur()
        e.target.parentNode.blur()
      }
    },
    // 修改角色
    showEdit (row) {
      this.editFormVisible = true
      this.roleId2 = row.id
      this.editForm = { ...row }
    },
    async edit () {
      try {
        await this.$refs.editForm.validate()
        const { meta } = await this.$axios.put(`roles/${this.roleId2}`, this.editForm)
        // console.log(meta)
        if (meta.status === 200) {
          this.$message.success('小可爱, 你修改角色成功啦')
          this.editFormVisible = false
          this.getRoleList()
        }
      } catch {
        this.$message.waning('小可爱, 你输入的 有误哦')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.addRole {
  margin: 10px 0;
}
.l1 {
  margin-top: 10px;
  border-bottom: 1px dashed #ccc;
}
.l3 {
  margin-right: 5px;
  margin-bottom: 10px;
}
</style>
