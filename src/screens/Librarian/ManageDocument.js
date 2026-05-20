import { useEffect, useState } from "react";
import Apis, { endpoints } from "../../configs/Apis";
import { Table, Spinner, Button, Form, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const ManageDocument = () => {
    const [docs, setDocs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    
    // State để kiểm tra xem Backend còn dữ liệu để tải thêm không
    const [hasMore, setHasMore] = useState(true); 
    
    const navigate = useNavigate();

    const loadDocuments = async () => {
        try {
            // Chỉ hiện loading xoay xoay ở lần đầu tải trang, các lần bấm "Tải thêm" sẽ không bị giật lốm đốm
            if (page === 1) setLoading(true); 

            let res;
            if(page !== 1) {
                res = await Apis.get(`${endpoints['documents']}?page=${page}`);
                // Nếu trang tiếp theo không có dữ liệu (mảng rỗng), ẩn nút tải thêm
                if (res.data.length === 0) {
                    setHasMore(false);
                } else {
                    setDocs(prev => [...prev, ...res.data]); // Nối thêm dữ liệu
                }
            } else {
                res = await Apis.get(endpoints['documents']);
                setDocs(res.data);
                if (res.data.length === 0) setHasMore(false);
            }
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu Tài liệu:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadDocuments();
    }, [page]);

    // Lọc danh sách theo từ khóa tìm kiếm
    const filteredDocs = docs.filter(d => d.title.toLowerCase().includes(search.toLowerCase()));

    return (
        <div style={{ padding: '32px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
            <div className="bg-white p-4 rounded-4 shadow-sm border-0">
                
                {/* KHU VỰC HEADER & NÚT THÊM TÀI LIỆU */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h3 className="mb-1" style={{ color: '#0f172a', fontWeight: '700', letterSpacing: '-0.02em' }}>
                            Quản lý tài liệu
                        </h3>
                        <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
                            Xem, tìm kiếm và cập nhật danh mục kho tài liệu trong hệ thống
                        </p>
                    </div>
                    
                    <Button 
                        variant="none" 
                        className="text-white d-flex align-items-center gap-2 border-0 fw-semibold shadow-sm"
                        style={{ 
                            backgroundColor: '#4f46e5', 
                            padding: '10px 22px', 
                            borderRadius: '10px',
                            fontSize: '0.95rem',
                            transition: 'all 0.2s ease',
                            boxShadow: '0 4px 14px rgba(79, 70, 229, 0.35)'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = '#4338ca';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = '#4f46e5';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                        onClick={() => navigate('/librarian/add-document')}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Thêm tài liệu mới
                    </Button>
                </div>

                {/* KHU VỰC Ô TÌM KIẾM */}
                <InputGroup className="mb-4" style={{ maxWidth: '420px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                    <InputGroup.Text 
                        className="border-0 px-3" 
                        style={{ backgroundColor: '#fdfdfd', color: '#94a3b8', fontSize: '1.1rem' }}
                    >
                        🔍
                    </InputGroup.Text>
                    <Form.Control
                        className="border-0 shadow-none ps-1 py-2"
                        style={{ 
                            backgroundColor: '#fdfdfd', 
                            fontSize: '0.95rem',
                            color: '#334155'
                        }}
                        placeholder="Tìm kiếm theo tên tài liệu..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </InputGroup>

                {/* PHẦN BẢNG DỮ LIỆU */}
                {loading && page === 1 ? (
                    <div className="d-flex justify-content-center py-5">
                        <Spinner animation="border" variant="primary" />
                    </div>
                ) : (
                    <>
                        <Table hover responsive className="align-middle mb-0">
                            <thead style={{ backgroundColor: '#f8fafc', color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                <tr>
                                    <th className="border-0 py-3 px-3" style={{ borderRadius: '8px 0 0 8px' }}>ID</th>
                                    <th className="border-0 py-3">Hình ảnh</th>
                                    <th className="border-0 py-3">Tên tài liệu</th>
                                    <th className="border-0 py-3">Tác giả</th>
                                    <th className="border-0 py-3">Danh mục</th>
                                    <th className="border-0 py-3">Giá (VNĐ)</th>
                                    <th className="border-0 py-3" style={{ borderRadius: '0 8px 8px 0' }}>Loại</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Sử dụng filteredDocs để render tất cả dữ liệu (đã lọc theo tìm kiếm) */}
                                {filteredDocs && filteredDocs.length > 0 ? (
                                    filteredDocs.map((d) => (
                                        <tr key={d.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                            <td className="px-3 text-muted fw-semibold">{d.id}</td>
                                            <td>
                                                <img
                                                    src={
                                                        d.image
                                                            ? (d.image.startsWith('http') ? d.image : `http://localhost:8080/eLibrary_war/uploads/${d.image}`)
                                                            : 'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2250%22%20height%3D%2250%22%20viewBox%3D%220%200%2050%2050%22%3E%3Crect%20fill%3D%22%23f1f5f9%22%20width%3D%2250%22%20height%3D%2250%22%2F%3E%3Ctext%20fill%3D%22%2394a3b8%22%20font-family%3D%22sans-serif%22%20font-size%3D%2210%22%20dy%3D%223%22%20font-weight%3D%22bold%22%20x%3D%2250%25%22%20y%3D%2250%25%22%20text-anchor%3D%22middle%22%3ENo%20Img%3C%2Ftext%3E%3C%2Fsvg%3E'
                                                    }
                                                    alt={d.title}
                                                    style={{ width: '46px', height: '46px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2250%22%20height%3D%2250%22%20viewBox%3D%220%200%2050%2050%22%3E%3Crect%20fill%3D%22%23f1f5f9%22%20width%3D%2250%22%20height%3D%2250%22%2F%3E%3Ctext%20fill%3D%22%2394a3b8%22%20font-family%3D%22sans-serif%22%20font-size%3D%2210%22%20dy%3D%223%22%20font-weight%3D%22bold%22%20x%3D%2250%25%22%20y%3D%2250%25%22%20text-anchor%3D%22middle%22%3ENo%20Img%3C%2Ftext%3E%3C%2Fsvg%3E';
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                <span className="fw-semibold text-dark">{d.title}</span>
                                            </td>
                                            <td>
                                                {d.authors && d.authors.length > 0
                                                    ? <span className="text-secondary" style={{ fontSize: '0.9rem' }}>{d.authors.map(author => author.name).join(', ')}</span>
                                                    : <span className="text-black-50 fst-italic" style={{ fontSize: '0.9rem' }}>Chưa cập nhật</span>}
                                            </td>
                                            <td>
                                                {d.category 
                                                    ? <span className="badge bg-light text-secondary border fw-medium px-2.5 py-1.5" style={{ color: '#475569', fontSize: '0.8rem' }}>{d.category.name}</span> 
                                                    : <span className="text-black-50 fst-italic" style={{ fontSize: '0.9rem' }}>Không có</span>}
                                            </td>
                                            <td>
                                                {d.price > 0 
                                                    ? <span className="fw-semibold" style={{ color: '#334155', fontSize: '0.95rem' }}>{d.price.toLocaleString('vi-VN')} đ</span> 
                                                    : <span className="text-success fw-semibold" style={{ fontSize: '0.95rem' }}>Miễn phí</span>}
                                            </td>
                                            <td>
                                                {d.isPremium ? (
                                                    <span className="badge rounded-pill px-3 py-1.5 fw-semibold" style={{ backgroundColor: '#fef08a', color: '#854d0e', fontSize: '0.8rem', border: '1px solid #fef08a' }}>Premium</span>
                                                ) : (
                                                    <span className="badge rounded-pill bg-light text-muted border px-3 py-1.5 fw-medium" style={{ fontSize: '0.8rem' }}>Thường</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="text-center py-5 text-muted">
                                            <div className="fs-4 mb-2">📭</div>
                                            Không tìm thấy dữ liệu tài liệu nào phù hợp.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>

                        {/* NÚT TẢI THÊM: Chỉ hiện nếu vẫn còn dữ liệu từ Backend */}
                        {hasMore && filteredDocs.length > 0 && search === "" && (
                            <div className="d-flex justify-content-center mt-4">
                                <Button
                                    variant="none"
                                    className="fw-semibold px-4 py-2 shadow-sm"
                                    style={{
                                        color: '#4f46e5',
                                        border: '1px solid #e2e8f0',
                                        backgroundColor: '#ffffff',
                                        borderRadius: '10px',
                                        fontSize: '0.9rem',
                                        transition: 'all 0.2s ease',
                                    }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.backgroundColor = '#f8fafc';
                                        e.currentTarget.style.borderColor = '#4f46e5';
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.backgroundColor = '#ffffff';
                                        e.currentTarget.style.borderColor = '#e2e8f0';
                                    }}
                                    onClick={() => setPage(prev => prev + 1)} 
                                >
                                    Tải thêm trang tiếp theo...
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default ManageDocument;