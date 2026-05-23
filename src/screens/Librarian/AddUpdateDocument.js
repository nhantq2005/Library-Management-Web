import React, { useState, useEffect, useRef } from 'react';
import { Form, Button, Row, Col, Spinner, Alert, InputGroup, Modal } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import Apis, { authApi, endpoints } from '../../configs/Apis';

const AddUpdateDocument = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Lấy ID từ URL nếu đang ở trang Edit
    const isUpdate = !!id; // Biến cờ kiểm tra trạng thái cập nhật hay thêm mới

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isUpdate);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    // State lưu danh sách dropdown & checkbox
    const [categories, setCategories] = useState([]);
    const [authors, setAuthors] = useState([]);
    const [tags, setTags] = useState([]); // Mới thêm state cho Tags

    // State Modal Tạo Danh mục
    const [showCatModal, setShowCatModal] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [catLoading, setCatLoading] = useState(false);

    // State lưu dữ liệu form
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        publishYear: new Date().getFullYear(),
        price: 0,
        quantity: 1,
        isPremium: false,
        categoryId: '',
        authorIds: [], // Chuyển thành mảng
        tagIds: []     // Thêm mảng tagIds
    });

    const imageRef = useRef();
    const fileRef = useRef();
    
    // Lưu ý: Thay TOKEN bằng cơ chế lấy từ Context/LocalStorage thực tế
    const TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJsaWJyYXJpYW4wMSIsInJvbGUiOiJST0xFX0xJQlJBUklBTiIsImV4cCI6MTc3OTU2Njk3MSwiaWF0IjoxNzc5NDgwNTcxfQ.6I3wLNVu_Mv87GJ3VAZ0SngQLBiihcJg1KyqnwIlPH4";

    useEffect(() => {
        const loadInitData = async () => {
            try {
                // TODO: Thay bằng các API lấy danh sách thực tế của bạn
                setCategories([{ id: 1, name: 'Khoa học Máy tính' }, { id: 2, name: 'Vật lý' }]);
                setAuthors([{ id: 1, name: 'Isaac Newton' }, { id: 2, name: 'Alan Turing' }]);
                setTags([{ id: 1, name: 'Lập trình' }, { id: 2, name: 'AI/ML' }, { id: 3, name: 'Cơ sở dữ liệu' }]);

                // Nếu là trạng thái Cập nhật, lấy dữ liệu tài liệu cũ
                if (isUpdate) {
                    // let res = await Apis.get(`${endpoints['documents']}/${id}`);
                    // Dữ liệu mock:
                    const res = {
                        data: {
                            id: id, title: 'Tài liệu mẫu đang edit', description: 'Mô tả mẫu',
                            publishYear: 2024, price: 50000, quantity: 10, isPremium: true,
                            category: { id: 1 }, 
                            authors: [{ id: 1 }], 
                            tags: [{ id: 1 }, { id: 2 }]
                        }
                    };
                    
                    setFormData({
                        title: res.data.title,
                        description: res.data.description,
                        publishYear: res.data.publishYear,
                        price: res.data.price,
                        quantity: res.data.quantity,
                        isPremium: res.data.isPremium,
                        categoryId: res.data.category ? res.data.category.id : '',
                        authorIds: res.data.authors ? res.data.authors.map(a => a.id) : [],
                        tagIds: res.data.tags ? res.data.tags.map(t => t.id) : []
                    });
                }
            } catch (err) {
                console.error("Lỗi khởi tạo dữ liệu:", err);
                setError("Không thể tải thông tin hệ thống. Vui lòng tải lại trang.");
            } finally {
                setFetching(false);
            }
        };
        loadInitData();
    }, [id, isUpdate]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    // Hàm xử lý khi check/uncheck danh sách Tác giả hoặc Tag
    const handleCheckboxChange = (e, field) => {
        const value = parseInt(e.target.value);
        const checked = e.target.checked;
        
        setFormData(prev => {
            const currentList = prev[field];
            return {
                ...prev,
                [field]: checked 
                    ? [...currentList, value] 
                    : currentList.filter(item => item !== value)
            };
        });
    };

    const handleCreateCategory = async () => {
        if (!newCategoryName.trim()) return;
        setCatLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Mock API delay
            const newCat = { id: Date.now(), name: newCategoryName }; 
            
            setCategories([...categories, newCat]);
            setFormData({ ...formData, categoryId: newCat.id });
            setShowCatModal(false);
            setNewCategoryName('');
        } catch (err) {
            console.error(err);
            alert("Không thể tạo danh mục mới lúc này!");
        } finally {
            setCatLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            let form = new FormData();
            
            // Đưa các fields văn bản vào form
            form.append('title', formData.title);
            form.append('description', formData.description);
            form.append('publishYear', formData.publishYear);
            form.append('price', formData.price);
            form.append('quantity', formData.quantity);
            form.append('isPremium', formData.isPremium);
            form.append('categoryId', formData.categoryId);
            
            // Xử lý chuỗi ID (Backend đang dùng split(","))
            if (formData.authorIds.length > 0) {
                form.append('authorIds', formData.authorIds.join(','));
            }
            if (formData.tagIds.length > 0) {
                form.append('tagIds', formData.tagIds.join(','));
            }

            // Xử lý Ảnh
            if (imageRef.current.files[0]) {
                form.append('image', imageRef.current.files[0]);
            } else if (!isUpdate) {
                setError('Vui lòng chọn ảnh bìa tài liệu'); setLoading(false); return; 
            } else {
                // Bypass Spring boot required @RequestParam nếu là Update
                form.append('image', new Blob(), ''); 
            }

            // Xử lý File nội dung
            if (fileRef.current.files[0]) {
                form.append('file', fileRef.current.files[0]);
            } else if (!isUpdate) {
                setError('Vui lòng chọn file nội dung tài liệu (.pdf, .doc)'); setLoading(false); return; 
            } else {
                form.append('file', new Blob(), ''); 
            }

            let res;
            if (isUpdate) {
                res = await authApi(TOKEN).put(`/secure/documents/${id}`, form, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                res = await authApi(TOKEN).post('/secure/documents', form, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }

            if (res.status === 201 || res.status === 200) {
                setSuccess(`${isUpdate ? 'Cập nhật' : 'Thêm'} tài liệu thành công!`);
                setTimeout(() => navigate('/librarian/manage-document'), 1500);
            }
        } catch (err) {
            console.error(err);
            setError(`Có lỗi xảy ra khi ${isUpdate ? 'cập nhật' : 'thêm'} tài liệu. Vui lòng kiểm tra lại!`);
        } finally {
            setLoading(false);
        }
    };

    // UI Tùy chỉnh tái sử dụng
    const inputStyle = { backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px 16px', fontSize: '0.95rem', color: '#1e293b', boxShadow: 'none' };
    const labelStyle = { fontSize: '0.85rem', fontWeight: '600', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' };

    if (fetching) {
        return <div className="text-center py-5 mt-5"><Spinner animation="border" variant="primary" /> Đang tải thông tin...</div>;
    }

    return (
        <div style={{ padding: '32px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
            <div className="bg-white p-5 rounded-4 shadow-sm border-0" style={{ maxWidth: '950px', margin: '0 auto' }}>
                
                {/* HEADER */}
                <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
                    <div>
                        <h3 className="mb-1" style={{ color: '#0f172a', fontWeight: '700', letterSpacing: '-0.02em' }}>
                            {isUpdate ? '📝 Cập nhật tài liệu' : '✨ Thêm tài liệu mới'}
                        </h3>
                        <p className="text-muted mb-0" style={{ fontSize: '0.95rem' }}>
                            {isUpdate ? 'Chỉnh sửa thông tin tài liệu hiện có' : 'Điền đầy đủ thông tin bên dưới để xuất bản tài liệu vào hệ thống'}
                        </p>
                    </div>
                    <Button 
                        variant="none" 
                        className="fw-semibold shadow-sm d-flex align-items-center gap-2"
                        onClick={() => navigate(-1)}
                        style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', color: '#475569', borderRadius: '10px', padding: '8px 18px', transition: 'all 0.2s' }}
                        onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#f1f5f9'; }}
                        onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#ffffff'; }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/></svg>
                        Quay lại
                    </Button>
                </div>

                {error && <Alert variant="danger" className="rounded-3 border-0 shadow-sm">{error}</Alert>}
                {success && <Alert variant="success" className="rounded-3 border-0 shadow-sm">{success}</Alert>}

                <Form onSubmit={handleSubmit}>
                    <Row className="mb-4">
                        <Col md={8}>
                            <Form.Group className="mb-4">
                                <Form.Label style={labelStyle}>Tên tài liệu <span className="text-danger">*</span></Form.Label>
                                <Form.Control type="text" name="title" value={formData.title} onChange={handleChange} placeholder="VD: Lập trình Python nâng cao..." required style={inputStyle} />
                            </Form.Group>

                            <Form.Group className="mb-4">
                                <Form.Label style={labelStyle}>Mô tả chi tiết</Form.Label>
                                <Form.Control as="textarea" rows={6} name="description" value={formData.description} onChange={handleChange} placeholder="Nhập tóm tắt nội dung tài liệu..." style={inputStyle} />
                            </Form.Group>
                        </Col>

                        <Col md={4}>
                            <Form.Group className="mb-4">
                                <Form.Label style={labelStyle}>Danh mục <span className="text-danger">*</span></Form.Label>
                                <InputGroup>
                                    <Form.Select name="categoryId" value={formData.categoryId} onChange={handleChange} required style={{...inputStyle, borderRight: 'none', borderTopRightRadius: 0, borderBottomRightRadius: 0}}>
                                        <option value="">-- Chọn danh mục --</option>
                                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </Form.Select>
                                    <Button 
                                        variant="none"
                                        onClick={() => setShowCatModal(true)}
                                        style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', color: '#4f46e5', borderLeft: 'none', borderTopRightRadius: '10px', borderBottomRightRadius: '10px', fontWeight: 'bold' }}
                                    >
                                        + Thêm
                                    </Button>
                                </InputGroup>
                            </Form.Group>

                            <Form.Group className="mb-4">
                                <Form.Label style={labelStyle}>Tác giả (Có thể chọn nhiều)</Form.Label>
                                <div className="border rounded-3 p-3" style={{ backgroundColor: '#f8fafc', maxHeight: '140px', overflowY: 'auto', borderColor: '#e2e8f0' }}>
                                    {authors.map(a => (
                                        <Form.Check 
                                            key={a.id}
                                            type="checkbox"
                                            label={a.name}
                                            value={a.id}
                                            checked={formData.authorIds.includes(a.id)}
                                            onChange={(e) => handleCheckboxChange(e, 'authorIds')}
                                            className="mb-1 text-muted"
                                        />
                                    ))}
                                    {authors.length === 0 && <span className="text-muted fst-italic">Chưa có tác giả</span>}
                                </div>
                            </Form.Group>

                            <Form.Group className="mb-4">
                                <Form.Label style={labelStyle}>Nhãn / Tags</Form.Label>
                                <div className="border rounded-3 p-3" style={{ backgroundColor: '#f8fafc', maxHeight: '140px', overflowY: 'auto', borderColor: '#e2e8f0' }}>
                                    {tags.map(t => (
                                        <Form.Check 
                                            key={t.id}
                                            type="checkbox"
                                            label={t.name}
                                            value={t.id}
                                            checked={formData.tagIds.includes(t.id)}
                                            onChange={(e) => handleCheckboxChange(e, 'tagIds')}
                                            className="mb-1 text-muted"
                                        />
                                    ))}
                                </div>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-4">
                        <Col md={3}>
                            <Form.Group className="mb-4">
                                <Form.Label style={labelStyle}>Năm xuất bản</Form.Label>
                                <Form.Control type="number" name="publishYear" value={formData.publishYear} onChange={handleChange} style={inputStyle}/>
                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <Form.Group className="mb-4">
                                <Form.Label style={labelStyle}>Số lượng (Bản cứng)</Form.Label>
                                <Form.Control type="number" name="quantity" min="0" value={formData.quantity} onChange={handleChange} style={inputStyle}/>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-4 p-3 rounded-4 h-100" style={{ backgroundColor: formData.isPremium ? '#fefce8' : '#f8fafc', border: formData.isPremium ? '1px dashed #eab308' : '1px dashed #cbd5e1', transition: 'all 0.3s' }}>
                                <div className="d-flex justify-content-between align-items-center">
                                    <Form.Check 
                                        type="switch"
                                        id="premium-switch"
                                        name="isPremium"
                                        label={<span className="fw-bold ms-2" style={{ color: formData.isPremium ? '#854d0e' : '#64748b' }}>Premium (Có phí)</span>}
                                        checked={formData.isPremium}
                                        onChange={handleChange}
                                    />
                                    <div className="d-flex align-items-center gap-2">
                                        <Form.Control type="number" name="price" placeholder="Nhập giá tiền..." min="0" value={formData.price} onChange={handleChange} disabled={!formData.isPremium} style={{...inputStyle, padding: '8px 12px', width: '150px'}}/>
                                        <span className="fw-semibold text-muted">VNĐ</span>
                                    </div>
                                </div>
                            </Form.Group>
                        </Col>
                    </Row>

                    <hr className="my-4" style={{ borderColor: '#e2e8f0' }} />

                    <Row className="mb-5">
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label style={labelStyle}>📸 Ảnh bìa tài liệu {!isUpdate && <span className="text-danger">*</span>}</Form.Label>
                                <div className="p-3 text-center rounded-4" style={{ border: '2px dashed #cbd5e1', backgroundColor: '#f8fafc' }}>
                                    <Form.Control type="file" accept="image/*" ref={imageRef} className="shadow-none border-0 bg-transparent w-100" />
                                    <small className="text-muted d-block mt-2">
                                        {isUpdate ? 'Bỏ trống nếu muốn giữ nguyên ảnh cũ. Hỗ trợ: JPG, PNG' : 'Định dạng hỗ trợ: JPG, PNG, WEBP'}
                                    </small>
                                </div>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label style={labelStyle}>📄 File nội dung {!isUpdate && <span className="text-danger">*</span>}</Form.Label>
                                <div className="p-3 text-center rounded-4" style={{ border: '2px dashed #cbd5e1', backgroundColor: '#f8fafc' }}>
                                    <Form.Control type="file" accept=".pdf,.doc,.docx" ref={fileRef} className="shadow-none border-0 bg-transparent w-100" />
                                    <small className="text-muted d-block mt-2">
                                        {isUpdate ? 'Bỏ trống nếu muốn giữ nguyên file cũ. Hỗ trợ: PDF, DOCX' : 'Định dạng hỗ trợ: PDF, DOCX'}
                                    </small>
                                </div>
                            </Form.Group>
                        </Col>
                    </Row>

                    <div className="d-flex justify-content-end gap-3 pt-3">
                        <Button variant="none" className="fw-semibold px-4" onClick={() => navigate(-1)} style={{ borderRadius: '10px', color: '#64748b', backgroundColor: '#f1f5f9' }}>
                            Hủy bỏ
                        </Button>
                        <Button 
                            type="submit" 
                            disabled={loading}
                            className="text-white fw-bold px-5 shadow-sm border-0 d-flex align-items-center"
                            style={{ backgroundColor: '#4f46e5', borderRadius: '10px', transition: 'all 0.2s' }}
                            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#4338ca'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#4f46e5'; e.currentTarget.style.transform = 'translateY(0)'; }}
                        >
                            {loading ? <Spinner size="sm" animation="border" className="me-2" /> : null}
                            {isUpdate ? '💾 Lưu thay đổi' : '🚀 Xuất bản tài liệu'}
                        </Button>
                    </div>
                </Form>
            </div>

            {/* MODAL TẠO DANH MỤC MỚI */}
            <Modal show={showCatModal} onHide={() => setShowCatModal(false)} centered contentClassName="border-0 rounded-4 shadow-lg">
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title className="fs-5 fw-bold" style={{ color: '#0f172a' }}>Tạo danh mục mới</Modal.Title>
                </Modal.Header>
                <Modal.Body className="pt-3 pb-4">
                    <Form.Group>
                        <Form.Label style={labelStyle}>Tên danh mục</Form.Label>
                        <Form.Control 
                            type="text" 
                            placeholder="Nhập tên danh mục..." 
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            onKeyDown={(e) => { if(e.key === 'Enter') handleCreateCategory(); }}
                            autoFocus
                            style={inputStyle}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer className="border-0 pt-0">
                    <Button variant="light" className="fw-semibold rounded-3" onClick={() => setShowCatModal(false)}>Hủy</Button>
                    <Button 
                        variant="primary" 
                        onClick={handleCreateCategory} 
                        disabled={!newCategoryName.trim() || catLoading}
                        className="fw-bold rounded-3 border-0"
                        style={{ backgroundColor: '#4f46e5' }}
                    >
                        {catLoading ? <Spinner size="sm" animation="border" /> : 'Lưu danh mục'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default AddUpdateDocument;