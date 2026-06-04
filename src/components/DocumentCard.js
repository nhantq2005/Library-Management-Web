import moment from "moment";
import HomeStyles from "../style/HomeStyles";
import { Badge, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const DocumentCard = ({doc, isGrid = false}) => { 
    const nav = useNavigate();

    return (
        <div
            key={doc.id}
            style={isGrid ? { height: '100%' } : HomeStyles.cardWrapper}
            className={isGrid ? "col-12 col-sm-6 col-md-4 col-lg-3 mb-4" : ""}
        >
            <Card
                onClick={() => nav(`/documents/${doc.id}`)}
                style={HomeStyles.card}
                onMouseOver={e => {
                    e.currentTarget.style.transform = 'translateY(-6px)';
                    e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.08)';
                    e.currentTarget.style.borderColor = '#e2e8f0';
                }}
                onMouseOut={e => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = HomeStyles.card.boxShadow;
                    e.currentTarget.style.borderColor = HomeStyles.card.border.split(' ')[2];
                }}
            >
                <div style={HomeStyles.badgeWrapper}>
                    <Badge bg="primary" style={HomeStyles.badge}>
                        {doc.category?.name || "Tài liệu"}
                    </Badge>
                </div>

                <Card.Img
                    variant="top"
                    src={doc.image}
                    style={HomeStyles.cardImage}
                />

                <Card.Body style={HomeStyles.cardBody}>
                    <Card.Title title={doc.title} style={HomeStyles.cardTitle}>
                        {doc.title}
                    </Card.Title>

                    <Card.Text style={HomeStyles.authorText}>
                        <i className="fa-regular fa-pen-to-square me-1"></i>
                        {doc.authors?.map(a => a.name).join(', ') || 'Đang cập nhật'}
                    </Card.Text>

                    <div style={HomeStyles.statsContainer}>
                        <span style={HomeStyles.statText}>
                            <i className="fa-regular fa-eye me-1"></i>{doc.viewCount || 0}
                        </span>
                        {doc.quantity > 0 ? (
                            <span style={{ ...HomeStyles.statText, color: '#10b981', fontWeight: '700' }}>
                                Còn: {doc.quantity}
                            </span>
                        ) : (
                            <span style={{ ...HomeStyles.statText, color: '#ef4444', fontWeight: '700' }}>
                                Hết sách
                            </span>
                        )}
                    </div>

                    <div className="mt-auto">
                        <div style={{ ...HomeStyles.priceText, color: doc.price ? '#e11d48' : '#10b981' }}>
                            {doc.price ? `${doc.price?.toLocaleString()} đ` : 'Miễn phí'}
                        </div>
                        <div style={HomeStyles.dateText}>
                            <i className="fa-regular fa-clock me-1"></i>
                            {moment(doc.createdDate).format('DD/MM/YYYY')}
                        </div>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
}

export default DocumentCard;