import React, { useState, useEffect, useCallback } from 'react';
import { Table, Spinner, Button, Form, Modal, Alert } from 'react-bootstrap';
import Apis, { authApi, endpoints } from '../../configs/Apis';
import LoadMoreButton from '../../components/LoadMoreButton';
import DeleteButton from '../../components/DeleteButton';
import EditButton from '../../components/EditButton';
import cookies from 'react-cookies';
import { manageCategoryStyle } from '../../style/ManageCategoryStyle';
import { IoIosAdd } from 'react-icons/io';

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
    }, [page, categories.length]);

    const handleOpenModal = (category = null) => {
        setError('');
        if (category) {
            setCurrentCategory(category);
        } else {
            setCurrentCategory({ id: '', name: '', description: '' });
        }
        setShowModal(true);
    };

    const handleSaveCategory = async (e) => {
        e.preventDefault();
        setModalLoading(true);
        setError('');

        try {
            const payload = {
                name: currentCategory.name,
                description: currentCategory.description
            };

            if (currentCategory.id) {
                const token = cookies.load('token');
                const res = await authApi(token).put(endpoints['update-category'](currentCategory.id), payload);
                if (res.status === 200) {
                    setCategories(prev => prev.map(c => c.id === currentCategory.id ? res.data : c));
                }
            } else {
                const token = cookies.load('token');
                const res = await authApi(token).post(endpoints['secure-categories'], payload);
                if (res.status === 201) {
                    setCategories(prev => [res.data, ...prev]);
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

    const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa danh mục này? Các tài liệu thuộc danh mục có thể bị ảnh hưởng.")) {
        try {
            const token = cookies.load('token');
            const res = await authApi(token).delete(endpoints['delete-category'](id));
            
            if (res.status === 204) {
                alert("Xóa danh mục thành công!");
               setCategories(prev => prev.filter(c => c.id !== id));
            }
        } catch (error) {
            console.error("Lỗi khi xóa:", error);
            alert(error?.response?.data?.message || "Có lỗi xảy ra! Không thể xóa danh mục này.");
        }
    }
};

    return (
        <div style={manageCategoryStyle.pageWrapperStyle}>
            <div style={manageCategoryStyle.cardStyle}>

                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h3 className="mb-1" style={manageCategoryStyle.titleStyle}>
                            Quản lý Danh mục
                        </h3>
                        <p className="mb-0" style={manageCategoryStyle.subtitleStyle}>
                            Thêm, sửa, xóa và quản lý các thể loại tài liệu.
                        </p>
                    </div>

                    <Button
                        variant="none"
                        className="d-flex align-items-center gap-2"
                        style={manageCategoryStyle.addBtnStyle}
                        onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#154078'; }}
                        onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#1D559F'; }}
                        onClick={() => handleOpenModal()}
                    >
                        <IoIosAdd size={22} />
                        Thêm danh mục
                    </Button>
                </div>

                {loading && page === 1 ? (
                    <div className="d-flex justify-content-center py-5">
                        <Spinner animation="border" style={{ color: '#1D559F' }} />
                    </div>
                ) : (
                    <div style={manageCategoryStyle.tableContainerStyle}>
                        <Table hover responsive className="align-middle mb-0" style={manageCategoryStyle.tableStyle}>
                            <thead>
                                <tr>
                                    <th style={{ ...manageCategoryStyle.thStyle, width: '10%' }}>ID</th>
                                    <th style={{ ...manageCategoryStyle.thStyle, width: '35%' }}>Tên danh mục</th>
                                    <th style={{ ...manageCategoryStyle.thStyle, width: '40%' }}>Mô tả</th>
                                    <th style={{ ...manageCategoryStyle.thStyle, width: '15%', textAlign: 'center' }}>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.length > 0 ? (
                                    categories.map((c) => (
                                        <tr key={c.id} style={manageCategoryStyle.trStyle}>
                                            <td style={{ ...manageCategoryStyle.tdStyle, color: '#6B7280', fontWeight: '500' }}>#{c.id}</td>
                                            <td style={{ ...manageCategoryStyle.tdStyle, fontWeight: '500', color: '#1D559F' }}>{c.name}</td>
                                            <td style={{ ...manageCategoryStyle.tdStyle, color: '#4B5563' }}>
                                                {c.description || <span style={{ fontStyle: 'italic', color: '#9CA3AF' }}>Không có mô tả</span>}
                                            </td>
                                            <td style={{ ...manageCategoryStyle.tdStyle, textAlign: 'center' }}>
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

                {hasMore && categories.length > 0 && (
                    <div className="mt-4">
                        <LoadMoreButton
                            onClick={() => setPage(prev => prev + 1)}
                            isLoading={loading}
                        />
                    </div>
                )}
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)} centered contentClassName="border-0 shadow-lg" style={manageCategoryStyle.modalStyle}>
                <Form onSubmit={handleSaveCategory}>
                    <Modal.Header closeButton className="border-0 pb-0">
                        <Modal.Title className="fs-5 fw-bold" style={manageCategoryStyle.modalTitleStyle}>
                            {currentCategory.id ? 'Cập nhật danh mục' : 'Thêm danh mục mới'}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="pt-3 pb-4">
                        {error && <Alert variant="danger" style={{ borderRadius: '4px', fontSize: '0.875rem' }}>{error}</Alert>}

                        <Form.Group className="mb-3">
                            <Form.Label style={manageCategoryStyle.labelStyle}>Tên danh mục <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Nhập tên..."
                                required
                                value={currentCategory.name}
                                onChange={(e) => setCurrentCategory({ ...currentCategory, name: e.target.value })}
                                style={manageCategoryStyle.inputStyle}
                                autoFocus
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label style={manageCategoryStyle.labelStyle}>Mô tả</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Nhập mô tả (không bắt buộc)..."
                                value={currentCategory.description || ''}
                                onChange={(e) => setCurrentCategory({ ...currentCategory, description: e.target.value })}
                                style={manageCategoryStyle.inputStyle}
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer className="border-0 pt-0 d-flex flex-nowrap justify-content-end gap-2 w-100">
                        <Button
                            variant="none"
                            onClick={() => setShowModal(false)}
                            style={manageCategoryStyle.cancelBtnStyle}
                        >
                            Hủy
                        </Button>
                        <Button
                            type="submit"
                            disabled={!currentCategory.name.trim() || modalLoading}
                            style={manageCategoryStyle.saveBtnStyle}
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