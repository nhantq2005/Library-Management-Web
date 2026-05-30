import { Button, Spinner } from "react-bootstrap";

const LoadMoreButton = ({ onClick, isLoading }) => {
    return (
        <div className="d-flex justify-content-center mt-4 mb-2">
            <Button
                variant="none"
                className="fw-semibold px-4 py-2 shadow-sm"
                style={{
                    color: '#1D559F',
                    border: '1px solid #e2e8f0',
                    backgroundColor: '#ffffff',
                    borderRadius: '10px',
                    fontSize: '0.9rem',
                    transition: 'all 0.2s ease',
                }}
                onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#f8fafc';
                    e.currentTarget.style.borderColor = '#1D559F';
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = '#ffffff';
                    e.currentTarget.style.borderColor = '#e2e8f0';
                }}
                onClick={onClick}
                disabled={isLoading}
            >
                {isLoading ? <Spinner animation="border" size="sm" /> : 'Tải thêm trang tiếp theo...'}
            </Button>
        </div>
    );
};

export default LoadMoreButton;