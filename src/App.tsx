import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import {
  HomeOutlined,
  HeartOutlined,
  LineChartOutlined,
  BarChartOutlined,
  DashboardOutlined,
  ThunderboltOutlined,
  MoonOutlined,
  CalendarOutlined,
  InteractionOutlined,
} from '@ant-design/icons';
import Home from './pages/Home';
import HeartRate from './pages/HeartRate';
import Trends from './pages/Trends';
import Analysis from './pages/Analysis';
import WeightBMI from './pages/WeightBMI';
import Exercise from './pages/Exercise';
import Sleep from './pages/Sleep';
import SeasonalTrends from './pages/SeasonalTrends';
import HealthScreentimeCorrelation from './pages/HealthScreentimeCorrelation';
import 'antd/dist/reset.css';

const { Header, Content, Footer } = Layout;

const AppContent: React.FC = () => {
  const location = useLocation();

  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: <Link to="/">首页</Link>,
    },
    {
      key: '/heartrate',
      icon: <HeartOutlined />,
      label: <Link to="/heartrate">心率分析</Link>,
    },
    {
      key: '/sleep',
      icon: <MoonOutlined />,
      label: <Link to="/sleep">睡眠质量</Link>,
    },
    {
      key: '/exercise',
      icon: <ThunderboltOutlined />,
      label: <Link to="/exercise">运动数据</Link>,
    },
    {
      key: '/weight-bmi',
      icon: <DashboardOutlined />,
      label: <Link to="/weight-bmi">体重BMI</Link>,
    },
    {
      key: '/health-screentime-correlation',
      icon: <InteractionOutlined />,
      label: <Link to="/health-screentime-correlation">健康×屏幕时间</Link>,
    },
    {
      key: '/seasonal-trends',
      icon: <CalendarOutlined />,
      label: <Link to="/seasonal-trends">季节趋势</Link>,
    },
    {
      key: '/trends',
      icon: <LineChartOutlined />,
      label: <Link to="/trends">趋势</Link>,
    },
    {
      key: '/analysis',
      icon: <BarChartOutlined />,
      label: <Link to="/analysis">健康分析</Link>,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <div style={{ fontSize: '20px', fontWeight: 'bold', marginRight: '40px', color: '#1890ff' }}>
          🍎 Apple Health
        </div>
        <Menu
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={menuItems}
          style={{ flex: 1, border: 'none' }}
        />
      </Header>

      <Content style={{ background: '#f0f2f5' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/heartrate" element={<HeartRate />} />
          <Route path="/sleep" element={<Sleep />} />
          <Route path="/exercise" element={<Exercise />} />
          <Route path="/weight-bmi" element={<WeightBMI />} />
          <Route path="/health-screentime-correlation" element={<HealthScreentimeCorrelation />} />
          <Route path="/seasonal-trends" element={<SeasonalTrends />} />
          <Route path="/trends" element={<Trends />} />
          <Route path="/analysis" element={<Analysis />} />
        </Routes>
      </Content>

      <Footer style={{ textAlign: 'center', background: '#fff' }}>
        Apple Health Data Analysis ©2026 Created with ❤️
      </Footer>
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
