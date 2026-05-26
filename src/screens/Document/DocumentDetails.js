import React, { useEffect, useState, useContext } from "react";
import { Button, Col, Container, Image, Row, Spinner, Form } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import cookies from 'react-cookies';
import Apis, { authApi, endpoints } from "../../configs/Apis";
import moment from "moment";
import { MyUserContext } from "../../configs/Context";
import useOrder from "../../components/useOrder";
import DocumentDetailStyles from "../../style/DocumentDetailStyles";

const DocumentDetails = () => {
    const { documentId } = useParams();
    const [doc, setDoc] = useState(null);
    const [loading, setLoading] = useState(false);
    const nav = useNavigate();
    const [user] = useContext(MyUserContext);
    const [hasAccess, setHasAccess] = useState(false);
    const [checkingAccess, setCheckingAccess] = useState(false);
    const order = useOrder();

    const [reviews, setReviews] = useState([]);
    const [reviewPage, setReviewPage] = useState(1);
    const [ratingInput, setRatingInput] = useState(5);
    const [commentInput, setCommentInput] = useState("");
    const [submittingReview, setSubmittingReview] = useState(false);
    const [loadingMoreReviews, setLoadingMoreReviews] = useState(false);
    const [hasMoreReviews, setHasMoreReviews] = useState(true);

    const loadDocumentDetail = async () => {
        try {
            setLoading(true);
            let res = await Apis.get(endpoints['document-details'](documentId));
            setDoc(res.data);
            
        } catch (error) {
            console.error("Lỗi tải chi tiết sách", error);
        } finally {
            setLoading(false);
        }
    }

    const loadReviews = async (page = 1, append = false) => {
        try {
            let url = endpoints['reviews'](documentId) + `?page=${page}`;
            const res = await Apis.get(url);
            if (append) {
                setReviews(prev => [...prev, ...res.data]);
            } else {
                setReviews(res.data);
            }
            if (!res.data || res.data.length < 5) setHasMoreReviews(false);
            else setHasMoreReviews(true);
        } catch (error) {
            console.error("Lỗi tải đánh giá", error);
        }
    }

    const loadMoreReviews = async () => {
        setLoadingMoreReviews(true);
        const nextPage = reviewPage + 1;
        await loadReviews(nextPage, true);
        setReviewPage(nextPage);
        setLoadingMoreReviews(false);
    }

    const addReview = async (e) => {
        e.preventDefault(); 
        
        if (!user) {
            alert("Bạn cần đăng nhập để thực hiện đánh giá!");
            return;
        }
        if (!commentInput.trim()) return;

        setSubmittingReview(true);
        
        try {
            const token = cookies.load('token');
            console.log("Gửi đánh giá mới:", { rating: ratingInput, comment: commentInput, token });
            await authApi(token).post(endpoints['add-review'](documentId), { 
                rating: ratingInput, 
                comment: commentInput 
            });
            setCommentInput("");
            setRatingInput(5);
            alert("Gửi nhận xét thành công!");
            loadReviews();
            
        } catch (error) {
            console.error("Lỗi gửi đánh giá:", error);
            alert("Không thể gửi đánh giá lúc này (Lỗi 403 hoặc server từ chối)!");
        } finally {
            setSubmittingReview(false);
        }
    }

    const checkAccess = async () => {
        if (!user) return;
        const token = cookies.load('token');
        if (!token) return;

        try {
            setCheckingAccess(true);
            let resBorrow = await authApi(token).get(endpoints['my-borrows'], { params: { userId: user.id } });
            let isBorrowed = resBorrow.data.some(item => item.documentId === parseInt(documentId));

            let resBuy = await authApi(token).get(endpoints['my-buys'], { params: { userId: user.id } });
            let isBought = resBuy.data.some(item => item.documentId === parseInt(documentId));

            setHasAccess(isBorrowed || isBought);
        } catch (error) {
            console.error("Lỗi kiểm tra quyền truy cập PDF:", error);
        } finally {
            setCheckingAccess(false);
        }
    };

    const increaseViewCount = async () => {
        try {
            await Apis.post(endpoints['increase-view'](documentId));
        } catch (error) {
            console.error("Lỗi khi cộng view", error);
        }
    }

    useEffect(() => {
        const initLoad = async () => {
            const cookieName = user
                ? `viewed_doc_${documentId}_user_${user.id}`
                : `viewed_doc_${documentId}_guest`;

            let viewed = cookies.load(cookieName);

            if (!viewed) {
                await increaseViewCount();
                const expires = new Date();
                expires.setDate(expires.getDate() + 1);
                cookies.save(cookieName, 'true', { path: '/', expires: expires });
            }

            loadDocumentDetail();
            checkAccess();
            setReviewPage(1);
            loadReviews(1, false);
        }

        initLoad();
    }, [documentId, user]);

    const handleViewPdf = () => {
        if (!user) {
            alert("Bạn cần đăng nhập để xem tài liệu này!");
            nav(`/login?next=/documents/${documentId}`);
            return;
        }

        if (hasAccess) {
            const pdfUrl = doc.fileUrl;
            if (pdfUrl) {
                window.open(pdfUrl, '_blank');
            } else {
                alert("Rất tiếc, tài liệu này hiện chưa được cập nhật file PDF trên hệ thống!");
            }
        } else {
            alert("Bạn cần phải MƯỢN hoặc MUA tài liệu này trước thì mới có thể xem nội dung (File PDF)!");
        }
    };
    const cardStyle = { backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '4px', padding: '32px' };
    const labelStyle = { fontSize: '0.75rem', fontWeight: '600', color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' };
    const inputStyle = { backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '4px', padding: '10px 14px', fontSize: '0.875rem', color: '#111827', boxShadow: 'none' };
    const badgeStyle = (bgColor, textColor) => ({ backgroundColor: bgColor, color: textColor, padding: '4px 10px', borderRadius: '2px', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.02em' });

    if (loading) return <div className="text-center py-5 mt-5"><Spinner animation="border" style={{ color: '#1D559F' }} /></div>;
    if (doc === null) return <h3 className="text-center mt-5" style={{ color: '#DC2626', fontWeight: '600' }}>Không tìm thấy thông tin tài liệu!</h3>;

    return (
        <div style={{ backgroundColor: '#F9FAFB', minHeight: '100vh', padding: '32px 40px', fontFamily: 'Inter, sans-serif' }}>
            <Container style={{ maxWidth: '1050px', padding: 0 }}>
                
                <Button variant="none" className="mb-3 d-flex align-items-center gap-2 px-0" onClick={() => nav(-1)} style={{ color: '#4B5563', fontSize: '0.875rem', fontWeight: '500' }}>
                    &larr; Quay lại danh sách
                </Button>

                <div style={cardStyle} className="mb-4">
                    <Row className="g-5">
                        <Col md={4} className="text-center">
                            <Image
                                src={doc.image || 'https://via.placeholder.com/400x600?text=No+Cover'}
                                fluid
                                style={{ borderRadius: '4px', border: '1px solid #E5E7EB', width: '100%', maxHeight: '420px', objectFit: 'cover' }}
                            />
                        </Col>
                        
                        <Col md={8} className="d-flex flex-column justify-content-between">
                            <div>
                                <h2 className="fw-bold mb-3" style={{ color: '#111827', fontSize: '1.75rem', letterSpacing: '-0.02em' }}>{doc.title}</h2>

                                <div className="mb-4 d-flex flex-wrap gap-2">
                                    <span style={badgeStyle('#EFF6FF', '#1D559F')}>Danh mục: {doc.category?.name || 'Chưa cập nhật'}</span>
                                    <span style={badgeStyle('#F3F4F6', '#4B5563')}>Lượt xem: {doc.viewCount || 0}</span>
                                    {doc.quantity > 0 ? (
                                        <span style={badgeStyle('#DCFCE7', '#166534')}>Còn lại: {doc.quantity} cuốn</span>
                                    ) : (
                                        <span style={badgeStyle('#FEE2E2', '#991B1B')}>Hết sách bản cứng</span>
                                    )}
                                </div>

                                <h3 className="fw-bold mb-4" style={{ color: '#DC2626', fontSize: '1.5rem' }}>
                                    {doc.price ? `${doc.price.toLocaleString('vi-VN')} VNĐ` : 'Miễn phí'}
                                </h3>

                                <div className="mb-4 d-flex flex-column gap-2" style={{ fontSize: '0.875rem' }}>
                                    <Row><Col sm={3} style={{ fontWeight: '600', color: '#6B7280' }}>TÁC GIẢ:</Col><Col sm={9} style={{ color: '#111827' }}>{doc.authors && doc.authors.length > 0 ? doc.authors.map(a => a.name).join(', ') : 'Đang cập nhật'}</Col></Row>
                                    <Row><Col sm={3} style={{ fontWeight: '600', color: '#6B7280' }}>NĂM XUẤT BẢN:</Col><Col sm={9} style={{ color: '#111827' }}>{doc.publishYear || 'Đang cập nhật'}</Col></Row>
                                    <Row><Col sm={3} style={{ fontWeight: '600', color: '#6B7280' }}>NGÀY ĐĂNG TẢI:</Col><Col sm={9} style={{ color: '#111827' }}>{doc.createdDate ? moment(doc.createdDate).format('DD/MM/YYYY HH:mm') : 'Đang cập nhật'}</Col></Row>
                                </div>

                                <hr style={{ borderColor: '#E5E7EB', opacity: 1 }} />

                                <div className="mb-4">
                                    <h6 className="fw-bold text-uppercase mb-2" style={{ fontSize: '0.75rem', color: '#6B7280', letterSpacing: '0.05em' }}>Mô tả tài liệu</h6>
                                    <p style={{ fontSize: '0.875rem', color: '#4B5563', lineHeight: '1.6', textAlign: 'justify', margin: 0 }}>
                                        {doc.description || 'Chưa có mô tả cho tài liệu này.'}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <div className="d-flex flex-wrap gap-3 align-items-center">
                                    {checkingAccess ? (
                                        <Button variant="none" disabled style={{ backgroundColor: '#F3F4F6', color: '#6B7280', borderRadius: '4px', fontSize: '0.875rem', padding: '10px 24px' }}>
                                            <Spinner as="span" animation="border" size="sm" className="me-2" /> Kiểm tra quyền...
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="none"
                                            onClick={handleViewPdf}
                                            style={{ backgroundColor: hasAccess ? '#059669' : '#6B7280', color: '#FFFFFF', borderRadius: '4px', padding: '10px 24px', fontSize: '0.875rem', fontWeight: '500', border: 'none' }}
                                        >
                                            {hasAccess ? "📄 Xem file PDF" : "🔒 Xem file PDF (Đã khóa)"}
                                        </Button>
                                    )}

                                    {!hasAccess && !checkingAccess && (
                                        <>
                                            <Button variant="none" disabled={doc.quantity <= 0} onClick={() => order(doc, 'BUY')} style={{ backgroundColor: '#DC2626', color: '#FFFFFF', borderRadius: '4px', padding: '10px 24px', fontSize: '0.875rem', fontWeight: '500', border: 'none' }}>
                                                🛒 Mua tài liệu
                                            </Button>
                                            <Button variant="none" disabled={doc.quantity <= 0} onClick={() => order(doc, 'BORROW')} style={{ backgroundColor: '#1D559F', color: '#FFFFFF', borderRadius: '4px', padding: '10px 24px', fontSize: '0.875rem', fontWeight: '500', border: 'none' }}>
                                                📖 Mượn đọc
                                            </Button>
                                        </>
                                    )}
                                </div>

                                {!hasAccess && !checkingAccess && (
                                    <div className="mt-3 text-muted" style={{ fontSize: '0.75rem', fontStyle: 'italic' }}>
                                        * Bạn cần thêm sách vào giỏ (Mượn/Mua) và hoàn tất thanh toán để mở khóa tính năng đọc trực tuyến (File PDF).
                                    </div>
                                )}
                            </div>
                        </Col>
                    </Row>
                </div>

                <div style={cardStyle}>
                    <h5 className="mb-4" style={{ color: '#111827', fontWeight: '600', fontSize: '1.1rem' }}>Đánh giá từ độc giả ({reviews.length})</h5>
                    <div className="p-4 mb-5" style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '4px' }}>
                        <h6 className="mb-3 fw-bold" style={{ fontSize: '0.875rem', color: '#111827' }}>Gửi nhận xét của bạn</h6>
                        <Form onSubmit={addReview}>
                            <Row className="align-items-center mb-3">
                                <Col xs="auto">
                                    <span style={labelStyle}>Chọn số sao:</span>
                                </Col>
                                <Col xs="auto">
                                    <Form.Select 
                                        value={ratingInput} 
                                        onChange={(e) => setRatingInput(parseInt(e.target.value))}
                                        style={{ ...inputStyle, width: '150px', padding: '6px 12px' }}
                                    >
                                        <option value="5">⭐⭐⭐⭐⭐</option>
                                        <option value="4">⭐⭐⭐⭐</option>
                                        <option value="3">⭐⭐⭐</option>
                                        <option value="2">⭐⭐</option>
                                        <option value="1">⭐</option>
                                    </Form.Select>
                                </Col>
                            </Row>
                            <Form.Group className="mb-3">
                                <Form.Label style={labelStyle}>Nội dung bình luận</Form.Label>
                                <Form.Control 
                                    as="textarea" 
                                    rows={3} 
                                    placeholder={user ? "Hãy chia sẻ cảm nghĩ của bạn về tài liệu này..." : "Bạn cần đăng nhập để viết bình luận..."}
                                    value={commentInput}
                                    onChange={(e) => setCommentInput(e.target.value)}
                                    disabled={!user}
                                    style={inputStyle}
                                    required
                                />
                            </Form.Group>
                            <div className="d-flex justify-content-end">
                                <Button 
                                    type="submit" 
                                    disabled={submittingReview || !user || !commentInput.trim()}
                                    style={{ backgroundColor: '#1D559F', color: '#FFFFFF', border: 'none', borderRadius: '4px', padding: '8px 20px', fontSize: '0.875rem', fontWeight: '500' }}
                                >
                                    {submittingReview ? <Spinner size="sm" className="me-2" /> : null}
                                    Gửi nhận xét
                                </Button>
                            </div>
                        </Form>
                    </div>
                    <div className="d-flex flex-column gap-4">
                        {reviews.map((rev) => (
                            <ReviewItem key={rev.id} review={rev} />
                        ))}
                        {reviews.length === 0 && (
                            <div className="text-center py-4 text-muted" style={{ fontSize: '0.875rem' }}>
                                Chưa có lượt đánh giá nào cho tài liệu này.
                            </div>
                        )}
                    </div>
                    {reviews.length > 0 && hasMoreReviews && (
                        <div className="text-center mt-4">
                            <Button
                                variant="outline-primary"
                                onClick={loadMoreReviews}
                                disabled={loadingMoreReviews}
                                style={{ minWidth: 180 }}
                            >
                                {loadingMoreReviews ? (
                                    <><Spinner as="span" animation="border" size="sm" className="me-2" />Đang tải...</>
                                ) : (
                                    'Tải thêm đánh giá'
                                )}
                            </Button>
                        </div>
                    )}
                </div>

            </Container>
        </div>
    );
}

export default DocumentDetails;