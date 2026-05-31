import React, { useState, useEffect, useRef } from 'react';
import { Form, Button, Row, Col, Spinner, Alert, InputGroup, Modal } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import Apis, { authApi, endpoints } from '../../configs/Apis';
import AddModal from '../../components/AddModal';
import FileUploadBox from '../../components/FileUploadBox';
import ScrollableCheckboxList from '../../components/ScrollableCheckboxList';
import cookies from 'react-cookies';
import LabelWithAddButton from '../../components/LabelWithAddButton';
import { addUpdateDocStyle } from '../../style/AddUpdateDocumentStyle';

const AddUpdateDocument = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isUpdate = !!id;

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isUpdate);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [categories, setCategories] = useState([]);
    const [authors, setAuthors] = useState([]);
    const [tags, setTags] = useState([]);

    const [modalConfig, setModalConfig] = useState({ show: false, type: '', title: '', label: '', placeholder: '' });
    const [inputValue, setInputValue] = useState('');
    const [modalLoading, setModalLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        publishYear: new Date().getFullYear(),
        price: 0,
        quantity: 1,
        isPremium: false,
        categoryId: '',
        authorIds: [],
        tagIds: []
    });

    const imageRef = useRef();
    const fileRef = useRef();

    const loadCategories = async () => {
        try {
            const res = await Apis.get(endpoints['categories']);
            setCategories(res.data);
        } catch (err) {
            console.error("Lỗi tải danh mục:", err);
            setError("Không thể tải danh mục.");
        }
    };

    const loadAuthors = async () => {
        try {
            const res = await Apis.get(endpoints['authors']);
            setAuthors(res.data);
        } catch (err) {
            console.error("Lỗi tải tác giả:", err);
        }
    };

    const loadTags = async () => {
        try {
            const res = await Apis.get(endpoints['tags']);
            setTags(res.data);
        } catch (err) {
            console.error("Lỗi tải nhãn:", err);
        }
    };

    const loadDocument = async () => {
        try {
            const res = await Apis.get(endpoints['document-details'](id));
            const data = res.data || {};
            
            // Xử lý map dữ liệu từ JSON trả về sang State formData
            setFormData({
                title: data.title || '',
                description: data.description || '',
                publishYear: data.publishYear || new Date().getFullYear(),
                price: data.price || 0,
                quantity: data.quantity || 1,
                isPremium: data.isPremium || false,
                // Lấy ID từ object category
                categoryId: data.category ? data.category.id : '',
                // Lặp qua mảng authors/tags để lấy mảng ID
                authorIds: data.authors ? data.authors.map(author => author.id) : [],
                tagIds: data.tags ? data.tags.map(tag => tag.id) : []
            });
        } catch (err) {
            console.error("Lỗi tải thông tin tài liệu:", err);
            setError("Không thể tải thông tin tài liệu.");
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => {
        loadCategories();
        loadAuthors();
        loadTags();
        if (isUpdate) {
            loadDocument();
        } else {
            setFetching(false);
        }
    }, [isUpdate]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    };

    const handleCheckboxChange = (e, field) => {
        const value = parseInt(e.target.value);
        const checked = e.target.checked;
        setFormData(prev => ({
            ...prev,
            [field]: checked ? [...prev[field], value] : prev[field].filter(item => item !== value)
        }));
    };

    const openModal = (type) => {
        let config = { show: true, type };
        if (type === 'CATEGORY') {
            config = { ...config, title: 'Tạo danh mục mới', label: 'Tên danh mục', placeholder: 'Nhập tên danh mục...' };
        } else if (type === 'AUTHOR') {
            config = { ...config, title: 'Thêm tác giả mới', label: 'Tên tác giả', placeholder: 'Nhập tên tác giả...' };
        } else if (type === 'TAG') {
            config = { ...config, title: 'Tạo nhãn mới', label: 'Tên nhãn (Tag)', placeholder: 'Nhập tên tag...' };
        }
        setInputValue('');
        setModalConfig(config);
    };

    const handleCreateEntity = async () => {
        if (!inputValue.trim()) return;
        setModalLoading(true);
        try {
            const token = cookies.load('token');
            const payload = { name: inputValue };
            let res;

            if (modalConfig.type === 'CATEGORY') {
                res = await authApi(token).post('/secure/categories', payload);
                setCategories([...categories, res.data]);
                setFormData({ ...formData, categoryId: res.data.id });
            } else if (modalConfig.type === 'AUTHOR') {
                res = await authApi(token).post('/secure/authors', payload);
                setAuthors([...authors, res.data]);
                setFormData({ ...formData, authorIds: [...formData.authorIds, res.data.id] });
            } else if (modalConfig.type === 'TAG') {
                res = await authApi(token).post('/secure/tags', payload);
                setTags([...tags, res.data]);
                setFormData({ ...formData, tagIds: [...formData.tagIds, res.data.id] });
            }

            setModalConfig({ ...modalConfig, show: false });
            setInputValue('');
        } catch (err) {
            console.error(err);
            alert(`Không thể tạo ${modalConfig.label.toLowerCase()} lúc này!`);
        } finally {
            setModalLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            let form = new FormData();
            form.append('title', formData.title);
            form.append('description', formData.description);
            form.append('publishYear', formData.publishYear);
            form.append('price', formData.price);
            form.append('quantity', formData.quantity);
            form.append('isPremium', formData.isPremium);
            form.append('categoryId', formData.categoryId);

            if (formData.authorIds.length > 0) form.append('authorIds', formData.authorIds.join(','));
            if (formData.tagIds.length > 0) form.append('tagIds', formData.tagIds.join(','));

if (imageRef.current.files[0]) {
                form.append('image', imageRef.current.files[0]);
            } else if (!isUpdate) {
                setError('Vui lòng chọn ảnh bìa tài liệu'); 
                setLoading(false); 
                return;
            }
            // ĐÃ XÓA KHỐI ELSE GÂY LỖI Ở ĐÂY

            // Xử lý File nội dung
            if (fileRef.current.files[0]) {
                form.append('file', fileRef.current.files[0]);
            } else if (!isUpdate) {
                setError('Vui lòng chọn file nội dung tài liệu (.pdf, .doc)'); 
                setLoading(false); 
                return;
            }

            const token = cookies.load('token');
            const res = isUpdate
                ? await authApi(token).put(`/secure/documents/${id}`, form, { headers: { 'Content-Type': 'multipart/form-data' } })
                : await authApi(token).post('/secure/documents', form, { headers: { 'Content-Type': 'multipart/form-data' } });

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

    if (fetching) return <div className="text-center py-5 mt-5"><Spinner animation="border" style={addUpdateDocStyle.spinnerStyle} /> Đang tải thông tin...</div>;

    return (
        <div style={addUpdateDocStyle.pageWrapperStyle}>
            <div className="p-5" style={addUpdateDocStyle.cardStyle}>

                <div className="d-flex justify-content-between align-items-center mb-4 pb-3" style={addUpdateDocStyle.headerContainerStyle}>
                    <div>
                        <h3 className="mb-1" style={addUpdateDocStyle.titleStyle}>
                            {isUpdate ? 'Cập nhật tài liệu' : 'Thêm tài liệu mới'}
                        </h3>
                        <p className="mb-0" style={addUpdateDocStyle.subtitleStyle}>
                            {isUpdate ? 'Chỉnh sửa thông tin tài liệu hiện có.' : 'Điền đầy đủ thông tin bên dưới để xuất bản tài liệu vào hệ thống.'}
                        </p>
                    </div>
                    <Button 
                        variant="none" 
                        className="d-flex align-items-center gap-2" 
                        onClick={() => navigate(-1)} 
                        style={addUpdateDocStyle.backBtnStyle} 
                        onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#F9FAFB'; }} 
                        onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#FFFFFF'; }}
                    >
                        Quay lại
                    </Button>
                </div>

                {error && <Alert variant="danger" style={addUpdateDocStyle.alertStyle}>{error}</Alert>}
                {success && <Alert variant="success" style={addUpdateDocStyle.alertStyle}>{success}</Alert>}

                <Form onSubmit={handleSubmit}>
                    <Row className="mb-4">
                        <Col md={8}>
                            <Form.Group className="mb-4">
                                <Form.Label style={addUpdateDocStyle.labelStyle}>Tên tài liệu <span className="text-danger">*</span></Form.Label>
                                <Form.Control type="text" name="title" value={formData.title} onChange={handleChange} placeholder="VD: Lập trình Python nâng cao..." required style={addUpdateDocStyle.inputStyle} />
                            </Form.Group>

                            <Form.Group className="mb-4">
                                <Form.Label style={addUpdateDocStyle.labelStyle}>Mô tả chi tiết</Form.Label>
                                <Form.Control as="textarea" rows={6} name="description" value={formData.description} onChange={handleChange} placeholder="Nhập tóm tắt nội dung tài liệu..." style={addUpdateDocStyle.inputStyle} />
                            </Form.Group>
                        </Col>

                        <Col md={4}>
                            <Form.Group className="mb-4">
                                <Form.Label style={addUpdateDocStyle.labelStyle}>Danh mục <span className="text-danger">*</span></Form.Label>
                                <InputGroup>
                                    <Form.Select name="categoryId" value={formData.categoryId} onChange={handleChange} required style={{ ...addUpdateDocStyle.inputStyle, borderRight: 'none', borderRadius: '4px 0 0 4px' }}>
                                        <option value="">-- Chọn danh mục --</option>
                                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </Form.Select>
                                    <Button variant="none" onClick={() => openModal('CATEGORY')} style={addUpdateDocStyle.categoryAddBtnStyle}>
                                        + Thêm
                                    </Button>
                                </InputGroup>
                            </Form.Group>

                            <ScrollableCheckboxList
                                label={<LabelWithAddButton title="Tác giả" onAddClick={() => openModal('AUTHOR')} />}
                                items={authors}
                                selectedItems={formData.authorIds}
                                onChange={handleCheckboxChange}
                                fieldName="authorIds"
                                emptyMessage="Chưa có tác giả"
                            />

                            <ScrollableCheckboxList
                                label={<LabelWithAddButton title="Nhãn" onAddClick={() => openModal('TAG')} />}
                                items={tags}
                                selectedItems={formData.tagIds}
                                onChange={handleCheckboxChange}
                                fieldName="tagIds"
                                emptyMessage="Chưa có nhãn"
                            />
                        </Col>
                    </Row>

                    <Row className="mb-4">
                        <Col md={3}>
                            <Form.Group className="mb-4">
                                <Form.Label style={addUpdateDocStyle.labelStyle}>Năm xuất bản</Form.Label>
                                <Form.Control type="number" name="publishYear" value={formData.publishYear} onChange={handleChange} style={addUpdateDocStyle.inputStyle} />
                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <Form.Group className="mb-4">
                                <Form.Label style={addUpdateDocStyle.labelStyle}>Số lượng (Bản cứng)</Form.Label>
                                <Form.Control type="number" name="quantity" min="0" value={formData.quantity} onChange={handleChange} style={addUpdateDocStyle.inputStyle} />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group 
                                className="mb-4 p-3 h-100" 
                                style={{ 
                                    ...addUpdateDocStyle.premiumBoxBaseStyle, 
                                    backgroundColor: formData.isPremium ? '#EFF6FF' : '#F9FAFB', 
                                    border: formData.isPremium ? '1px solid #1D559F' : '1px solid #E5E7EB' 
                                }}
                            >
                                <div className="d-flex justify-content-between align-items-center h-100">
                                    <Form.Check 
                                        type="switch" 
                                        id="premium-switch" 
                                        name="isPremium" 
                                        label={<span className="fw-semibold ms-2" style={{ color: formData.isPremium ? '#1D559F' : '#4B5563', fontSize: '0.875rem' }}>Premium (Có phí)</span>} 
                                        checked={formData.isPremium} 
                                        onChange={handleChange} 
                                    />
                                    <div className="d-flex align-items-center gap-2">
                                        <Form.Control type="number" name="price" placeholder="Nhập giá..." min="0" value={formData.price} onChange={handleChange} disabled={!formData.isPremium} style={{ ...addUpdateDocStyle.inputStyle, padding: '8px 12px', width: '130px' }} />
                                        <span className="fw-semibold" style={addUpdateDocStyle.currencyStyle}>VNĐ</span>
                                    </div>
                                </div>
                            </Form.Group>
                        </Col>
                    </Row>

                    <hr className="my-4" style={addUpdateDocStyle.dividerStyle} />

                    <Row className="mb-5">
                        <Col md={6}>
                            <FileUploadBox label="📸 Ảnh bìa tài liệu" accept="image/*" fileRef={imageRef} isRequired={!isUpdate} helperText={isUpdate ? 'Bỏ trống nếu muốn giữ nguyên ảnh cũ. Hỗ trợ: JPG, PNG' : 'Định dạng hỗ trợ: JPG, PNG, WEBP'} />
                        </Col>
                        <Col md={6}>
                            <FileUploadBox label="📄 File nội dung" accept=".pdf,.doc,.docx" fileRef={fileRef} isRequired={!isUpdate} helperText={isUpdate ? 'Bỏ trống nếu muốn giữ nguyên file cũ. Hỗ trợ: PDF, DOCX' : 'Định dạng hỗ trợ: PDF, DOCX'} />
                        </Col>
                    </Row>

                    <div className="d-flex flex-nowrap justify-content-end align-items-center gap-3 pt-3">
                        <Button variant="none" onClick={() => navigate(-1)} style={addUpdateDocStyle.cancelBtnStyle}>
                            Hủy bỏ
                        </Button>
                        <Button type="submit" disabled={loading} style={addUpdateDocStyle.submitBtnStyle}>
                            {loading ? <Spinner size="sm" className="me-2" /> : null}
                            {isUpdate ? 'Lưu thay đổi' : 'Xuất bản tài liệu'}
                        </Button>
                    </div>
                </Form>
            </div>

            <AddModal
                show={modalConfig.show}
                onHide={() => setModalConfig({ ...modalConfig, show: false })}
                onCreate={handleCreateEntity}
                inputValue={inputValue}
                setInputValue={setInputValue}
                loading={modalLoading}
                title={modalConfig.title}
                label={modalConfig.label}
                placeholder={modalConfig.placeholder}
            />
        </div>
    );
};

export default AddUpdateDocument;