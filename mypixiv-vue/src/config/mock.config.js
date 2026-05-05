// Mock配置文件
// 直接从项目根目录的 config.json 读取配置

// 读取 config.json 配置
const config = require('../../config.json')

// 获取当前环境配置
const envName = config.defaultEnvironment || 'development'
const envConfig = config.environments[envName]

if (!envConfig) {
  console.error(`错误: 未找到环境配置 "${envName}"`)
  throw new Error(`环境配置 "${envName}" 不存在`)
}

const mockConfig = {
  // 是否启用Mock - 从配置文件读取
  enabled: envConfig.useMock || false,

  // Mock延迟时间（毫秒）- 模拟网络延迟
  delay: 300,

  // 是否打印Mock日志
  logging: true,

  // API基础路径
  apiBaseUrl: envConfig.apiBaseUrl || 'http://localhost:8080',

  // 前端端口（可选）
  frontendPort: envConfig.frontendPort || 8081,

  // 当前环境名称
  environment: envName,

  // 环境描述
  description: envConfig.description || ''
}

export default mockConfig

