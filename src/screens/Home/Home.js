import { useEffect, useState, useRef } from "react";
import { Alert, Card, Spinner, Container, Badge, Row } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";
import Apis, { endpoints } from "../../configs/Apis";
import moment from "moment";
import HomeStyles from "../../style/HomeStyles";
import LoadMoreButton from "../../components/LoadMoreButton";

const Home = () => {
    const [latestDocs, setLatestDocs] = useState([]);
    const [trendDocs, setTrendDocs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchDocs, setSearchDocs] = useState([]);
    const [searchPage, setSearchPage] = useState(1);
    const [hasMoreSearch, setHasMoreSearch] = useState(true);
    const [loadingMoreSearch, setLoadingMoreSearch] = useState(false);
    const [q] = useSearchParams();
    const kw = q.get("kw") || "";
    const cateId = q.get("cateId") || "";
    const isSearching = kw !== "" || cateId !== "";
    const nav = useNavigate();
    const latestScrollRef = useRef(null);
    const trendScrollRef = useRef(null);

    useEffect(() => {
        if (isSearching) {
            setSearchPage(1);
            setHasMoreSearch(true);
        }
    }, [kw, cateId, isSearching]);

    useEffect(() => {
        const fetchHomeData = async () => {
            try {
                if (isSearching) {
                    if (searchPage === 1) setLoading(true);
                    else setLoadingMoreSearch(true);

                    let url = `${endpoints['documents']}?page=${searchPage}`;
                    if (kw) url += `&kw=${kw}`;
                    if (cateId) url += `&cateId=${cateId}`;
                    
                    let res = await Apis.get(url);
                    
                    if (res.data.length < 20) {
                        setHasMoreSearch(false);
                    } else {
                        setHasMoreSearch(true);
                    }

                    if (searchPage === 1) {
                        setSearchDocs(res.data);
                    } else {
                        setSearchDocs(prev => [...prev, ...res.data]);
                    }
                } else {
                    setLoading(true);
                    const [resLatest, resTrend] = await Promise.all([
                        Apis.get(endpoints['latest-docs']),
                        Apis.get(endpoints['trend-docs'])
                    ]);
                    setLatestDocs(resLatest.data);
                    setTrendDocs(resTrend.data);
                }
            } catch (ex) {
                console.error("Lỗi load tài liệu:", ex);
            } finally {
                setLoading(false);
                setLoadingMoreSearch(false);
            }
        };

        fetchHomeData();
    }, [searchPage, kw, cateId, isSearching]); 

    useEffect(() => {
        const handleWheel = (e) => {
            if (e.deltaY !== 0) {
                e.preventDefault(); 
                e.currentTarget.scrollLeft += e.deltaY;
            }
        };

        const latestElem = latestScrollRef.current;
        const trendElem = trendScrollRef.current;

        if (latestElem) latestElem.addEventListener('wheel', handleWheel, { passive: false });
        if (trendElem) trendElem.addEventListener('wheel', handleWheel, { passive: false });

        return () => {
            if (latestElem) latestElem.removeEventListener('wheel', handleWheel);
            if (trendElem) trendElem.removeEventListener('wheel', handleWheel);
        };
    }, [latestDocs, trendDocs, isSearching]); 

    const renderDocumentCard = (doc, isGrid = false) => (
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
                        {doc.authorSet?.map(a => a.name).join(', ') || 'Đang cập nhật'}
                    </Card.Text>

                    <div style={HomeStyles.statsContainer}>
                        <span style={HomeStyles.statText}>
                            <i className="fa-regular fa-eye me-1"></i>{doc.viewCount || 0}
                        </span>
                        {doc.quantity > 0 ? (
                            <span style={{...HomeStyles.statText, color: '#10b981', fontWeight: '700'}}>
                                Còn: {doc.quantity}
                            </span>
                        ) : (
                            <span style={{...HomeStyles.statText, color: '#ef4444', fontWeight: '700'}}>
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

    return (
        <Container style={HomeStyles.container}>
            {loading && searchPage === 1 ? (
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
                    <Spinner animation="grow" variant="primary" />
                </div>
            ) : isSearching ? (
                
                <div className="mb-5">
                    <h3 style={HomeStyles.headerTitle} className="mb-4 text-primary">
                        <i className="fa-solid fa-magnifying-glass me-2"></i>
                        Kết quả tìm kiếm ({searchDocs.length} tài liệu)
                    </h3>
                    
                    {searchDocs.length === 0 ? (
                        <Alert variant="light" className="text-center border">Không tìm thấy tài liệu phù hợp!</Alert>
                    ) : (
                        <>
                            <Row>
                                {searchDocs.map(doc => renderDocumentCard(doc, true))}
                            </Row>
                            
                            {hasMoreSearch && (
                                <LoadMoreButton 
                                    onClick={() => setSearchPage(prev => prev + 1)} 
                                    isLoading={loadingMoreSearch} 
                                />
                            )}
                        </>
                    )}
                </div>

            ) : (
                <>
                    <div className="mb-5">
                        <h3 style={HomeStyles.headerTitle} className="mb-4">
                            Sách mới nhất <span style={{ color: '#ef4444' }}></span>
                        </h3>
                        {latestDocs.length === 0 ? (
                            <Alert variant="light" className="text-center border">Chưa có dữ liệu sách mới.</Alert>
                        ) : (
                            <div ref={latestScrollRef} className="hide-scrollbar" style={HomeStyles.scrollContainer}>
                                {latestDocs.map(doc => renderDocumentCard(doc))}
                            </div>
                        )}
                    </div>

                    <div className="mb-5">
                        <h3 style={HomeStyles.headerTitle} className="mb-4">
                            Sách ưa thích nhất <span style={{ color: '#10b981' }}></span>
                        </h3>
                        {trendDocs.length === 0 ? (
                            <Alert variant="light" className="text-center border">Chưa có dữ liệu sách ưa thích.</Alert>
                        ) : (
                            <div ref={trendScrollRef} className="hide-scrollbar" style={HomeStyles.scrollContainer}>
                                {trendDocs.map(doc => renderDocumentCard(doc))}
                            </div>
                        )}
                    </div>
                </>
            )}
        </Container>
    );
};

export default Home;