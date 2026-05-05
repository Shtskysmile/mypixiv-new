# PCOI - Vue Frontend

## 项目说明

PCOI (Pixiv Community Illustration) 是一个类似 Pixiv 的插画分享平台的前端项目。

## 快速开始

### 1. 安装依赖
```bash
npm install
```

### 2. 启动开发服务器

**方式一：使用交互式启动脚本（推荐）**
```bash
start.bat
```
脚本会提示你选择运行模式：
- 开发模式：连接本地后端 (localhost:8080)
- Mock模式：使用模拟数据，无需后端

**方式二：使用 npm 命令**
```bash
# 开发模式（需要后端服务运行在 localhost:8080）
npm run serve:dev

# Mock模式（使用模拟数据）
npm run serve:mock
```

## 配置说明

项目配置文件位于 `config.json`，包含以下环境配置：

- **development**: 开发环境，连接本地后端服务 (http://localhost:8080)
- **mock**: Mock模式，使用 Mock.js 拦截 API 请求
- **production**: 生产环境配置

### 环境变量
- `VUE_APP_USE_MOCK`: 是否启用 Mock 模式 (true/false)
- `VUE_APP_API_BASE_URL`: 后端 API 地址

## 构建生产版本

```bash
# 构建正常版本
npm run build

# 构建 Mock 版本
npm run build:mock
```

## 技术栈

- Vue 2.6
- Vue Router
- Vuex
- Axios
- Bulma CSS
- Mock.js

## 更多配置
参考 [Vue CLI 配置文档](https://cli.vuejs.org/config/)
