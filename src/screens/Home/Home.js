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
                        <Card style={HomeStyles.card}>

                            <div style={HomeStyles.badgeWrapper}>
                                <Badge bg="primary">{doc.category?.name || "Tài liệu"}</Badge>
                            </div>

                            <Card.Img variant="top" src={doc.image} style={HomeStyles.cardImage} />

                            <Card.Body style={HomeStyles.cardBody}>
                                <Card.Title title={doc.title} style={HomeStyles.cardTitle}>
                                    {doc.title}
                                </Card.Title>

                                <Card.Text style={HomeStyles.authorText}>
                                    Tác giả: {doc.authorSet?.map(a => a.name).join(', ') || 'Đang cập nhật'}
                                </Card.Text>

                                <div style={HomeStyles.statsContainer}>
                                    <span>Lượt xem: {doc.viewCount || 0}</span>
                                    {doc.quantity > 0 ? (
                                        <span className="text-success fw-bold">Còn: {doc.quantity}</span>
                                    ) : (
                                        <span className="text-danger">Hết sách</span>
                                    )}
                                </div>

                                <div className="mt-auto">
                                    <div style={HomeStyles.priceText}>
                                        {doc.price ? `${doc.price?.toLocaleString()} VNĐ` : 'Miễn phí'}
                                    </div>
                                    <div style={HomeStyles.dateText}>
                                        📅 {moment(doc.createdDate).format('DD/MM/YYYY')}
                                    </div>

                                    <div style={HomeStyles.actionContainer}>
                                        <div style={HomeStyles.buttonRow}>
                                            <Button
                                                variant="danger"
                                                className="w-50 fw-bold"
                                                disabled={doc.quantity <= 0}
                                                onClick={() => order(doc, 'BUY')}
                                            >
                                                Mua
                                            </Button>
                                            <Button
                                                variant="success"
                                                className="w-50 fw-bold"
                                                disabled={doc.quantity <= 0}
                                                onClick={() => order(doc, 'BORROW')}
                                            >
                                                Mượn
                                            </Button>
                                        </div>
                                        <Button
                                            variant="info"
                                            className="w-100 text-white fw-bold"
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