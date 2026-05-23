import { Button } from "react-bootstrap";
import { MdDeleteOutline } from "react-icons/md";

const DeleteButton = ({ onClick, isLoading }) => {
    return (
        <Button
            variant="light"
            size="sm"
            className="d-flex align-items-center justify-content-center border"
            style={{ borderRadius: '8px', color: '#ef4444', transition: 'all 0.2s ease' }}
            onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#fef2f2';
                e.currentTarget.style.borderColor = '#fca5a5';
            }}
            onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#f8f9fa';
                e.currentTarget.style.borderColor = '#dee2e6';
            }}
            onClick={onClick}
            title="Xóa"
        >
            <MdDeleteOutline size={20} />
        </Button>
    );
}

export default DeleteButton;