<template>
  <el-container style="min-height:100vh">
    <el-header>
      <el-row justify="space-between" align="middle">
        <el-col>
          <h2 style="color:white">TodoList</h2>
        </el-col>
        <el-col>
          <div v-if="user">
            <span style="color:white;margin-right:12px">{{ user.username }}</span>
            <el-button type="danger" size="small" @click="logout">Logout</el-button>
          </div>
          <div v-else>
            <el-button type="primary" size="small" @click="$router.push('/login')">Login</el-button>
            <el-button size="small" @click="$router.push('/register')">Register</el-button>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-main>
      <router-view />
    </el-main>
  </el-container>
</template>

<script lang="ts">
import { useUserStore } from "./store/user";
import { useRouter } from "vue-router";
export default {
  setup() {
    const store = useUserStore();
    const router = useRouter();
    function logout() {
      store.logout();
      router.push("/login");
    }
    return { user: store.user, logout };
  }
};
</script>

<style>
html,body,#app { height: 100%; margin:0 }
.el-header { background: #409EFF; padding: 8px 20px; }
</style>
