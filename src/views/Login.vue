<template>
  <div class="login">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <img src="../assets/likeCat.jpg" alt="">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" placeholder="亲,  这里输入用户名哦🤣"></el-input>
      </el-form-item>
      <el-form-item label="密 码" prop="password">
        <el-input v-model="form.password" type="password" placeholder="亲， 这里输入密码哦🎉"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="login">登录</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data () {
    return {
      form: {
        username: '',
        password: ''
      },
      // 表单验证规则
      rules: {
        username: [
          { required: true, message: '亲，用户名不能为空', trigger: ['blur', 'change'] },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: ['blur', 'change'] }
        ],
        password: [
          { required: true, message: '亲，密码不能为空', trigger: ['blur', 'change'] },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    // 点击重置按钮，调用 组件的api
    resetForm () {
      this.$refs.form.resetFields()
    },

    // 点击登录按钮, 先校验表单, 在发送ajax
    login () {
      this.$refs.form.validate(valid => {
        if (!valid) return
        // 校验成功 发送 ajax
        axios.post('login', this.form).then(res => {
          // console.log(res.data)
          const { meta, data } = res.data
          if (meta.status === 200) {
            // 登录成功
            // 存 token
            localStorage.setItem('token', data.token)
            this.$router.push('/index')
            this.$message.success('小可爱, 欢迎进入管理系统😝')
          } else {
            this.$message.error('小可爱, 用户名或密码错啦🐷')
          }
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login {
  height: 100%;
  background-color: #2d434c;
  overflow: hidden;
  .el-form {
    width: 400px;
    margin: 200px auto;
    background-color: #fff;
    padding: 75px 40px 15px;
    border-radius: 20px;
    position: relative;
    .el-button:last-child {
      margin-left: 35%;
    }

    img {
      width: 100px;
      position: absolute;
      top: -65px;
      left: 50%;
      transform: translateX(-50%);
      border-radius: 50%;
      border: 10px solid #fff;
    }
  }
}
</style>
