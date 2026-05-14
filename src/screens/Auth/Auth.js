import { FaArrowLeft } from 'react-icons/fa';
import React from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import { FaBookOpen } from 'react-icons/fa';
import Register from './Register';
import Login from './Login';
import Footer from '../../components/Footer';
import { useNavigate} from 'react-router-dom';

const Auth = ({ page }) => {
  const navigate = useNavigate();
  const isLogin = page === 'login';

  return (
    <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: '#f8f9fa' }}>
      <Container className="flex-grow-1 d-flex align-items-center justify-content-center py-5">
        <Card className="border-0 shadow-sm" style={{ width: '100%', maxWidth: '550px', borderRadius: '4px' }}>
          <Card.Body className="p-4 p-sm-5">
            {/* Back Button */}
            <Button variant="link" className="px-0 mb-3 text-decoration-none text-dark" style={{ fontSize: '1rem' }} onClick={() => navigate(-1)}>
              <FaArrowLeft className="me-2" /> Quay lại
            </Button>
            {/* Logo & Header */}
            <div className="text-center mb-4">
              <div
                className="d-inline-flex align-items-center justify-content-center mb-3"
                style={{ width: '50px', height: '50px', backgroundColor: '#003366', borderRadius: '4px' }}
              >
                <FaBookOpen size={24} color="white" />
              </div>
              <h3 className="fw-bold" style={{ color: '#003366' }}>eLibrary</h3>
              <p className="text-muted" style={{ fontSize: '0.85rem' }}>
                Quản lý & Khám phá Danh mục Chuyên nghiệp
              </p>
            </div>

            <div className="d-flex bg-light p-1 mb-4" style={{ borderRadius: '4px' }}>
              <Button
                variant={isLogin ? "white" : "light"}
                className={`flex-fill fw-semibold border-0 ${isLogin ? 'shadow-sm' : 'text-muted bg-transparent'}`}
                style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}
                onClick={() => navigate('/login')}
              >
                Đăng nhập
              </Button>
              <Button
                variant={!isLogin ? "white" : "light"}
                className={`flex-fill fw-semibold border-0 ${!isLogin ? 'shadow-sm' : 'text-muted bg-transparent'}`}
                style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}
                onClick={() => navigate('/register')}
              >
                Đăng ký
              </Button>
            </div>

            {isLogin ? <Login /> : <Register />}
          </Card.Body>

          <Card.Footer className="text-center py-3 border-0 bg-light text-muted" style={{ fontSize: '0.8rem' }}>
            Được bảo vệ bởi Hệ thống bảo mật eLibrary. <a href="#privacy" className="text-decoration-none" style={{ color: '#004085' }}>Chính sách bảo mật</a>.
          </Card.Footer>
        </Card>
      </Container>
      
      <Footer />
    </div>
  );
};

export default Auth;