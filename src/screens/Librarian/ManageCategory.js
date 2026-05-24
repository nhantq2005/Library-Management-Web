import React, { useState, useEffect } from 'react';
import { Table, Spinner, Button, Form, Modal, Alert } from 'react-bootstrap';
import Apis, { authApi, endpoints } from '../../configs/Apis';
import LoadMoreButton from '../../components/LoadMoreButton';
import DeleteButton from '../../components/DeleteButton';
import EditButton from '../../components/EditButton';
import cookies from 'react-cookies';

const ManageCategory = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [error, setError] = useState('');
    const [currentCategory, setCurrentCategory] = useState({ id: '', name: '', description: '' });

    const loadCategories = async () => {
        try {
            if (page === 1) setLoading(true);
            let res = await Apis.get(`${endpoints['categories']}?page=${page}`);
            
            if (res.data.length === 0 || res.data.length < 20) {
                setHasMore(false);
            } else {
                setHasMore(true);
            }

            if (page === 1) {
                setCategories(res.data);
            } else {
                setCategories(prev => [...prev, ...res.data]);
            }
        } catch (ex) {
            console.error("Lỗi khi tải danh mục:", ex);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCategories();
    }, [page]);

    // 2. MỞ MODAL (Dùng chung cho Thêm mới và Chỉnh sửa)
    const handleOpenModal = (category = null) => {
        setError('');
        if (category) {
            setCurrentCategory(category);
        } else {
            setCurrentCategory({ id: '', name: '', description: '' });
        }
        setShowModal(true);
    };

    // 3. LƯU DANH MỤC (Thêm hoặc Sửa)
    const handleSaveCategory = async (e) => {
        e.preventDefault();
        setModalLoading(true);
        setError('');

        try {
            // API Spring Boot yêu cầu @RequestBody nên ta truyền trực tiếp object JSON
            const payload = {
                name: currentCategory.name,
                description: currentCategory.description
            };

            if (currentCategory.id) {
                const res = await authApi(cookies.load('token')).put(`/secure/categories/${currentCategory.id}`, payload);
                if (res.status === 200) {
                    setCategories(categories.map(c => c.id === currentCategory.id ? res.data : c));
                }
            } else {
                // Thêm mới (POST)
                const res = await authApi(cookies.load('token')).post('/secure/categories', payload);
                if (res.status === 201) {
                    setCategories([res.data, ...categories]);
                }
            }
            setShowModal(false);
        } catch (err) {
            console.error(err);
            setError("Có lỗi xảy ra khi lưu danh mục!");
        } finally {
            setModalLoading(false);
        }
    };

    // 4. XÓA DANH MỤC
    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa danh mục này? Các tài liệu thuộc danh mục có thể bị ảnh hưởng.")) {
            try {
                const res = await authApi(cookies.load('token')).delete(`/secure/categories/${id}`);
                if (res.status === 204) {
                    setCategories(categories.filter(c => c.id !== id));
                    alert("Xóa danh mục thành công!");
                }
            } catch (error) {
                console.error("Lỗi khi xóa:", error);
                alert("Có lỗi xảy ra! Không thể xóa danh mục này.");
            }
        }
    };

    // --- LUMINA DESIGN STYLES ---
    const inputStyle = { backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '4px', padding: '10px 14px', fontSize: '0.875rem', color: '#111827', boxShadow: 'none', fontFamily: 'Inter, sans-serif' };
    const labelStyle = { fontSize: '0.75rem', fontWeight: '600', color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', fontFamily: 'Inter, sans-serif' };
    const thStyle = { padding: '12px 20px', fontSize: '0.75rem', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #E5E7EB', backgroundColor: '#FFFFFF' };
    const tdStyle = { padding: '16px 20px', fontSize: '0.875rem', color: '#111827', verticalAlign: 'middle' };

    return (
        <div style={{ padding: '32px 40px', backgroundColor: '#F9FAFB', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '4px', padding: '24px' }}>
                
                {/* HEADER */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h3 className="mb-1" style={{ color: '#111827', fontWeight: '600', letterSpacing: '-0.02em', fontSize: '1.5rem' }}>
                            Quản lý Danh mục
                        </h3>
                        <p className="mb-0" style={{ fontSize: '0.875rem', color: '#4B5563' }}>
                            Thêm, sửa, xóa và quản lý các thể loại tài liệu.
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
                        onClick={() => handleOpenModal()}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Thêm danh mục
                    </Button>
                </div>

                {/* BẢNG DỮ LIỆU */}
                {loading && page === 1 ? (
                    <div className="d-flex justify-content-center py-5">
                        <Spinner animation="border" style={{ color: '#1D559F' }} />
                    </div>
                ) : (
                    <div style={{ margin: '0 -24px' }}>
                        <Table hover responsive className="align-middle mb-0" style={{ borderTop: '1px solid #E5E7EB' }}>
                            <thead>
                                <tr>
                                    <th style={{ ...thStyle, width: '10%' }}>ID</th>
                                    <th style={{ ...thStyle, width: '35%' }}>Tên danh mục</th>
                                    <th style={{ ...thStyle, width: '40%' }}>Mô tả</th>
                                    <th style={{ ...thStyle, width: '15%', textAlign: 'center' }}>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.length > 0 ? (
                                    categories.map((c) => (
                                        <tr key={c.id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                                            <td style={{ ...tdStyle, color: '#6B7280', fontWeight: '500' }}>#{c.id}</td>
                                            <td style={{ ...tdStyle, fontWeight: '500', color: '#1D559F' }}>{c.name}</td>
                                            <td style={{ ...tdStyle, color: '#4B5563' }}>
                                                {c.description || <span style={{ fontStyle: 'italic', color: '#9CA3AF' }}>Không có mô tả</span>}
                                            </td>
                                            <td style={{ ...tdStyle, textAlign: 'center' }}>
                                                <div className="d-flex justify-content-center gap-2">
                                                    <EditButton onClick={() => handleOpenModal(c)} />
                                                    <DeleteButton onClick={() => handleDelete(c.id)} />
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="text-center py-5 text-muted" style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                                            <div className="mb-2" style={{ fontSize: '1.5rem' }}>📭</div>
                                            Chưa có danh mục nào.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </div>
                )}

                {/* TẢI THÊM */}
                {hasMore && categories.length > 0 && (
                    <div className="mt-4">
                        <LoadMoreButton 
                            onClick={() => setPage(prev => prev + 1)}
                            isLoading={loading}
                        />
                    </div>
                )}
            </div>

            {/* MODAL THÊM / SỬA */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered contentClassName="border-0 shadow-lg" style={{ borderRadius: '4px' }}>
                <Form onSubmit={handleSaveCategory}>
                    <Modal.Header closeButton className="border-0 pb-0">
                        <Modal.Title className="fs-5 fw-bold" style={{ color: '#111827', fontFamily: 'Inter, sans-serif' }}>
                            {currentCategory.id ? 'Cập nhật danh mục' : 'Thêm danh mục mới'}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="pt-3 pb-4">
                        {error && <Alert variant="danger" style={{ borderRadius: '4px', fontSize: '0.875rem' }}>{error}</Alert>}
                        
                        <Form.Group className="mb-3">
                            <Form.Label style={labelStyle}>Tên danh mục <span className="text-danger">*</span></Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Nhập tên..." 
                                required
                                value={currentCategory.name}
                                onChange={(e) => setCurrentCategory({...currentCategory, name: e.target.value})}
                                style={inputStyle}
                                autoFocus
                            />
                        </Form.Group>
                        
                        <Form.Group>
                            <Form.Label style={labelStyle}>Mô tả</Form.Label>
                            <Form.Control 
                                as="textarea" 
                                rows={3}
                                placeholder="Nhập mô tả (không bắt buộc)..." 
                                value={currentCategory.description || ''}
                                onChange={(e) => setCurrentCategory({...currentCategory, description: e.target.value})}
                                style={inputStyle}
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer className="border-0 pt-0 d-flex flex-nowrap justify-content-end gap-2 w-100">
                        <Button 
                            variant="none" 
                            onClick={() => setShowModal(false)}
                            style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', color: '#4B5563', borderRadius: '4px', padding: '8px 16px', fontSize: '0.875rem', fontWeight: '500', whiteSpace: 'nowrap' }}
                        >
                            Hủy
                        </Button>
                        <Button 
                            type="submit" 
                            disabled={!currentCategory.name.trim() || modalLoading}
                            style={{ backgroundColor: '#1D559F', color: '#FFFFFF', border: 'none', borderRadius: '4px', padding: '8px 16px', fontSize: '0.875rem', fontWeight: '500', whiteSpace: 'nowrap' }}
                        >
                            {modalLoading ? <Spinner size="sm" animation="border" className="me-2" /> : null}
                            Lưu thông tin
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    );
};

export default ManageCategory;