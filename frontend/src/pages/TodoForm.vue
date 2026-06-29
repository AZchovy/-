<template>
  <el-card class="box">
    <h2>{{ isEdit ? "Edit Todo" : "New Todo" }}</h2>
    <el-form :model="form">
      <el-form-item label="Title">
        <el-input v-model="form.title" />
      </el-form-item>
      <el-form-item label="Description">
        <el-input type="textarea" v-model="form.description" />
      </el-form-item>
      <el-form-item label="Due Date">
        <el-input v-model="form.dueDate" placeholder="YYYY-MM-DD" />
      </el-form-item>
      <el-form-item label="Priority">
        <el-select v-model="form.priority" placeholder="Select">
          <el-option label="Low" value="low" />
          <el-option label="Medium" value="medium" />
          <el-option label="High" value="high" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">Save</el-button>
        <el-button @click="$router.push('/todos')">Cancel</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script lang="ts">
import { reactive, onMounted } from "vue";
import api from "../services/api";
import { useRoute, useRouter } from "vue-router";

export default {
  setup() {
    const route = useRoute();
    const router = useRouter();
    const id = route.params.id as string | undefined;
    const isEdit = !!id;
    const form = reactive({ title: "", description: "", dueDate: "", priority: "low", status: "todo" });

    async function load() {
      if (!id) return;
      const { data } = await api.get(`/todos/${id}`);
      Object.assign(form, data);
    }
    async function submit() {
      try {
        if (isEdit) {
          await api.put(`/todos/${id}`, form);
        } else {
          await api.post("/todos", form);
        }
        router.push("/todos");
      } catch (err: any) {
        alert(err?.response?.data?.message || "Save failed");
      }
    }
    onMounted(load);
    return { form, submit, isEdit };
  }
};
</script>

<style scoped>.box{max-width:720px;margin:20px auto}</style>
