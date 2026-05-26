import { useContext, useEffect, useState } from "react";
import { Alert } from "react-bootstrap";
import cookies from 'react-cookies'
import { MyCartBuyContext, MyCartBorrowContext, MyUserContext } from "../../configs/Context"; 
import { Link } from "react-router-dom";
import { authApi, endpoints } from "../../configs/Apis";
import CartStyles from "../../style/CartStyles";
import CartSection from "../../components/CartSection";

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

    const payBorrow = async () => {
        const token = cookies.load('token');
        let cart = cookies.load(`cartBorrow_${user.id}`) || null;
        
        if (cart === null || Object.keys(cart).length === 0) return;
        
        if (window.confirm('Bạn chắc chắn muốn mượn những cuốn sách này?')) {
            try {
                let cartList = Object.values(cart).map(c => ({ id: c.id, quantity: c.quantity })); 
                let res = await authApi(token).post(endpoints['secure-borrows'], cartList);
                
                if (res.status === 201 || res.status === 200) {
                    alert("Mượn thành công!");
                    cookies.remove(`cartBorrow_${user.id}`, { path: '/' });
                    setCartBorrow(null);
                    dispatchBorrow({ "type": "UPDATE", "userId": user.id });
                }
            } catch (ex) {
                console.error("Lỗi:", ex);
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

            let updatedCart = {...cartBorrow, [productId]: { ...cartBorrow[productId], 'quantity': newQty }};
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

    const buyItems = cartBuy ? Object.values(cartBuy) : [];
    const borrowItems = cartBorrow ? Object.values(cartBorrow) : [];

    return (
        <div className="container" style={CartStyles.container}>
            <h1 style={CartStyles.pageTitle}>GIỎ HÀNG CỦA BẠN</h1>

            {user === null ? (
                <Alert variant="warning" style={CartStyles.loginAlert}>
                    Bạn cần <Link to="/login?next=/cart" style={CartStyles.loginLink}>đăng nhập</Link> để xem và xử lý giỏ hàng của mình!
                </Alert>
            ) : (
                <>
                    <CartSection 
                        type="buy"
                        items={buyItems}
                        summary={cBuy}
                        onDelete={deleteBuyItem}
                        onCheckout={payBuy}
                    />
                    <CartSection 
                        type="borrow"
                        items={borrowItems}
                        summary={cBorrow}
                        onDelete={deleteBorrowItem}
                        onUpdateQuantity={updateBorrowItem}
                        onCheckout={payBorrow}
                    />
                </>
            )}
        </div>
    );
}

export default Cart;