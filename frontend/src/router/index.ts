import { createRouter, createWebHistory } from "vue-router";
import Login from "../pages/Login.vue";
import Register from "../pages/Register.vue";
import Todos from "../pages/Todos.vue";
import TodoForm from "../pages/TodoForm.vue";
import { useUserStore } from "../store/user";

const routes = [
  { path: "/", redirect: "/todos" },
  { path: "/login", component: Login },
  { path: "/register", component: Register },
  { path: "/todos", component: Todos, meta: { requiresAuth: true } },
  { path: "/todos/new", component: TodoForm, meta: { requiresAuth: true } },
  { path: "/todos/:id/edit", component: TodoForm, meta: { requiresAuth: true } },
];

const router = createRouter({ history: createWebHistory(), routes });

router.beforeEach((to, from, next) => {
  const store = useUserStore();
  const token = store.token;
  if ((to.meta as any).requiresAuth && !token) return next("/login");
  next();
});

export default router;
