import React, { useContext, useState } from 'react';
import { Row, Col, Form, Button, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { MyUserContext } from '../../configs/Context';

const Payment = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('VNPAY');
    const [user,]= useContext(MyUserContext);

    // MOCK DATA: Giả lập dữ liệu giỏ hàng. 
    // Thay thế bằng dữ liệu thật từ MyCartBuyContext của bạn nhé.
    const cartItems = [
        { id: 1, title: 'Lập trình Python nâng cao', price: 150000 },
        { id: 2, title: 'Thiết kế hệ thống phân tán', price: 250000 }
    ];
    const totalAmount = cartItems.reduce((sum, item) => sum + item.price, 0);

    const handlePayment = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Giả lập gọi API thanh toán
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Chuyển hướng đến cổng thanh toán hoặc trang thành công
            alert(`Đang chuyển hướng đến cổng thanh toán ${paymentMethod}...`);
        } catch (error) {
            console.error(error);
            alert("Có lỗi xảy ra trong quá trình khởi tạo thanh toán.");
        } finally {
            setLoading(false);
        }
    };

    // --- LUMINA DESIGN STYLES ---
    const cardStyle = { backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '4px', padding: '24px' };
    const inputStyle = { backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '4px', padding: '10px 14px', fontSize: '0.875rem', color: '#111827', boxShadow: 'none', fontFamily: 'Inter, sans-serif' };
    const labelStyle = { fontSize: '0.75rem', fontWeight: '600', color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', fontFamily: 'Inter, sans-serif' };
    
    // Style cho các ô chọn phương thức thanh toán
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
        <div style={{ padding: '32px 40px', backgroundColor: '#F9FAFB', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                
                {/* Header */}
                <div className="mb-4 d-flex justify-content-between align-items-center">
                    <div>
                        <h3 style={{ color: '#111827', fontWeight: '600', letterSpacing: '-0.02em', fontSize: '1.5rem', marginBottom: '4px' }}>
                            Thanh toán an toàn
                        </h3>
                        <p className="mb-0" style={{ fontSize: '0.875rem', color: '#4B5563' }}>
                            Vui lòng kiểm tra lại thông tin đơn hàng và chọn phương thức thanh toán.
                        </p>
                    </div>
                    <Button 
                        variant="none" 
                        onClick={() => navigate(-1)}
                        style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', color: '#4B5563', borderRadius: '4px', padding: '8px 16px', fontSize: '0.875rem', fontWeight: '500' }}
                    >
                        Quay lại giỏ hàng
                    </Button>
                </div>

                <Row className="g-4">
                    {/* CỘT TRÁI: Phương thức thanh toán */}
                    <Col lg={7}>
                        <div style={cardStyle} className="mb-4">
                            <h5 style={{ color: '#111827', fontWeight: '600', fontSize: '1.1rem', marginBottom: '24px' }}>
                                1. Phương thức thanh toán
                            </h5>
                            <div className="d-flex flex-column gap-3">
                                {/* Option VNPay */}
                                <div 
                                    style={methodBoxStyle('VNPAY')} 
                                    onClick={() => setPaymentMethod('VNPAY')}
                                >
                                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: paymentMethod === 'VNPAY' ? '5px solid #1D559F' : '1px solid #D1D5DB', backgroundColor: '#FFFFFF' }}></div>
                                    <div className="d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px', backgroundColor: '#FFFFFF', borderRadius: '4px', border: '1px solid #E5E7EB', fontWeight: 'bold', color: '#005BAA', fontSize: '0.7rem' }}>
                                        VNP
                                    </div>
                                    <div>
                                        <div style={{ color: '#111827', fontWeight: '600', fontSize: '0.9rem' }}>Thanh toán qua VNPAY</div>
                                        <div style={{ color: '#6B7280', fontSize: '0.8rem' }}>Quét mã QR hoặc dùng thẻ ATM/Visa/MasterCard</div>
                                    </div>
                                </div>

                                {/* Option Momo */}
                                {/* <div 
                                    style={methodBoxStyle('MOMO')} 
                                    onClick={() => setPaymentMethod('MOMO')}
                                >
                                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: paymentMethod === 'MOMO' ? '5px solid #1D559F' : '1px solid #D1D5DB', backgroundColor: '#FFFFFF' }}></div>
                                    <div className="d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px', backgroundColor: '#A50064', borderRadius: '4px', color: '#FFFFFF', fontSize: '0.7rem', fontWeight: 'bold' }}>
                                        MM
                                    </div>
                                    <div>
                                        <div style={{ color: '#111827', fontWeight: '600', fontSize: '0.9rem' }}>Ví điện tử MoMo</div>
                                        <div style={{ color: '#6B7280', fontSize: '0.8rem' }}>Thanh toán nhanh chóng qua ứng dụng MoMo</div>
                                    </div>
                                </div> */}
                            </div>
                        </div>

                        <div style={cardStyle}>
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h5 style={{ color: '#111827', fontWeight: '600', fontSize: '1.1rem', margin: 0 }}>
                                    2. Thông tin cá nhân
                                </h5>
                                <span style={{ fontSize: '0.75rem', color: '#1D559F', fontWeight: '600', cursor: 'pointer' }}>
                                    Chỉnh sửa hồ sơ
                                </span>
                            </div>
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label style={labelStyle}>Họ và tên</Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        value={user.name}
                                        readOnly 
                                        style={{ ...inputStyle, backgroundColor: '#F3F4F6', color: '#6B7280', cursor: 'not-allowed' }} 
                                    />
                                </Form.Group>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label style={labelStyle}>Email</Form.Label>
                                            <Form.Control 
                                                type="email" 
                                                value={user.email}
                                                readOnly 
                                                style={{ ...inputStyle, backgroundColor: '#F3F4F6', color: '#6B7280', cursor: 'not-allowed' }} 
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label style={labelStyle}>Vai trò</Form.Label>
                                            <Form.Control 
                                                type="text" 
                                                value={user.role === "ROLE_STUDENT" ? "Sinh viên" : "Giảng viên"} // Thay bằng {user.role === "ROLE_STU" ? "Sinh viên" : "Giảng viên"}
                                                readOnly 
                                                style={{ ...inputStyle, backgroundColor: '#F3F4F6', color: '#6B7280', cursor: 'not-allowed' }} 
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Form>
                        </div>
                    </Col>

                    <Col lg={5}>
                        <div style={{ ...cardStyle, position: 'sticky', top: '32px' }}>
                            <h5 style={{ color: '#111827', fontWeight: '600', fontSize: '1.1rem', marginBottom: '24px' }}>
                                Tóm tắt đơn hàng
                            </h5>
                            <div className="d-flex flex-column gap-3 mb-4" style={{ maxHeight: '300px', overflowY: 'auto', paddingRight: '4px' }}>
                                {cartItems.map((item) => (
                                    <div key={item.id} className="d-flex justify-content-between align-items-start pb-3" style={{ borderBottom: '1px solid #E5E7EB' }}>
                                        <div>
                                            <div style={{ color: '#1D559F', fontWeight: '500', fontSize: '0.875rem', marginBottom: '4px' }}>{item.title}</div>
                                            <div style={{ color: '#6B7280', fontSize: '0.75rem' }}>Số lượng: 1</div>
                                        </div>
                                        <div style={{ fontWeight: '600', color: '#111827', fontSize: '0.875rem', whiteSpace: 'nowrap', marginLeft: '12px' }}>
                                            {item.price.toLocaleString('vi-VN')} đ
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Tính tiền */}
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <span style={{ color: '#4B5563', fontSize: '0.875rem' }}>Tạm tính</span>
                                <span style={{ color: '#111827', fontWeight: '500', fontSize: '0.875rem' }}>{totalAmount.toLocaleString('vi-VN')} đ</span>
                            </div>
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <span style={{ color: '#4B5563', fontSize: '0.875rem' }}>Giảm giá</span>
                                <span style={{ color: '#059669', fontWeight: '500', fontSize: '0.875rem' }}>0 đ</span>
                            </div>

                            <div className="d-flex justify-content-between align-items-center pt-3 mb-4" style={{ borderTop: '1px dashed #D1D5DB' }}>
                                <span style={{ color: '#111827', fontWeight: '600', fontSize: '1rem' }}>Tổng cộng</span>
                                <div className="text-end">
                                    <div style={{ color: '#1D559F', fontWeight: '700', fontSize: '1.5rem' }}>
                                        {totalAmount.toLocaleString('vi-VN')} <span style={{ fontSize: '1rem', fontWeight: '600' }}>đ</span>
                                    </div>
                                    <div style={{ color: '#6B7280', fontSize: '0.7rem' }}>(Đã bao gồm VAT nếu có)</div>
                                </div>
                            </div>

                            {/* Nút thanh toán */}
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
                            
                            <p className="text-center mt-3 mb-0" style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                                Bằng việc xác nhận thanh toán, bạn đồng ý với <a href="/" style={{ color: '#1D559F', textDecoration: 'none' }}>Điều khoản dịch vụ</a> của chúng tôi.
                            </p>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default Payment;