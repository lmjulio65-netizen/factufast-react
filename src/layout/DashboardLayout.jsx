import './layout.css';

import React from 'react';

import { Outlet } from 'react-router-dom';

import Footer from '../components/Footer';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

function DashboardLayout() {
  return (

    <div className="dashboard-layout">

      <Header />

      <div className="dashboard-body">

        <Sidebar />

        <div className="dashboard-content">
          <Outlet />
        </div>

      </div>

      <Footer />

    </div>

  );
}

export default DashboardLayout;