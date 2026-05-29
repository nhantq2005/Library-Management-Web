import React, { useState, useEffect } from 'react';
import { Row, Col, Table, Form, Spinner } from 'react-bootstrap';
import { authApi } from '../../configs/Apis';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import LoadMoreButton from '../../components/LoadMoreButton';
import cookies from 'react-cookies';
import {
    cardStyle,
    inputStyle,
    thStyle,
    tdStyle,
    badgeStyle
} from './PaymentStatsStyle';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

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
    const [error, setError] = useState("");

    // const loadRevenueStats = async () => {
    //     setStatsLoading(true);
    //     try {
    //         // Gọi đến API backend của bạn
    //         let url = '/stats/secure/revenue-by-document';
    //         let queryParams = [];
    //         if (fromDate) queryParams.push(`fromDate=${fromDate}`);
    //         if (toDate) queryParams.push(`toDate=${toDate}`);
    //         if (queryParams.length > 0) url += `?${queryParams.join('&')}`;

    //         // Sử dụng authApi với token
    //         const res = await authApi(cookies.load('token')).get(url);

    //         // Cập nhật dữ liệu từ API thay vì mock data
    //         setStatsData(res.data || []);
    //     } catch (err) {
    //         console.error("Lỗi tải thống kê doanh thu:", err);
    //         setError("Không thể tải thống kê doanh thu.");
    //         setStatsData([]); // Reset về rỗng nếu lỗi
    //     } finally {
    //         setStatsLoading(false);
    //     }
    // };

    // Fetch transaction history
    // const loadTransactionHistory = async () => {
    // setTxLoading(true);
    // try {
    //     let url = `/stats/secure/revenue-by-document`; // <--- LỖI Ở ĐÂY
    //     if (statusFilter) url += `&status=${statusFilter}`;
    //         const res = await authApi(cookies.load('token')).get(url);
    //         setHasMore(!(res.data.length === 0 || res.data.length < 20));
    //         setTransactions(page === 1 ? res.data : prev => [...prev, ...res.data]);
    //     } catch (err) {
    //         console.error("Lỗi tải lịch sử mua tài liệu:", err);
    //         setError("Không thể tải lịch sử mua tài liệu.");
    //     } finally {
    //         setTxLoading(false);
    //     }
    // };


    const loadRevenueStats = async () => {
        const token = cookies.load('token'); // Lấy token
        if (!token) return; // Nếu không có token thì dừng luôn

        setStatsLoading(true);
        try {
            let url = '/stats/secure/revenue-by-document';
            let queryParams = [];
            if (fromDate) queryParams.push(`fromDate=${fromDate}`);
            if (toDate) queryParams.push(`toDate=${toDate}`);
            if (queryParams.length > 0) url += `?${queryParams.join('&')}`;

            // Truyền biến token vào authApi
            const res = await authApi(token).get(url);
            setStatsData(res.data || []);
        } catch (error) {
            console.error("Lỗi tải thống kê doanh thu:", error);
            setError("Không thể tải thống kê doanh thu.");
            setStatsData([]);
        } finally {
            setStatsLoading(false);
        }
    };

    const loadTransactionHistory = async () => {
        const token = cookies.load('token'); // Lấy token
        if (!token) return; // Nếu không có token thì dừng luôn

        setTxLoading(true);
        try {
            let url = `/stats/secure/transaction-history?page=${page}`;
            if (statusFilter) {
                url += `&status=${statusFilter}`;
            }

            // Truyền biến token vào authApi
            const res = await authApi(token).get(url);

            const responseData = Array.isArray(res.data) ? res.data : [];
            setHasMore(!(responseData.length === 0 || responseData.length < 20));
            setTransactions(page === 1 ? responseData : prev => [...prev, ...responseData]);
        } catch (error) {
            console.error("Lỗi tải lịch sử mua tài liệu:", error);
            setError("Không thể tải lịch sử mua tài liệu.");
            if (page === 1) setTransactions([]);
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
                    '#1D559F', '#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE',
                ],
                borderWidth: 1,
                borderColor: '#FFFFFF',
            },
        ],
    };



    return (
        <div style={{ padding: '32px 40px', backgroundColor: '#F9FAFB', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
            {/* Title */}
            <div className="mb-4">
                <h3 style={{ color: '#111827', fontWeight: '600', letterSpacing: '-0.02em', fontSize: '1.5rem', marginBottom: '4px' }}>
                    Thống kê thanh toán & Thương mại
                </h3>
                <p className="mb-0" style={{ fontSize: '0.875rem', color: '#4B5563' }}>
                    Theo dõi doanh thu, lịch sử mua và hoạt động thanh toán.
                </p>
            </div>

            {/* Summary widgets */}
            <Row className="mb-4">
                <Col md={6} lg={4}>
                    <div style={cardStyle} className="h-100">
                        <div style={{ fontSize: '0.75rem', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                            Tổng Doanh Thu Kinh Doanh
                        </div>
                        <h2 style={{ fontSize: '2rem', fontWeight: '700', color: '#1D559F', margin: 0 }}>
                            {totalRevenue.toLocaleString('vi-VN')} <span style={{ fontSize: '1rem', fontWeight: '600', color: '#4B5563' }}>VNĐ</span>
                        </h2>
                    </div>
                </Col>
                <Col md={6} lg={4}>
                    <div style={cardStyle} className="h-100">
                        <div style={{ fontSize: '0.75rem', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                            Tổng Số Lượt Mua Thành Công
                        </div>
                        <h2 style={{ fontSize: '2rem', fontWeight: '700', color: '#111827', margin: 0 }}>
                            {totalTransactionsCount} <span style={{ fontSize: '1rem', fontWeight: '600', color: '#4B5563' }}>lượt</span>
                        </h2>
                    </div>
                </Col>
            </Row>

            {/* Revenue table & pie chart */}
            <Row className="mb-4">
                {/* Revenue table */}
                <Col lg={7} className="mb-3 mb-lg-0">
                    <div style={cardStyle} className="h-100 d-flex flex-column">
                        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                            <h5 style={{ color: '#111827', fontWeight: '600', fontSize: '1.1rem', margin: 0 }}>Doanh thu theo đầu sách</h5>
                            <div className="d-flex gap-2 align-items-center">
                                <Form.Control
                                    type="date"
                                    value={fromDate}
                                    onChange={e => setFromDate(e.target.value)}
                                    style={{ ...inputStyle, width: '130px' }}
                                />
                                <span style={{ color: '#9CA3AF' }}>-</span>
                                <Form.Control
                                    type="date"
                                    value={toDate}
                                    onChange={e => setToDate(e.target.value)}
                                    style={{ ...inputStyle, width: '130px' }}
                                />
                            </div>
                        </div>

                        {statsLoading ? (
                            <div className="text-center py-5 my-auto">
                                <Spinner animation="border" style={{ color: '#1D559F' }} />
                            </div>
                        ) : (
                            <div style={{ margin: '0 -24px', flexGrow: 1, overflowX: 'auto', overflowY: 'auto', maxHeight: '350px' }}>
                                <Table hover responsive className="align-middle mb-0" style={{ borderTop: '1px solid #E5E7EB' }}>
                                    <thead>
                                        <tr>
                                            <th style={thStyle}>Tên tài liệu</th>
                                            <th style={{ ...thStyle, textAlign: 'center' }}>Số lượt mua</th>
                                            <th style={{ ...thStyle, textAlign: 'right' }}>Tổng tiền (VNĐ)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {statsData.map((item, idx) => (
                                            <tr key={idx}>
                                                <td style={{ ...tdStyle, fontWeight: '500', color: '#1D559F' }}>{item[1]}</td>
                                                <td style={{ ...tdStyle, textAlign: 'center', color: '#4B5563' }}>{item[2]}</td>
                                                <td style={{ ...tdStyle, textAlign: 'right', fontWeight: '600' }}>{(item[3] || 0).toLocaleString('vi-VN')} đ</td>
                                            </tr>
                                        ))}
                                        {statsData.length === 0 && (
                                            <tr>
                                                <td colSpan="3" className="text-center py-5 text-muted" style={{ fontSize: '0.875rem' }}>
                                                    Không có dữ liệu kinh doanh trong thời gian này
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </div>
                        )}
                    </div>
                </Col>

                {/* Pie chart */}
                <Col lg={5}>
                    <div style={cardStyle} className="h-100 d-flex flex-column justify-content-between">
                        <h5 style={{ color: '#111827', fontWeight: '600', fontSize: '1.1rem', marginBottom: '24px' }}>Tỷ lệ đóng góp doanh thu (Top 5)</h5>
                        <div style={{ height: '260px', position: 'relative' }} className="d-flex justify-content-center">
                            {statsData.length > 0 ? (
                                <Pie
                                    data={pieChartData}
                                    options={{
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: {
                                                position: 'bottom',
                                                labels: { boxWidth: 12, font: { family: 'Inter', size: 11 }, color: '#4B5563' },
                                            },
                                        },
                                    }}
                                />
                            ) : (
                                <div className="text-center my-auto" style={{ color: '#9CA3AF', fontSize: '0.875rem' }}>Chưa có thông số</div>
                            )}
                        </div>
                    </div>
                </Col>
            </Row>

            {/* Transaction history */}
            <div style={cardStyle}>
                <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                    <h5 style={{ color: '#111827', fontWeight: '600', fontSize: '1.1rem', margin: 0 }}>Nhật ký giao dịch mua tài liệu</h5>
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
                        <Spinner animation="border" style={{ color: '#1D559F' }} />
                    </div>
                ) : (
                    <>
                        <div style={{ margin: '0 -24px' }}>
                            <Table hover responsive className="align-middle mb-0" style={{ borderTop: '1px solid #E5E7EB' }}>
                                <thead>
                                    <tr>
                                        <th style={thStyle}>Ngày GD</th>
                                        <th style={thStyle}>Khách hàng</th>
                                        <th style={thStyle}>Tên tài liệu</th>
                                        <th style={thStyle}>Phương thức</th>
                                        <th style={{ ...thStyle, textAlign: 'right' }}>Số tiền</th>
                                        <th style={{ ...thStyle, textAlign: 'center' }}>Trạng thái</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.map((tx, idx) => (
                                        <tr key={idx}>
                                            <td style={{ ...tdStyle, color: '#6B7280' }}>{tx.transactionDate ? new Date(tx.transactionDate).toLocaleString('vi-VN') : '---'}</td>
                                           <td style={{ ...tdStyle, fontWeight: '500' }}>{tx.username || 'Ẩn danh'}</td>
<td style={{ ...tdStyle, fontWeight: '500', color: '#1D559F' }}>{tx.documentTitle || 'Tài liệu không còn tồn tại'}</td>
<td style={tdStyle}>
                                                <span style={{ ...badgeStyle, backgroundColor: '#F3F4F6', color: '#4B5563' }}>{tx.paymentMethod || 'VNPay'}</span>
                                            </td>
                                            <td style={{ ...tdStyle, textAlign: 'right', fontWeight: '600' }}>{(tx.amount || 0).toLocaleString('vi-VN')} đ</td>
                                            <td style={{ ...tdStyle, textAlign: 'center' }}>
                                                {tx.status === 'SUCCESS' ? (
                                                    <span style={{ ...badgeStyle, backgroundColor: '#DCFCE7', color: '#166534' }}>Thành công</span>
                                                ) : tx.status === 'FAILED' ? (
                                                    <span style={{ ...badgeStyle, backgroundColor: '#FEE2E2', color: '#991B1B' }}>Thất bại</span>
                                                ) : (
                                                    <span style={{ ...badgeStyle, backgroundColor: '#FEF08A', color: '#854D0E' }}>{tx.status}</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {transactions.length === 0 && (
                                        <tr>
                                            <td colSpan="6" className="text-center py-5 text-muted" style={{ fontSize: '0.875rem' }}>
                                                <div className="mb-2" style={{ fontSize: '1.5rem' }}>📬</div>
                                                Không tìm thấy lịch sử giao dịch nào phù hợp.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </div>

                        {hasMore && transactions.length > 0 && (
                            <div className="mt-4">
                                <LoadMoreButton onClick={() => setPage(prev => prev + 1)} isLoading={txLoading} />
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default PaymentStats;