import { useEffect, useState, useContext } from "react";
import { Badge, Button, Col, Container, Image, Row, Spinner } from "react-bootstrap";
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
        }

        initLoad();

        // eslint-disable-next-line react-hooks/exhaustive-deps
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

    if (loading) return <div className="text-center mt-5"><Spinner animation="border" variant="primary" /></div>;

    if (doc === null) return <h3 className="text-center mt-5 text-danger">Không tìm thấy thông tin tài liệu!</h3>;

    return (
        <Container className="mt-4 mb-5">
            <Button variant="link" className="mb-3 text-decoration-none text-dark px-0" onClick={() => nav(-1)}>
                &larr; Quay lại danh sách
            </Button>

            <Row className="bg-white p-4 shadow-sm" style={DocumentDetailStyles.cardRow}>
                <Col md={4} className="text-center mb-4 mb-md-0">
                    <Image
                        src={doc.image || 'https://via.placeholder.com/400x600?text=No+Cover'}
                        fluid
                        rounded
                        className="shadow"
                        style={DocumentDetailStyles.bookCover}
                    />
                </Col>
                <Col md={8}>
                    <h2 className="fw-bold text-primary mb-3">{doc.title}</h2>

                    <div className="mb-3 d-flex flex-wrap gap-2">
                        <Badge bg="info" className="fs-6">Danh mục: {doc.category?.name || 'Chưa cập nhật'}</Badge>
                        <Badge bg="secondary" className="fs-6">Lượt xem: {doc.viewCount || 0}</Badge>

                        {doc.quantity > 0 ? (
                            <Badge bg="success" className="fs-6">Còn lại: {doc.quantity} cuốn</Badge>
                        ) : (
                            <Badge bg="danger" className="fs-6">Hết sách</Badge>
                        )}
                    </div>
                    <h3 className="text-danger fw-bold mb-4">
                        {doc.price ? `${doc.price.toLocaleString()} VNĐ` : 'Miễn phí'}
                    </h3>

                    <div className="mb-4" style={DocumentDetailStyles.infoSection}>
                        <Row>
                            <Col sm={4} className="fw-bold text-muted">Tác giả:</Col>
                            <Col sm={8}>
                                {doc.authors && doc.authors.length > 0
                                    ? doc.authors.map(a => a.name).join(', ')
                                    : 'Đang cập nhật'}
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={4} className="fw-bold text-muted">Năm xuất bản:</Col>
                            <Col sm={8}>{doc.publishYear || 'Đang cập nhật'}</Col>
                        </Row>
                        <Row>
                            <Col sm={4} className="fw-bold text-muted">Ngày đăng tải:</Col>
                            <Col sm={8}>
                                {doc.createdDate ? moment(doc.createdDate).format('DD/MM/YYYY HH:mm') : 'Đang cập nhật'}
                            </Col>
                        </Row>
                    </div>
                    <hr />

                    <div className="mb-4">
                        <h5 className="fw-bold">Mô tả tài liệu:</h5>
                        <p className="text-justify" style={DocumentDetailStyles.descriptionText}>
                            {doc.description || 'Chưa có mô tả cho tài liệu này.'}
                        </p>
                    </div>

                    <div className="d-flex flex-wrap gap-3 mt-4 align-items-center">
                        {checkingAccess ? (
                            <Button variant="secondary" size="lg" disabled className="px-4">
                                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                                Đang kiểm tra quyền...
                            </Button>
                        ) : (
                            <Button
                                variant={hasAccess ? "success" : "secondary"}
                                size="lg"
                                className="px-4 fw-bold text-white shadow-sm"
                                onClick={handleViewPdf}
                                style={DocumentDetailStyles.actionButton}
                            >
                                <i className={`fa-solid ${hasAccess ? 'fa-book-open-reader' : 'fa-lock'} me-2`}></i>
                                {hasAccess ? "Xem file PDF" : "Xem file PDF (Đã khóa)"}
                            </Button>
                        )}

                        {!hasAccess && !checkingAccess && (
                            <>
                                <div className="vr d-none d-md-block mx-2"></div>
                                <Button
                                    variant="danger"
                                    size="lg"
                                    className="px-4 fw-bold shadow-sm"
                                    disabled={doc.quantity <= 0}
                                    onClick={() => order(doc, 'BUY')}
                                >
                                    <i className="fa-solid fa-cart-arrow-down me-2"></i>Mua
                                </Button>
                                <Button
                                    variant="primary"
                                    size="lg"
                                    className="px-4 fw-bold shadow-sm"
                                    disabled={doc.quantity <= 0}
                                    onClick={() => order(doc, 'BORROW')}
                                >
                                    <i className="fa-solid fa-book-bookmark me-2"></i>Mượn
                                </Button>
                            </>
                        )}
                    </div>

                    {!hasAccess && !checkingAccess && (
                        <div className="mt-2 text-muted small fst-italic">
                            * Bạn cần thêm sách vào giỏ (Mượn/Mua) và Thanh toán để mở khóa tính năng này.
                        </div>
                    )}
                </Col>
            </Row>
        </Container>
    );
}

export default DocumentDetails;