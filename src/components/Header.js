import { useContext, useEffect, useState } from "react";
import { Button, Col, Container, Form, Nav, Navbar, NavDropdown, Row } from "react-bootstrap";
import Apis, { endpoints } from "../configs/Apis";
import { Link, useNavigate } from "react-router-dom";
import { FaBookOpen } from "react-icons/fa";
import cookies from "react-cookies";

import { MyUserContext } from "../configs/Context";

const Header = () => {
    const [categories, setCategories] = useState([]);
    const [kw, setKw] = useState("");
    const nav = useNavigate();

    const [user, dispatch] = useContext(MyUserContext);

    const loadCates = async () => {
        try {
            let res = await Apis.get(endpoints['categories']);
            setCategories(res.data);
        } catch (ex) {
            console.error("Lỗi tải danh mục", ex);
        }
    }

    useEffect(() => {
        loadCates();
    }, []);

    const search = (e) => {
        e.preventDefault();
        nav(`/?kw=${kw}`);
    }

    const logout = () => {
        cookies.remove('token');
        cookies.remove('user');
        dispatch({ type: "logout" }); 
        nav("/login");
    }

    return (
        <Navbar expand="lg" className="bg-body-tertiary shadow-sm">
            <Container>
                <Navbar.Brand href="/" className="fw-bold" style={{ color: '#1c4c96' }}>
                    <FaBookOpen size={28} className="me-2 mb-1" />eLibrary
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Link to="/" className="nav-link">Trang chủ</Link>
                        
                        <NavDropdown title="Danh mục sách" id="basic-nav-dropdown">
                            {categories.map(c => (
                                <Link to={`/?cateId=${c.id}`} className="dropdown-item" key={c.id}>
                                    {c.name}
                                </Link>
                            ))}
                        </NavDropdown>
                        <Link to="/?type=latest" className="nav-link text-danger fw-bold">Mới nhất</Link>
                        <Link to="/?type=trend" className="nav-link text-success fw-bold">Xem nhiều</Link>
                    </Nav>
                    <Form inline="true" onSubmit={search} className="me-3 my-2 my-lg-0">
                        <Row>
                            <Col xs="auto">
                                <Form.Control
                                    type="text"
                                    placeholder="Nhập tên sách..."
                                    value={kw}
                                    onChange={e => setKw(e.target.value)}
                                />
                            </Col>
                            <Col xs="auto">
                                <Button type="submit" variant="primary">Tìm</Button>
                            </Col>
                        </Row>
                    </Form>
                    <Nav className="ms-auto align-items-center">
                        {user === null ? (
                            <>
                                <Link className="btn btn-outline-primary me-2 mb-2 mb-lg-0" to="/login">
                                    Đăng nhập
                                </Link>
                                <Link className="btn btn-primary" to="/register">
                                    Đăng ký
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link to="/profile" className="nav-link text-success fw-bold me-3">
                                    Chào, {user.username || 'bạn'}!
                                </Link>
                                <Button variant="danger" onClick={logout}>
                                    Đăng xuất
                                </Button>
                            </>
                        )}
                    </Nav>

                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Header;