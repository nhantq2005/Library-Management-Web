import React, { useState, useEffect } from 'react';
import { Table, Spinner, Button, Form, InputGroup, Row, Col, Badge, Card } from 'react-bootstrap';
import { authApi, endpoints } from '../../configs/Apis';
import {  Chart as ChartJS,  CategoryScale,  LinearScale,  BarElement,
  Title,  Tooltip,  Legend,} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { RiErrorWarningLine } from 'react-icons/ri';
import LoadMoreButton from '../../components/LoadMoreButton';

// Đăng ký các thành phần của Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJsaWJyYXJpYW4wMSIsInJvbGUiOiJST0xFX0xJQlJBUklBTiIsImV4cCI6MTc3OTU2Njk3MSwiaWF0IjoxNzc5NDgwNTcxfQ.6I3wLNVu_Mv87GJ3VAZ0SngQLBiihcJg1KyqnwIlPH4"; // Thay bằng Token thực tế từ Context/Redux

const BorrowStats = () => {
    // State cho Danh sách mượn trả
    const [borrows, setBorrows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    
    // State cho Bộ lọc
    const [kw, setKw] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    // State cho Biểu đồ & Thống kê
    const [chartData, setChartData] = useState([]);
    const [overdueDocs, setOverdueDocs] = useState([]);
    const [statYear, setStatYear] = useState(new Date().getFullYear());
    const [chartLoading, setChartLoading] = useState(false);

    // 1. GỌI API LẤY BIỂU ĐỒ & DANH SÁCH QUÁ HẠN
    useEffect(() => {
        const loadStats = async () => {
            setChartLoading(true);
            try {
                // API lấy thống kê mượn sách theo năm
                // Trả về dạng [id, title, count]
                let resStats = await authApi(TOKEN).get(`/stats/secure/borrowing?year=${statYear}`);
                setChartData(resStats.data);

                // API lấy danh sách sách quá hạn chưa trả
                let resOverdue = await authApi(TOKEN).get('/stats/secure/overdue-documents');
                setOverdueDocs(resOverdue.data);
            } catch (error) {
                console.error("Lỗi tải thống kê:", error);
            } finally {
                setChartLoading(false);
            }
        };
        loadStats();
    }, [statYear]);

    // 2. GỌI API LẤY DANH SÁCH PHIẾU MƯỢN (CÓ LỌC)
    const loadBorrows = async () => {
        try {
            if (page === 1) setLoading(true);
            
            let url = `/secure/borrows?page=${page}`;
            if (kw) url += `&kw=${kw}`;
            if (statusFilter) url += `&status=${statusFilter}`;

            let res = await authApi(TOKEN).get(url);
            
            if (res.data.length === 0 || res.data.length < 20) {
                setHasMore(false);
            } else {
                setHasMore(true);
            }

            if (page === 1) {
                setBorrows(res.data);
            } else {
                setBorrows(prev => [...prev, ...res.data]);
            }
        } catch (error) {
            console.error("Lỗi tải danh sách phiếu mượn:", error);
        } finally {
            setLoading(false);
        }
    };

    // Theo dõi thay đổi của trang, keyword, status để gọi lại API
    useEffect(() => {
        loadBorrows();
    }, [page, kw, statusFilter]);

    // Debounce cho ô tìm kiếm (sau 500ms mới setKw)
    useEffect(() => {
        const timer = setTimeout(() => {
            if (kw !== searchInput) {
                setKw(searchInput);
                setPage(1); // Reset về trang 1
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [searchInput, kw]);

    const handleFilterStatus = (e) => {
        setStatusFilter(e.target.value);
        setPage(1); // Reset về trang 1
    };

    // CẤU HÌNH BIỂU ĐỒ BAR
    const barChartData = {
        labels: chartData.slice(0, 10).map(item => item[1].length > 25 ? item[1].substring(0, 25) + '...' : item[1]), // Lấy 10 sách top đầu, cắt ngắn tên
        datasets: [
            {
                label: 'Số lượt mượn',
                data: chartData.slice(0, 10).map(item => item[2]), // Lấy số lượng count
                backgroundColor: 'rgba(79, 70, 229, 0.7)',
                borderColor: 'rgba(79, 70, 229, 1)',
                borderWidth: 1,
                borderRadius: 4,
            },
        ],
    };

    const barChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: `Top 10 tài liệu được mượn nhiều nhất năm ${statYear}` },
        },
        scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
    };

    // UI Styles
    const inputStyle = { backgroundColor: '#fdfdfd', border: '1px solid #e2e8f0', color: '#334155' };

    return (
        <div style={{ padding: '32px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
            
            {/* PHẦN 1: HEADER & CẢNH BÁO */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h3 className="mb-1" style={{ color: '#0f172a', fontWeight: '700', letterSpacing: '-0.02em' }}>
                        Thống kê mượn trả
                    </h3>
                    
                </div>
                {overdueDocs.length > 0 && (
                    <div className="bg-danger text-white px-4 py-2 rounded-3 shadow-sm fw-semibold d-flex align-items-center gap-2">
                        <RiErrorWarningLine size={20} />
                        Cảnh báo: Có {overdueDocs.length} phiếu mượn đang quá hạn!
                    </div>
                )}
            </div>

            {/* PHẦN 2: BIỂU ĐỒ THỐNG KÊ */}
            <Row className="mb-4">
                <Col md={12}>
                    <Card className="border-0 shadow-sm rounded-4 h-100 p-4">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h5 className="mb-0 fw-bold text-dark">Biểu đồ lượt mượn tài liệu</h5>
                            <Form.Select 
                                value={statYear} 
                                onChange={(e) => setStatYear(e.target.value)}
                                style={{ width: '120px', ...inputStyle }}
                            >
                                <option value="2024">Năm 2024</option>
                                <option value="2025">Năm 2025</option>
                                <option value="2026">Năm 2026</option>
                            </Form.Select>
                        </div>
                        <div style={{ height: '350px' }}>
                            {chartLoading ? (
                                <div className="h-100 d-flex justify-content-center align-items-center">
                                    <Spinner animation="border" variant="primary" />
                                </div>
                            ) : chartData.length > 0 ? (
                                <Bar data={barChartData} options={barChartOptions} />
                            ) : (
                                <div className="h-100 d-flex justify-content-center align-items-center text-muted">
                                    Không có dữ liệu thống kê cho năm này
                                </div>
                            )}
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* PHẦN 3: DANH SÁCH PHIẾU MƯỢN */}
            <Card className="border-0 shadow-sm rounded-4 p-4">
                <h5 className="mb-3 fw-bold text-dark">Danh sách phiếu mượn</h5>
                
                {/* THANH TÌM KIẾM & LỌC */}
                <div className="d-flex gap-3 mb-4 flex-wrap">
                    <InputGroup style={{ maxWidth: '400px', borderRadius: '10px', overflow: 'hidden' }}>
                        <InputGroup.Text className="border-0 px-3 bg-light text-muted">🔍</InputGroup.Text>
                        <Form.Control
                            className="border-0 shadow-none bg-light"
                            placeholder="Tìm theo tên tài liệu..."
                            value={searchInput}
                            onChange={e => setSearchInput(e.target.value)}
                        />
                    </InputGroup>

                    <Form.Select 
                        value={statusFilter} 
                        onChange={handleFilterStatus}
                        style={{ maxWidth: '200px', borderRadius: '10px', ...inputStyle }}
                    >
                        <option value="">Tất cả trạng thái</option>
                        <option value="PENDING">Đang chờ</option>
                        <option value="BORROWING">Đang mượn</option>
                        <option value="RETURNED">Đã trả</option>
                        <option value="OVERDUE">Quá hạn</option>
                    </Form.Select>
                </div>

                {/* BẢNG DỮ LIỆU */}
                {loading && page === 1 ? (
                    <div className="d-flex justify-content-center py-5"><Spinner animation="border" variant="primary" /></div>
                ) : (
                    <>
                        <Table hover responsive className="align-middle mb-0">
                            <thead style={{ backgroundColor: '#f8fafc', color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                                <tr>
                                    <th className="border-0 py-3 px-3" style={{ borderRadius: '8px 0 0 8px' }}>Mã phiếu</th>
                                    <th className="border-0 py-3">Người mượn</th>
                                    <th className="border-0 py-3">Tài liệu</th>
                                    <th className="border-0 py-3">Ngày mượn</th>
                                    <th className="border-0 py-3">Ngày trả (Dự kiến)</th>
                                    <th className="border-0 py-3" style={{ borderRadius: '0 8px 8px 0' }}>Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                {borrows.length > 0 ? (
                                    borrows.map((b) => (
                                        <tr key={b.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                            <td className="px-3 fw-bold text-primary">#{b.id}</td>
                                            <td className="fw-medium">{b.name || 'N/A'}</td>
                                            <td className="fw-semibold text-dark">{b.documentTitle || 'N/A'}</td>
                                            <td className="text-muted">{b.borrowedDate ? new Date(b.borrowedDate).toLocaleDateString('vi-VN') : '---'}</td>
                                            <td className="text-muted">{b.returnDate ? new Date(b.returnDate).toLocaleDateString('vi-VN') : '---'}</td>
                                            <td>
                                                {b.status === 'PENDING' && <Badge bg="warning" text="dark" className="px-3 py-2 rounded-pill">Đang chờ</Badge>}
                                                {b.status === 'BORROWING' && <Badge bg="primary" className="px-3 py-2 rounded-pill">Đang mượn</Badge>}
                                                {b.status === 'RETURNED' && <Badge bg="success" className="px-3 py-2 rounded-pill">Đã trả</Badge>}
                                                {b.status === 'OVERDUE' && <Badge bg="danger" className="px-3 py-2 rounded-pill">Quá hạn</Badge>}
                                                {/* Fallback nếu có trạng thái lạ */}
                                                {!['PENDING', 'BORROWING', 'RETURNED', 'OVERDUE'].includes(b.status) && <Badge bg="secondary" className="px-3 py-2 rounded-pill">{b.status}</Badge>}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-center py-5 text-muted">
                                            <div className="fs-4 mb-2">📭</div>
                                            Không tìm thấy phiếu mượn nào phù hợp.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>

                        {/* NÚT TẢI THÊM */}
                        {hasMore && borrows.length > 0 && (
                            <LoadMoreButton onClick={() => setPage(prev => prev + 1)} isLoading={loading} />
                        )}
                    </>
                )}
            </Card>
        </div>
    );
};

export default BorrowStats;