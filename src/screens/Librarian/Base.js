import React from 'react';
import { Outlet } from "react-router-dom";
import SideBar from '../../components/SideBar';
import Footer from '../../components/Footer';
import './LibrarianDashboard.css'; 

const Base = () => {
  return (
    <div className="app-container">
      <SideBar />
      <div className="main-wrapper" style={{ marginLeft: 260, overflowX: 'hidden' }}>
        <main className="main-content">
          <Outlet /> 
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Base;