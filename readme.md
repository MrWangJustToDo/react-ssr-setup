# 使用

## install

```shell
pnpm install
```

## prepare

```shell
pnpm run build:packages
```

## development

```shell
pnpm run dev:ui
```

## production

```shell
pnpm run build:ui

and

pnpm run start:ui
```

# 包含功能

## 完整开发功能支持

## 生产环境准备

## 最新的工具

## 完整 Typescript 支持

## redux

## 灵活的渲染方式 SSR CSR

## CSR 回退

## page level 代码分割

## preLoad data 标准化预加载行为 通过返回配置对象进行精细的跳转控制: getInitialState 方法返回 {error, redirect, props: data}

## sass

## css module

## 不同打包方式

## 静态路由

## 文件路由 自动 query 参数支持 使用 :参数名(:id.tsx) 文件作为的约定 开发环境支持 page 新建删除的实时路由更新(middleware 模式下支持)

## 装饰器

## page level component 数据自动注入 getInitialState: () => ({props: xxx})

## middleware develop 适合手机等远程调试

## dev Server develop 适合桌面开发 (webpack)

## animate router 路由切换动画

## file router 开发自动更新

## react router 6

## jest

## swc (目前只支持 webpack)

## esbuild (目前只支持 webpack)

## react-18 ssr

## monorepo

## 静态页面生成 build:static 标记静态页面 export isStatic = true; (目前只支持 webpack)

## 支持 webpack/vite 开发或者生产

## 支持 vite 兼容 esModule 和 legacy
