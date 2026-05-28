import React, { useState } from 'react';
import { Modal, Form, Button, Spinner, Table, Image } from 'react-bootstrap';
import Apis, { endpoints } from '../configs/Apis';

const CompareModal = ({ show, onHide, currentDoc, currentReviews }) => {
    const [searchCompareKw, setSearchCompareKw] = useState("");
    const [compareResults, setCompareResults] = useState([]);
    const [docToCompare, setDocToCompare] = useState(null);
    const [searchingCompare, setSearchingCompare] = useState(false);
    const [compareReviews, setCompareReviews] = useState([]);

    const currentReviewCount = currentReviews?.length || 0;
    const currentAvg = currentReviewCount > 0 
        ? (currentReviews.reduce((sum, r) => sum + r.rating, 0) / currentReviewCount).toFixed(1) 
        : 0;

    const compareReviewCount = compareReviews?.length || 0;
    const compareAvg = compareReviewCount > 0 
        ? (compareReviews.reduce((sum, r) => sum + r.rating, 0) / compareReviewCount).toFixed(1) 
        : 0;

    const searchDocumentToCompare = async (e) => {
        e.preventDefault();
        if (!searchCompareKw.trim()) return;

        try {
            setSearchingCompare(true);
            let res = await Apis.get(`${endpoints['documents']}?kw=${searchCompareKw}`);
            let filteredDocs = res.data.filter(d => d.id !== currentDoc.id);
            setCompareResults(filteredDocs);
        } catch (error) {
            console.error("Lỗi tìm kiếm sách so sánh:", error);
        } finally {
            setSearchingCompare(false);
        }
    };

    const handleSelectDocToCompare = async (docId) => {
        try {
            setSearchingCompare(true);
            let resDoc = await Apis.get(endpoints['document-details'](docId));
            setDocToCompare(resDoc.data); 
            
            try {
                let resRev = await Apis.get(endpoints['reviews'](docId));
                setCompareReviews(resRev.data || []);
            } catch (revError) {
                console.error("Sách chưa có review hoặc lỗi tải review");
                setCompareReviews([]);
            }

        } catch (error) {
            console.error("Lỗi tải chi tiết sách để so sánh:", error);
            alert("Không thể tải thông tin chi tiết của tài liệu này!");
        } finally {
            setSearchingCompare(false);
        }
    };

    const handleClose = () => {
        setSearchCompareKw("");
        setCompareResults([]);
        setDocToCompare(null);
        setCompareReviews([]);
        onHide();
    };

    return (
        <Modal show={show} onHide={handleClose} size="xl" centered backdrop="static">
            <Modal.Header closeButton style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB', padding: '20px 32px' }}>
                <Modal.Title style={{ fontSize: '1.25rem', fontWeight: '700', color: '#111827' }}>
                    <i className="fa-solid fa-code-compare text-primary me-2"></i> So sánh tài liệu
                </Modal.Title>
            </Modal.Header>

            <Modal.Body style={{ padding: '32px' }}>
                {!docToCompare && (
                    <div className="mx-auto" style={{ maxWidth: '700px' }}>
                        <div className="text-center mb-4">
                            <h5 style={{ color: '#4B5563', fontWeight: '600' }}>Tìm kiếm tài liệu để so sánh</h5>
                            <p className="text-muted" style={{ fontSize: '0.875rem' }}>Nhập tên sách bạn muốn so sánh với "{currentDoc.title}"</p>
                        </div>

                        <Form onSubmit={searchDocumentToCompare} className="d-flex align-items-stretch gap-2 w-100">
                            <Form.Control
                                type="text"
                                placeholder="Nhập tên tài liệu bạn muốn so sánh..."
                                value={searchCompareKw}
                                onChange={e => setSearchCompareKw(e.target.value)}
                                className="bg-light flex-grow-1" 
                                style={{ boxShadow: 'none', padding: '12px 16px', fontSize: '1rem' }}
                            />
                            <Button 
                                type="submit" 
                                variant="primary" 
                                className="px-4 d-flex align-items-center justify-content-center"
                                style={{ fontWeight: '500', whiteSpace: 'nowrap' }} 
                                disabled={searchingCompare}
                            >
                                {searchingCompare ? <Spinner size="sm" className="me-2" /> : null} 
                                Tìm kiếm
                            </Button>
                        </Form>

                        {compareResults.length > 0 && (
                            <div className="mt-4 shadow-sm" style={{ maxHeight: '350px', overflowY: 'auto', border: '1px solid #E5E7EB', borderRadius: '8px' }}>
                                <Table hover className="mb-0 align-middle">
                                    <thead style={{ backgroundColor: '#F9FAFB', position: 'sticky', top: 0, zIndex: 1 }}>
                                        <tr>
                                            <th colSpan="3" style={{ padding: '12px 24px', fontSize: '0.75rem', color: '#6B7280', textTransform: 'uppercase', borderBottom: '1px solid #E5E7EB' }}>
                                                Kết quả tìm kiếm ({compareResults.length})
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {compareResults.map(item => (
                                            <tr key={item.id} style={{ cursor: 'pointer' }} onClick={() => handleSelectDocToCompare(item.id)}>
                                                <td style={{ width: '80px', padding: '12px 24px' }}>
                                                    <Image src={item.image} style={{ width: '45px', height: '65px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #E5E7EB' }} />
                                                </td>
                                                <td>
                                                    <div className="fw-semibold" style={{ color: '#111827', fontSize: '1rem' }}>{item.title}</div>
                                                    <div className="text-muted" style={{ fontSize: '0.875rem', marginTop: '4px' }}>Danh mục: {item.category?.name || 'Chưa phân loại'}</div>
                                                </td>
                                                <td className="text-end" style={{ paddingRight: '24px' }}>
                                                    <span style={{ backgroundColor: '#EFF6FF', color: '#1D559F', padding: '6px 12px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '600' }}>
                                                        Chọn so sánh &rarr;
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        )}
                    </div>
                )}

                {docToCompare && (
                    <div>
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h5 style={{ color: '#111827', fontWeight: '600', margin: 0 }}>Bảng đối chiếu thông tin</h5>
                            <Button variant="outline-secondary" size="sm" onClick={() => setDocToCompare(null)} style={{ borderRadius: '4px', fontWeight: '500' }}>
                                <i className="fa-solid fa-arrow-rotate-left me-2"></i> Chọn sách khác
                            </Button>
                        </div>
                        
                        <div style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                            <Table bordered style={{ margin: 0, tableLayout: 'fixed', borderColor: '#E5E7EB' }}>
                                <thead>
                                    <tr>
                                        <th style={{ width: '20%', backgroundColor: '#F9FAFB', color: '#6B7280', fontSize: '0.875rem', textTransform: 'uppercase', padding: '16px', verticalAlign: 'middle' }}>Tiêu chí</th>
                                        <th style={{ width: '40%', backgroundColor: '#F0FDF4', fontSize: '1.1rem', color: '#166534', textAlign: 'center', padding: '16px' }}>
                                            <div style={{ fontSize: '0.75rem', fontWeight: '600', color: '#22C55E', textTransform: 'uppercase', marginBottom: '4px' }}>Đang xem</div>
                                            {currentDoc.title}
                                        </th>
                                        <th style={{ width: '40%', backgroundColor: '#EFF6FF', fontSize: '1.1rem', color: '#1D559F', textAlign: 'center', padding: '16px' }}>
                                            <div style={{ fontSize: '0.75rem', fontWeight: '600', color: '#3B82F6', textTransform: 'uppercase', marginBottom: '4px' }}>Đối chiếu</div>
                                            {docToCompare.title}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="fw-semibold text-muted align-middle" style={{ padding: '16px' }}>Ảnh bìa</td>
                                        <td className="text-center" style={{ padding: '24px 16px' }}><Image src={currentDoc.image} style={{ height: '180px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #E5E7EB' }} /></td>
                                        <td className="text-center" style={{ padding: '24px 16px' }}><Image src={docToCompare.image} style={{ height: '180px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #E5E7EB' }} /></td>
                                    </tr>
                                    <tr>
                                        <td className="fw-semibold text-muted" style={{ padding: '16px' }}>Danh mục</td>
                                        <td style={{ padding: '16px', color: '#111827' }}>{currentDoc.category?.name || '---'}</td>
                                        <td style={{ padding: '16px', color: '#111827' }}>{docToCompare.category?.name || '---'}</td>
                                    </tr>
                                    <tr>
                                        <td className="fw-semibold text-muted" style={{ padding: '16px' }}>Tác giả</td>
                                        <td style={{ padding: '16px', color: '#111827' }}>{currentDoc.authors && currentDoc.authors.length > 0 ? currentDoc.authors.map(a => a.name).join(', ') : '---'}</td>
                                        <td style={{ padding: '16px', color: '#111827' }}>{docToCompare.authors && docToCompare.authors.length > 0 ? docToCompare.authors.map(a => a.name).join(', ') : '---'}</td>
                                    </tr>
                                    <tr>
                                        <td className="fw-semibold text-muted" style={{ padding: '16px' }}>Năm xuất bản</td>
                                        <td style={{ padding: '16px', color: '#111827' }}>{currentDoc.publishYear || '---'}</td>
                                        <td style={{ padding: '16px', color: '#111827' }}>{docToCompare.publishYear || '---'}</td>
                                    </tr>

                                    <tr>
                                        <td className="fw-semibold text-muted" style={{ padding: '16px' }}>Lượt xem</td>
                                        <td style={{ padding: '16px', color: '#111827' }}>
                                            <i className="fa-regular fa-eye me-2 text-muted"></i>{currentDoc.viewCount || 0} lượt
                                        </td>
                                        <td style={{ padding: '16px', color: '#111827' }}>
                                            <i className="fa-regular fa-eye me-2 text-muted"></i>{docToCompare.viewCount || 0} lượt
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="fw-semibold text-muted" style={{ padding: '16px' }}>Đánh giá</td>
                                        <td className="fw-bold" style={{ padding: '16px', color: '#111827' }}>
                                            <span className="text-warning me-1"><i className="fa-solid fa-star"></i></span>
                                            {currentAvg > 0 ? `${currentAvg} / 5 (${currentReviewCount} lượt)` : <span className="text-muted fw-normal">Chưa có</span>}
                                        </td>
                                        <td className="fw-bold" style={{ padding: '16px', color: '#111827' }}>
                                            <span className="text-warning me-1"><i className="fa-solid fa-star"></i></span>
                                            {compareAvg > 0 ? `${compareAvg} / 5 (${compareReviewCount} lượt)` : <span className="text-muted fw-normal">Chưa có</span>}
                                        </td>
                                    </tr>

                                    <tr>
                                        <td className="fw-semibold text-muted align-middle" style={{ padding: '16px' }}>Đơn giá</td>
                                        <td className="fw-bold text-danger text-center" style={{ padding: '16px', fontSize: '1.1rem' }}>{currentDoc.price ? `${currentDoc.price.toLocaleString()} VNĐ` : 'Miễn phí'}</td>
                                        <td className="fw-bold text-danger text-center" style={{ padding: '16px', fontSize: '1.1rem' }}>{docToCompare.price ? `${docToCompare.price.toLocaleString()} VNĐ` : 'Miễn phí'}</td>
                                    </tr>
                                    <tr>
                                        <td className="fw-semibold text-muted align-middle" style={{ padding: '16px' }}>Tình trạng kho</td>
                                        <td className="text-center" style={{ padding: '16px' }}>{currentDoc.quantity > 0 ? <span className="badge bg-success px-3 py-2">{currentDoc.quantity} cuốn</span> : <span className="badge bg-danger px-3 py-2">Hết hàng</span>}</td>
                                        <td className="text-center" style={{ padding: '16px' }}>{docToCompare.quantity > 0 ? <span className="badge bg-success px-3 py-2">{docToCompare.quantity} cuốn</span> : <span className="badge bg-danger px-3 py-2">Hết hàng</span>}</td>
                                    </tr>
                                </tbody>
                            </Table>
                        </div>
                    </div>
                )}
            </Modal.Body>
        </Modal>
    );
};

export default CompareModal;