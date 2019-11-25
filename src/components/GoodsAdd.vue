<template>
  <div>
    <!-- 步骤条 -->
    <el-steps :active="active" finish-status="success">
      <el-step title="步骤 1" description="基本信息"></el-step>
      <el-step title="步骤 2" description="商品图片"></el-step>
      <el-step title="步骤 3" description="商品内容"></el-step>
    </el-steps>
    <el-tabs tab-position="left" v-model="tabActive" @tab-click="handleTabClick">
      <el-tab-pane label="基本信息" name="0">
        <el-form class="el-form-1" :model="addForm" ref="addForm" label-width="80px">
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="addForm.goods_name" placeholder="请输入商品名称"></el-input>
          </el-form-item>
          <el-form-item label="商品价格" prop="goods_price">
            <el-input v-model="addForm.goods_price" placeholder="请输入商品价格"></el-input>
          </el-form-item>
          <el-form-item label="商品重量" prop="goods_weight">
            <el-input v-model="addForm.goods_weight" placeholder="请输入商品重量"></el-input>
          </el-form-item>
          <el-form-item label="商品数量" prop="goods_number">
            <el-input v-model="addForm.goods_number" placeholder="请输入商品数量"></el-input>
          </el-form-item>
          <el-form-item label="商品分类" prop="goods_cat">
            <el-cascader
              v-model="addForm.goods_cat"
              :options="options"
              :props="props"
              @change="handleChange">
            </el-cascader>
          </el-form-item>
          <el-form-item label="是否促销">
            <el-radio-group v-model="addForm.isSell">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <el-button type="primary" @click="next">下一步</el-button>
      </el-tab-pane>
      <el-tab-pane label="商品信息" name="1">
        <!-- 照片墙 -->
        <el-upload
          action="http://localhost:8888/api/private/v1/upload"
          list-type="picture-card"
          :headers="headers"
          :on-success="uploadSuccess"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl">
        </el-dialog>
        <el-button type="success" @click="prev">上一步</el-button>
        <el-button type="primary" @click="next">下一步</el-button>
      </el-tab-pane>
      <el-tab-pane label="商品内容" name="2">
        <quill-editor
          v-model="addForm.goods_introduce">
        </quill-editor>
        <el-button type="success" class="addSure" @click="add">添加</el-button>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data () {
    return {
      active: 0,
      tabActive: '0',
      addForm: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        goods_cat: [],
        isSell: 1,
        pics: [],
        goods_introduce: ''
      },
      options: [],
      props: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      headers: {
        Authorization: sessionStorage.getItem('token')
      },
      dialogImageUrl: '',
      dialogVisible: false
    }
  },
  created () {
    this.getOptions()
  },
  methods: {
    handleTabClick (tag) {
      // console.log(index)
      this.active = +tag.index
    },
    async getOptions () {
      const { meta, data } = await this.$axios.get('categories?type=3')
      if (meta.status === 200) {
        this.options = data
      }
    },
    // 级联菜单点击处理
    handleChange (val) {
      console.log(val)
    },
    // 点击下一步
    next () {
      this.active++
      this.tabActive = this.active + ''
    },
    prev () {
      this.active--
      this.tabActive = this.active + ''
    },
    // 图片预览的处理函数
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    //  删除图片处理函数
    handleRemove (file) {
      const path = file.response.data.tmp_path
      this.addForm.pics = this.addForm.pics.filter(item => item.pic !== path)
    },
    // 图片上传成功的回调, 把图片地址存数组中
    uploadSuccess (file) {
      // console.log(file)
      this.addForm.pics.push(
        { pic: file.data.tmp_path }
      )
    },
    // 添加
    async add () {
      const { meta } = await this.$axios.post('goods', {
        ...this.addForm,
        goods_cat: this.addForm.goods_cat.join(',')
      })
      if (meta.status === 201) {
        this.$message.success('小可爱, 添加成功啦🎉')
        this.$router.push('/index/goods')
      } else {
        this.$message.error(meta.msg)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.el-form-1 {
  width: 60%;
}
.quill-editor {
  background-color: #fff;
  /deep/ .ql-editor {
    min-height: 300px
  }
}
.addSure {
  margin-top: 20px;
  margin-left: 50%;
  width: 200px;
  transform: translateX(-50%);
  font-weight: 700;
}
</style>
