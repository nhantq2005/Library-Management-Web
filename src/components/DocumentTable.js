import React from 'react';
import moment from "moment";
import LoadMoreButton from './LoadMoreButton';
import MyDocumentsStyles from '../style/MyDocumentsStyles';

const DocumentTable = ({ 
    docs, 
    type, 
    emptyMessage, 
    loading, 
    page, 
    onLoadMore, 
    onRowClick 
}) => {
    if (docs.length === 0 && !loading) {
        return <div className="text-center py-4 text-muted">{emptyMessage}</div>;
    }

    return (
        <>
            <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                    <tr>
                        <th scope="col" style={MyDocumentsStyles.colStt}>STT</th>
                        <th scope="col" style={MyDocumentsStyles.colCover}>Ảnh bìa</th>
                        <th scope="col" style={MyDocumentsStyles.colTitleBorrow}>Tên tài liệu</th>
                        <th scope="col" style={MyDocumentsStyles.colAuthorBorrow}>Tác giả</th>
                        <th scope="col" style={MyDocumentsStyles.colQuantity}>Số lượng</th>
                        
                        {type === 'purchased' && (
                            <th scope="col" style={MyDocumentsStyles.colAmountBuy}>Tổng tiền</th>
                        )}
                        
                        <th scope="col" style={MyDocumentsStyles.colTime}>Thời gian</th>
                    </tr>
                </thead>
                <tbody>
                    {docs.map((item, index) => (
                        <tr key={item.id || index} onClick={() => onRowClick(item)} style={MyDocumentsStyles.tableRow} title="Bấm để xem chi tiết">
                            <td className="fw-bold text-muted">{index + 1}</td>
                            <td>
                                <img
                                    src={item.image || item.document?.image}
                                    alt="cover"
                                    style={MyDocumentsStyles.bookCover}
                                />
                            </td>
                            <td className="fw-semibold text-primary">
                                {item.documentTitle || item.document?.title || item.title || "Tài liệu không tên"}
                            </td>
                            <td className="text-muted small">
                                {item.authorNames || item.document?.authorSet?.map(a => a.name).join(', ') || 'Đang cập nhật'}
                            </td>
                            <td>
                                <span className="badge bg-primary px-3 py-2 rounded-pill">
                                    {item.quantity} cuốn
                                </span>
                            </td>
                            
                            {type === 'purchased' && (
                                <td className="text-danger fw-bold">
                                    {item.amount ? `${item.amount.toLocaleString('vi-VN')} đ` : "Miễn phí"}
                                </td>
                            )}

                            <td className="text-muted fw-semibold small" style={{ minWidth: 130, maxWidth: 180 }}>
                                <span className="text-success"><i className="fa-regular fa-clock me-1"></i>
                                    {item.rawDate ? moment(item.rawDate).fromNow() : "---"}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="d-flex justify-content-center mt-3">
                {page > 0 && (
                    <LoadMoreButton 
                        onClick={onLoadMore} 
                        isLoading={loading} 
                    />
                )}
            </div>
        </>
    );
};

export default DocumentTable;