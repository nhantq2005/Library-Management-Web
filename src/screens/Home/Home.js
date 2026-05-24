import { useEffect, useState } from "react";
import { Alert, Button, Card, Col, Row, Spinner, Container, Badge } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";
import Apis, { endpoints } from "../../configs/Apis";
import moment from "moment";
import HomeStyles from "../../style/HomeStyles";
import useOrder from "../../hooks/useOrder";

const Home = () => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [q] = useSearchParams();
    const nav = useNavigate();
    const order = useOrder();
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [q, page]);

    const loadMore = () => {
        setPage(page + 1);
    }


    return (
        <Container style={HomeStyles.container}>
            <h3 style={HomeStyles.headerTitle}>Danh mục tài liệu</h3>

            {documents.length === 0 && !loading && (
                <Alert variant="info" className="text-center">Không tìm thấy tài liệu phù hợp!</Alert>
            )}

            <Row>
                {documents.map(doc => (
                    <Col xs={12} sm={6} md={4} lg={3} key={doc.id} className="p-2">
                        <Card
                            style={{
                                ...HomeStyles.card,
                                boxShadow: '0 4px 24px 0 rgba(80, 112, 255, 0.08)',
                                border: 'none',
                                borderRadius: 18,
                                transition: 'transform 0.18s cubic-bezier(.4,2,.3,.7), box-shadow 0.18s',
                                cursor: 'pointer',
                            }}
                            className="h-100 card-hover"
                            onMouseOver={e => {
                                e.currentTarget.style.transform = 'translateY(-4px) scale(1.03)';
                                e.currentTarget.style.boxShadow = '0 8px 32px 0 rgba(80, 112, 255, 0.16)';
                            }}
                            onMouseOut={e => {
                                e.currentTarget.style.transform = 'none';
                                e.currentTarget.style.boxShadow = '0 4px 24px 0 rgba(80, 112, 255, 0.08)';
                            }}
                        >
                            <div style={{
                                ...HomeStyles.badgeWrapper,
                                position: 'absolute',
                                top: 16,
                                left: 16,
                                zIndex: 2,
                            }}>
                                <Badge bg="primary" style={{ fontSize: 13, padding: '6px 14px', borderRadius: 12, boxShadow: '0 2px 8px rgba(80,112,255,0.10)' }}>
                                    {doc.category?.name || "Tài liệu"}
                                </Badge>
                            </div>

                            <Card.Img
                                variant="top"
                                src={doc.image}
                                style={{
                                    ...HomeStyles.cardImage,
                                    borderTopLeftRadius: 18,
                                    borderTopRightRadius: 18,
                                    height: 180,
                                    objectFit: 'cover',
                                    background: '#f3f6fa',
                                }}
                            />

                            <Card.Body style={{ ...HomeStyles.cardBody, display: 'flex', flexDirection: 'column', minHeight: 260 }}>
                                <Card.Title
                                    title={doc.title}
                                    style={{
                                        ...HomeStyles.cardTitle,
                                        fontWeight: 700,
                                        fontSize: 18,
                                        color: '#1e293b',
                                        marginBottom: 8,
                                        minHeight: 48,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    {doc.title}
                                </Card.Title>

                                <Card.Text style={{ ...HomeStyles.authorText, color: '#64748b', fontSize: 14, marginBottom: 8 }}>
                                    Tác giả: {doc.authorSet?.map(a => a.name).join(', ') || 'Đang cập nhật'}
                                </Card.Text>

                                <div style={{ ...HomeStyles.statsContainer, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                    <span style={{ fontSize: 13, color: '#475569' }}>👁️ {doc.viewCount || 0}</span>
                                    {doc.quantity > 0 ? (
                                        <span className="text-success fw-bold" style={{ fontSize: 13 }}>Còn: {doc.quantity}</span>
                                    ) : (
                                        <span className="text-danger" style={{ fontSize: 13 }}>Hết sách</span>
                                    )}
                                </div>

                                <div className="mt-auto" style={{ marginTop: 12 }}>
                                    <div style={{ ...HomeStyles.priceText, fontWeight: 700, fontSize: 16, color: doc.price ? '#e11d48' : '#10b981', marginBottom: 4 }}>
                                        {doc.price ? `${doc.price?.toLocaleString()} VNĐ` : 'Miễn phí'}
                                    </div>
                                    <div style={{ ...HomeStyles.dateText, fontSize: 13, color: '#64748b', marginBottom: 10 }}>
                                        <span role="img" aria-label="calendar">📅</span> {moment(doc.createdDate).format('DD/MM/YYYY')}
                                    </div>

                                    <div style={{ ...HomeStyles.actionContainer, display: 'flex', flexDirection: 'column', gap: 8 }}>
                                        <div style={{ ...HomeStyles.buttonRow, display: 'flex', gap: 8 }}>
                                            <Button
                                                variant="danger"
                                                className="fw-bold"
                                                style={{ width: '50%', borderRadius: 8, fontSize: 15, padding: '7px 0' }}
                                                disabled={doc.quantity <= 0}
                                                onClick={() => order(doc, 'BUY')}
                                            >
                                                Mua
                                            </Button>
                                            <Button
                                                variant="success"
                                                className="fw-bold"
                                                style={{ width: '50%', borderRadius: 8, fontSize: 15, padding: '7px 0' }}
                                                disabled={doc.quantity <= 0}
                                                onClick={() => order(doc, 'BORROW')}
                                            >
                                                Mượn
                                            </Button>
                                        </div>
                                        <Button
                                            variant="info"
                                            className="w-100 text-white fw-bold"
                                            style={{ borderRadius: 8, fontSize: 15, padding: '7px 0', background: 'linear-gradient(90deg,#06b6d4 0%,#4f46e5 100%)', border: 'none' }}
                                            onClick={() => nav(`/documents/${doc.id}`)}
                                        >
                                            Xem chi tiết
                                        </Button>
                                    </div>
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
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                    >
                        Ẩn bớt
                    </Button>
                )}
            </div>

            {loading && page === 1 && (
                <div style={HomeStyles.loadingContainer}>
                    <Spinner animation="border" variant="primary" />
                </div>
            )}
        </Container>
    );
};

export default Home;