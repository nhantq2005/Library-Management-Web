import React, { useEffect, useContext, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { MyCartBuyContext, MyUserContext } from '../../configs/Context';
import cookies from 'react-cookies';
import { authApi, endpoints } from '../../configs/Apis';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const PaymentResult = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    const [user,] = useContext(MyUserContext);
    const [, dispatchBuy] = useContext(MyCartBuyContext);
    const status = searchParams.get('status');

    // Dùng useRef để đánh dấu xem API đã được gọi chưa, tránh gọi 2 lần do StrictMode của React
    const hasProcessedRef = useRef(false);

    useEffect(() => {
        const processPayment = async () => {
            // Chỉ chạy luồng lưu data nếu status = success, có thông tin user và chưa từng xử lý
            if (status === 'success' && user?.id && !hasProcessedRef.current) {
                hasProcessedRef.current = true; // Đánh dấu là đã xử lý
                
                const token = cookies.load('token');
                let cart = cookies.load(`cartBuy_${user.id}`) || null;

                if (cart && Object.keys(cart).length > 0) {
                    try {
                        let cartList = Object.values(cart).map(c => ({ id: c.id, quantity: 1 }));
                        
                        // Gọi API lưu lịch sử mua hàng
                        let res = await authApi(token).post(endpoints['secure-buy'], cartList);
                        
                        if (res.status === 201 || res.status === 200) {
                            console.log("Lưu lịch sử giao dịch thành công!");
                            
                            // Xóa cookie giỏ hàng
                            cookies.remove(`cartBuy_${user.id}`, { path: '/' });
                            
                            // Cập nhật lại số lượng giỏ hàng trên UI (header)
                            dispatchBuy({ "type": "UPDATE", "userId": user.id });
                        }
                    } catch (ex) {
                        console.error("Lỗi khi lưu lịch sử giao dịch:", ex);
                    }
                }
            }
        };

        processPayment();
    }, [status, user, dispatchBuy]);

    // --- LUMINA DESIGN SYSTEM STYLES ---
    const containerStyle = {
        backgroundColor: '#F9FAFB',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Inter, sans-serif',
        padding: '24px'
    };

    const cardStyle = {
        backgroundColor: '#FFFFFF',
        border: '1px solid #E5E7EB',
        borderRadius: '4px',
        padding: '48px 40px',
        maxWidth: '480px',
        width: '100%',
        textAlign: 'center',
        boxShadow: 'none'
    };

    const iconWrapperStyle = (bgColor, color) => ({
        width: '72px',
        height: '72px',
        backgroundColor: bgColor,
        color: color,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 24px auto'
    });

    const titleStyle = { color: '#111827', fontWeight: '600', fontSize: '1.5rem', marginBottom: '16px', letterSpacing: '-0.02em' };
    const descStyle = { color: '#4B5563', fontSize: '0.875rem', lineHeight: '1.6', marginBottom: '32px' };

    return (
        <>
        <Header />
        <div style={containerStyle}>
            <div style={cardStyle}>
                
                {status === 'success' && (
                    <>
                        <div style={iconWrapperStyle('#DCFCE7', '#166534')}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 style={titleStyle}>Thanh toán thành công!</h3>
                        <p style={descStyle}>
                            Cảm ơn bạn đã mua tài liệu. Hệ thống đã ghi nhận lịch sử giao dịch và tài liệu đã được thêm vào kho lưu trữ cá nhân của bạn.
                        </p>
                    </>
                )}

                {status === 'failed' && (
                    <>
                        <div style={iconWrapperStyle('#FEE2E2', '#DC2626')}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h3 style={titleStyle}>Thanh toán thất bại</h3>
                        <p style={descStyle}>
                            Giao dịch của bạn đã bị hủy hoặc không thành công. Vui lòng kiểm tra lại tài khoản hoặc thử phương thức thanh toán khác.
                        </p>
                    </>
                )}

                {status === 'invalid_signature' && (
                    <>
                        <div style={iconWrapperStyle('#FEF08A', '#CA8A04')}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h3 style={titleStyle}>Lỗi bảo mật!</h3>
                        <p style={descStyle}>
                            Dữ liệu thanh toán không hợp lệ hoặc đã bị can thiệp. Hệ thống đã từ chối giao dịch này để đảm bảo an toàn.
                        </p>
                    </>
                )}

                <Button 
                    variant="none"
                    onClick={() => navigate('/')}
                    style={{
                        backgroundColor: '#1D559F',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '12px 24px',
                        fontWeight: '500',
                        fontSize: '0.875rem',
                        width: '100%',
                        transition: 'all 0.2s ease'
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#154078'; }}
                    onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#1D559F'; }}
                >
                    Trở về Trang Chủ
                </Button>

            </div>
        </div>
        <Footer />
        </>
    );
};

export default PaymentResult;