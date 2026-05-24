import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './SideBar.css';
import { MdOutlineDashboard, MdOutlineDocumentScanner, MdDashboard, MdDocumentScanner, MdCategory, MdOutlineCategory, MdPayments, MdOutlinePayments, MdOutlineLogout, MdOutlineMessage, MdMessage, MdLocalLibrary } from 'react-icons/md';
import { FaBookReader } from 'react-icons/fa';
import { BiBookReader } from 'react-icons/bi';

const SideBar = () => {
  // Sử dụng useLocation để xác định trang hiện tại và hiển thị style active
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    {
      label: 'Bảng điều khiển',
      icon: <MdOutlineDashboard size={24}/>,
      selected: currentPath === '/librarian',
      link: '/librarian',
      selectedIcon: <MdDashboard size={24} />

    },{
      label: 'Quản lý tài liệu',
      icon: <MdOutlineDocumentScanner size={24} />,
      selected: currentPath === '/librarian/manage-document',
      link: '/librarian/manage-document',
      selectedIcon: <MdDocumentScanner size={24} />
    },
    {
      label: 'Quản lý danh mục',
      icon: <MdOutlineCategory size={24} />,
      selected: currentPath === '/librarian/category',
      link: '/librarian/category',
      selectedIcon: <MdCategory size={24} />
    },
    {
      label: 'Thống kê mượn trả',
      icon: <BiBookReader size={24} />,
      selected: currentPath === '/librarian/stats',
      link: '/librarian/stats',
      selectedIcon: <FaBookReader size={23} />
    },
    {
      label: 'Thống kê thanh toán',
      icon: <MdOutlinePayments size={24} />,
      selected: currentPath === '/librarian/payment-stats',
      link: '/librarian/payment-stats',
      selectedIcon: <MdPayments size={24} />
    },
    {
      label: 'Tin nhắn',
      icon: <MdOutlineMessage size={24} />,
      selected: currentPath === '/librarian/messages',
      link: '/librarian/messages',
      selectedIcon: <MdMessage size={24} />
    }
  ]

  return (
    <nav className="sidebar-container">
      {/* Header & Profile */}
      {/* <div className="sidebar-header" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h2 className="sidebar-logo">eLibrary</h2>
      </div> */}

<div 
        className="sidebar-header" 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          padding: '24px 20px',
          borderBottom: '1px solid #e2e8f0', // Đường kẻ ngang mờ ngăn cách với menu
          marginBottom: '20px'
        }}
      >
        {/* Khung Icon Logo */}
        <div 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            backgroundColor: '#4f46e5', // Màu xanh Indigo chủ đạo
            color: 'white',
            width: '38px', 
            height: '38px', 
            borderRadius: '10px',
            marginRight: '12px',
            boxShadow: '0 4px 10px rgba(79, 70, 229, 0.3)' // Đổ bóng nhẹ cho icon
          }}
        >
          <MdLocalLibrary size={22} />
        </div>
        
        {/* Chữ Logo cách điệu */}
        <h2 
          className="sidebar-logo" 
          style={{ 
            margin: 0, 
            fontSize: '1.6rem', 
            fontWeight: '800', 
            letterSpacing: '-0.5px' 
          }}
        >
          <span style={{ color: '#1e293b' }}>e</span>
          <span style={{ color: '#4f46e5' }}>Library</span>
        </h2>
      </div>

      {/* Main Navigation */}
      <ul className="nav-menu">
        {navItems.map((item, index) => (
          <li key={index} className="nav-item">
            <Link
              to={item.link}
              className={`nav-link ${item.selected ? 'active' : ''}`}
            >
              {item.selected ? item.selectedIcon : item.icon}
              {item.label}
            </Link>
          </li>
        ))}
      </ul>

      {/* Action Button (Tách Thêm tài liệu ra thành nút nổi bật giống Add New Book) */}
      <div className="action-section">
        <Link to="/librarian/add-document" className="btn-primary">
          Thêm tài liệu
        </Link>
      </div>

      <div className="sidebar-header">
        <div className="user-profile">
          {/* Bạn có thể thay src bằng link ảnh avatar thật */}
          <img 
            src="https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff" 
            alt="Librarian Avatar" 
            className="user-avatar" 
          />
          <div className="user-info">
            <h4>Librarian Portal</h4>
            <p>Management Suite</p>
          </div>
        </div>
      </div>

      <div className="divider"></div>

      {/* Footer Navigation */}
      <div className="sidebar-footer">
        <Link to="/" className="nav-link">
          <MdOutlineLogout />
          Về trang chủ (Home)
        </Link>
      </div>
    </nav>
  );
};
export default SideBar;