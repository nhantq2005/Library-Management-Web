import { useContext, useEffect, useState } from "react";
import { Alert, Button, Form, Table } from "react-bootstrap";
import cookies from 'react-cookies'
import { MyCartBuyContext, MyCartBorrowContext, MyUserContext } from "../../configs/Context"; 
import { Link } from "react-router-dom";
import { authApi, endpoints } from "../../configs/Apis";
import CartStyles from "../../style/CartStyles";

const Cart = () => {
    const [cartBuy, setCartBuy] = useState(null);
    const [cartBorrow, setCartBorrow] = useState(null);
    
    const [user, ] = useContext(MyUserContext);
    const [cBuy, dispatchBuy] = useContext(MyCartBuyContext);
    const [cBorrow, dispatchBorrow] = useContext(MyCartBorrowContext);

    useEffect(() => {
        if (user && user.id) {
            setCartBuy(cookies.load(`cartBuy_${user.id}`) || null);
            setCartBorrow(cookies.load(`cartBorrow_${user.id}`) || null);
        } else {
            setCartBuy(null);
            setCartBorrow(null);
        }
    }, [user]);

    // ================= XỬ LÝ GIỎ HÀNG MUA =================
    const payBuy = async () => {
        const token = cookies.load('token');
        let cart = cookies.load(`cartBuy_${user.id}`) || null;
        
        if (cart === null || Object.keys(cart).length === 0) {
            alert("Giỏ hàng mua đang trống!");
            return;
        }
        if (window.confirm('Bạn chắc chắn muốn mua những cuốn sách này?') === true) {
            try {
                // ÉP CỨNG quantity = 1 khi gửi xuống Backend để đúng chuẩn DB
                let cartList = Object.values(cart).map(c => ({
                    id: c.id,
                    quantity: 1 
                }));
                
                let res = await authApi(token).post(endpoints['secure-buy'], cartList);
                console.log("Giỏ hàng mua gửi đi:", cartList);
                
                if (res.status === 201 || res.status === 200) {
                    alert("Mua thành công!");
                    cookies.remove(`cartBuy_${user.id}`, { path: '/' });
                    setCartBuy(null);
                    dispatchBuy({ "type": "UPDATE", "userId": user.id });
                }
            } catch (ex) {
                console.error("Lỗi khi mua sách:", ex);
                // Bắt lỗi từ Backend quăng ra (ví dụ: đã sở hữu sách)
                if (ex.response && ex.response.data && ex.response.data.message) {
                    alert(ex.response.data.message);
                } else {
                    alert("Đã có lỗi xảy ra. Vui lòng thử lại!");
                }
            }
        }
    }

    const deleteBuyItem = (productId) => {
        if (cartBuy !== null && productId in cartBuy) {
            let updatedCart = { ...cartBuy };
            delete updatedCart[productId];
            setCartBuy(updatedCart);
            cookies.save(`cartBuy_${user.id}`, updatedCart, { path: '/' });
            dispatchBuy({ "type": "UPDATE", "userId": user.id });
        }
    }

    // ================= XỬ LÝ GIỎ HÀNG MƯỢN =================
    const payBorrow = async () => {
        const token = cookies.load('token');
        let cart = cookies.load(`cartBorrow_${user.id}`) || null;
        
        if (cart === null || Object.keys(cart).length === 0) {
            alert("Giỏ hàng mượn đang trống!");
            return;
        }
        if (window.confirm('Bạn chắc chắn muốn mượn những cuốn sách này?') === true) {
            try {
                // Bên mượn thì vẫn lấy số lượng bình thường
                let cartList = Object.values(cart).map(c => ({
                    id: c.id,
                    quantity: c.quantity 
                })); 
                
                let res = await authApi(token).post(endpoints['secure-borrows'], cartList);
                
                if (res.status === 201 || res.status === 200) {
                    alert("Mượn thành công!");
                    cookies.remove(`cartBorrow_${user.id}`, { path: '/' });
                    setCartBorrow(null);
                    dispatchBorrow({ "type": "UPDATE", "userId": user.id });
                }
            } catch (ex) {
                console.error("Lỗi khi mượn sách:", ex);
                alert("Đã có lỗi xảy ra. Vui lòng thử lại!");
            }
        }
    }

    const updateBorrowItem = (e, productId) => {
        if (cartBorrow !== null && productId in cartBorrow) {
            let newQty = parseInt(e.target.value);
            if (isNaN(newQty) || newQty < 1) newQty = 1;

            let maxQty = cartBorrow[productId].maxQuantity || 999;

            if (newQty > maxQty) {
                alert(`Kho chỉ còn ${maxQty} quyển.`);
                newQty = maxQty; 
            }

            let updatedCart = {...cartBorrow, [productId]: {
                ...cartBorrow[productId],
                'quantity': newQty
            }};
            setCartBorrow(updatedCart);
            cookies.save(`cartBorrow_${user.id}`, updatedCart, { path: '/' });
            dispatchBorrow({ "type": "UPDATE", "userId": user.id });
        }
    }

    const deleteBorrowItem = (productId) => {
        if (cartBorrow !== null && productId in cartBorrow) {
            let updatedCart = { ...cartBorrow };
            delete updatedCart[productId];
            setCartBorrow(updatedCart);
            cookies.save(`cartBorrow_${user.id}`, updatedCart, { path: '/' });
            dispatchBorrow({ "type": "UPDATE", "userId": user.id });
        }
    }

    return (
        <div className="container" style={CartStyles.container}>
            <h1 style={CartStyles.pageTitle}>GIỎ HÀNG CỦA BẠN</h1>

            {user === null ? (
                <Alert variant="warning" style={CartStyles.loginAlert}>
                    Bạn cần <Link to="/login?next=/cart" style={CartStyles.loginLink}>đăng nhập</Link> để xem và xử lý giỏ hàng của mình!
                </Alert>
            ) : (
                <>
                    {/* ================= KHU VỰC SÁCH CHỌN MUA ================= */}
                    <h3 style={CartStyles.sectionTitleBuy}>
                        <i className="fa-solid fa-cart-arrow-down me-2"></i>Sách Chọn Mua
                    </h3>
                    
                    {cartBuy === null || Object.keys(cartBuy).length === 0 ? (
                        <Alert variant="light" className="border">KHÔNG có sản phẩm trong giỏ mua!</Alert>
                    ) : (
                        <>
                            <Table striped bordered hover responsive>
                                <thead style={CartStyles.tableHeader}>
                                    <tr>
                                        <th>Id</th>
                                        <th>Tên sản phẩm</th>
                                        <th>Đơn giá</th>
                                        <th className="text-center">Số lượng</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.values(cartBuy).map(c => (
                                        <tr key={`buy-${c.id}`}>
                                            <td style={CartStyles.verticalMiddle} className="text-center">{c.id}</td>
                                            <td style={CartStyles.verticalMiddle} className="fw-semibold">{c.title || c.name}</td>
                                            <td style={CartStyles.verticalMiddle} className="text-danger fw-bold">
                                                {c.price?.toLocaleString()} VNĐ
                                            </td>
                                            
                                            {/* ĐÃ KHÓA CỨNG SỐ LƯỢNG MUA LÀ 1 */}
                                            <td style={CartStyles.verticalMiddle} className="text-center">
                                                <span className="fw-bold px-3 py-1 bg-light border rounded">1</span>
                                                <div className="text-muted mt-1" style={{ fontSize: '12px' }}>
                                                    (Chỉ mua 1 cuốn)
                                                </div>
                                            </td>

                                            <td style={CartStyles.actionCell}>
                                                <Button variant="outline-danger" size="sm" onClick={() => deleteBuyItem(c.id)}>
                                                    <i className="fa-solid fa-trash-can"></i>
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>

                            <Alert variant="danger" style={CartStyles.summaryAlert}>
                                <div style={CartStyles.summaryText}>Tổng tiền: {(cBuy?.totalAmount || 0).toLocaleString()} VND</div>
                                <div style={CartStyles.summaryText}>Tổng số sách: {Object.keys(cartBuy).length} cuốn</div>
                            </Alert>
                            <div className="text-end">
                                <Button onClick={payBuy} variant="danger" style={CartStyles.confirmButton}>
                                    Thanh toán Mua
                                </Button>
                            </div>
                        </>
                    )}

                    {/* ================= KHU VỰC SÁCH CHỌN MƯỢN ================= */}
                    <h3 style={CartStyles.sectionTitleBorrow} className="mt-5">
                        <i className="fa-solid fa-book-open-reader me-2"></i>Sách Chọn Mượn
                    </h3>

                    <Button as={Link} to="/payment" variant="success" size="sm" className="mb-3">
                        <i className="fa-solid fa-money-check-dollar me-1"></i> Xem phí mượn
                    </Button>
                    
                    {cartBorrow === null || Object.keys(cartBorrow).length === 0 ? (
                        <Alert variant="light" className="border">KHÔNG có sản phẩm trong giỏ mượn!</Alert>
                    ) : (
                        <>
                            <Table striped bordered hover responsive>
                                <thead style={CartStyles.tableHeader}>
                                    <tr>
                                        <th>Id</th>
                                        <th>Tên sản phẩm</th>
                                        <th>Đơn giá</th>
                                        <th className="text-center">Số lượng</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.values(cartBorrow).map(c => (
                                        <tr key={`borrow-${c.id}`}>
                                            <td style={CartStyles.verticalMiddle} className="text-center">{c.id}</td>
                                            <td style={CartStyles.verticalMiddle} className="fw-semibold">{c.title || c.name}</td>
                                            <td style={CartStyles.verticalMiddle} className="text-success fw-bold">Miễn phí</td>
                                            <td style={CartStyles.quantityCell}>
                                                <Form.Control 
                                                    type="number" 
                                                    min="1" 
                                                    value={c.quantity} 
                                                    onChange={e => updateBorrowItem(e, c.id)} 
                                                    className="text-center mx-auto"
                                                    style={{ width: '80px' }}
                                                />
                                            </td>
                                            <td style={CartStyles.actionCell}>
                                                <Button variant="outline-danger" size="sm" onClick={() => deleteBorrowItem(c.id)}>
                                                    <i className="fa-solid fa-trash-can"></i>
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>

                            <Alert variant="success" style={CartStyles.summaryAlert}>
                                <div style={CartStyles.summaryText}>Tổng số lượng mượn: {cBorrow?.totalQuantity || 0}</div>
                            </Alert>
                            <div className="text-end">
                                <Button onClick={payBorrow} variant="success" style={CartStyles.confirmButton}>
                                    Xác nhận Mượn
                                </Button>
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    );
}

export default Cart;