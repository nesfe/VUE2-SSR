const fs = require('fs')
const path = require('path')
const express = require('express')
const favicon = require('serve-favicon')
const cookieParser = require('cookie-parser')
const resolve = file => path.resolve(__dirname, file)

const proxyMiddleware = require('http-proxy-middleware')

const config = require('./config')
const isProd = process.env.NODE_ENV === 'production'

const app = express()

let renderer
if (isProd) {
  // 生产环境使用本地打包文件来渲染
  const bundle = require('./output/vue-ssr-bundle.json')
  const template = fs.readFileSync(resolve('./output/index.html'), 'utf-8')
  renderer = createRenderer(bundle, template)
} else {
  // 开发环境使用webpack热更新服务
  require('./build/dev-server')(app, (bundle, template) => {
    renderer = createRenderer(bundle, template)
  })
}

function createRenderer(bundle, template) {
  return require('vue-server-renderer').createBundleRenderer(bundle, {
    template,
    cache: require('lru-cache')({
      max: 1000,
      maxAge: 1000 * 60 * 15
    })
  })
}

const serve = (path, cache) => express.static(resolve(path), {
  maxAge: cache && isProd ? 60 * 60 * 24 * 30 : 0
})

console.log('baseUrl', config.baseUrl)
const proxyTable = {
  '/api': {
    target: config.baseUrl,
    changeOrigin: true,
    pathRewrite: {
      '^/api': '/api'
    }
  }
}

// 客户端跨域
Object.keys(proxyTable).forEach(function(context) {
  var options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(options.filter || context, options))
})

const v = Date.now()

app.use(cookieParser())
app.use('/output', serve('./output', true))
app.use('/service-worker.js', serve('./output/service-worker.js'))
app.use(favicon(path.resolve(__dirname, 'public/images/favicons.ico')))
app.use(express.static(path.join(__dirname, 'public')))

app.get('*', (req, res) => {
  if (!renderer) {
    return res.end('waiting for compilation... refresh in a moment.')
  }

  const s = Date.now()

  res.setHeader("Content-Type", "text/html")
  res.header("Access-Control-Allow-Credentials", true)
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "X-Requested-With")
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS")
  res.header("X-Powered-By", ' 3.2.1')

  const errorHandler = err => {
    if (err && err.code === 404) {
      res.status(404).sendfile('public/404.html');
    } else {
      // 页面渲染错误
      res.status(500).end('500 - Internal Server Error')
      console.error(`error during render : ${req.url}`)
      console.error(err)
    }
  }

  // 如果cookies失效或者不存在跳转到登录页
  const historys = req.url.includes('/user')
  if (!historys && req.cookies.JSESSIONID == undefined) {
    res.cookie('TO_URL', req.url)
    res.redirect('/user/login')
  }

  const context = {
    title: '管控平台',
    version: v,
    url: req.url,
    cookies: req.cookies
  }

  renderer.renderToString(context, (err, html) => {
    if (err) {
      return errorHandler(err)
    }
    res.end(html)
    console.log(`whole request: ${Date.now() - s}ms`)
  })
})

const port = process.env.PORT || 3001
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`)
})
