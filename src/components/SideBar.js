import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    MdOutlineDashboard, MdOutlineDocumentScanner, MdDashboard, MdDocumentScanner,
    MdCategory, MdOutlineCategory, MdPayments, MdOutlinePayments, MdOutlineLogout,
    MdOutlineMessage, MdMessage
} from 'react-icons/md';
import { FaBookOpen, FaBookReader } from 'react-icons/fa';
import { BiBookReader } from 'react-icons/bi';
import {sidebarStyles} from '../style/SideBarStyle';
import { IoMdAddCircleOutline } from 'react-icons/io';

const SideBar = () => {
    const location = useLocation();
    const currentPath = location.pathname;

    const [hoveredNavIndex, setHoveredNavIndex] = useState(null);
    const [isBtnHovered, setIsBtnHovered] = useState(false);
    const [isFooterHovered, setIsFooterHovered] = useState(false);

    const navItems = [
        {
            label: 'Bảng điều khiển',
            icon: <MdOutlineDashboard size={24} />,
            selected: currentPath === '/librarian',
            link: '/librarian',
            selectedIcon: <MdDashboard size={24} />
        },
        {
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
    ];

    return (
        <nav style={sidebarStyles.sidebarContainerStyle}>
            <div style={sidebarStyles.sidebarHeaderLogoAreaStyle}>
                <div style={sidebarStyles.logoIconWrapperStyle}>
                    <FaBookOpen size={22} style={{ color: 'white' }}/>
                </div>
                <h2 style={sidebarStyles.sidebarLogoStyle}>
                    <span style={{ color: '#1D559F' }}>eLibrary</span>
                </h2>
            </div>

            <ul style={sidebarStyles.navMenuStyle}>
                {navItems.map((item, index) => {
                    const isActive = item.selected;
                    const isHovered = hoveredNavIndex === index;

                    let currentLinkStyle = isActive ? sidebarStyles.navLinkActiveStyle : sidebarStyles.navLinkNormalStyle;
                    if (isHovered && !isActive) {
                        currentLinkStyle = { ...currentLinkStyle, backgroundColor: '#e5e7eb', color: '#111827' };
                    }

                    return (
                        <li key={index} style={sidebarStyles.navItemStyle}>
                            <Link
                                to={item.link}
                                style={currentLinkStyle}
                                onMouseEnter={() => setHoveredNavIndex(index)}
                                onMouseLeave={() => setHoveredNavIndex(null)}
                            >
                                {isActive ? item.selectedIcon : item.icon}
                                {item.label}
                            </Link>
                        </li>
                    );
                })}
            </ul>

            <div style={sidebarStyles.actionSectionStyle}>
                <Link
                    to="/librarian/add-document"
                    style={{
                        ...sidebarStyles.btnPrimaryStyle,
                        backgroundColor: isBtnHovered ? '#1d4ed8' : '#2563eb'
                    }}
                    onMouseEnter={() => setIsBtnHovered(true)}
                    onMouseLeave={() => setIsBtnHovered(false)}
                >
                    <IoMdAddCircleOutline size={20} className="me-1" />
                    Thêm tài liệu
                </Link>
            </div>

            {/* <div style={sidebarStyles.sidebarHeaderProfileStyle}>
                <div style={sidebarStyles.userProfileStyle}>
                    <img
                        src="https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff"
                        alt="Librarian Avatar"
                        style={sidebarStyles.userAvatarStyle}
                    />
                    <div>
                        <h4 style={sidebarStyles.userInfoH4Style}>Librarian Portal</h4>
                        <p style={sidebarStyles.userInfoPStyle}>Management Suite</p>
                    </div>
                </div>
            </div> */}

            <div style={sidebarStyles.dividerStyle}></div>
            <div style={sidebarStyles.sidebarFooterStyle}>
                <Link
                    to="/"
                    style={isFooterHovered ? { ...sidebarStyles.navLinkNormalStyle, backgroundColor: '#e5e7eb', color: '#111827' } : sidebarStyles.navLinkNormalStyle}
                    onMouseEnter={() => setIsFooterHovered(true)}
                    onMouseLeave={() => setIsFooterHovered(false)}
                >
                    <MdOutlineLogout size={24} />
                    Về trang chủ (Home)
                </Link>
            </div>
        </nav>
    );
};

export default SideBar;