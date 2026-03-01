# Apple健康数据

Apple Health数据分析与可视化平台前端

## 项目简介

本项目是个人数据分析平台的Apple健康数据模块，用于分析和可视化Apple Health导出的健康数据。

## 技术栈

- **框架**: React 18 + TypeScript
- **UI组件**: Ant Design
- **图表库**: Recharts
- **HTTP客户端**: Axios
- **日期处理**: Day.js
- **构建工具**: Vite

## 数据说明

### 数据来源
- Apple Health 导出数据
- 包含心率、体重、BMI、身高等健康数据
- 数据范围: 2023-10-14 至 2026-01-23
- 总记录数: 710,000条

### 数据存储
- SQLite数据库
- WAL模式开启

## 核心功能

### 已实现功能 ✅

1. ✅ **首页 (Home)**
   - 健康数据摘要
   - 总记录数统计
   - 平均心率展示
   - 活跃天数统计
   - 最近30天心率趋势图
   - 快速导航按钮

2. ✅ **心率分析 (HeartRate)**
   - 日期范围筛选
   - 平均心率/静息心率/峰值心率统计
   - 心率趋势图表
   - 心率区间分布（饼图）
   - 每小时活动模式
   - 异常心率检测表格

3. ✅ **趋势分析 (Trends)**
   - 每日心率趋势（最近90天）
   - 静息心率趋势
   - 每周活动模式（柱状图）
   - 最活跃日/最不活跃日统计

4. ✅ **健康分析 (Analysis)**
   - 健康评分仪表盘
   - 评分细分（静息心率/心率变异性/测量一致性）
   - 每日活动模式摘要
   - 每周活动模式摘要
   - 健康评分解读和建议

### 组件库 ✅

- ✅ HealthMetricCard - 健康指标卡片
- ✅ HealthScoreGauge - 健康评分仪表盘
- ✅ HeartRateChart - 心率趋势图表
- ✅ ZoneDistribution - 心率区间分布图

### API服务层 ✅

- ✅ healthApiService.ts - 完整的API服务封装
  - 基础查询（摘要、每日统计）
  - 心率分析（区间、异常、静息心率）
  - 活动模式（每日、每周）
  - 健康评分

### 类型系统 ✅

- ✅ health.ts - 完整的TypeScript类型定义
  - HealthSummary, HealthStatistics
  - HeartRateZones, Anomaly, RestingHR
  - DailyPattern, WeeklyPattern
  - HealthScore

## 运行方式

### 开发环境
```bash
npm install
npm run dev
```

访问: http://localhost:5178/health/

### 生产构建
```bash
npm run build
npm run preview
```

## 后端配置

- API地址: http://localhost:9000/api/v1
- 后端端点: 15个健康分析API
- 数据库: go-backend/data/health/applehealth.db

## 部署说明

- 部署路径：record.yzup.top/health
- 基础路径配置：/health/

## 更新日志

### 2026-03-02 (项目完成总结)
- ✅ **前端完成度: 90%**
- ✅ 4个完整页面全部实现
  - Home - 健康摘要
  - HeartRate - 心率分析
  - Trends - 趋势分析
  - Analysis - 健康分析
- ✅ 4个可复用组件全部实现
- ✅ API服务层完整
- ✅ TypeScript类型系统完整
- ✅ 工具函数库完整
- ⚠️ 后端数据处理需要修复
  - 每日统计数据为空
  - 健康评分查询有NULL值错误
- 📊 **状态**: 前端代码完整，后端数据处理待修复

### 2026-02-19
- 初始化项目结构
- 配置 React + TypeScript + Tailwind CSS
- 创建基础项目框架

