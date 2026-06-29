<template>
  <el-card class="box">
    <h2>Register</h2>
    <el-form :model="form">
      <el-form-item label="Username">
        <el-input v-model="form.username" />
      </el-form-item>
      <el-form-item label="Email">
        <el-input v-model="form.email" />
      </el-form-item>
      <el-form-item label="Password">
        <el-input type="password" v-model="form.password" />
      </el-form-item>
      <el-button type="primary" @click="onSubmit">Register</el-button>
      <router-link to="/login" style="margin-left:12px">Login</router-link>
    </el-form>
  </el-card>
</template>

<script lang="ts">
import { reactive } from "vue";
import api from "../services/api";
import { useRouter } from "vue-router";
import { useUserStore } from "../store/user";

export default {
  setup() {
    const router = useRouter();
    const store = useUserStore();
    const form = reactive({ username: "", email: "", password: "" });
    async function onSubmit() {
      try {
        const { data } = await api.post("/auth/register", form);
        store.setToken(data.token);
        store.setUser(data.user);
        router.push("/todos");
      } catch (err: any) {
        alert(err?.response?.data?.message || "Register failed");
      }
    }
    return { form, onSubmit };
  }
};
</script>

<style scoped>.box{max-width:420px;margin:40px auto}</style>
