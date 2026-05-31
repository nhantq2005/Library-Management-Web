import { Button, Form, Modal, Spinner } from "react-bootstrap";

const AddModal = ({ show, onHide, onCreate, inputValue, setInputValue, loading, title, label, placeholder }) => {
    const inputStyle = { 
        backgroundColor: '#F9FAFB', 
        border: '1px solid #E5E7EB', 
        borderRadius: '4px', 
        padding: '10px 14px', 
        fontSize: '0.875rem', 
        color: '#111827', 
        boxShadow: 'none',
        fontFamily: 'Inter, sans-serif'
    };

    const labelStyle = { 
        fontSize: '0.75rem', 
        fontWeight: '600', 
        color: '#4B5563', 
        textTransform: 'uppercase', 
        letterSpacing: '0.05em', 
        marginBottom: '8px',
        fontFamily: 'Inter, sans-serif'
    };

    return (
        <Modal show={show} onHide={onHide} centered contentClassName="border-0 shadow-lg" style={{ borderRadius: '4px' }}>
            <Modal.Header closeButton className="border-0 pb-0">
                <Modal.Title className="fs-5 fw-bold" style={{ color: '#111827', fontFamily: 'Inter, sans-serif' }}>
                    {title || 'Thêm mới'}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="pt-3 pb-4">
                <Form.Group>
                    <Form.Label style={labelStyle}>{label || 'Tên'}</Form.Label>
                    <Form.Control 
                        type="text" 
                        placeholder={placeholder || "Nhập tên..."} 
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => { 
                            if(e.key === 'Enter') {
                                e.preventDefault();
                                onCreate(); 
                            } 
                        }}
                        autoFocus
                        style={inputStyle}
                    />
                </Form.Group>
            </Modal.Body>
            <Modal.Footer className="border-0 pt-0 d-flex flex-nowrap justify-content-end gap-2 w-100">
    <Button 
        variant="none" 
        onClick={onHide} 
        style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', color: '#4B5563', borderRadius: '4px', padding: '8px 16px', fontSize: '0.875rem', fontWeight: '500', whiteSpace: 'nowrap' }}
    >
        Hủy
    </Button>
    <Button 
        onClick={onCreate} 
        disabled={!inputValue.trim() || loading}
        style={{ backgroundColor: '#1D559F', color: '#FFFFFF', border: 'none', borderRadius: '4px', padding: '8px 16px', fontSize: '0.875rem', fontWeight: '500', whiteSpace: 'nowrap' }}
    >
        {loading ? <Spinner size="sm" animation="border" /> : 'Lưu lại'}
    </Button>
</Modal.Footer>
        </Modal>
    );
};

export default AddModal;