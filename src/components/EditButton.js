import { Button } from "react-bootstrap";
import { FaRegEdit } from "react-icons/fa";

const EditButton = ({ onClick }) => {
    return (
        <Button
            variant="light"
            size="sm"
            className="d-flex align-items-center justify-content-center border"
            style={{ borderRadius: '8px', color: '#3b82f6', transition: 'all 0.2s ease' }}
            onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#eff6ff';
                e.currentTarget.style.borderColor = '#93c5fd';
            }}
            onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#f8f9fa';
                e.currentTarget.style.borderColor = '#dee2e6';
            }}
            onClick={onClick}
            title="Chỉnh sửa"
        >
            <FaRegEdit size={20} />
        </Button>
    );
}

export default EditButton;