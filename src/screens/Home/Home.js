import { useEffect, useState, useRef } from "react";
import { Alert, Card, Spinner, Container, Badge, Row, Carousel } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";
import Apis, { endpoints } from "../../configs/Apis";
import moment from "moment";
import HomeStyles from "../../style/HomeStyles";
import LoadMoreButton from "../../components/LoadMoreButton";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import { FaBookOpen } from "react-icons/fa";

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

    // Danh sách các ảnh Banner (Bạn có thể thay link ảnh thực tế của thư viện vào đây)
    const banners = [
        "https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    ];

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
        <>
            <Header />
            <Container style={{ ...HomeStyles.container, paddingTop: '20px' }}>

                {/* BANNER SLIDER (Ẩn đi khi người dùng đang tìm kiếm sách) */}
                {!isSearching && (
                    <div className="mb-5" style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                        <Carousel interval={1000} slide={true}>
                            {banners.map((img, idx) => (
                                <Carousel.Item key={idx}>
                                    <img
                                        className="d-block w-100"
                                        src={img}
                                        alt={`Banner ${idx + 1}`}
                                        style={{ height: '360px', objectFit: 'cover' }}
                                    />
                                </Carousel.Item>
                            ))}
                        </Carousel>
                    </div>
                )}

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

                <div className="mb-5" style={{ background: '#F3F6FA', borderRadius: 12, padding: '32px 28px', boxShadow: '0 2px 12px rgba(26,85,159,0.04)', display: 'flex', alignItems: 'center', gap: 32 }}>
                    <FaBookOpen style={{ fontSize: '2rem', color: '#1D559F' }} size={150} />
                    <div>
                        <h2 style={{ color: '#1D559F', fontWeight: 800, fontSize: '2rem', marginBottom: 8, letterSpacing: '-0.02em' }}>eLibrary - Hệ thống quản lý thư viện hiện đại</h2>
                        <p style={{ color: '#374151', fontSize: '1.1rem', marginBottom: 0}}>
                            Chào mừng bạn đến với eLibrary! Chúng tôi cung cấp nền tảng quản lý tài liệu, sách và hỗ trợ mượn/trả hiện đại, thân thiện, bảo mật cao. Hệ thống giúp bạn dễ dàng tìm kiếm, lưu trữ, chia sẻ và quản lý tài liệu mọi lúc, mọi nơi. Đội ngũ thủ thư luôn sẵn sàng hỗ trợ bạn trực tuyến.
                        </p>
                    </div>
                </div>

            </Container>
            <Footer />
        </>
    );
};

export default Home;