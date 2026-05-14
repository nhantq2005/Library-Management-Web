import React, { useRef, useState } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import { FaIdBadge, FaLock, FaRegEnvelope, FaUser, FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { MdPermContactCalendar } from "react-icons/md";
import Apis, { endpoints } from "../../configs/Apis";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isAgree, setIsAgree] = useState(false);
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(false);
    const avatar = useRef();
    const [errors, setErrors] = useState({});
    const nav = useNavigate();
    const infos = [
        {
            field: "name",
            placeholder: "Nguyễn Văn A",
            label: "Họ tên",
            icon: <FaUser size={14} />,
            type: "text",
        },
        {
            field: "email",
            placeholder: "nguyenvana@email.com",
            label: "Email",
            icon: <FaRegEnvelope size={14} />,
            type: "email",
        },
        {
            field: "userRole",
            placeholder: "Sinh viên",
            label: "Vai trò",
            icon: <MdPermContactCalendar size={14} />,
            type: "select",
        },
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
        },
        {
            field: "confirmPassword",
            placeholder: "••••••••",
            label: "Nhập lại mật khẩu",
            icon: <FaLock size={14} />,
            type: "password",
        }
    ]

    const validate = () => {
        let newErrors = {};
        for (let u of infos) {
            if (!(u.field in user) || !user[u.field]) {
                newErrors[u.field] = `Vui lòng nhập ${u.label}!`;
            }
        }
        if (user.password !== user.confirmPassword) {
            newErrors['confirmPassword'] = 'Mật khẩu không khớp!';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const register = async (e) => {
        e.preventDefault();
        if (validate()) {
            let form = new FormData();
            for (let key of Object.keys(user)) {
                if (key !== 'confirmPassword') {
                    form.append(key, user[key]);
                }
            }

            if (avatar.current && avatar.current.files && avatar.current.files.length > 0) {
                form.append('avatar', avatar.current.files[0]);
            }

            try {
                setLoading(true);
                let res = await Apis.post(endpoints['register'], form, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                if (res.status === 201)
                    nav('/login');
                else
                    alert("Hệ thống bị lỗi!");
            } catch (ex) {
                alert("Đăng ký thất bại!\n" + (ex.response?.data?.detail || ex.message));
                console.error(ex);
            } finally {
                setLoading(false);
            }
        }
    };

    return (

        <Form onSubmit={register} style={{ width: '100%', margin: "0 auto", background: "#fff", padding: 24, borderRadius: 8, boxShadow: "0 2px 8px #0001" }}>
            <h4 className="mb-4 text-center" style={{ color: '#003366', fontWeight: 700 }}>Tạo tài khoản thư viện</h4>

            {infos.map((info) => (
                <Form.Group className="mb-3" key={info.field}>
                    <Form.Label>{info.label}</Form.Label>
                    <InputGroup>
                        <InputGroup.Text className="bg-transparent text-muted">
                            {info.icon}
                        </InputGroup.Text>
                        {info.type === "select" ? (
                            <Form.Select name={info.field} value={user[info.field]|| ""} onChange={(e) => setUser((prev) => ({ ...prev, [info.field]: e.target.value }))} isInvalid={errors[info.field]}>
                                <option value="">Chọn vai trò</option>
                                <option value="ROLE_STUDENT">Sinh viên</option>
                                <option value="ROLE_TEACHER">Giảng viên</option>
                                <option value="ROLE_LIBRARIAN">Thủ thư</option>
                            </Form.Select>
                        ) : (
                            <Form.Control
                                type={info.type === "password" ? (showPassword ? "text" : "password") : info.type}
                                name={info.field}
                                placeholder={info.placeholder}
                                value={user[info.field]|| ""}
                                onChange={(e) => setUser({ ...user, [info.field]: e.target.value })}
                                isInvalid={errors[info.field]}
                                style={info.type === "password" ? { letterSpacing: '2px' } : {}}
                            />
                        )}
                        {info.type === "password" && (
                            <InputGroup.Text className="bg-transparent text-muted" style={{ cursor: 'pointer' }}
                                onClick={() => setShowPassword(s => !s)}>
                                {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                            </InputGroup.Text>
                        )}
                        <Form.Control.Feedback type="invalid">{errors[info.field]}</Form.Control.Feedback>
                    </InputGroup>
                </Form.Group>
            ))
            }

            <Form.Group className="mb-3">
                <Form.Label>Ảnh đại diện</Form.Label>
                <Form.Control
                    type="file"
                    name="avatar"
                    accept="image/*"
                    ref={avatar}
                    onChange={(e) => setUser((prev) => ({ ...prev, avatar: e.target.files[0] }))}
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Check
                    type="checkbox"
                    name="agree"
                    label="Tôi đồng ý với Điều khoản & Bảo mật"
                    checked={isAgree}
                    onChange={(e) => setIsAgree(e.target.checked)}
                    isInvalid={!!errors.agree}
                    feedback={errors.agree}
                />
            </Form.Group>

            <Button type="submit" variant="primary"
                disabled={!isAgree || loading}
                className="w-100 py-2 fw-semibold"
                style={{ backgroundColor: '#1c4c96', borderColor: '#1c4c96' }}>
                Đăng ký
            </Button>


        </Form>
    );
};

export default Register;