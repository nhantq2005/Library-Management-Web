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

    // --- LUMINA DESIGN STYLES ---
    const thStyle = { padding: '12px 20px', fontSize: '0.75rem', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #E5E7EB', backgroundColor: '#FFFFFF' };
    const tdStyle = { padding: '16px 20px', fontSize: '0.875rem', color: '#111827', verticalAlign: 'middle' };
    const badgeStyle = { padding: '4px 8px', borderRadius: '2px', fontSize: '0.7rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'inline-block' };

    return (
        <div style={{ padding: '32px 40px', backgroundColor: '#F9FAFB', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '4px', padding: '24px' }}>
                
                {/* HEADER */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h3 className="mb-1" style={{ color: '#111827', fontWeight: '600', letterSpacing: '-0.02em', fontSize: '1.5rem' }}>
                            Quản lý tài liệu
                        </h3>
                        <p className="mb-0" style={{ fontSize: '0.875rem', color: '#4B5563' }}>
                            Xem, tìm kiếm và cập nhật danh mục kho tài liệu trong hệ thống.
                        </p>
                    </div>
                    
                    <Button 
                        variant="none" 
                        className="d-flex align-items-center gap-2"
                        style={{ 
                            backgroundColor: '#1D559F', 
                            color: '#FFFFFF',
                            padding: '10px 20px', 
                            borderRadius: '4px',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            border: 'none',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#154078'; }}
                        onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#1D559F'; }}
                        onClick={() => navigate('/librarian/add-document')}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Thêm tài liệu mới
                    </Button>
                </div>

                {/* KHU VỰC Ô TÌM KIẾM */}
                <InputGroup className="mb-4" style={{ maxWidth: '420px', borderRadius: '4px', overflow: 'hidden', border: '1px solid #E5E7EB' }}>
                    <InputGroup.Text 
                        className="border-0 px-3" 
                        style={{ backgroundColor: '#F9FAFB', color: '#9CA3AF', fontSize: '1rem' }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </InputGroup.Text>
                    <Form.Control
                        className="border-0 shadow-none ps-1 py-2"
                        style={{ 
                            backgroundColor: '#F9FAFB', 
                            fontSize: '0.875rem',
                            color: '#111827'
                        }}
                        placeholder="Tìm kiếm theo tên tài liệu..."
                        value={searchInput}
                        onChange={e => setSearchInput(e.target.value)}
                    />
                </InputGroup>

                {/* PHẦN BẢNG DỮ LIỆU */}
                {loading && page === 1 ? (
                    <div className="d-flex justify-content-center py-5">
                        <Spinner animation="border" style={{ color: '#1D559F' }} />
                    </div>
                ) : (
                    <div style={{ margin: '0 -24px' }}> {/* Kéo dãn viền bảng ra sát lề card */}
                        <Table hover responsive className="align-middle mb-0" style={{ borderTop: '1px solid #E5E7EB' }}>
                            <thead>
                                <tr>
                                    <th style={thStyle}>ID</th>
                                    <th style={thStyle}>Hình ảnh</th>
                                    <th style={thStyle}>Tên tài liệu</th>
                                    <th style={thStyle}>Tác giả</th>
                                    <th style={thStyle}>Danh mục</th>
                                    <th style={thStyle}>Giá (VNĐ)</th>
                                    <th style={thStyle}>Phân loại</th>
                                    <th style={{ ...thStyle, textAlign: 'center' }}>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {docs.length > 0 ? (
                                    docs.map((d) => (
                                        <tr key={d.id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                                            <td style={{ ...tdStyle, color: '#6B7280', fontWeight: '500' }}>#{d.id}</td>
                                            <td style={tdStyle}>
                                                <img
                                                    src={
                                                        d.image
                                                            ? (d.image.startsWith('http') ? d.image : `http://localhost:8080/eLibrary_war/uploads/${d.image}`)
                                                            : 'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%220%200%2040%2040%22%3E%3Crect%20fill%3D%22%23F3F4F6%22%20width%3D%2240%22%20height%3D%2240%22%2F%3E%3Ctext%20fill%3D%22%239CA3AF%22%20font-family%3D%22sans-serif%22%20font-size%3D%228%22%20dy%3D%223%22%20font-weight%3D%22bold%22%20x%3D%2250%25%22%20y%3D%2250%25%22%20text-anchor%3D%22middle%22%3ENo%20Img%3C%2Ftext%3E%3C%2Fsvg%3E'
                                                    }
                                                    alt={d.title}
                                                    style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #E5E7EB' }}
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%220%200%2040%2040%22%3E%3Crect%20fill%3D%22%23F3F4F6%22%20width%3D%2240%22%20height%3D%2240%22%2F%3E%3Ctext%20fill%3D%22%239CA3AF%22%20font-family%3D%22sans-serif%22%20font-size%3D%228%22%20dy%3D%223%22%20font-weight%3D%22bold%22%20x%3D%2250%25%22%20y%3D%2250%25%22%20text-anchor%3D%22middle%22%3ENo%20Img%3C%2Ftext%3E%3C%2Fsvg%3E';
                                                    }}
                                                />
                                            </td>
                                            <td style={{ ...tdStyle, fontWeight: '500', color: '#1D559F' }}>
                                                {d.title}
                                            </td>
                                            <td style={{ ...tdStyle, color: '#4B5563' }}>
                                                {d.authors && d.authors.length > 0
                                                    ? d.authors.map(author => author.name).join(', ')
                                                    : <span style={{ fontStyle: 'italic', color: '#9CA3AF' }}>Chưa cập nhật</span>}
                                            </td>
                                            <td style={tdStyle}>
                                                {d.category 
                                                    ? <span style={{ ...badgeStyle, backgroundColor: '#F3F4F6', color: '#4B5563' }}>{d.category.name}</span> 
                                                    : <span style={{ fontStyle: 'italic', color: '#9CA3AF', fontSize: '0.875rem' }}>Không có</span>}
                                            </td>
                                            <td style={tdStyle}>
                                                {d.price > 0 
                                                    ? <span style={{ fontWeight: '500', color: '#111827' }}>{d.price.toLocaleString('vi-VN')} đ</span> 
                                                    : <span style={{ fontWeight: '500', color: '#166534' }}>Miễn phí</span>}
                                            </td>
                                            <td style={tdStyle}>
                                                {d.isPremium ? (
                                                    <span style={{ ...badgeStyle, backgroundColor: '#FFEDD5', color: '#9A3412' }}>Có phí</span>
                                                ) : (
                                                    <span style={{ ...badgeStyle, backgroundColor: '#DBEAFE', color: '#1E40AF' }}>Miễn phí</span>
                                                )}
                                            </td>
                                            
                                            <td style={{ ...tdStyle, textAlign: 'center' }}>
                                                <div className="d-flex justify-content-center gap-2">
                                                    <EditButton onClick={() => navigate(`/librarian/edit-document/${d.id}`)} />
                                                    <DeleteButton onClick={() => deleteDocument(d.id)} />
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="text-center py-5 text-muted" style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                                            <div className="mb-2" style={{ fontSize: '1.5rem' }}>📭</div>
                                            Không tìm thấy dữ liệu tài liệu nào phù hợp.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </div>
                )}

                {/* NÚT TẢI THÊM */}
                {hasMore && docs.length > 0 && (
                    <div className="mt-4">
                        <LoadMoreButton
                            onClick={() => setPage(prev => prev + 1)}
                            isLoading={loading}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

export default ManageDocument;