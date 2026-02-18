# Apple健康数据

Apple Health数据分析与可视化平台前端

## 项目简介

本项目是个人数据分析平台的Apple健康数据模块，用于分析和可视化Apple Health导出的健康数据。

## 技术栈

- React 18
- TypeScript
- Tailwind CSS
- Vite

## 数据说明

### 数据来源
- Apple Health 导出数据
- 包含步数、心率、睡眠、运动等健康数据

### 数据存储
- SQLite数据库
- WAL模式开启

## 核心功能（规划中）

1. 步数统计与分析
2. 心率数据分析
3. 睡眠质量分析
4. 运动数据统计
5. 时间维度分析
6. 健康趋势可视化
7. 与轨迹数据联动分析

## 运行方式

### 开发环境
```bash
npm install
npm run dev
```

### 生产构建
```bash
npm run build
npm run preview
```

## 部署说明

- 部署路径：record.yzup.top/health
- 基础路径配置：/health/

## 更新日志

### 2026-02-19
- 初始化项目结构
- 配置 React + TypeScript + Tailwind CSS
- 创建基础项目框架
