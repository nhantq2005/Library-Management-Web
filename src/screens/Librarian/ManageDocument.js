import { useEffect, useState } from "react";
import Apis, { authApi, endpoints } from "../../configs/Apis";
import { Table, Spinner, Button, Form, InputGroup } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";
import { MdDeleteOutline } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import LoadMoreButton from "../../components/LoadMoreButton";
import EditButton from "../../components/EditButton";
import DeleteButton from "../../components/DeleteButton";

const ManageDocument = () => {
    const [docs, setDocs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [query, setSearchParams] = useSearchParams();
    const kwParam = query.get("kw") || "";
    const [searchInput, setSearchInput] = useState(kwParam);
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            if (kwParam !== searchInput.trim()) {
                setPage(1); 
                setHasMore(true);
                setSearchParams(prev => {
                    const params = new URLSearchParams(prev);
                    if (searchInput.trim()) {
                        params.set("kw", searchInput.trim());
                    } else {
                        params.delete("kw");
                    }
                    return params;
                });
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [searchInput, kwParam, setSearchParams]);

    useEffect(() => {
        const loadDocuments = async () => {
            try {
                if (page === 1) setLoading(true);

                let url = `${endpoints['documents']}?page=${page}`;
                if (kwParam) {
                    url += `&kw=${kwParam}`;
                }

                let res = await Apis.get(url);
                
                if (res.data.length === 0) {
                    setHasMore(false);
                } else {
                    setHasMore(true);
                }

                if (page === 1) {
                    setDocs(res.data);
                } else {
                    setDocs(prev => [...prev, ...res.data]);
                }
            } catch (ex) {
                console.error("Lỗi khi tải tài liệu:", ex);
            } finally {
                setLoading(false);
            }
        };

        loadDocuments();
    }, [page, kwParam]);

    // 3. XỬ LÝ XÓA TÀI LIỆU
    const deleteDocument = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa tài liệu này không?")) {
            try {
                const res = await authApi(localStorage.getItem("token")).delete(endpoints['delete-document'](id));
                setDocs(prevDocs => prevDocs.filter(doc => doc.id !== id));
                if (res.status === 204) {
                    alert("Xóa thành công!");
                }
            } catch (error) {
                console.error("Lỗi khi xóa tài liệu:", error);
                alert("Có lỗi xảy ra khi xóa tài liệu!");
            }
        }
    };

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
                        value={searchInput}
                        onChange={e => setSearchInput(e.target.value)}
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
                                    <th className="border-0 py-3">Loại</th>
                                    <th className="border-0 py-3 text-center" style={{ borderRadius: '0 8px 8px 0' }}>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {docs.length > 0 ? (
                                    docs.map((d) => (
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
                                                    <span className="badge rounded-pill px-3 py-1.5 fw-semibold" style={{ backgroundColor: '#fef08a', color: '#854d0e', fontSize: '0.8rem', border: '1px solid #fef08a' }}>Có phí</span>
                                                ) : (
                                                    <span className="badge rounded-pill bg-light text-muted border px-3 py-1.5 fw-medium" style={{ fontSize: '0.8rem' }}>Miễn phí</span>
                                                )}
                                            </td>
                                            
                                            {/* CỘT HÀNH ĐỘNG MỚI THÊM */}
                                            <td>
                                                <div className="d-flex justify-content-center gap-2">
                                                    <EditButton onClick={() => navigate(`/librarian/edit-document/${d.id}`)} />

                                                    <DeleteButton onClick={() => deleteDocument(d.id)} />
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="text-center py-5 text-muted">
                                            <div className="fs-4 mb-2">📭</div>
                                            Không tìm thấy dữ liệu tài liệu nào phù hợp.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>

                        {/* NÚT TẢI THÊM */}
                        {hasMore && docs.length > 0 && (
                            <LoadMoreButton
                                onClick={() => setPage(prev => prev + 1)}
                                isLoading={loading}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default ManageDocument;
                                        