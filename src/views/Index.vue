<template>
  <div class="index">
    <el-container>
      <el-header>
        <div class="logo"></div>
        <h1>Vue后台管理系统</h1>
        <div class="logout">
          要离开了嘛, 小可爱
          <a href="javascript:;" @click="logout">退出</a>
        </div>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <el-menu
            router
            unique-opened
            :default-active="defaultActive"
            class="el-menu-vertical-demo"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b">
            <el-submenu :index="submenu.path" v-for="submenu of menuList" :key="submenu.id">
              <template v-slot:title>
                <i class="el-icon-location"></i>
                <span>{{ submenu.authName }}</span>
              </template>
                <el-menu-item :index="'/index/' + item.path" v-for="item of submenu.children" :key="item.id">
                  <i class="el-icon-menu"></i>
                  <span slot="title">{{ item.authName }}</span>
                </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  data () {
    return {
      menuList: []
    }
  },
  created () {
    // 在组件创建的时候, 发送ajax , 拿数据,渲染到页面上
    this.$axios.get('menus').then(res => {
      const { meta, data } = res
      if (!data) {
        this.$message.error(meta.msg)
      }
      if (meta.status === 200) {
        this.menuList = data
      }
    })
  },
  methods: {
    //  退出功能实现
    async logout () {
      try {
        await this.$confirm('小可爱, 你确定要离开嘛🐷', '温馨提示', { type: 'warning' })
        // 点击确定, 则 清除 token
        sessionStorage.removeItem('token')
        this.$router.push('/login')
        this.$message.success('小可爱, 退出成功了呦💞')
      } catch {
        this.$message.warning('我就知道, 你还是舍不得我的😝')
      }
    }
  },
  computed: {
  // 提供一个 计算属性, 动态给 默认高亮
    defaultActive () {
      // console.log(this.$route)
      return this.$route.path
    }
  }
}
</script>

<style lang="less" scoped>
.index {
  height: 100%;
  user-select: none;
  > .el-container {
    height: 100%;

    .el-header {
      height: 60px;
      line-height: 60px;
      background-color: #b3c1cd;
      display: flex;
      padding-left: 0;
      .logo, .logout {
        width: 180px;
      }
      .logo {
        background: url('../assets/logo2.jpg') no-repeat center center/contain;
        background-size: 100% 100%;
        width: 200px;
      }
      .logout {
        text-align: right;
        font-size: 14px;
        color: #666;
        font-weight: 700;
        a {
          color: blueviolet;
        }
      }
      h1 {
        flex: 1;
        color: #555;
        font-size: 25px;
        text-align: center;
      }
    }

    .el-aside {
      background-color: #545c64;
      .el-submenu {
        width: 200px;
      }
    }

    .el-main {
      background-color: #eaeef1;
    }
  }
}
</style>
