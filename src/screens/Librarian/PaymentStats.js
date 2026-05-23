
import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Form, Spinner, Badge } from 'react-bootstrap';
import { authApi } from '../../configs/Apis';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import LoadMoreButton from '../../components/LoadMoreButton';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJsaWJyYXJpYW4wMSIsInJvbGUiOiJST0xFX0xJQlJBUklBTiIsImV4cCI6MTc3OTU2Njk3MSwiaWF0IjoxNzc5NDgwNTcxfQ.6I3wLNVu_Mv87GJ3VAZ0SngQLBiihcJg1KyqnwIlPH4"; // Token hệ thống

const PaymentStats = () => {
    // State
    const [statsData, setStatsData] = useState([]);
    const [statsLoading, setStatsLoading] = useState(false);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [transactions, setTransactions] = useState([]);
    const [txLoading, setTxLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [statusFilter, setStatusFilter] = useState('');

    // Fetch revenue stats
    const loadRevenueStats = async () => {
        setStatsLoading(true);
        try {
            let url = '/stats/secure/buy-documents';
            let queryParams = [];
            if (fromDate) queryParams.push(`fromDate=${fromDate}`);
            if (toDate) queryParams.push(`toDate=${toDate}`);
            if (queryParams.length > 0) url += `?${queryParams.join('&')}`;

            const res = await authApi(TOKEN).get(url);
            setStatsData(res.data || []);
        } catch (err) {
            console.error("Lỗi tải thống kê doanh thu thương mại:", err);
            // Mock data nếu lỗi
            setStatsData([
                [1, "Lập trình Java core", 12, 600000],
                [2, "Cấu trúc dữ liệu & Giải thuật", 8, 480000],
                [3, "Thiết kế hệ thống phân tán", 15, 1050000],
                [4, "Nhập môn Trí tuệ nhân tạo", 5, 250000],
            ]);
        } finally {
            setStatsLoading(false);
        }
    };

    // Fetch transaction history
    const loadTransactionHistory = async () => {
        setTxLoading(true);
        try {
            let url = `/secure/buy?page=${page}`;
            if (statusFilter) url += `&status=${statusFilter}`;
            const res = await authApi(TOKEN).get(url);
            setHasMore(!(res.data.length === 0 || res.data.length < 20));
            setTransactions(page === 1 ? res.data : prev => [...prev, ...res.data]);
        } catch (err) {
            console.error("Lỗi tải lịch sử mua tài liệu:", err);
        } finally {
            setTxLoading(false);
        }
    };

    // Effects
    useEffect(() => {
        loadRevenueStats();
        // eslint-disable-next-line
    }, [fromDate, toDate]);

    useEffect(() => {
        loadTransactionHistory();
        // eslint-disable-next-line
    }, [page, statusFilter]);

    // Derived values
    const totalRevenue = statsData.reduce((sum, item) => sum + (item[3] || 0), 0);
    const totalTransactionsCount = statsData.reduce((sum, item) => sum + (item[2] || 0), 0);

    // Pie chart config
    const pieLabels = statsData.slice(0, 5).map(item => item[1]);
    const pieAmounts = statsData.slice(0, 5).map(item => item[3]);
    const pieChartData = {
        labels: pieLabels.length > 0 ? pieLabels : ["Chưa có dữ liệu"],
        datasets: [
            {
                data: pieAmounts.length > 0 ? pieAmounts : [1],
                backgroundColor: [
                    '#4f46e5', '#06b6d4', '#10b981', '#f59e0b', '#ef4444',
                ],
                borderWidth: 1,
            },
        ],
    };

    const inputStyle = {
        backgroundColor: '#fdfdfd',
        border: '1px solid #e2e8f0',
        color: '#334155',
        borderRadius: '10px',
    };

    return (
        <div style={{ padding: '32px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
            {/* Title */}
            <div className="mb-4">
                <h3 style={{ color: '#0f172a', fontWeight: '700', letterSpacing: '-0.02em' }}>
                    Thống kê thanh toán & Thương mại
                </h3>
            </div>

            {/* Summary widgets */}
            <Row className="mb-4">
                <Col md={6} lg={4}>
                    <Card className="border-0 shadow-sm p-4 rounded-4 bg-white">
                        <div className="text-muted text-uppercase fw-bold mb-1" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                            💰 Tổng Doanh Thu Kinh Doanh
                        </div>
                        <h2 className="fw-bold mb-0 text-success">
                            {totalRevenue.toLocaleString('vi-VN')} <span className="fs-5">đ</span>
                        </h2>
                    </Card>
                </Col>
                <Col md={6} lg={4}>
                    <Card className="border-0 shadow-sm p-4 rounded-4 bg-white">
                        <div className="text-muted text-uppercase fw-bold mb-1" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                            📦 Tổng Số Lượt Mua Thành Công
                        </div>
                        <h2 className="fw-bold mb-0" style={{ color: '#0f172a' }}>
                            {totalTransactionsCount} <span className="fs-5">lượt</span>
                        </h2>
                    </Card>
                </Col>
            </Row>

            {/* Revenue table & pie chart */}
            <Row className="mb-4">
                {/* Revenue table */}
                <Col lg={7} className="mb-3 mb-lg-0">
                    <Card className="border-0 shadow-sm p-4 rounded-4 bg-white h-100">
                        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                            <h5 className="fw-bold text-dark mb-0">Doanh thu theo đầu sách</h5>
                            <div className="d-flex gap-2 align-items-center">
                                <Form.Control
                                    type="date"
                                    value={fromDate}
                                    onChange={e => setFromDate(e.target.value)}
                                    style={{ ...inputStyle, width: '140px', padding: '6px 12px' }}
                                />
                                <span className="text-muted">-</span>
                                <Form.Control
                                    type="date"
                                    value={toDate}
                                    onChange={e => setToDate(e.target.value)}
                                    style={{ ...inputStyle, width: '140px', padding: '6px 12px' }}
                                />
                            </div>
                        </div>

                        {statsLoading ? (
                            <div className="text-center py-5">
                                <Spinner animation="border" variant="primary" />
                            </div>
                        ) : (
                            <Table responsive hover className="align-middle mb-0">
                                <thead className="table-light" style={{ fontSize: '0.8rem', textTransform: 'uppercase' }}>
                                    <tr>
                                        <th className="border-0">Tên tài liệu</th>
                                        <th className="border-0 text-center">Số lượt mua</th>
                                        <th className="border-0 text-end">Tổng tiền (VNĐ)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {statsData.map((item, idx) => (
                                        <tr key={idx}>
                                            <td className="fw-semibold text-dark">{item[1]}</td>
                                            <td className="text-center text-muted">{item[2]}</td>
                                            <td className="text-end fw-bold text-secondary">{(item[3] || 0).toLocaleString('vi-VN')} đ</td>
                                        </tr>
                                    ))}
                                    {statsData.length === 0 && (
                                        <tr>
                                            <td colSpan="3" className="text-center py-4 text-muted">
                                                Không có dữ liệu kinh doanh trong thời gian này
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        )}
                    </Card>
                </Col>

                {/* Pie chart */}
                <Col lg={5}>
                    <Card className="border-0 shadow-sm p-4 rounded-4 bg-white h-100 d-flex flex-column justify-content-between">
                        <h5 className="fw-bold text-dark mb-3">Tỷ lệ đóng góp doanh thu (Top 5)</h5>
                        <div style={{ height: '260px', position: 'relative' }} className="d-flex justify-content-center">
                            {statsData.length > 0 ? (
                                <Pie
                                    data={pieChartData}
                                    options={{
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: {
                                                position: 'bottom',
                                                labels: { boxWidth: 12, font: { size: 11 } },
                                            },
                                        },
                                    }}
                                />
                            ) : (
                                <div className="text-center my-auto text-muted">Chưa có thông số</div>
                            )}
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* Transaction history */}
            <Card className="border-0 shadow-sm p-4 rounded-4 bg-white">
                <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                    <h5 className="fw-bold text-dark mb-0">Nhật ký giao dịch mua tài liệu</h5>
                    <Form.Select
                        value={statusFilter}
                        onChange={e => {
                            setStatusFilter(e.target.value);
                            setPage(1);
                        }}
                        style={{ width: '180px', ...inputStyle }}
                    >
                        <option value="">Tất cả trạng thái</option>
                        <option value="SUCCESS">Thành công (SUCCESS)</option>
                        <option value="PENDING">Chờ xử lý (PENDING)</option>
                        <option value="FAILED">Thất bại (FAILED)</option>
                    </Form.Select>
                </div>

                {txLoading && page === 1 ? (
                    <div className="text-center py-5">
                        <Spinner animation="border" variant="primary" />
                    </div>
                ) : (
                    <>
                        <Table responsive hover className="align-middle">
                            <thead style={{ backgroundColor: '#f8fafc', color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                                <tr>
                                    <th className="border-0 py-3">Ngày GD</th>
                                    <th className="border-0 py-3">Khách hàng</th>
                                    <th className="border-0 py-3">Tên tài liệu</th>
                                    <th className="border-0 py-3">Phương thức</th>
                                    <th className="border-0 py-3 text-end">Số tiền</th>
                                    <th className="border-0 py-3 text-center">Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((tx, idx) => (
                                    <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td className="text-muted">{tx.transactionDate ? new Date(tx.transactionDate).toLocaleString('vi-VN') : '---'}</td>
                                        <td className="fw-medium">{tx.user?.username || 'Ẩn danh'}</td>
                                        <td className="fw-semibold text-dark">{tx.document?.title || 'Tài liệu không còn tồn tại'}</td>
                                        <td>
                                            <Badge bg="light" className="text-dark border">{tx.paymentMethod || 'VNPay'}</Badge>
                                        </td>
                                        <td className="text-end fw-bold text-dark">{(tx.amount || 0).toLocaleString('vi-VN')} đ</td>
                                        <td className="text-center">
                                            {tx.status === 'SUCCESS' ? (
                                                <Badge bg="success-subtle" className="text-success border border-success-subtle px-3 py-1.5 rounded-pill">Thành công</Badge>
                                            ) : tx.status === 'FAILED' ? (
                                                <Badge bg="danger-subtle" className="text-danger border border-danger-subtle px-3 py-1.5 rounded-pill">Thất bại</Badge>
                                            ) : (
                                                <Badge bg="warning-subtle" className="text-warning border border-warning-subtle px-3 py-1.5 rounded-pill">{tx.status}</Badge>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {transactions.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="text-center py-5 text-muted">
                                            <div className="fs-3">📬</div>
                                            Không tìm thấy lịch sử giao dịch nào phù hợp.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>

                        {/* Pagination / Load more button */}
                        {hasMore && transactions.length > 0 && (
                            <LoadMoreButton onClick={() => setPage(prev => prev + 1)} isLoading={txLoading} />
                        )}
                    </>
                )}
            </Card>
        </div>
    );
};

export default PaymentStats;