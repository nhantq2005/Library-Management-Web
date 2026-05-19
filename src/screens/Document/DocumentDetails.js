import { useEffect, useState, useContext } from "react";
import { Badge, Button, Col, Container, Image, Row, Spinner } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import cookies from 'react-cookies';
import Apis, { endpoints } from "../../configs/Apis";
import moment from "moment";
import { MyUserContext } from "../../configs/Context";

const DocumentDetails = () => {
    const { documentId } = useParams(); 
    const [doc, setDoc] = useState(null);
    const [loading, setLoading] = useState(false);
    const nav = useNavigate();

    const [user] = useContext(MyUserContext);

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
        }

        initLoad();
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [documentId, user]); 

    if (loading) return <div className="text-center mt-5"><Spinner animation="border" variant="primary" /></div>;
    
    if (doc === null) return <h3 className="text-center mt-5 text-danger">Không tìm thấy thông tin tài liệu!</h3>;

    return (
        <Container className="mt-4 mb-5">
            <Button variant="link" className="mb-3 text-decoration-none text-dark px-0" onClick={() => nav(-1)}>
                &larr; Quay lại danh sách
            </Button>

            <Row className="bg-white p-4 shadow-sm" style={{ borderRadius: '10px' }}>
                <Col md={4} className="text-center mb-4 mb-md-0">
                    <Image 
                        src={doc.image || 'https://via.placeholder.com/400x600?text=No+Cover'} 
                        fluid 
                        rounded 
                        className="shadow"
                        style={{ maxHeight: '500px', objectFit: 'cover' }}
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
                    <div className="mb-4" style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
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
                        <p className="text-justify" style={{ whiteSpace: 'pre-line' }}>
                            {doc.description || 'Chưa có mô tả cho tài liệu này.'}
                        </p>
                    </div>
                    <div className="d-flex gap-3 mt-4">
                        <Button 
                            variant="primary" 
                            size="lg" 
                            className="px-5 fw-bold"
                            disabled={doc.quantity <= 0} 
                        >
                            {doc.quantity > 0 ? 'Mượn' : 'Tạm hết sách'}
                        </Button>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default DocumentDetails;