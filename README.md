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
- 商品编辑
  - <img width="300px" alt="image" src="https://github.com/user-attachments/assets/133d747c-a5ed-4dde-8c35-2ac5315c8d95">
- 商品上/下架
  - <img width="300px" alt="image" src="https://github.com/user-attachments/assets/6cec7b8a-34fa-4d1e-a9ea-04d7c7a992fc">
- 商品详情 
  - <img width="300px" alt="image" src="https://github.com/user-attachments/assets/9beabe31-582b-423f-8b06-007fd1d6e349">
- 订单管理
  - <img width="300px" alt="image" src="https://github.com/user-attachments/assets/ef8f314a-0bd8-495b-b3c5-f2abaf6d6c06">
- 订单详情
  - <img width="300px" alt="image" src="https://github.com/user-attachments/assets/98f175e4-7cef-420b-9122-668eb670638f">
- 订单状态
  - <img width="300px" alt="image" src="https://github.com/user-attachments/assets/274f3fcc-953e-47ca-984c-65f67b417c49">
- 用户管理
  - <img width="300px" alt="image" src="https://github.com/user-attachments/assets/85d95bfc-1c1a-49d5-9f49-f10592f2fea7">
- 用户编辑
  - <img width="300px" alt="image" src="https://github.com/user-attachments/assets/16db4a48-8acf-4208-a423-69fe3064c434">
- 系统设置
  - 系统配置
    - <img width="300px" alt="image" src="https://github.com/user-attachments/assets/03f26f51-880d-40c3-9852-ba31e6ed2b3c">
  - 个人信息
    - <img width="300px" alt="image" src="https://github.com/user-attachments/assets/07467fd9-67df-4bc2-9c7b-c564c526f9b0">
  - 修改密码
    - <img width="300px" alt="image" src="https://github.com/user-attachments/assets/fbab8531-06a2-4d94-b051-0dc8788c46d2">
- 404
  - <img width="300px" alt="image" src="https://github.com/user-attachments/assets/6ac4e2a9-4f48-4642-a07f-fee6935c08cf">

