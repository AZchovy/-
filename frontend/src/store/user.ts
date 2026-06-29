import { defineStore } from "pinia";
import api from "../services/api";

export const useUserStore = defineStore("user", {
  state: () => ({
    token: localStorage.getItem("token") || "",
    user: null as null | { id: number; username: string; email: string; role: string }
  }),
  actions: {
    setToken(token: string) {
      this.token = token;
      localStorage.setItem("token", token);
    },
    setUser(u: any) {
      this.user = u;
    },
    logout() {
      this.token = "";
      this.user = null;
      localStorage.removeItem("token");
    },
    async fetchMe() {
      if (!this.token) return;
      try {
        const { data } = await api.get("/auth/me");
        if (data) this.setUser(data);
      } catch {
        this.logout();
      }
    }
  }
});
