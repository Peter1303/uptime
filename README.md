简体中文 | [English](./README.md)

<div align="center">
<h1>Uptime</h1>
<p>一个基于 UptimeKuma API 的在线状态面板</p>
<br />
<img src="https://img.shields.io/github/last-commit/imsyy/site-status" alt="last commit"/>
<img src="https://img.shields.io/github/languages/code-size/imsyy/site-status" alt="code size"/>
<img src="https://img.shields.io/github/stars/imsyy/site-status?style=full" alt="GitHub stars"/>
<img src="https://img.shields.io/github/forks/imsyy/site-status?style=full&color=orange" alt="GitHub followers"/>
<br />
<br />
<img src="https://s1.ax1x.com/2023/07/20/pCHnLLt.png" alt="demo"/>
</div>

## 👀 Demo

> Demo password: `123456`

- [IMSYY-站点监测](https://status.imsyy.top/)

## 🎉 特色

- 🌍 多平台部署支持
- ✨ 优雅且流畅的浏览体验
- 👀 全站状态预览
- ⏲️ 数据定时刷新
- 📱 移动端适配

## 事先准备

- 您需要先到 `UptimeKuma` 添加站点监控

### 环境变量

新建 `env.prod`
```
# 站点配置
VITE_SITE_TITLE='服务监测状态'
VITE_SITE_DESCRIPTION=一个简约的站点监测
VITE_SITE_KEYWORDS=站点监测,监测,监控
VITE_SITE_LOGO=/favicon.ico
VITE_SITE_ICP=
VITE_COUNT_DAYS=60
VITE_SHOW_LINK=true
VITE_GITHUB_LINK=https://github.com/Peter1303/uptime

# UptimeKuma API 配置 修改这里
VITE_API_URL=https://localhost:3001/api
# 状态页默认 slug
VITE_STATUS_PAGE_SLUG=mp
```

获取 `UptimeKuma` 的状态页地址 `/status/` 后面部分即 `<slug>`

### 编译项目
执行命令
```bash
npm run build
```
或者
```bash
vite build --mode prod
```

部署并打开网址
```
http://<your-domain>/?s=<slug>
```