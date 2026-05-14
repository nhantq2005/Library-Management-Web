
import React, { useContext, useState } from 'react';
import { Form, Button, InputGroup, Row, Col } from 'react-bootstrap';
import { FaLock, FaIdBadge, FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import Apis, { authApi, endpoints } from '../../configs/Apis';
import { MyUserContext } from '../../configs/Context';
import cookies from 'react-cookies'
import { useNavigate, useSearchParams } from 'react-router-dom';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState({ });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState("");
  const [, dispatch] = useContext(MyUserContext);
  const nav = useNavigate();
  const [q] = useSearchParams();
  const infos = [
    {
      field: "username",
      placeholder: "nguyenvana",
      label: "Tên đăng nhập",
      icon: <FaIdBadge size={14} />,
      type: "text",
    },
    {
      field: "password",
      placeholder: "••••••••",
      label: "Mật khẩu",
      icon: <FaLock size={14} />,
      type: "password",
    }
  ];


  const validate = () => {
    for (let u of infos) {
      if (!(u.field in user) || !user[u.field]) {
        setErrors(`Vui lòng nhập ${u.label}!`);
        return false;
      }
    }
    return true;
  };

const login = async (e) => {
        e.preventDefault();

        if (validate() === true) {
            setErrors("");
            
            try {
                setLoading(true);
                
                let res = await Apis.post(endpoints['login'], {...user});
                cookies.save('token', res.data.token);
                
                
                let u = await authApi(res.data.token).get(endpoints['current-user']);
                console.info(u.data);

                dispatch({"type": "LOGIN", "payload": u.data});

                let next = q.get('next');
                if (next)
                    nav(next);
                else
                    nav('/');
            } catch (ex) {
              if (ex.response && ex.response.status === 401) {
                setErrors("Tên đăng nhập hoặc mật khẩu không đúng!");
              } else {
                setErrors("Đã xảy ra lỗi hệ thống. Vui lòng thử lại!");
              }
              console.error(ex);
            } finally {
              setLoading(false);
            }
        }
    }

  return (
    <Form onSubmit={login}>
      {errors && (
        <div className="alert alert-danger" role="alert">
          {errors}
        </div>
      )}
      {infos.map((info) => (
        <Form.Group className="mb-3" key={info.field}>
          <Form.Label>{info.label}</Form.Label>
          <InputGroup>
            <InputGroup.Text className="bg-transparent text-muted">
              {info.icon}
            </InputGroup.Text>
            <Form.Control
              type={info.type === "password" ? (showPassword ? "text" : "password") : info.type}
              name={info.field}
              placeholder={info.placeholder}
              value={user[info.field] || ""}
              onChange={(e) => setUser({ ...user, [info.field]: e.target.value })}
              // isInvalid={errors}
              style={info.type === "password" ? { letterSpacing: '2px' } : {}}
            />
            {info.type === "password" && (
              <InputGroup.Text className="bg-transparent text-muted" style={{ cursor: 'pointer' }} onClick={() => setShowPassword(s => !s)}>
                {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
              </InputGroup.Text>
            )}
            <Form.Control.Feedback type="invalid">{errors}</Form.Control.Feedback>
          </InputGroup>
        </Form.Group>
      ))}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <Form.Check
          type="checkbox"
          label="Ghi nhớ tài khoản"
          id="remember-me"
          className="text-muted"
          style={{ fontSize: '0.9rem' }}
        />
        <a href="#forgot" className="text-decoration-none fw-semibold" style={{ color: '#004085', fontFamily: 'monospace', fontSize: '0.9rem' }}>
          Quên mật khẩu?
        </a>
      </div>

      <Button
        type="submit"
        variant="primary"
        className="w-100 py-2 mb-4 fw-semibold"
        disabled={loading}
        style={{ backgroundColor: '#1c4c96', borderColor: '#1c4c96', fontFamily: 'monospace', letterSpacing: '0.5px' }}
      >
        Đăng Nhập
      </Button>

      <div className="d-flex align-items-center mb-4">
        <div className="flex-grow-1 bg-secondary" style={{ height: '1px', opacity: 0.2 }}></div>
        <span className="px-3 text-muted" style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>Hoặc</span>
        <div className="flex-grow-1 bg-secondary" style={{ height: '1px', opacity: 0.2 }}></div>
      </div>

      <Row className="g-2">
        <Col xs={12}>
          <Button variant="outline-danger" className="w-100 d-flex align-items-center justify-content-center py-2 text-dark" style={{ fontFamily: 'monospace', fontSize: '0.95rem' }}>
            <img src={require('../../assets/google.png')} alt="Google" style={{ width: '20px', height: '20px', marginRight: '8px' }} />
            Đăng nhập bằng Google
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default Login;