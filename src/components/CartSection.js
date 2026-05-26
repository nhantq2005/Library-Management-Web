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

    return (
        <div className={isBuy ? "" : "mt-5"}>
            <h3 style={isBuy ? CartStyles.sectionTitleBuy : CartStyles.sectionTitleBorrow}>
                <i className={`fa-solid ${isBuy ? 'fa-cart-arrow-down' : 'fa-book-open-reader'} me-2`}></i>
                {isBuy ? 'Sách Chọn Mua' : 'Sách Chọn Mượn'}
            </h3>
            
            {!items || items.length === 0 ? (
                <Alert variant="light" className="border">
                    KHÔNG có sản phẩm trong giỏ {isBuy ? 'mua' : 'mượn'}!
                </Alert>
            ) : (
                <>
                    <div className="shadow-sm mb-3" style={{ maxHeight: '400px', overflowY: 'auto', borderRadius: '8px', border: '1px solid #dee2e6' }}>
                        <Table striped bordered hover responsive className="mb-0">
                            <thead style={{ ...CartStyles.tableHeader, position: 'sticky', top: 0, zIndex: 1, backgroundColor: '#f8f9fa' }}>
                                <tr>
                                    <th>Id</th>
                                    <th>Tên sản phẩm</th>
                                    <th>Đơn giá</th>
                                    <th className="text-center">Số lượng</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map(c => (
                                    <tr key={`${type}-${c.id}`}>
                                        <td style={CartStyles.verticalMiddle} className="text-center">{c.id}</td>
                                        <td style={CartStyles.verticalMiddle} className="fw-semibold">{c.title || c.name}</td>
                                        
                                        <td style={CartStyles.verticalMiddle} className={isBuy ? "text-danger fw-bold" : "text-success fw-bold"}>
                                            {isBuy ? `${c.price?.toLocaleString()} VNĐ` : 'Miễn phí'}
                                        </td>
                                        
                                        <td style={isBuy ? CartStyles.verticalMiddle : CartStyles.quantityCell} className="text-center">
                                            {isBuy ? (
                                                <>
                                                    <span className="fw-bold px-3 py-1 bg-light border rounded">1</span>
                                                    <div className="text-muted mt-1" style={{ fontSize: '12px' }}>(Chỉ mua 1 cuốn)</div>
                                                </>
                                            ) : (
                                                <Form.Control 
                                                    type="number" 
                                                    min="1" 
                                                    value={c.quantity} 
                                                    onChange={e => onUpdateQuantity(e, c.id)} 
                                                    className="text-center mx-auto"
                                                    style={{ width: '80px' }}
                                                />
                                            )}
                                        </td>

                                        <td style={CartStyles.actionCell}>
                                            <Button variant="outline-danger" size="sm" onClick={() => onDelete(c.id)}>
                                                <i className="fa-solid fa-trash-can"></i>
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>

                    <Alert variant={isBuy ? "danger" : "success"} style={CartStyles.summaryAlert}>
                        {isBuy ? (
                            <>
                                <div style={CartStyles.summaryText}>Tổng tiền: {(summary?.totalAmount || 0).toLocaleString()} VND</div>
                                <div style={CartStyles.summaryText}>Tổng số sách: {items.length} cuốn</div>
                            </>
                        ) : (
                            <div style={CartStyles.summaryText}>Tổng số lượng mượn: {summary?.totalQuantity || 0}</div>
                        )}
                    </Alert>
                    
                    <div className={`text-end ${!isBuy ? 'mb-5' : ''}`}>
                        <Button onClick={onCheckout} variant={isBuy ? "danger" : "success"} style={CartStyles.confirmButton}>
                            {isBuy ? 'Thanh toán Mua' : 'Xác nhận Mượn'}
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
};

export default CartSection;