
import React from 'react';
import { Alert, Button, Form, Table } from "react-bootstrap";
import CartStyles from "../style/CartStyles";


const CartSection = ({
    type,
    items,
    summary,
    onDelete,
    onUpdateQuantity,
    onCheckout
}) => {
    const isBuy = type === 'buy';

    // Style constants
    const cardStyle = {
        background: '#fff',
        borderRadius: 10,
        boxShadow: '0 4px 24px 0 rgba(0,0,0,0.07)',
        border: '1.5px solid #e5e7eb',
        padding: '32px 28px',
        marginBottom: 32,
        maxWidth: 900,
        marginLeft: 'auto',
        marginRight: 'auto',
    };
    const thStyle = {
        color: '#374151',
        fontWeight: 700,
        fontSize: '1rem',
        background: '#f3f4f6',
        borderBottom: '2px solid #e5e7eb',
        letterSpacing: '-0.01em',
        verticalAlign: 'middle',
    };
    const tdStyle = {
        background: '#fff',
        fontSize: '0.98rem',
        verticalAlign: 'middle',
        padding: '12px 8px',
        borderBottom: '1px solid #e5e7eb',
    };
    const qtyInputStyle = {
        width: 70,
        textAlign: 'center',
        borderRadius: 6,
        border: '1px solid #e5e7eb',
        fontWeight: 600,
        fontSize: '0.95rem',
        background: '#f9fafb',
        color: '#1d559f',
        margin: '0 auto',
    };
    const summaryText = {
        fontSize: '1.05rem',
        fontWeight: 500,
        color: isBuy ? '#dc2626' : '#1d559f',
        marginBottom: 2,
    };
    const confirmBtnStyle = {
        backgroundColor: isBuy ? '#dc2626' : '#1d559f',
        color: '#fff',
        border: 'none',
        borderRadius: 6,
        padding: '10px 28px',
        fontWeight: 600,
        fontSize: '1rem',
        boxShadow: '0 2px 8px 0 rgba(31,41,55,0.07)',
        marginTop: 8,
    };

    return (
        <div style={{ padding: '32px 40px', backgroundColor: '#F9FAFB', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                <div style={cardStyle}>
                    <h4 style={{ color: '#111827', fontWeight: 700, letterSpacing: '-0.02em', fontSize: '1.25rem', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 10 }}>
                        <i className={`fa-solid ${isBuy ? 'fa-cart-arrow-down' : 'fa-book-open-reader'}`}></i>
                        {isBuy ? 'Sách Chọn Mua' : 'Sách Chọn Mượn'}
                    </h4>
                    {!items || items.length === 0 ? (
                        <div style={{ backgroundColor: '#F9FAFB', border: '1.5px dashed #D1D5DB', color: '#6B7280', padding: '32px', textAlign: 'center', borderRadius: '6px', fontSize: '0.98rem', marginBottom: 0 }}>
                            Không có tài liệu nào trong giỏ {isBuy ? 'mua' : 'mượn'}!
                        </div>
                    ) : (
                        <>
                            <div style={{ margin: '0 -24px', overflowX: 'auto' }}>
                                <Table hover responsive className="align-middle mb-0" style={{ borderTop: '1px solid #E5E7EB', minWidth: 600 }}>
                                    <thead>
                                        <tr>
                                            <th style={{ ...thStyle, width: '10%' }}>ID</th>
                                            <th style={{ ...thStyle, width: '40%' }}>Tên sản phẩm</th>
                                            <th style={{ ...thStyle, width: '20%' }}>Đơn giá</th>
                                            <th style={{ ...thStyle, width: '20%', textAlign: 'center' }}>Số lượng</th>
                                            <th style={{ ...thStyle, width: '10%', textAlign: 'center' }}></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {items.map(c => (
                                            <tr key={`${type}-${c.id}`}>
                                                <td style={{ ...tdStyle, color: '#6B7280', fontWeight: 500, textAlign: 'center' }}>#{c.id}</td>
                                                <td style={{ ...tdStyle, fontWeight: 500, color: '#1D559F' }}>{c.title || c.name}</td>
                                                <td style={{ ...tdStyle, fontWeight: 600, color: isBuy ? '#dc2626' : '#059669' }}>
                                                    {isBuy ? `${c.price?.toLocaleString()} VNĐ` : 'Miễn phí'}
                                                </td>
                                                <td style={{ ...tdStyle, textAlign: 'center' }}>
                                                    {isBuy ? (
                                                        <>
                                                            <span style={{ backgroundColor: '#F3F4F6', color: '#374151', padding: '4px 12px', borderRadius: '4px', fontWeight: 600, fontSize: '0.98rem' }}>1</span>
                                                            <div style={{ fontSize: '0.7rem', color: '#9CA3AF', marginTop: '4px' }}>(Chỉ mua 1 cuốn)</div>
                                                        </>
                                                    ) : (
                                                        <Form.Control
                                                            type="number"
                                                            min="1"
                                                            value={c.quantity}
                                                            onChange={e => onUpdateQuantity(e, c.id)}
                                                            className="mx-auto"
                                                            style={qtyInputStyle}
                                                        />
                                                    )}
                                                </td>
                                                <td style={{ ...tdStyle, textAlign: 'center' }}>
                                                    <Button variant="none" onClick={() => onDelete(c.id)} style={{ color: '#DC2626', backgroundColor: '#FEE2E2', padding: '6px 10px', borderRadius: '4px', border: 'none' }}>
                                                        <i className="fa-solid fa-trash-can"></i>
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                            <div className="d-flex justify-content-between align-items-center mt-4 pt-4" style={{ borderTop: '1px solid #E5E7EB' }}>
                                <div>
                                    {isBuy ? (
                                        <>
                                            <div style={{ color: '#4B5563', fontSize: '0.98rem', marginBottom: '4px' }}>Tổng số sách: <strong style={{ color: '#111827' }}>{items.length}</strong> cuốn</div>
                                            <div style={summaryText}>
                                                Tổng tiền: <span style={{ color: '#DC2626', fontSize: '1.15rem' }}>{(summary?.totalAmount || 0).toLocaleString()} VNĐ</span>
                                            </div>
                                        </>
                                    ) : (
                                        <div style={summaryText}>
                                            Tổng số lượng mượn: <span style={{ color: '#1D559F', fontSize: '1.15rem' }}>{summary?.totalQuantity || 0}</span> cuốn
                                        </div>
                                    )}
                                </div>
                                <Button
                                    onClick={onCheckout}
                                    style={confirmBtnStyle}
                                >
                                    {isBuy ? 'Thanh toán Mua' : 'Xác nhận Mượn'}
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CartSection;