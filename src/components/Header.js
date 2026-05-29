import { useContext, useEffect, useState } from "react";
import { Button, Container, Form, Nav, Navbar, NavDropdown, InputGroup } from "react-bootstrap";
import Apis, { endpoints } from "../configs/Apis";
import { Link, useNavigate } from "react-router-dom";
import { FaBookOpen } from "react-icons/fa";
import cookies from "react-cookies";
import { MyCartBuyContext, MyCartBorrowContext, MyUserContext } from "../configs/Context";
import { GiShoppingCart } from "react-icons/gi";
import { RiBookShelfLine } from "react-icons/ri";
import { TbCategory } from "react-icons/tb";

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


    const navLinkStyle = { color: '#4B5563', fontSize: '0.875rem', fontWeight: '500', padding: '8px 12px' };
    const badgeBuyStyle = { backgroundColor: '#FEE2E2', color: '#991B1B', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: '700', minWidth: '22px', textAlign: 'center' };
    const badgeBorrowStyle = { backgroundColor: '#DCFCE7', color: '#166534', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: '700', minWidth: '22px', textAlign: 'center' };

    return (
        <>
            <style>
                {`
                    /* Xóa mũi tên mặc định của Dropdown User để UI gọn hơn */
                    .user-dropdown-header > .dropdown-toggle::after { display: none !important; }
                    .nav-item-hover:hover { background-color: #F3F4F6; border-radius: 4px; }
                `}
            </style>
            <Navbar expand="lg" className="sticky-top" style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E5E7EB', padding: '10px 0', fontFamily: 'Inter, sans-serif' }}>
                <Container fluid="xl" className="d-flex align-items-center">
                    
                    <Navbar.Brand as={Link} to="/" className="d-flex align-items-center gap-2 m-0 pe-4" style={{ color: '#1D559F', fontSize: '1.25rem', fontWeight: '700', letterSpacing: '-0.02em', textDecoration: 'none' }}>
                        <FaBookOpen size={24} />
                        eLibrary
                    </Navbar.Brand>
                    
                    <Navbar.Toggle aria-controls="basic-navbar-nav" style={{ border: '1px solid #E5E7EB', borderRadius: '4px', padding: '4px 8px', boxShadow: 'none' }} />
                    
                    <Navbar.Collapse id="basic-navbar-nav">
                        
                        <Nav className="me-auto d-flex align-items-lg-center gap-1">
                            <Link to="/" className="nav-link text-nowrap nav-item-hover" style={navLinkStyle}>Trang chủ</Link>
                            
                            <NavDropdown 
                                title={<span style={navLinkStyle}>
                                    <TbCategory size={20} className="me-2" />
                                    Danh mục sách
                                    </span>} 
                                id="basic-nav-dropdown" 
                                className="text-nowrap nav-item-hover"
                                menuVariant="light"
                                style={{ maxHeight: 'unset' }}
                            >
                                <div style={{ maxHeight: '320px', overflowY: 'auto', minWidth: 220 }}>
                                    {categories?.map(c => (
                                        <NavDropdown.Item as={Link} to={`/?cateId=${c.id}`} key={c.id} style={{ fontSize: '0.875rem', padding: '8px 20px', color: '#4B5563', whiteSpace: 'normal' }}>
                                            {c.name}
                                        </NavDropdown.Item>
                                    ))}
                                </div>
                            </NavDropdown>

                            {user !== null && (
                                <Link to="/my-documents" className="nav-link text-nowrap nav-item-hover d-flex align-items-center gap-2" style={{ ...navLinkStyle, color: '#1D559F' }}>
                                    <RiBookShelfLine size={20} /> Sách của tôi
                                </Link>
                            )}
                        </Nav>

                        <Form inline="true" onSubmit={search} className="d-flex align-items-center mx-lg-4 my-2 my-lg-0 flex-grow-1" style={{ maxWidth: '400px' }}>
                            <InputGroup style={{ height: '38px' }}>
                                <Form.Control
                                    type="text"
                                    placeholder="Nhập tên sách..."
                                    value={kw}
                                    onChange={e => setKw(e.target.value)}
                                    style={{ height: '100%', backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '4px 0 0 4px', fontSize: '0.875rem', color: '#111827', boxShadow: 'none' }}
                                />
                                <Button 
                                    type="submit" 
                                    variant="none" 
                                    className="d-flex align-items-center justify-content-center"
                                    style={{ height: '100%', backgroundColor: '#1D559F', color: '#FFFFFF', border: 'none', borderRadius: '0 4px 4px 0', fontSize: '0.875rem', padding: '0 20px', fontWeight: '500' }}
                                >
                                    Tìm
                                </Button>
                            </InputGroup>
                        </Form>

                        <Nav className="ms-auto d-flex align-items-lg-center gap-3 flex-row mt-2 mt-lg-0">
                            
                            <Link to="/cart" className="text-decoration-none d-flex align-items-center gap-2" style={{ height: '38px', backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', padding: '0 12px', borderRadius: '4px', transition: 'all 0.2s' }}>
                                <GiShoppingCart style={{ color: '#4B5563' }} />
                                <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#4B5563' }}>Giỏ hàng</span>
                                <div className="d-flex gap-1 ms-1">
                                    <span style={badgeBuyStyle} title="Số lượng mua">{user ? (cartBuy?.totalQuantity || 0) : 0}</span>
                                    <span style={badgeBorrowStyle} title="Số lượng mượn">{user ? (cartBorrow?.totalQuantity || 0) : 0}</span>
                                </div>
                            </Link>

                            {user === null ? (
                                <div className="d-flex align-items-center gap-2">
                                    <Link to="/login" className="text-decoration-none d-flex align-items-center justify-content-center text-nowrap" style={{ height: '38px', backgroundColor: '#FFFFFF', color: '#4B5563', border: '1px solid #E5E7EB', borderRadius: '4px', padding: '0 16px', fontSize: '0.875rem', fontWeight: '600' }}>
                                        Đăng nhập
                                    </Link>
                                    <Link to="/register" className="text-decoration-none d-flex align-items-center justify-content-center text-nowrap" style={{ height: '38px', backgroundColor: '#1D559F', color: '#FFFFFF', border: 'none', borderRadius: '4px', padding: '0 16px', fontSize: '0.875rem', fontWeight: '500' }}>
                                        Đăng ký
                                    </Link>
                                </div>
                            ) : (
                                <NavDropdown
                                    align="end"
                                    id="user-dropdown"
                                    className="user-dropdown-header d-flex align-items-center"
                                    title={
                                        <div className="d-flex align-items-center gap-2" style={{ height: '38px', padding: '0 8px' }}>
                                            <img 
                                                src={user.avatar || `https://ui-avatars.com/api/?name=${user.username || 'U'}&background=EFF6FF&color=1D559F`} 
                                                alt="avatar" 
                                                style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #E5E7EB' }} 
                                            />
                                            <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827' }}>
                                                {user.name || user.username}
                                            </span>
                                        </div>
                                    }
                                >
                                    <NavDropdown.Item as={Link} to="/profile" style={{ fontSize: '0.875rem', padding: '10px 20px', color: '#4B5563' }}>
                                        <i className="fa-regular fa-user me-2"></i> Hồ sơ cá nhân
                                    </NavDropdown.Item>
                                    <NavDropdown.Divider style={{ margin: '4px 0' }} />
                                    <NavDropdown.Item onClick={logout} style={{ fontSize: '0.875rem', padding: '10px 20px', color: '#DC2626', fontWeight: '500' }}>
                                        <i className="fa-solid fa-arrow-right-from-bracket me-2"></i> Đăng xuất
                                    </NavDropdown.Item>
                                </NavDropdown>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    );
}

export default Header;