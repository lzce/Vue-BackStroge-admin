<template>
  <div class="categories">
    <el-button type="success" @click="showAdd">添加分类</el-button>
    <el-table :data="categoryList" row-key="cat_id" v-loading="loading" class="el-table-1">
      <el-table-column label="分类名称" prop="cat_name"></el-table-column>
      <el-table-column label="是否有效">
        <template v-slot="{row}">
          {{ row.cat_deleted ? '否': '是' }}
        </template>
      </el-table-column>
      <el-table-column label="层级" prop="cat_level"></el-table-column>
      <el-table-column label="操作">
        <template v-slot="{row}">
          <el-button type="primary" size="mini" circle icon="el-icon-edit" plain @click="showEdit(row)"></el-button>
          <el-button type="danger" size="mini" circle icon="el-icon-delete" plain @click="delCate(row.cat_id, $event)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!-- 添加模态框 -->
    <el-dialog title="添加分类" :visible.sync="addFormVisible">
      <el-form :model="addForm" ref="addForm" label-width="80px" :rules="rules" status-icon>
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addForm.cat_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="父级名称" prop="cat_pid">
          <el-cascader
            clearable
            :props="props"
            v-model="addForm.cat_pid"
            :options="options"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改的模态框 -->
    <el-dialog title="修改分类" :visible.sync="editFormVisible">
      <el-form  :model="eidtForm" ref="eidtForm" label-width="80px" :rules="rules" status-icon @keyup.enter.native="editCate">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="eidtForm.cat_name" ></el-input>
        </el-form-item>
        <!-- 防止在输入框上回车提交表单 -->
        <el-form-item v-show="false">
          <el-input></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCate">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      categoryList: [],
      pagenum: 1,
      pagesize: 10,
      total: 0,
      loading: false,
      addFormVisible: false,
      editFormVisible: false,
      addForm: {
        cat_name: '',
        cat_pid: [],
        cat_level: ''
      },
      eidtForm: {
        id: '',
        cat_name: ''
      },
      options: [],
      props: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true
      },
      rules: {
        cat_name: [
          { required: true, message: '分类名称不能为空哦', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  created () {
    this.getCategoryList()
  },
  methods: {
    // 拿数据
    async getCategoryList () {
      this.loading = true
      const { meta, data } = await this.$axios.get(`categories`, {
        params: {
          type: 3,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      })
      if (meta.status === 200) {
        // console.log(data)
        this.categoryList = data.result
        this.total = data.total
      }
      this.loading = false
    },
    // 分页处理函数
    handleCurrentChange (val) {
      this.pagenum = val
      this.getCategoryList()
    },
    handleSizeChange (val) {
      this.pagesize = val
      this.pagenum = 1
      this.getCategoryList()
    },
    async showAdd () {
      this.addFormVisible = true
      const { meta, data } = await this.$axios.get(`categories?type=2`)
      if (meta.status === 200) {
        this.options = data
        // console.log(data)
      }
    },
    async addCate () {
      try {
        await this.$refs.addForm.validate()
        const { meta } = await this.$axios.post('categories', {
          cat_name: this.addForm.cat_name,
          cat_pid: this.addForm.cat_pid[this.addForm.cat_pid.length - 1] || 0,
          cat_level: this.addForm.cat_pid.length
        })
        if (meta.status === 201) {
          this.$message.success('小可爱, 创建成功啦')
          this.addFormVisible = false
          this.$refs.addForm.resetFields()
          this.getCategoryList()
        }
      } catch {
        this.$message.warning('小可爱, 分类名称不能为空哦')
      }
    },
    // 删除分类
    async delCate (id, e) {
      try {
        await this.$confirm('小可爱, 你确定要删除么', '温馨提示', { type: 'warning' })
        const { meta } = await this.$axios.delete(`categories/${id}`)
        console.log(meta)
        if (meta.status === 200) {
          this.$message.success('小可爱, 删除成功啦')
          this.getCategoryList()
        }
      } catch {
        this.$message.warning('嘻嘻嘻, 手下留情了哦')
      } finally {
        e.target.blur()
        e.target.parentNode.blur()
      }
    },
    // 修改
    showEdit (row) {
      this.editFormVisible = true
      this.eidtForm = { ...row }
    },
    async editCate () {
      try {
        await this.$refs.eidtForm.validate()
        const { meta } = await this.$axios.put(`categories/${this.eidtForm.cat_id}`, {
          cat_name: this.eidtForm.cat_name
        })
        if (meta.status === 200) {
          this.$message.success('小可爱, 修改成功啦')
          this.editFormVisible = false
          this.getCategoryList()
        }
      } catch {
        this.$message.warning('小可爱, 你的信息有误哦')
      }
    }
  }
}
</script>

<style lang="less" scoped>

</style>
