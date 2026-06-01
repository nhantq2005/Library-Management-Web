import { useContext, useEffect, useState } from "react";
import { Button, Container, Form, Nav, Navbar, NavDropdown, InputGroup } from "react-bootstrap";
import Apis, { endpoints } from "../configs/Apis";
import { Link, useNavigate } from "react-router-dom";
import { FaBookOpen, FaRegUserCircle } from "react-icons/fa";
import cookies from "react-cookies";
import { MyCartBuyContext, MyCartBorrowContext, MyUserContext } from "../configs/Context";
import { GiShoppingCart } from "react-icons/gi";
import { RiBookShelfLine } from "react-icons/ri";
import { TbCategory } from "react-icons/tb";
import { headerStyle } from "../style/HeaderStyle";
import { MdOutlineManageAccounts } from "react-icons/md";
import { IoLogOutOutline } from "react-icons/io5";

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
        <>
            <style>
                {`
                    .user-dropdown-header > .dropdown-toggle::after { display: none !important; }
                    .nav-item-hover:hover { background-color: #F3F4F6; border-radius: 4px; }
                `}
            </style>
            <Navbar expand="lg" className="sticky-top" style={headerStyle.navbar}>
                <Container fluid="xl" className="d-flex align-items-center">
                    
                    <Navbar.Brand as={Link} to="/" className="d-flex align-items-center gap-2 m-0 pe-4" style={headerStyle.brand}>
                        <FaBookOpen size={24} />
                        eLibrary
                    </Navbar.Brand>
                    
                    <Navbar.Toggle aria-controls="basic-navbar-nav" style={headerStyle.toggle} />
                    
                    <Navbar.Collapse id="basic-navbar-nav">
                        
                        <Nav className="me-auto d-flex align-items-lg-center gap-1">
                            <Link to="/" className="nav-link text-nowrap nav-item-hover" style={headerStyle.navLink}>Trang chủ</Link>
                            
                            <NavDropdown 
                                title={<span style={headerStyle.navLink}>
                                    <TbCategory size={20} className="me-2" />
                                    Danh mục sách
                                    </span>} 
                                id="basic-nav-dropdown" 
                                className="text-nowrap nav-item-hover"
                                menuVariant="light"
                                style={{ maxHeight: 'unset' }}
                            >
                                <div style={headerStyle.dropdownMenuContainer}>
                                    {categories?.map(c => (
                                        <NavDropdown.Item as={Link} to={`/?cateId=${c.id}`} key={c.id} style={headerStyle.dropdownItem}>
                                            {c.name}
                                        </NavDropdown.Item>
                                    ))}
                                </div>
                            </NavDropdown>

                            {user !== null && (
                                <Link to="/my-documents" className="nav-link text-nowrap nav-item-hover d-flex align-items-center gap-2" style={headerStyle.navLinkMyDoc}>
                                    <RiBookShelfLine size={20} /> Sách của tôi
                                </Link>
                            )}
                        </Nav>

                        <Form inline="true" onSubmit={search} className="d-flex align-items-center mx-lg-4 my-2 my-lg-0 flex-grow-1" style={headerStyle.searchForm}>
                            <InputGroup style={headerStyle.searchInputGroup}>
                                <Form.Control
                                    type="text"
                                    placeholder="Nhập tên sách..."
                                    value={kw}
                                    onChange={e => setKw(e.target.value)}
                                    style={headerStyle.searchInput}
                                />
                                <Button 
                                    type="submit" 
                                    variant="none" 
                                    className="d-flex align-items-center justify-content-center"
                                    style={headerStyle.searchButton}
                                >
                                    Tìm
                                </Button>
                            </InputGroup>
                        </Form>

                        <Nav className="ms-auto d-flex align-items-lg-center gap-3 flex-row mt-2 mt-lg-0">
                            
                            <Link to="/cart" className="text-decoration-none d-flex align-items-center gap-2" style={headerStyle.cartLink}>
                                <GiShoppingCart style={{ color: '#4B5563' }} />
                                <span style={headerStyle.cartText}>Giỏ hàng</span>
                                <div className="d-flex gap-1 ms-1">
                                    <span style={headerStyle.badgeBuy} title="Số lượng mua">{user ? (cartBuy?.totalQuantity || 0) : 0}</span>
                                    <span style={headerStyle.badgeBorrow} title="Số lượng mượn">{user ? (cartBorrow?.totalQuantity || 0) : 0}</span>
                                </div>
                            </Link>

                            {user === null ? (
                                <div className="d-flex align-items-center gap-2">
                                    <Link to="/login" className="text-decoration-none d-flex align-items-center justify-content-center text-nowrap" style={headerStyle.loginLink}>
                                        Đăng nhập
                                    </Link>
                                    <Link to="/register" className="text-decoration-none d-flex align-items-center justify-content-center text-nowrap" style={headerStyle.registerLink}>
                                        Đăng ký
                                    </Link>
                                </div>
                            ) : (
                                <NavDropdown
                                    align="end"
                                    id="user-dropdown"
                                    className="user-dropdown-header d-flex align-items-center"
                                    title={
                                        <div className="d-flex align-items-center gap-2" style={headerStyle.userToggleDiv}>
                                            <img 
                                                src={user.avatar || `https://ui-avatars.com/api/?name=${user.username || 'U'}&background=EFF6FF&color=1D559F`} 
                                                alt="avatar" 
                                                style={headerStyle.userAvatar} 
                                            />
                                            <span style={headerStyle.userName}>
                                                {user.name || user.username}
                                            </span>
                                        </div>
                                    }
                                >
                                    <NavDropdown.Item as={Link} to="/profile" style={headerStyle.userDropdownItem}>
                                        <FaRegUserCircle size={16} /> Hồ sơ cá nhân
                                    </NavDropdown.Item>
                                    {user.role === 'ROLE_LIBRARIAN' && (
                                        <>
                                            <NavDropdown.Divider style={headerStyle.userDropdownDivider} />
                                            <NavDropdown.Item as={Link} to="/librarian" style={headerStyle.userDropdownItem}>
                                                <MdOutlineManageAccounts size={16} /> Trang quản lý
                                            </NavDropdown.Item>
                                        </>
                                    )}
                                    <NavDropdown.Divider style={headerStyle.userDropdownDivider} />
                                    <NavDropdown.Item onClick={logout} style={headerStyle.userDropdownLogout}>
                                        <IoLogOutOutline size={16} /> Đăng xuất
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