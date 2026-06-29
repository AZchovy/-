# 简易在线待办事项（TodoList） - 完整项目

技术栈：
- 前端：Vue 3 + TypeScript + Vite + Element Plus + Pinia
- 后端：Node.js + TypeScript + Express + TypeORM + SQLite
- 通信：RESTful API（JSON），前后端分离

目录结构（简述）：
- backend/: 后端代码（Express + TypeORM）
- frontend/: 前端代码（Vite + Vue）

快速运行（开发环境）

1) 后端
- 进入 backend 目录：
  cd backend
- 复制环境示例并修改（可选）：
  cp .env.example .env
- 安装依赖：
  npm install
- 启动开发服务器（自动编译）：
  npm run dev
- 初始化 admin 种子用户（一次）：
  npm run seed
后端默认启动 http://localhost:4000

默认 admin 账户（可在 .env 修改）：
- username: admin
- password: admin123

2) 前端
- 进入 frontend：
  cd frontend
- 安装依赖：
  npm install
- 启动前端开发服务器：
  npm run dev
打开浏览器访问 Vite 提示的地址（通常 http://localhost:5173）

接口示例（核心）
- POST /auth/register { username, email, password } -> { token, user }
- POST /auth/login { usernameOrEmail, password } -> { token, user }
- GET /auth/me -> 当前用户信息
- GET /todos -> 列表（需要 Authorization header）
- POST /todos -> 新建
- GET /todos/:id -> 详情
- PUT /todos/:id -> 更新
- DELETE /todos/:id -> 删除

作业/演示提示
- 在完成开发后，截取以下页面用于报告：登录页、待办列表页、新建/编辑页、管理员页（如果实现）
- 在报告中列出核心 API 接口表（路径、方法、参数、示例返回）
- 保存 Git 提交记录作为作业证明（建议按功能分开提交）

若需我���的下一步（可选）：
- 将该项目打包成一个 zip 并上传（或直接推到你提供的 GitHub 仓库）
- 为你生成 Dockerfile + docker-compose.yml（backend + frontend + db）
- 为后端补充更多单元测试（Jest + supertest）
- 为前端补充更完整的样式与校验、以及报告里需的截图占位说明
