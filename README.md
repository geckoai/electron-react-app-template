# 项目说明

## 1. 项目资源

## 2. 项目结构
```
|-  project                                     项目名称
|    |-  public                                 组件入口
|    |    |-  index.html
|    |    |-  robots.txt
|    |    |-  logo.png
|    |-  src                                    开发工作目录
|    |    |-  main                              Platform for Electron
|    |    |    |-  index.ts                     Electron进程 (如果只开发Web则无需理会)
|    |    |    |-  util.ts                      常用方法
|    |    |-  renderer                          Platform for Web
|    |    |    |-  application.tsx              应用
|    |    |    |-  application.less             应用样式
|    |    |    |-  fallback.tsx                 Suspense的fallback
|    |    |    |-  index.tsx                    应用入口
|    |    |    |-  root.tsx                     根元素
|    |-  .babelrc                               babel配置文件
|    |-  .env                                   环境变量配置
|    |-  .env.local.md                          环境变量配置(删除.md后缀后当作本地配置) 优先级高于(.env.production|.env.development)
|    |-  .env.development                       开发环境变量配置 优先级高于(.env)
|    |-  .env.production                        生产环境变量配置 优先级高于(.env)
|    |-   eslint.config.mjs                     eslint配置
|    |-  .gitignore                             git配置
|    |-  .npmrc                                 npm配置 支持pnpm
|    |-  crowdin.yaml                           多语言平台配置
|    |-  project.config.js                      项目配置
|    |-  pnpm-workspace.yaml                    pnpm工作空间配置
|    |-  README.md                              项目描述
|    |-  tsconfig.json                          ts配置文件
|    |-  package.json                           
```

## 3. 团队合作描述
`在此完善团队合作描述`

## 4. 开发规范
`在此完善开发规范`

## 5. 启动项目
1. 安装nodejs@latest
2. 安装vscode或webstorm
3. 打开项目
4. 安装依赖
   在项目根目录打开shell
```shell
npm i
npm start
# or
yarn
yarn start
# or
pnpm install
pnpm run start
```

## 6. 其他
-----