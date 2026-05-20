import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <h1 className="header-title">Thư viện điện tử</h1>
        <div className="header-user">
          <span>Xin chào, Quản lý viên</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
