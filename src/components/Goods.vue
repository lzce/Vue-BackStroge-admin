<template>
  <div>
    <el-button type="success" @click="goodsAdd">添加商品</el-button>
    <el-table :data="goodsList" v-loading="loading">
      <el-table-column type="index" :index="tabIndex"></el-table-column>
      <el-table-column label="商品名称" prop="goods_name"></el-table-column>
      <el-table-column label="商品价格" prop="goods_price"></el-table-column>
      <el-table-column label="商品重量" prop="goods_weight"></el-table-column>
      <el-table-column label="创建时间">
        <template v-slot="{row}">
          {{ row.add_time | format }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot="{row}">
          <el-button type="primary" icon="el-icon-edit" circle size="mini" plain></el-button>
          <el-button type="danger" icon="el-icon-delete" circle size="mini" plain></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[10, 15, 20, 25]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
export default {
  data () {
    return {
      goodsList: [],
      pagenum: 1,
      pagesize: 10,
      total: 1,
      loading: false // 加载效果
    }
  },
  created () {
    this.getGoodsList()
  },
  methods: {
    async getGoodsList () {
      this.loading = true
      const { meta, data } = await this.$axios.get('goods', {
        params: {
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      })
      if (meta.status === 200) {
        // console.log(data)
        this.goodsList = data.goods
        this.total = data.total
      }
      setTimeout(() => {
        this.loading = false
      }, 400)
    },
    // 分页序号处理
    tabIndex (index) {
      return this.pagesize * (this.pagenum - 1) + index + 1
    },
    // 分页处理
    handleCurrentChange (val) {
      this.pagenum = val
      this.getGoodsList()
    },
    handleSizeChange (val) {
      this.pagesize = val
      this.pagenum = 1
      this.getGoodsList()
    },
    goodsAdd () {
      this.$router.push('/index/goods-add')
    }
  }
}
</script>

<style lang="less" scoped>

</style>
