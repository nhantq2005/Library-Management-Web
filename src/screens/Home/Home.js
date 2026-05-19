// import { Card, Container, Navbar, Nav, Button } from 'react-bootstrap';
// import { FaBookOpen } from 'react-icons/fa';
// import { Link, useNavigate } from 'react-router-dom';

// const Home = () => {
//     const nav = useNavigate();
//     return (
//         <div style={{ minHeight: '80vh', background: 'linear-gradient(135deg, #f8fafc 60%, #e3eafc 100%)' }}>
//             <Navbar bg="light" expand="lg" className="shadow-sm">
//                 <Container>
//                     <Navbar.Brand href="#home" className="fw-bold" style={{ color: '#1c4c96' }}>
//                         <FaBookOpen size={28} className="me-2 mb-1" />eLibrary
//                     </Navbar.Brand>
//                     <Navbar.Toggle aria-controls="basic-navbar-nav" />
//                     <Navbar.Collapse id="basic-navbar-nav">
//                         <Nav className="ms-auto">
//                             <Button variant="outline-primary" href="/login" className="me-2">Đăng nhập</Button>
//                             <Button variant="primary" href="/register" className="me-2">Đăng ký</Button>.
//                             <Link to="/home" className="nav-link" onClick={() => nav('/home')}>
//                                 Trang chủ
//                             </Link>
//                             <Button variant="danger" onClick={() => {
//                                 // Xóa token đăng nhập nếu có
//                                 if (window.localStorage) {
//                                     localStorage.removeItem('token');
//                                 }
//                                 if (window.sessionStorage) {
//                                     sessionStorage.removeItem('token');
//                                 }
//                                 document.cookie = 'token=; Max-Age=0; path=/;';
//                                 nav('/login');
//                             }}>Đăng xuất</Button>
//                         </Nav>
//                     </Navbar.Collapse>
//                 </Container>
//             </Navbar>
//             <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '75vh' }}>
//                 <Container>
//                     <Card className="shadow-lg mx-auto" style={{ maxWidth: 500, borderRadius: 16 }}>
//                         <Card.Body className="text-center p-5">
//                             <div className="mb-3">
//                                 <FaBookOpen size={48} color="#1c4c96" />
//                             </div>
//                             <h1 className="fw-bold mb-3" style={{ color: '#003366', letterSpacing: 1 }}>Trang chủ Thư viện</h1>
//                             <p className="text-muted mb-0" style={{ fontSize: '1.15rem' }}>
//                                 Chào mừng bạn đến với hệ thống thư viện trực tuyến eLibrary.<br />Khám phá, quản lý và truy cập tài liệu dễ dàng, mọi lúc mọi nơi.
//                             </p>
//                         </Card.Body>
//                     </Card>
//                 </Container>
//             </div>
//         </div>
//     );
// };

// export default Home;

import { useEffect, useState } from "react";
import { Alert, Button, Card, Col, Row, Spinner, Container, Badge } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";
import Apis, { endpoints } from "../../configs/Apis";
import moment from "moment";

const Home = () => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [q] = useSearchParams(); // Đọc ?cateId, ?kw, ?type
    const nav = useNavigate();

    const loadDocuments = async () => {
        try {
            setLoading(true);

            let url = `${endpoints['documents']}?page=${page}`;

            const type = q.get("type");
            const cateId = q.get("cateId");
            const kw = q.get("kw");

            if (type === "latest") url = `${endpoints['latest-docs']}?page=${page}`;
            else if (type === "trend") url = `${endpoints['trend-docs']}?page=${page}`;
            else {
                if (cateId) url += `&cateId=${cateId}`;
                if (kw) url += `&kw=${kw}`;
            }

            let res = await Apis.get(url);
            
            if (res.data.length < 20)
                setPage(0);
            
            if (page === 1)
                setDocuments(res.data);
            else 
                setDocuments([...documents, ...res.data]);
                
        } catch (ex) {
            console.error("Lỗi load tài liệu:", ex);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        setPage(1);
    }, [q]);

    useEffect(() => {
        if (page > 0) loadDocuments();
    }, [q, page]);

    const loadMore = () => {
        setPage(page + 1);
    }

    return (
        <Container className="mt-4">
            <h3 className="text-primary mb-4 fw-bold">Danh mục tài liệu</h3>
            
            {documents.length === 0 && !loading && (
                <Alert variant="info" className="text-center">Không tìm thấy tài liệu phù hợp!</Alert>
            )}
            
            <Row>
                {documents.map(doc => (
                    <Col xs={12} sm={6} md={4} lg={3} key={doc.id} className="p-2">
                        <Card className="h-100 shadow-sm border-0 position-relative" style={{ borderRadius: '12px' }}>
                            <div className="position-absolute top-0 start-0 m-2" style={{ zIndex: 1 }}>
                                <Badge bg="primary">{doc.category?.name || "Tài liệu"}</Badge>
                            </div>
                            
                            <Card.Img variant="top" src={doc.image} style={{ height: '220px', objectFit: 'cover' }} />
                            
                            <Card.Body className="d-flex flex-column p-3">
                                <Card.Title className="fw-bold text-truncate" title={doc.title} style={{ fontSize: '1rem' }}>
                                    {doc.title}
                                </Card.Title>
                                
                                <Card.Text className="text-muted small mb-1">
                                    Tác giả: {doc.authorSet?.map(a => a.name).join(', ') || 'Đang cập nhật'}
                                </Card.Text>

                                <div className="d-flex justify-content-between small text-muted mb-2">
                                    <span>Lượt xem: {doc.viewCount || 0}</span>
                                    {doc.quantity > 0 ? (
                                        <span className="text-success fw-bold">Còn: {doc.quantity}</span>
                                    ) : (
                                        <span className="text-danger">Hết sách</span>
                                    )}
                                </div>

                                <div className="mt-auto">
                                    <div className="text-danger fw-bold mb-2">{doc.price?.toLocaleString()} VNĐ</div>
                                    <div className="small mb-2 italic">{moment(doc.createdDate).format('DD/MM/YYYY')}</div>
                                    
                                    <Button 
                                        variant="info" 
                                        className="w-100 text-white" 
                                        onClick={() => nav(`/documents/${doc.id}`)}
                                    >
                                        Xem chi tiết
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            <div className="text-center my-4 d-flex justify-content-center gap-2">
            {page > 0 && (
                <Button variant="success" onClick={loadMore}>
                    Xem thêm...
                </Button>
            )}
            {documents.length > 20 && (
                <Button 
                    variant="outline-secondary" 
                    onClick={() => {
                        setPage(1); 
                        // window.scrollTo({ top: 0, behavior: 'smooth' }); 
                    }}
                >
                    Ẩn bớt
                </Button>
            )}
        </div>  
            {loading && page === 1 && <div className="text-center my-5"><Spinner animation="border" /></div>}
        </Container>
    );
}

export default Home;