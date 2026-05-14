import { Card, Container, Navbar, Nav, Button } from 'react-bootstrap';
import { FaBookOpen } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
    const nav = useNavigate();
    return (
        <div style={{ minHeight: '80vh', background: 'linear-gradient(135deg, #f8fafc 60%, #e3eafc 100%)' }}>
            <Navbar bg="light" expand="lg" className="shadow-sm">
                <Container>
                    <Navbar.Brand href="#home" className="fw-bold" style={{ color: '#1c4c96' }}>
                        <FaBookOpen size={28} className="me-2 mb-1" />eLibrary
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto">
                            <Button variant="outline-primary" href="/login" className="me-2">Đăng nhập</Button>
                            <Button variant="primary" href="/register" className="me-2">Đăng ký</Button>.
                            <Link to="/home" className="nav-link" onClick={() => nav('/home')}>
                                Trang chủ
                            </Link>
                            <Button variant="danger" onClick={() => {
                                // Xóa token đăng nhập nếu có
                                if (window.localStorage) {
                                    localStorage.removeItem('token');
                                }
                                if (window.sessionStorage) {
                                    sessionStorage.removeItem('token');
                                }
                                document.cookie = 'token=; Max-Age=0; path=/;';
                                nav('/login');
                            }}>Đăng xuất</Button>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '75vh' }}>
                <Container>
                    <Card className="shadow-lg mx-auto" style={{ maxWidth: 500, borderRadius: 16 }}>
                        <Card.Body className="text-center p-5">
                            <div className="mb-3">
                                <FaBookOpen size={48} color="#1c4c96" />
                            </div>
                            <h1 className="fw-bold mb-3" style={{ color: '#003366', letterSpacing: 1 }}>Trang chủ Thư viện</h1>
                            <p className="text-muted mb-0" style={{ fontSize: '1.15rem' }}>
                                Chào mừng bạn đến với hệ thống thư viện trực tuyến eLibrary.<br />Khám phá, quản lý và truy cập tài liệu dễ dàng, mọi lúc mọi nơi.
                            </p>
                        </Card.Body>
                    </Card>
                </Container>
            </div>
        </div>
    );
};

export default Home;