'use strict'
const path = require('path')
// glob是webpack安装时依赖的一个第三方模块，此模块允许你使用 *等符号, 例如lib/*.js就是获取lib文件夹下的所有js后缀名的文件
const glob = require('glob')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const merge = require('webpack-merge')
const config = require('../config')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const packageConfig = require('../package.json')
const apps = require('../config/app.config')

// 应用目录
const APP_PATH = path.resolve(__dirname, '../src/apps')

const resolve = dir => {
  return path.join(APP_PATH, dir)
}

// 获取应用数目
const getAPPS = () => {
  // 所有应用
  let entryFiles = glob.sync(APP_PATH + '/*/main.js')
  let entryHtml = glob.sync(APP_PATH + '/*/index.html')
  let allApp
  let subApp
  entryFiles = entryFiles.map(filePath => {
    return filePath.match(/\/(\w+)\/main\.js/)[1]
  })
  entryHtml = entryHtml.map(filePath => {
    return filePath.match(/\/(\w+)\/index\.html/)[1]
  })
  entryFiles = entryFiles.concat(entryHtml)
  allApp = new Set(entryFiles)
  if (apps.length && process.env.NODE_ENV !== 'production') {
    subApp = new Set(apps.filter(x => allApp.has(x)))
    return [...subApp]
  } else {
    return [...allApp]
  }
}

const APPS = getAPPS()

exports.assetsPath = function (_path) {
  const assetsSubDirectory = process.env.NODE_ENV === 'production'
    ? config.build.assetsSubDirectory
    : config.dev.assetsSubDirectory

  return path.posix.join(assetsSubDirectory, _path)
}

exports.cssLoaders = function (options) {
  options = options || {}

  const cssLoader = {
    loader: 'css-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  // generate loader string to be used with extract text plugin
  function generateLoaders (loader, loaderOptions) {
    const loaders = options.usePostCSS ? [cssLoader, postcssLoader] : [cssLoader]

    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }

    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      return ExtractTextPlugin.extract({
        use: loaders,
        fallback: 'vue-style-loader'
      })
    } else {
      return ['vue-style-loader'].concat(loaders)
    }
  }

  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateLoaders('sass', { indentedSyntax: true }),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  }
}

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function (options) {
  const output = []
  const loaders = exports.cssLoaders(options)

  for (const extension in loaders) {
    const loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }

  return output
}

exports.createNotifierCallback = () => {
  const notifier = require('node-notifier')

  return (severity, errors) => {
    if (severity !== 'error') return

    const error = errors[0]
    const filename = error.file && error.file.split('!').pop()

    notifier.notify({
      title: packageConfig.name,
      message: severity + ': ' + error.name,
      subtitle: filename || '',
      icon: path.join(__dirname, 'logo.png')
    })
  }
}

// 入口配置
// 读取 apps 文件夹下的所有 main.js 文件作为入口处理
exports.entries = () => {
  let map = {}
  APPS.forEach(app => {
    map[app] = resolve(`${app}/main.js`)
  })
  return map
}

// 页面输出配置
// 与上面的多页面入口配置相同，读取 apps 文件夹下的所有 index.html
exports.htmlPlugin = () => {
  return APPS.map(app => {
    let filePath = resolve(`${app}/index.html`)
    let conf = {
      // 模板来源
      template: filePath,
      // 文件名称
      filename: app + '.html',
      // 页面模板需要加对应的js脚本，如果不加这行则每个页面都会引入所有的js脚本
      chunks: ['manifest', 'vendor', app],
      inject: true
    }
    if (process.env.NODE_ENV === 'production') {
      conf = merge(conf, {
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true
        },
        chunksSortMode: 'dependency'
      })
    }
    return new HtmlWebpackPlugin(conf)
  })
}

// 配置别名
exports.alias = () => {
  let map = {}
  APPS.forEach(app => {
    map[`@${app}`] = resolve(app)
  })
  return map
}
