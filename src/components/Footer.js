import React from 'react';

const Footer = () => {
    return (
        <footer className="border-top py-3 px-4 bg-white mt-auto">
            <div className="container-fluid">
                <div className="row align-items-center">
                    <div className="col-md-6 text-center text-md-start mb-2 mb-md-0">
                        <span style={{ fontFamily: 'monospace', fontSize: '0.85rem', fontWeight: 'bold' }}>
                            &copy; 2026 eLibrary. Hệ thống quản lý thư viện chuyên nghiệp. 
                        </span>
                    </div>
                    <div className="col-md-6 text-center text-md-end">
                        <a href="#privacy" className="text-muted text-decoration-none ms-3" style={{ fontSize: '0.85rem' }}>Điều khoản bảo mật</a>
                        <a href="#terms" className="text-muted text-decoration-none ms-3" style={{ fontSize: '0.85rem' }}>Điều khoản dịch vụ</a>
                        <a href="#help" className="text-muted text-decoration-none ms-3" style={{ fontSize: '0.85rem' }}>Trung tâm trợ giúp</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;