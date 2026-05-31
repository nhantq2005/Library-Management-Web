import React from 'react';
import { Form } from 'react-bootstrap';

const ScrollableCheckboxList = ({ 
    label, 
    items, 
    selectedItems, 
    onChange, 
    fieldName, 
    emptyMessage = "Không có dữ liệu" 
}) => {
    const labelStyle = { fontSize: '0.85rem', fontWeight: '600', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' };

    return (
        <Form.Group className="mb-4">
            <Form.Label style={labelStyle}>{label}</Form.Label>
            <div className="border rounded-3 p-3" style={{ backgroundColor: '#f8fafc', maxHeight: '140px', overflowY: 'auto', borderColor: '#e2e8f0' }}>
                {items.length > 0 ? (
                    items.map(item => (
                        <Form.Check 
                            key={item.id}
                            type="checkbox"
                            label={item.name}
                            value={item.id}
                            checked={(selectedItems || []).includes(item.id)}
                            onChange={(e) => onChange(e, fieldName)}
                            className="mb-1 text-muted"
                        />
                    ))
                ) : (
                    <span className="text-muted fst-italic">{emptyMessage}</span>
                )}
            </div>
        </Form.Group>
    );
};

export default ScrollableCheckboxList;