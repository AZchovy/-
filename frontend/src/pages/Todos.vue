<template>
  <div class="container">
    <el-row justify="space-between" style="margin-bottom:12px">
      <el-col>
        <el-button type="primary" @click="$router.push('/todos/new')">New Todo</el-button>
      </el-col>
      <el-col>
        <el-input v-model="q" placeholder="Search" @keyup.enter="load" style="width:240px" />
      </el-col>
    </el-row>
    <el-table :data="todos" style="width: 100%">
      <el-table-column prop="title" label="Title" />
      <el-table-column prop="status" label="Status" />
      <el-table-column prop="priority" label="Priority" />
      <el-table-column label="Actions">
        <template #default="{ row }">
          <el-button size="mini" @click="edit(row.id)">Edit</el-button>
          <el-button size="mini" type="danger" @click="remove(row.id)">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from "vue";
import api from "../services/api";
import { useRouter } from "vue-router";

export default {
  setup() {
    const todos = ref<any[]>([]);
    const q = ref("");
    const router = useRouter();
    async function load() {
      const { data } = await api.get("/todos", { params: { q: q.value } });
      todos.value = data.items || [];
    }
    function edit(id: number) {
      router.push(`/todos/${id}/edit`);
    }
    async function remove(id: number) {
      if (!confirm("Delete?")) return;
      await api.delete(`/todos/${id}`);
      load();
    }
    onMounted(load);
    return { todos, edit, remove, q, load };
  },
};
</script>

<style scoped>.container{max-width:900px;margin:20px auto}</style>
