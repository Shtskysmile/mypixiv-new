const { defineConfig } = require('@vue/cli-service')
const config = require('./config.json')

// 获取当前环境配置
const envName = config.defaultEnvironment || 'development'
const envConfig = config.environments[envName]

if (!envConfig) {
  console.error(`错误: 未找到环境配置 "${envName}"`)
  process.exit(1)
}

// 从配置文件读取
const useMock = envConfig.useMock || false
const apiBaseUrl = envConfig.apiBaseUrl || 'http://localhost:8080'
const frontendPort = envConfig.frontendPort || 8081

// 调试输出
console.log('\n🔧 Vue Config 配置:')
console.log('  当前环境:', envName)
console.log('  环境描述:', envConfig.description)
console.log('  useMock:', useMock)
console.log('  apiBaseUrl:', apiBaseUrl)
console.log('  frontendPort:', frontendPort)
console.log('')

module.exports = defineConfig({
  transpileDependencies: true,
  
  // 设置页面标题
  chainWebpack: config => {
    config
      .plugin('html')
      .tap(args => {
        args[0].title = 'PCOI - 探索精彩插画'
        return args
      })
  },
  
  devServer: {
    port: frontendPort, // 从配置文件读取端口
    host: 'localhost', // 强制使用 localhost，避免 WebSocket 连接到局域网 IP
    client: {
      webSocketURL: `ws://localhost:${frontendPort}/ws`, // HMR WebSocket 连接到前端开发服务器
    },
    
    // 只在非Mock模式下启用代理
    proxy: useMock ? {} : {
      // 代理所有 /api 开头的请求到后端
      '/api': {
        target: apiBaseUrl,
        changeOrigin: true,
        ws: false, // 禁用 WebSocket 代理
        // 注意：不要使用 pathRewrite，保持完整的 /api 路径
        onProxyReq: (proxyReq, req, res) => {
          console.log(`🔄 代理请求: ${req.method} ${req.url} -> ${apiBaseUrl}${req.url}`)
        },
        onProxyRes: (proxyRes, req, res) => {
          console.log(`✅ 代理响应: ${proxyRes.statusCode} ${req.url}`)
        },
        onError: (err, req, res) => {
          console.error('❌ 代理错误:', err.message)
          console.error('   请求:', req.url)
          console.error('   目标:', apiBaseUrl)
          console.error('💡 提示: 请确保后端服务已启动')
        }
      }
    },
    
    // 在启动时显示Mock状态
    onListening: function(devServer) {
      const port = devServer.server.address().port
      console.log('\n========================================')
      if (useMock) {
        console.log('🎭 Mock模式已启用')
        console.log('📡 所有API请求将被Mock拦截')
      } else {
        console.log('🔌 Mock模式已关闭')
        console.log(`📡 API请求将代理到: ${apiBaseUrl}`)
        console.log('💡 请确保后端服务已启动')
      }
      console.log(`🌐 前端服务运行在: http://localhost:${port}`)
      console.log('========================================\n')
    }
  }
})
