import { useContext, useEffect, useState } from "react";
import { Button, Container, Form, Nav, Navbar, NavDropdown, Badge, InputGroup } from "react-bootstrap";
import Apis, { endpoints } from "../configs/Apis";
import { Link, useNavigate } from "react-router-dom";
import { FaBookOpen } from "react-icons/fa";
import cookies from "react-cookies";
import { MyCartBuyContext, MyCartBorrowContext, MyUserContext } from "../configs/Context";
import HeaderStyles from "../style/HeaderStyles";

const Header = () => {
    const [categories, setCategories] = useState([]);
    const [kw, setKw] = useState("");
    const nav = useNavigate();

    const [user, dispatch] = useContext(MyUserContext);
    
    const [cartBuy, dispatchBuy] = useContext(MyCartBuyContext);
    const [cartBorrow, dispatchBorrow] = useContext(MyCartBorrowContext);

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

    useEffect(() => {
        if (user && user.id) {
            dispatchBuy({ type: "UPDATE", userId: user.id });
            dispatchBorrow({ type: "UPDATE", userId: user.id });
        } else {
            dispatchBuy({ type: "CLEAR" });
            dispatchBorrow({ type: "CLEAR" });
        }
    }, [user, dispatchBuy, dispatchBorrow]);

    const search = (e) => {
        e.preventDefault();
        nav(`/?kw=${kw}`);
    }

    const logout = () => {
        cookies.remove('token');
        cookies.remove('user');
        dispatch({ type: "LOGOUT" }); 
        nav("/login");
    }

    
    return (
        <Navbar expand="lg" className="bg-body-tertiary shadow-sm sticky-top">
            <Container fluid="xl">
                <Navbar.Brand as={Link} to="/" className="fw-bold me-4" style={HeaderStyles.brand}>
                    <FaBookOpen size={28} className="me-2" />eLibrary
                </Navbar.Brand>
                
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto align-items-center gap-2">
                        <Link to="/" className="nav-link text-nowrap">Trang chủ</Link>
                        
                        <NavDropdown title="Danh mục sách" id="basic-nav-dropdown" className="text-nowrap">
                            {categories?.map(c => (
                                <Link to={`/?cateId=${c.id}`} className="dropdown-item" key={c.id}>
                                    {c.name}
                                </Link>
                            ))}
                        </NavDropdown>
                        <div>
                            <Link to="/?type=latest" className="nav-link text-danger fw-bold text-nowrap">Mới nhất</Link>
                            <Link to="/?type=trend" className="nav-link text-success fw-bold text-nowrap">Xem nhiều</Link>
                        </div>
                        
                        {user !== null && (
                            <Link to="/my-documents" style={HeaderStyles.myDocsButton} className="nav-link fw-bold ms-1 text-decoration-none">
                                <i className="fa-solid fa-bookmark me-2"></i> Tài liệu của tôi
                            </Link>
                        )}
                    </Nav>

                    <Form inline="true" onSubmit={search} className="mx-3 my-2 my-lg-0 d-flex align-items-center">
                        <InputGroup>
                            <Form.Control
                                type="text"
                                placeholder="Nhập tên sách..."
                                value={kw}
                                onChange={e => setKw(e.target.value)}
                                className="bg-light"
                                style={{ minWidth: '200px' }}
                            />
                        </InputGroup>
                        <Button type="submit" variant="primary" className="px-3">
                            Tìm
                        </Button>
                    </Form>

                    {/* KHU VỰC BÊN PHẢI (Dùng gap-3 để khoảng cách đẹp hơn) */}
                    <Nav className="ms-auto align-items-center gap-3">
                        
                        {/* Nút Giỏ hàng */}
                        <Link to="/cart" className="nav-link fw-bold text-decoration-none" style={HeaderStyles.cartLink}>
                            <i className="fa-solid fa-cart-shopping me-1 text-primary"></i> Giỏ hàng
                            <Badge bg="danger" className="ms-2 rounded-pill" title="Sách mua">
                                {user ? (cartBuy?.totalQuantity || 0) : 0}
                            </Badge>
                            <Badge bg="success" className="ms-1 rounded-pill" title="Sách mượn">
                                {user ? (cartBorrow?.totalQuantity || 0) : 0}
                            </Badge>
                        </Link>

                        {/* Phân luồng Đăng nhập / Đã đăng nhập */}
                        {user === null ? (
                            <div className="d-flex gap-2">
                                <Link className="btn btn-outline-primary btn-sm px-3 text-nowrap" to="/login">
                                    Đăng nhập
                                </Link>
                                <Link className="btn btn-primary btn-sm px-3 text-nowrap" to="/register">
                                    Đăng ký
                                </Link>
                            </div>
                        ) : (
                            <div className="d-flex align-items-center gap-3">
                                <Link to="/profile" className="nav-link fw-bold text-decoration-none" style={HeaderStyles.greetingText}>
                                    Chào, {user.username || 'bạn'}!
                                </Link>
                                <Button variant="outline-danger" size="sm" onClick={logout} className="rounded-pill px-3 text-nowrap">
                                    Đăng xuất
                                </Button>
                            </div>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Header;