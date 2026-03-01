import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import {
  HomeOutlined,
  HeartOutlined,
  LineChartOutlined,
  BarChartOutlined,
} from '@ant-design/icons';
import Home from './pages/Home';
import HeartRate from './pages/HeartRate';
import Trends from './pages/Trends';
import Analysis from './pages/Analysis';
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
