import React, { useState, useEffect } from 'react';
import { Table, Spinner, Button, Form, Modal, Alert } from 'react-bootstrap';
import Apis, { authApi, endpoints } from '../../configs/Apis';
import LoadMoreButton from '../../components/LoadMoreButton';
import DeleteButton from '../../components/DeleteButton';
import EditButton from '../../components/EditButton';

const TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJsaWJyYXJpYW4wMSIsInJvbGUiOiJST0xFX0xJQlJBUklBTiIsImV4cCI6MTc3OTU2Njk3MSwiaWF0IjoxNzc5NDgwNTcxfQ.6I3wLNVu_Mv87GJ3VAZ0SngQLBiihcJg1KyqnwIlPH4"; 

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
                const res = await authApi(TOKEN).put(`/secure/categories/${currentCategory.id}`, payload);
                if (res.status === 200) {
                    setCategories(categories.map(c => c.id === currentCategory.id ? res.data : c));
                }
            } else {
                // Thêm mới (POST)
                const res = await authApi(TOKEN).post('/secure/categories', payload);
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
                const res = await authApi(TOKEN).delete(`/secure/categories/${id}`);
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

    // UI Styles
    const inputStyle = { backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '10px 14px', fontSize: '0.95rem' };
    const labelStyle = { fontSize: '0.85rem', fontWeight: '600', color: '#475569', textTransform: 'uppercase', marginBottom: '8px' };

    return (
        <div style={{ padding: '32px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
            <div className="bg-white p-4 rounded-4 shadow-sm border-0">
                
                {/* HEADER */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h3 className="mb-1" style={{ color: '#0f172a', fontWeight: '700', letterSpacing: '-0.02em' }}>
                            Quản lý Danh mục
                        </h3>
                        <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
                            Thêm, sửa, xóa và quản lý các thể loại tài liệu
                        </p>
                    </div>
                    
                    <Button 
                        variant="none" 
                        className="text-white d-flex align-items-center gap-2 border-0 fw-semibold shadow-sm"
                        style={{ backgroundColor: '#4f46e5', padding: '10px 22px', borderRadius: '10px', fontSize: '0.95rem', transition: 'all 0.2s ease' }}
                        onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#4338ca'; }}
                        onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#4f46e5'; }}
                        onClick={() => handleOpenModal()}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Thêm danh mục
                    </Button>
                </div>

                {/* BẢNG DỮ LIỆU */}
                {loading && page === 1 ? (
                    <div className="d-flex justify-content-center py-5">
                        <Spinner animation="border" variant="primary" />
                    </div>
                ) : (
                    <>
                        <Table hover responsive className="align-middle mb-0">
                            <thead style={{ backgroundColor: '#f8fafc', color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                <tr>
                                    <th className="border-0 py-3 px-3" style={{ borderRadius: '8px 0 0 8px', width: '10%' }}>ID</th>
                                    <th className="border-0 py-3" style={{ width: '35%' }}>Tên danh mục</th>
                                    <th className="border-0 py-3" style={{ width: '40%' }}>Mô tả</th>
                                    <th className="border-0 py-3 text-center" style={{ borderRadius: '0 8px 8px 0', width: '15%' }}>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.length > 0 ? (
                                    categories.map((c) => (
                                        <tr key={c.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                            <td className="px-3 text-muted fw-semibold">{c.id}</td>
                                            <td><span className="fw-semibold text-dark">{c.name}</span></td>
                                            <td className="text-muted" style={{ fontSize: '0.9rem' }}>
                                                {c.description || <span className="fst-italic text-black-50">Không có mô tả</span>}
                                            </td>
                                            <td>
                                                <div className="d-flex justify-content-center gap-2">
                                                    {/* Nút Sửa */}
                                                    <EditButton onClick={() => handleOpenModal(c)} />

                                                    {/* Nút Xóa */}
                                                    <DeleteButton onClick={() => handleDelete(c.id)} />
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="text-center py-5 text-muted">
                                            <div className="fs-4 mb-2">📭</div>
                                            Chưa có danh mục nào.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>

                        {/* TẢI THÊM */}
                        {hasMore && categories.length > 0 && (
                            <LoadMoreButton 
                                onClick={() => setPage(prev => prev + 1)}
                                isLoading={loading}
                            />
                        )}
                    </>
                )}
            </div>

            {/* MODAL THÊM / SỬA */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered contentClassName="border-0 rounded-4 shadow-lg">
                <Form onSubmit={handleSaveCategory}>
                    <Modal.Header closeButton className="border-0 pb-0">
                        <Modal.Title className="fs-5 fw-bold" style={{ color: '#0f172a' }}>
                            {currentCategory.id ? '📝 Cập nhật danh mục' : '✨ Thêm danh mục mới'}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="pt-3 pb-4">
                        {error && <Alert variant="danger" className="py-2 border-0">{error}</Alert>}
                        
                        <Form.Group className="mb-3">
                            <Form.Label style={labelStyle}>Tên danh mục <span className="text-danger">*</span></Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Nhập tên..." 
                                required
                                value={currentCategory.name}
                                onChange={(e) => setCurrentCategory({...currentCategory, name: e.target.value})}
                                style={inputStyle}
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
                    <Modal.Footer className="border-0 pt-0">
                        <Button variant="light" className="fw-semibold rounded-3" onClick={() => setShowModal(false)}>Hủy</Button>
                        <Button 
                            type="submit" 
                            disabled={!currentCategory.name.trim() || modalLoading}
                            className="fw-bold rounded-3 border-0 d-flex align-items-center"
                            style={{ backgroundColor: '#4f46e5' }}
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