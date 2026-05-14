import { Button } from 'react-bootstrap';
import { FaBan } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Forbidden = () => {
	const navigate = useNavigate();
	return (
		<div className="d-flex flex-column align-items-center justify-content-center mt-3">
			<div className="mb-3">
				<FaBan size={60} color="#e53935" />
			</div>
			<h1 className="display-3 fw-bold mb-2" style={{ color: '#b71c1c', letterSpacing: 2 }}>403</h1>
			<h3 className="mb-3 fw-semibold" style={{ color: '#b71c1c' }}>Truy cập bị từ chối</h3>
			<p className="text-muted mb-4" style={{ fontSize: '1.1rem', maxWidth: 400, textAlign: 'center' }}>
				Bạn không có quyền truy cập vào trang này.<br />Vui lòng kiểm tra lại quyền truy cập hoặc quay về trang trước.
			</p>
			<Button variant="danger" style={{ backgroundColor: '#e53935', borderColor: '#e53935', fontFamily: 'monospace', fontWeight: 600, letterSpacing: 1 }} onClick={() => navigate(-1)}>
				Quay lại
			</Button>
		</div>
	);
};

export default Forbidden;
