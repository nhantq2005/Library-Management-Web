import { useContext, useEffect, useState } from "react";
import { Alert, Button, Form, Table } from "react-bootstrap";
import cookies from 'react-cookies';
import { MyCartBuyContext, MyCartBorrowContext, MyUserContext } from "../../configs/Context";
import { Link, useNavigate } from "react-router-dom";
import { authApi, endpoints } from "../../configs/Apis";
import { TiDeleteOutline } from "react-icons/ti";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const Cart = () => {
    const [cartBuy, setCartBuy] = useState(null);
    const [cartBorrow, setCartBorrow] = useState(null);
    const [user] = useContext(MyUserContext);
    const [cBuy, dispatchBuy] = useContext(MyCartBuyContext);
    const [cBorrow, dispatchBorrow] = useContext(MyCartBorrowContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user && user.id) {
            setCartBuy(cookies.load(`cartBuy_${user.id}`) || null);
            setCartBorrow(cookies.load(`cartBorrow_${user.id}`) || null);
        } else {
            setCartBuy(null);
            setCartBorrow(null);
        }
    }, [user]);

    const payBuy = async () => {
        const token = cookies.load('token');
        let cart = cookies.load(`cartBuy_${user.id}`) || null;
        if (cart === null || Object.keys(cart).length === 0) return;
        if (window.confirm('Bạn chắc chắn muốn mua những cuốn sách này?')) {
            try {
                let cartList = Object.values(cart).map(c => ({ id: c.id, quantity: 1 }));
                let res = await authApi(token).post(endpoints['secure-buy'], cartList);
                if (res.status === 201 || res.status === 200) {
                    alert("Mua thành công!");
                    cookies.remove(`cartBuy_${user.id}`, { path: '/' });
                    setCartBuy(null);
                    dispatchBuy({ "type": "UPDATE", "userId": user.id });
                }
            } catch (ex) {
                console.error("Lỗi:", ex);
                alert(ex.response?.data?.message || "Đã có lỗi xảy ra. Vui lòng thử lại!");
            }
        }
    };

    const deleteBuyItem = (productId) => {
        if (cartBuy !== null && productId in cartBuy) {
            let updatedCart = { ...cartBuy };
            delete updatedCart[productId];
            setCartBuy(updatedCart);
            cookies.save(`cartBuy_${user.id}`, updatedCart, { path: '/' });
            dispatchBuy({ "type": "UPDATE", "userId": user.id });
        }
    };

    const payBorrow = async () => {
        const token = cookies.load('token');
        let cart = cookies.load(`cartBorrow_${user.id}`) || null;
        if (cart === null || Object.keys(cart).length === 0) return;
        if (window.confirm('Bạn chắc chắn muốn mượn những cuốn sách này?')) {
            try {
                let cartList = Object.values(cart).map(c => ({ id: c.id, quantity: c.quantity }));
                let res = await authApi(token).post(endpoints['secure-borrows'], cartList);
                if (res.status === 201 || res.status === 200) {
                    alert("Mượn thành công!\nThời gian mượn là 20 ngày, hãy nhớ trả đúng hạn để tránh bị phạt nhé!");
                    cookies.remove(`cartBorrow_${user.id}`, { path: '/' });
                    setCartBorrow(null);
                    dispatchBorrow({ "type": "UPDATE", "userId": user.id });
                }
            } catch (ex) {
                console.error("Lỗi:", ex);
                alert("Đã có lỗi xảy ra. Vui lòng thử lại!");
            }
        }
    };

    const updateBorrowItem = (e, productId) => {
        if (cartBorrow !== null && productId in cartBorrow) {
            let newQty = parseInt(e.target.value);
            if (isNaN(newQty) || newQty < 1) newQty = 1;
            let maxQty = cartBorrow[productId].maxQuantity || 999;
            if (newQty > maxQty) {
                alert(`Kho chỉ còn ${maxQty} quyển.`);
                newQty = maxQty;
            }
            let updatedCart = { ...cartBorrow, [productId]: { ...cartBorrow[productId], 'quantity': newQty } };
            setCartBorrow(updatedCart);
            cookies.save(`cartBorrow_${user.id}`, updatedCart, { path: '/' });
            dispatchBorrow({ "type": "UPDATE", "userId": user.id });
        }
    };

    const deleteBorrowItem = (productId) => {
        if (cartBorrow !== null && productId in cartBorrow) {
            let updatedCart = { ...cartBorrow };
            delete updatedCart[productId];
            setCartBorrow(updatedCart);
            cookies.save(`cartBorrow_${user.id}`, updatedCart, { path: '/' });
            dispatchBorrow({ "type": "UPDATE", "userId": user.id });
        }
    };

    const cardStyle = { backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '4px', padding: '24px', marginBottom: '24px' };
    const thStyle = { padding: '14px 20px', fontSize: '0.75rem', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #E5E7EB', backgroundColor: '#F9FAFB' };
    const tdStyle = { padding: '16px 20px', fontSize: '0.875rem', color: '#111827', verticalAlign: 'middle', borderBottom: '1px solid #E5E7EB' };
    const qtyInputStyle = { backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '4px', padding: '6px 12px', fontSize: '0.875rem', textAlign: 'center', width: '70px', color: '#111827', boxShadow: 'none' };

    const buyItems = cartBuy ? Object.values(cartBuy) : [];
    const borrowItems = cartBorrow ? Object.values(cartBorrow) : [];

    return (
        <>
        <Header />
        <div style={{ padding: '32px 40px', backgroundColor: '#F9FAFB', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                <div className="mb-4">
                    <h3 style={{ color: '#111827', fontWeight: '600', letterSpacing: '-0.02em', fontSize: '1.5rem', marginBottom: '4px' }}>
                        Giỏ hàng của bạn
                    </h3>
                </div>
                {user === null ? (
                    <div style={{ backgroundColor: '#FEFCE8', border: '1px solid #FEF08A', color: '#854D0E', padding: '16px 24px', borderRadius: '4px', fontSize: '0.875rem' }}>
                        Bạn cần <Link to="/login?next=/cart" style={{ color: '#A16207', fontWeight: '600', textDecoration: 'none' }}>đăng nhập</Link> để xem và xử lý giỏ hàng của mình!
                    </div>
                ) : (
                    <>
                        <div style={cardStyle}>
                            <h5 style={{ color: '#111827', fontWeight: '600', fontSize: '1.1rem', marginBottom: '20px' }}>
                                🛒 Sách Chọn Mua
                            </h5>
                            {cartBuy === null || Object.keys(cartBuy).length === 0 ? (
                                <div style={{ backgroundColor: '#F9FAFB', border: '1px dashed #D1D5DB', color: '#6B7280', padding: '32px', textAlign: 'center', borderRadius: '4px', fontSize: '0.875rem' }}>
                                    Không có tài liệu nào trong giỏ mua!
                                </div>
                            ) : (
                                <>
                                    <div style={{ margin: '0 -24px', overflowX: 'auto' }}>
                                        <Table hover responsive className="align-middle mb-0" style={{ borderTop: '1px solid #E5E7EB' }}>
                                            <thead>
                                                <tr>
                                                    <th style={{ ...thStyle, width: '10%' }}>ID</th>
                                                    <th style={{ ...thStyle, width: '40%' }}>Tên sản phẩm</th>
                                                    <th style={{ ...thStyle, width: '20%' }}>Đơn giá</th>
                                                    <th style={{ ...thStyle, width: '20%', textAlign: 'center' }}>Số lượng</th>
                                                    <th style={{ ...thStyle, width: '10%', textAlign: 'center' }}>Xóa</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {Object.values(cartBuy).map(c => (
                                                    <tr key={`buy-${c.id}`}>
                                                        <td style={{ ...tdStyle, color: '#6B7280', fontWeight: '500' }}>#{c.id}</td>
                                                        <td style={{ ...tdStyle, fontWeight: '500', color: '#1D559F' }}>{c.title || c.name}</td>
                                                        <td style={{ ...tdStyle, fontWeight: '600', color: '#111827' }}>
                                                            {c.price?.toLocaleString()} VNĐ
                                                        </td>
                                                        <td style={{ ...tdStyle, textAlign: 'center' }}>
                                                            <span style={{ backgroundColor: '#F3F4F6', color: '#374151', padding: '4px 12px', borderRadius: '4px', fontWeight: '600', fontSize: '0.875rem' }}>1</span>
                                                            <div style={{ fontSize: '0.7rem', color: '#9CA3AF', marginTop: '4px' }}>(Chỉ mua 1 cuốn)</div>
                                                        </td>
                                                        <td style={{ ...tdStyle, textAlign: 'center' }}>
                                                            <Button variant="none" onClick={() => deleteBuyItem(c.id)} style={{ color: '#DC2626', backgroundColor: '#FEE2E2', padding: '6px 10px', borderRadius: '4px', border: 'none' }}>
                                                                <TiDeleteOutline />
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center mt-4 pt-4" style={{ borderTop: '1px solid #E5E7EB' }}>
                                        <div>
                                            <div style={{ color: '#4B5563', fontSize: '0.875rem', marginBottom: '4px' }}>Tổng số sách: <strong style={{ color: '#111827' }}>{Object.keys(cartBuy).length}</strong> cuốn</div>
                                            <div style={{ color: '#111827', fontSize: '1.1rem', fontWeight: '600' }}>
                                                Tổng tiền: <span style={{ color: '#DC2626', fontSize: '1.25rem' }}>{(cBuy?.totalAmount || 0).toLocaleString()} VNĐ</span>
                                            </div>
                                        </div>
                                        <Button
                                            onClick={() => navigate('/payment')}
                                            style={{ backgroundColor: '#DC2626', color: '#FFFFFF', border: 'none', borderRadius: '4px', padding: '10px 24px', fontWeight: '500', fontSize: '0.875rem', width: 'fit-content' }}
                                        >
                                            Thanh toán mua
                                        </Button>
                                    </div>
                                </>
                            )}
                        </div>
                        <div style={cardStyle}>
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h5 style={{ color: '#111827', fontWeight: '600', fontSize: '1.1rem', margin: 0 }}>
                                    📖 Sách Chọn Mượn
                                </h5>
                            </div>
                            {cartBorrow === null || Object.keys(cartBorrow).length === 0 ? (
                                <div style={{ backgroundColor: '#F9FAFB', border: '1px dashed #D1D5DB', color: '#6B7280', padding: '32px', textAlign: 'center', borderRadius: '4px', fontSize: '0.875rem' }}>
                                    Không có tài liệu nào trong giỏ mượn!
                                </div>
                            ) : (
                                <>
                                    <div style={{ margin: '0 -24px', overflowX: 'auto' }}>
                                        <Table hover responsive className="align-middle mb-0" style={{ borderTop: '1px solid #E5E7EB' }}>
                                            <thead>
                                                <tr>
                                                    <th style={{ ...thStyle, width: '10%' }}>ID</th>
                                                    <th style={{ ...thStyle, width: '40%' }}>Tên sản phẩm</th>
                                                    <th style={{ ...thStyle, width: '20%' }}>Đơn giá</th>
                                                    <th style={{ ...thStyle, width: '20%', textAlign: 'center' }}>Số lượng</th>
                                                    <th style={{ ...thStyle, width: '10%', textAlign: 'center' }}>Xóa</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {Object.values(cartBorrow).map(c => (
                                                    <tr key={`borrow-${c.id}`}>
                                                        <td style={{ ...tdStyle, color: '#6B7280', fontWeight: '500' }}>#{c.id}</td>
                                                        <td style={{ ...tdStyle, fontWeight: '500', color: '#1D559F' }}>{c.title || c.name}</td>
                                                        <td style={{ ...tdStyle, fontWeight: '600', color: '#059669' }}>Miễn phí</td>
                                                        <td style={{ ...tdStyle, textAlign: 'center' }}>
                                                            <Form.Control
                                                                type="number"
                                                                min="1"
                                                                value={c.quantity}
                                                                onChange={e => updateBorrowItem(e, c.id)}
                                                                className="mx-auto"
                                                                style={qtyInputStyle}
                                                            />
                                                        </td>
                                                        <td style={{ ...tdStyle, textAlign: 'center' }}>
                                                            <Button variant="none" onClick={() => deleteBorrowItem(c.id)} style={{ color: '#DC2626', backgroundColor: '#FEE2E2', padding: '6px 10px', borderRadius: '4px', border: 'none' }}>
                                                                <TiDeleteOutline />
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center mt-4 pt-4" style={{ borderTop: '1px solid #E5E7EB' }}>
                                        <div>
                                            <div style={{ color: '#111827', fontSize: '1.1rem', fontWeight: '600' }}>
                                                Tổng số lượng mượn: <span style={{ color: '#1D559F', fontSize: '1.25rem' }}>{cBorrow?.totalQuantity || 0}</span> cuốn
                                            </div>
                                        </div>
                                        <Button
                                            onClick={payBorrow}
                                            style={{ backgroundColor: '#1D559F', color: '#FFFFFF', border: 'none', borderRadius: '4px', padding: '10px 24px', fontWeight: '500', fontSize: '0.875rem', width: 'fit-content' }}
                                        >
                                            Xác nhận Mượn
                                        </Button>
                                    </div>
                                </>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
        <Footer />

        </>
    );
};

export default Cart;