import React from 'react';
import { Form } from 'react-bootstrap';

const FileUploadBox = ({ 
    label, 
    accept, 
    fileRef, 
    helperText, 
    isRequired 
}) => {
    const labelStyle = { fontSize: '0.85rem', fontWeight: '600', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' };

    return (
        <Form.Group>
            <Form.Label style={labelStyle}>
                {label} {isRequired && <span className="text-danger">*</span>}
            </Form.Label>
            <div className="p-3 text-center rounded-4" style={{ border: '2px dashed #cbd5e1', backgroundColor: '#f8fafc' }}>
                <Form.Control 
                    type="file" 
                    accept={accept} 
                    ref={fileRef} 
                    className="shadow-none border-0 bg-transparent w-100" 
                />
                <small className="text-muted d-block mt-2">
                    {helperText}
                </small>
            </div>
        </Form.Group>
    );
};

export default FileUploadBox;