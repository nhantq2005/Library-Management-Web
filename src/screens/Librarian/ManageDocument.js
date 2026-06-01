import { useEffect, useState } from "react";
import Apis, { authApi, endpoints } from "../../configs/Apis";
import { Table, Spinner, Button, Form, InputGroup } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";
import LoadMoreButton from "../../components/LoadMoreButton";
import EditButton from "../../components/EditButton";
import DeleteButton from "../../components/DeleteButton";
import { manageDocumentStyle } from "../../style/ManageDocumentStyle";
import cookies from "react-cookies";
import { IoIosAdd, IoIosSearch } from "react-icons/io";

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

    const deleteDocument = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa tài liệu này không?")) {
            try {
                const res = await authApi(cookies.load("token")).delete(endpoints['delete-document'](id));
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
        <div style={manageDocumentStyle.pageWrapperStyle}>
            <div style={manageDocumentStyle.cardStyle}>
                
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h3 className="mb-1" style={manageDocumentStyle.titleStyle}>
                            Quản lý tài liệu
                        </h3>
                        <p className="mb-0" style={manageDocumentStyle.subtitleStyle}>
                            Xem, tìm kiếm và cập nhật danh mục kho tài liệu trong hệ thống.
                        </p>
                    </div>
                    
                    <Button 
                        variant="none" 
                        className="d-flex align-items-center gap-2"
                        style={manageDocumentStyle.addBtnStyle}
                        onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#154078'; }}
                        onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#1D559F'; }}
                        onClick={() => navigate('/librarian/add-document')}
                    >
                        <IoIosAdd size={22} />
                        Thêm tài liệu mới
                    </Button>
                </div>

                <InputGroup className="mb-4" style={manageDocumentStyle.searchGroupStyle}>
                    <InputGroup.Text 
                        className="border-0 px-3" 
                        style={manageDocumentStyle.searchIconStyle}
                    >
                        <IoIosSearch size={20} />
                    </InputGroup.Text>
                    <Form.Control
                        className="border-0 shadow-none ps-1 py-2"
                        style={manageDocumentStyle.searchInputStyle}
                        placeholder="Tìm kiếm theo tên tài liệu..."
                        value={searchInput}
                        onChange={e => setSearchInput(e.target.value)}
                    />
                </InputGroup>

                {loading && page === 1 ? (
                    <div className="d-flex justify-content-center py-5">
                        <Spinner animation="border" style={manageDocumentStyle.spinnerColor} />
                    </div>
                ) : (
                    <div style={manageDocumentStyle.tableContainerStyle}> 
                        <Table hover responsive className="align-middle mb-0" style={manageDocumentStyle.tableStyle}>
                            <thead>
                                <tr>
                                    <th style={manageDocumentStyle.thStyle}>ID</th>
                                    <th style={manageDocumentStyle.thStyle}>Hình ảnh</th>
                                    <th style={manageDocumentStyle.thStyle}>Tên tài liệu</th>
                                    <th style={manageDocumentStyle.thStyle}>Tác giả</th>
                                    <th style={manageDocumentStyle.thStyle}>Danh mục</th>
                                    <th style={manageDocumentStyle.thStyle}>Giá (VNĐ)</th>
                                    <th style={manageDocumentStyle.thStyle}>Phân loại</th>
                                    <th style={{ ...manageDocumentStyle.thStyle, textAlign: 'center' }}>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {docs.length > 0 ? (
                                    docs.map((d) => (
                                        <tr key={d.id} style={manageDocumentStyle.trStyle}>
                                            <td style={{ ...manageDocumentStyle.tdStyle, ...manageDocumentStyle.idColStyle }}>#{d.id}</td>
                                            <td style={manageDocumentStyle.tdStyle}>
                                                <img
                                                    src={
                                                        d.image
                                                            ? (d.image.startsWith('http') ? d.image : `http://localhost:8080/eLibrary_war/uploads/${d.image}`)
                                                            : 'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%220%200%2040%2040%22%3E%3Crect%20fill%3D%22%23F3F4F6%22%20width%3D%2240%22%20height%3D%2240%22%2F%3E%3Ctext%20fill%3D%22%239CA3AF%22%20font-family%3D%22sans-serif%22%20font-size%3D%228%22%20dy%3D%223%22%20font-weight%3D%22bold%22%20x%3D%2250%25%22%20y%3D%2250%25%22%20text-anchor%3D%22middle%22%3ENo%20Img%3C%2Ftext%3E%3C%2Fsvg%3E'
                                                    }
                                                    alt={d.title}
                                                    style={manageDocumentStyle.imageStyle}
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%220%200%2040%2040%22%3E%3Crect%20fill%3D%22%23F3F4F6%22%20width%3D%2240%22%20height%3D%2240%22%2F%3E%3Ctext%20fill%3D%22%239CA3AF%22%20font-family%3D%22sans-serif%22%20font-size%3D%228%22%20dy%3D%223%22%20font-weight%3D%22bold%22%20x%3D%2250%25%22%20y%3D%2250%25%22%20text-anchor%3D%22middle%22%3ENo%20Img%3C%2Ftext%3E%3C%2Fsvg%3E';
                                                    }}
                                                />
                                            </td>
                                            <td style={{ ...manageDocumentStyle.tdStyle, ...manageDocumentStyle.titleColStyle }}>
                                                {d.title}
                                            </td>
                                            <td style={{ ...manageDocumentStyle.tdStyle, color: '#4B5563' }}>
                                                {d.authors && d.authors.length > 0
                                                    ? d.authors.map(author => author.name).join(', ')
                                                    : <span style={manageDocumentStyle.emptyTextStyle}>Chưa cập nhật</span>}
                                            </td>
                                            <td style={manageDocumentStyle.tdStyle}>
                                                {d.category 
                                                    ? <span style={{ ...manageDocumentStyle.badgeStyle, ...manageDocumentStyle.categoryBadgeStyle }}>{d.category.name}</span> 
                                                    : <span style={manageDocumentStyle.emptyCategoryTextStyle}>Không có</span>}
                                            </td>
                                            <td style={manageDocumentStyle.tdStyle}>
                                                {d.price > 0 
                                                    ? <span style={manageDocumentStyle.pricePaidStyle}>{d.price.toLocaleString('vi-VN')} đ</span> 
                                                    : <span style={manageDocumentStyle.priceFreeStyle}>Miễn phí</span>}
                                            </td>
                                            <td style={manageDocumentStyle.tdStyle}>
                                                {d.isPremium ? (
                                                    <span style={{ ...manageDocumentStyle.badgeStyle, ...manageDocumentStyle.premiumBadgePaidStyle }}>Có phí</span>
                                                ) : (
                                                    <span style={{ ...manageDocumentStyle.badgeStyle, ...manageDocumentStyle.premiumBadgeFreeStyle }}>Miễn phí</span>
                                                )}
                                            </td>
                                            
                                            <td style={{ ...manageDocumentStyle.tdStyle, textAlign: 'center' }}>
                                                <div className="d-flex justify-content-center gap-2">
                                                    <EditButton onClick={() => navigate(`/librarian/edit-document/${d.id}`)} />
                                                    <DeleteButton onClick={() => deleteDocument(d.id)} />
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="text-center py-5 text-muted" style={manageDocumentStyle.emptyStateTdStyle}>
                                            <div className="mb-2" style={manageDocumentStyle.emptyStateIconStyle}>📭</div>
                                            Không tìm thấy dữ liệu tài liệu nào phù hợp.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </div>
                )}

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