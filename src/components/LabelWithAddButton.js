import React from 'react';

const LabelWithAddButton = ({ title, onAddClick }) => {
    return (
        <div className="d-flex justify-content-between align-items-center w-100 pb-1 ms-2">
            <span style={{ color: '#4B5563', letterSpacing: '0.05em' }}>{title}</span>
            <div 
                className="d-flex align-items-center justify-content-center"
                style={{ 
                    color: '#1D559F', 
                    backgroundColor: '#EFF6FF', 
                    cursor: 'pointer', 
                    fontWeight: '600', 
                    fontSize: '0.75rem',
                    padding: '4px 10px',
                    borderRadius: '4px',
                    transition: 'all 0.2s ease',
                    border: '1px solid #BFDBFE',
                    textTransform: 'none',
                    letterSpacing: 'normal'
                }}
                onClick={onAddClick}
                onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#DBEAFE'; }}
                onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#EFF6FF'; }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" className="me-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Thêm
            </div>
        </div>
    );
};

export default LabelWithAddButton;