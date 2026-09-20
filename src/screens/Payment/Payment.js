import React, { useContext, useEffect, useState } from "react";
import PaymentStyle from '../../style/PaymentStyle';
import { Row, Col, Button, Form, Spinner, Alert } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import { MyUserContext, MyCartBuyContext } from '../../configs/Context';
import cookies from 'react-cookies';
import Apis, { authApi, endpoints } from '../../configs/Apis';

const Payment = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('VNPAY');
    const [user,] = useContext(MyUserContext);
    const [cartBuy,dispatchBuy] = useContext(MyCartBuyContext);
    let cartItems = [];
    if (user && user.id) {
        const cart = cookies.load(`cartBuy_${user.id}`) || {};
        cartItems = Object.values(cart);
    }

    const totalAmount = cartBuy?.totalAmount > 0
        ? cartBuy.totalAmount
        : cartItems.reduce((sum, item) => sum + (item.price || 0), 0);


    const handlePayment = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (totalAmount === 0) {
                const token = cookies.load('token');
                let cart = cookies.load(`cartBuy_${user.id}`) || null;

                if (cart && Object.keys(cart).length > 0) {
                    try {
                        let cartList = Object.values(cart).map(c => ({ id: c.id, quantity: 1 }));

                        let res = await authApi(token).post(endpoints['secure-buy'], cartList);

                        if (res.status === 201) {
                            console.log("Lưu lịch sử giao dịch thành công!");

                            cookies.remove(`cartBuy_${user.id}`, { path: '/' });

                            dispatchBuy({ "type": "UPDATE", "userId": user.id });
                            navigate('/payment-result?status=success');
                        }
                    } catch (ex) {
                        console.error("Lỗi khi lưu lịch sử giao dịch:", ex);
                    }
                }
                setLoading(false);
                return;
            }

            console.log("Khởi tạo thanh toán với số tiền:", totalAmount);

            const res = await Apis.post(endpoints['VNPAY-payment'], {
                amount: totalAmount.toString()
            });

            if (res.status === 200 && res.data && res.data.paymentUrl) {
                window.location.href = res.data.paymentUrl;
            } else {
                alert("Không thể khởi tạo thanh toán. Vui lòng thử lại!");
            }
        } catch (error) {
            console.error("Lỗi chi tiết:", error);
            if (error.response && error.response.data) {
                alert(`Lỗi từ server: ${error.response.data.message || 'Kiểm tra lại dữ liệu gửi lên'}`);
            } else {
                alert("Có lỗi xảy ra trong quá trình khởi tạo thanh toán.");
            }
        } finally {
            setLoading(false);
        }
    };

    const cardStyle = { backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '4px', padding: '24px' };
    const inputStyle = { backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '4px', padding: '10px 14px', fontSize: '0.875rem', color: '#111827', boxShadow: 'none', fontFamily: 'Inter, sans-serif' };
    const labelStyle = { fontSize: '0.75rem', fontWeight: '600', color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', fontFamily: 'Inter, sans-serif' };

    const methodBoxStyle = (method) => ({
        border: paymentMethod === method ? '1px solid #1D559F' : '1px solid #E5E7EB',
        backgroundColor: paymentMethod === method ? '#EFF6FF' : '#FFFFFF',
        borderRadius: '4px',
        padding: '16px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
    });

    return (
        <div style={PaymentStyle.pageWrapper}>
            <div style={PaymentStyle.container}>

                <div className="mb-4 d-flex justify-content-between align-items-center">
                    <div>
                        <h3 style={PaymentStyle.title}>
                            Thanh toán an toàn
                        </h3>
                        <p className="mb-0" style={PaymentStyle.subtitle}>
                            Vui lòng kiểm tra lại thông tin đơn hàng và chọn phương thức thanh toán.
                        </p>
                    </div>
                    <Button
                        variant="none"
                        onClick={() => navigate(-1)}
                        style={PaymentStyle.backBtn}
                    >
                        Quay lại giỏ hàng
                    </Button>
                </div>

                <Row className="g-4">
                    <Col lg={7}>
                        <div style={cardStyle} className="mb-4">
                            <h5 style={PaymentStyle.sectionTitle}>
                                1. Phương thức thanh toán
                            </h5>
                            <div className="d-flex flex-column gap-3">
                                <div
                                    style={methodBoxStyle('VNPAY')}
                                    onClick={() => setPaymentMethod('VNPAY')}
                                >
                                    <div style={PaymentStyle.methodBox(paymentMethod === "VNPAY")}></div>
                                    <div className="d-flex align-items-center justify-content-center" style={PaymentStyle.vnpayLogo}>
                                        VNPay
                                    </div>
                                    <div>
                                        <div style={PaymentStyle.methodTitle}>Thanh toán qua VNPAY</div>
                                        <div style={PaymentStyle.methodSubtitle}>Quét mã QR hoặc dùng thẻ ATM/Visa/MasterCard</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={cardStyle}>
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h5 style={PaymentStyle.sectionHeaderTitle}>
                                    2. Thông tin cá nhân
                                </h5>
                                <span style={PaymentStyle.editLink}>
                                    Chỉnh sửa hồ sơ
                                </span>
                            </div>
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label style={labelStyle}>Họ và tên</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={user?.name || ''}
                                        readOnly
                                        style={{...inputStyle, ...PaymentStyle.disabledInput}}
                                    />
                                </Form.Group>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label style={labelStyle}>Email</Form.Label>
                                            <Form.Control
                                                type="email"
                                                value={user?.email || ''}
                                                readOnly
                                                style={{...inputStyle, ...PaymentStyle.disabledInput}}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label style={labelStyle}>Vai trò</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={user?.role === "ROLE_STUDENT" ? "Sinh viên" : "Giảng viên"}
                                                readOnly
                                                style={{...inputStyle, ...PaymentStyle.disabledInput}}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Form>
                        </div>
                    </Col>

                    <Col lg={5}>
                        <div style={{...cardStyle, ...PaymentStyle.summaryCard}}>
                            <h5 style={PaymentStyle.sectionTitle}>
                                Tóm tắt đơn hàng
                            </h5>
                            <div className="d-flex flex-column gap-3 mb-4" style={PaymentStyle.itemList}>
                                {cartItems.map((item) => (
                                    <div key={item.id} className="d-flex justify-content-between align-items-start pb-3" style={PaymentStyle.itemRow}>
                                        <div>
                                            <div style={PaymentStyle.itemTitle}>{item.title}</div>
                                            <div style={PaymentStyle.itemQuantity}>Số lượng: 1</div>
                                        </div>
                                        <div style={PaymentStyle.itemPrice}>
                                            {item.price.toLocaleString('vi-VN')} đ
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <span style={PaymentStyle.summaryLabel}>Tạm tính</span>
                                <span style={PaymentStyle.summaryValue}>{totalAmount.toLocaleString('vi-VN')} đ</span>
                            </div>
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <span style={PaymentStyle.summaryLabel}>Giảm giá</span>
                                <span style={PaymentStyle.discountValue}>0 đ</span>
                            </div>

                            <div className="d-flex justify-content-between align-items-center pt-3 mb-4" style={PaymentStyle.totalSection}>
                                <span style={PaymentStyle.totalLabel}>Tổng cộng</span>
                                <div className="text-end">
                                    <div style={PaymentStyle.totalAmount}>
                                        {totalAmount.toLocaleString('vi-VN')} <span style={PaymentStyle.currency}>đ</span>
                                    </div>
                                    <div style={PaymentStyle.vatText}>(Đã bao gồm VAT nếu có)</div>
                                </div>
                            </div>

                            <Button
                                onClick={handlePayment}
                                disabled={loading || cartItems.length === 0}
                                style={{
                                    backgroundColor: '#1D559F',
                                    color: '#FFFFFF',
                                    border: 'none',
                                    borderRadius: '4px',
                                    padding: '14px',
                                    fontSize: '0.95rem',
                                    fontWeight: '600',
                                    width: '100%',
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#154078'; }}
                                onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#1D559F'; }}
                            >
                                {loading ? <Spinner size="sm" className="me-2" /> : null}
                                Xác nhận thanh toán
                            </Button>

                            <p className="text-center mt-3 mb-0" style={PaymentStyle.termsText}>
                                Bằng việc xác nhận thanh toán, bạn đồng ý với <a href="/" style={PaymentStyle.termsLink}>Điều khoản dịch vụ</a> của chúng tôi.
                            </p>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default Payment;