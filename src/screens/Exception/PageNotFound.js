import { Button } from 'react-bootstrap';
import { FaExclamationTriangle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const PageNotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="d-flex flex-column align-items-center justify-content-center mt-3" >
      <div className="mb-3">
        <FaExclamationTriangle size={60} color="#ff9800" />
      </div>
      <h1 className="display-1 fw-bold mb-2" style={{ color: '#003366', letterSpacing: 2 }}>404</h1>
      <h3 className="mb-3 fw-semibold" style={{ color: '#003366' }}>Trang không tồn tại</h3>
      <p className="text-muted mb-4" style={{ fontSize: '1.1rem', maxWidth: 400, textAlign: 'center' }}>
        Rất tiếc, chúng tôi không thể tìm thấy trang bạn đang tìm kiếm.<br />Vui lòng kiểm tra lại đường dẫn hoặc quay về trang chủ.
      </p>
      <Button variant="primary" className="mb-5" style={{ backgroundColor: '#1c4c96', borderColor: '#1c4c96', fontFamily: 'monospace', fontWeight: 600, letterSpacing: 1, width: '30%' }} onClick={() => navigate(-1)}>
        Quay lại
      </Button>
    </div>
  );
};

export default PageNotFound;