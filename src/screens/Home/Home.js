import { useEffect, useState, useRef } from "react";
import { Alert, Spinner, Container, Row, Carousel } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";
import Apis, { endpoints } from "../../configs/Apis";
// import moment from "moment";
import HomeStyles from "../../style/HomeStyles";
import LoadMoreButton from "../../components/LoadMoreButton";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import { FaBookOpen } from "react-icons/fa";
import { MdAutorenew, MdFavoriteBorder } from "react-icons/md";
import DocumentCard from "../../components/DocumentCard";

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
    // const nav = useNavigate();
    const latestScrollRef = useRef(null);
    const trendScrollRef = useRef(null);

    const banners = [
        require("../../assets/banner_1.jpg"),
        require("../../assets/banner_2.jpg"),
        require("../../assets/banner_3.jpg"),
        require("../../assets/banner_4.jpg")
    ];

    useEffect(() => {
        if (isSearching) {
            setSearchPage(1);
            setHasMoreSearch(true);
        }
    }, [kw, cateId, isSearching]);

    const loadLatestDocs = async () => {
        try {
            setLoading(true);
            const res = await Apis.get(endpoints['latest-docs']);
            setLatestDocs(res.data);
        } catch (ex) {
            console.error("Lỗi load sách mới:", ex);
        } finally {
            setLoading(false);
        }
    };

    const loadTrendDocs = async () => {
        try {
            setLoading(true);
            const res = await Apis.get(endpoints['trend-docs']);
            setTrendDocs(res.data);
        } catch (ex) {
            console.error("Lỗi load sách ưa thích:", ex);
        } finally {
            setLoading(false);
        }
    };

    const loadHomeData = async () => {
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
                loadLatestDocs();
                loadTrendDocs();
            }
        } catch (ex) {
            console.error("Lỗi load tài liệu:", ex);
        } finally {
            setLoading(false);
            setLoadingMoreSearch(false);
        }
    };

    useEffect(() => {
        loadHomeData();
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

    return (
        <>
            <Header />
            <Container style={{ ...HomeStyles.container, paddingTop: '20px' }}>
                {!isSearching && (
                    <div className="mb-5" style={{ overflow: 'hidden' }}>
                        <Carousel interval={1000} slide={true}>
                            {banners.map((img, idx) => (
                                <Carousel.Item key={idx}>
                                    <img
                                        className="d-block w-100"
                                        src={img}
                                        alt={`Banner ${idx + 1}`}
                                        style={{
                                            height: '450px',
                                            // width: '100%',
                                            objectFit: 'cover',
                                            borderRadius: '16px',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                        }}
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
                                    {searchDocs.map(doc => <DocumentCard key={doc.id} doc={doc} isSearchResult={true} />)}
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
                                <MdAutorenew size={30} className="me-2" />
                                Sách mới nhất <span style={{ color: '#ef4444' }}></span>
                            </h3>
                            {latestDocs.length === 0 ? (
                                <Alert variant="light" className="text-center border">Chưa có dữ liệu sách mới.</Alert>
                            ) : (
                                <div ref={latestScrollRef} className="hide-scrollbar" style={HomeStyles.scrollContainer}>
                                    {latestDocs.map(doc => <DocumentCard key={doc.id} doc={doc} />)}
                                </div>
                            )}
                        </div>

                        <div className="mb-5">
                            <h3 style={HomeStyles.headerTitle} className="mb-4">
                                <MdFavoriteBorder size={30} className="me-2" />
                                Sách ưa thích nhất <span style={{ color: '#10b981' }}></span>
                            </h3>
                            {trendDocs.length === 0 ? (
                                <Alert variant="light" className="text-center border">Chưa có dữ liệu sách ưa thích.</Alert>
                            ) : (
                                <div ref={trendScrollRef} className="hide-scrollbar" style={HomeStyles.scrollContainer}>
                                    {trendDocs.map(doc => <DocumentCard key={doc.id} doc={doc} />)}
                                </div>
                            )}
                        </div>
                    </>
                )}

                <div className="mb-5" style={{ background: '#F3F6FA', borderRadius: 12, padding: '32px 28px', boxShadow: '0 2px 12px rgba(26,85,159,0.04)', display: 'flex', alignItems: 'center', gap: 32 }}>
                    <FaBookOpen style={{ fontSize: '2rem', color: '#1D559F' }} size={150} />
                    <div>
                        <h2 style={{ color: '#1D559F', fontWeight: 800, fontSize: '2rem', marginBottom: 8, letterSpacing: '-0.02em' }}>eLibrary - Hệ thống quản lý thư viện hiện đại</h2>
                        <p style={{ color: '#374151', fontSize: '1.1rem', marginBottom: 0 }}>
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