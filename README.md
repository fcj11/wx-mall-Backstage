# 后台管理系统
这是一个基于 Vue.js 开发的现代化后台管理系统，提供了完整的后台管理功能。
# 项目根目录
├── public/ # 静态资源目录
│ ├── favicon.ico # 网站图标
│ └── index.html # HTML 模板
#
├── src/ # 源代码目录
│ ├── api/ # API 接口封装
│ │ └── product.js # 产品相关接口
#
│ ├── assets/ # 资源文件目录
│ │ ├── images/ # 图片资源
│ │ └── styles/ # 样式文件
#
│ ├── components/ # 公共组件
│ │ ├── Header/ # 头部组件
│ │ └── Sidebar/ # 侧边栏组件
#
│ ├── router/ # 路由配置
│ │ └── index.js # 路由主文件
#
│ ├── store/ # Vuex 状态管理
│ │ └── index.js # 状态管理主文件
#
│ ├── views/ # 页面视图组件
│ │ ├── Login.vue # 登录页面
│ │ ├── Home.vue # 首页
│ │ ├── Users.vue # 用户管理页面
│ │ ├── Settings.vue # 设置页面
│ │ └── product/ # 产品相关页面
│ │ └── index.vue
#
│ ├── utils/ # 工具函数目录
│ │ ├── request.js # axios 请求封装
│ │ └── auth.js # 权限相关工具
#
│ └── App.vue # 根组件
#
├── .gitignore # Git 忽略文件配置
├── package.json # 项目依赖配置
├── README.md # 项目说明文档
└── tsconfig.json # TypeScript 配置文件

## 技术栈
- 前端框架：Vue.js
- 路由管理：Vue Router
- 状态管理：Vuex
- UI 组件库：Element Plus
- HTTP 请求：Axios
- 代码规范：ESLint + Prettier

### 功能特性
- 🔐 用户认证与授权
- 👥 用户管理
- 🏷️ 产品管理
- ⚙️ 系统设置
- 📊 数据统计

#### 项目基础页面介绍
- 项目首页
  - <img width="300px" alt="image" src="https://github.com/user-attachments/assets/962a334f-503c-41ca-bbd9-282d418670eb">
- 商品管理
  - <img width="300px" alt="image" src="https://github.com/user-attachments/assets/fd376ca6-c10e-4cfa-b4ba-070218edbd84">
 
