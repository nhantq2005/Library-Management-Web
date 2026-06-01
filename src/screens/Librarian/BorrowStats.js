import React, { useState, useEffect } from 'react';
import { Table, Spinner, Form, InputGroup, Row, Col } from 'react-bootstrap';
import { authApi } from '../../configs/Apis';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { RiErrorWarningLine } from 'react-icons/ri';
import LoadMoreButton from '../../components/LoadMoreButton';
import cookies from 'react-cookies';
import {borrowStatsStyles} from '../../style/BorrowStatsStyle';
import { IoSearchSharp } from 'react-icons/io5';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BorrowStats = () => {
    const [borrows, setBorrows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const [kw, setKw] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const [chartData, setChartData] = useState([]);
    const [overdueDocs, setOverdueDocs] = useState([]);
    const [statYear, setStatYear] = useState(new Date().getFullYear());
    const [isChartLoading, setIsChartLoading] = useState(false);

    useEffect(() => {
        const loadStats = async () => {
            setIsChartLoading(true);
            try {
                let resStats = await authApi(cookies.load('token')).get(`/stats/secure/borrowing?year=${statYear}`);
                setChartData(resStats.data);

                let resOverdue = await authApi(cookies.load('token')).get('/stats/secure/overdue-documents');
                setOverdueDocs(resOverdue.data);
            } catch (error) {
                console.error("Lỗi tải thống kê:", error);
            } finally {
                setIsChartLoading(false);
            }
        };
        loadStats();
    }, [statYear]);

    const loadBorrows = async () => {
        try {
            if (page === 1) setLoading(true);

            let url = `/secure/borrows?page=${page}`;
            if (kw) url += `&kw=${kw}`;
            if (statusFilter) url += `&status=${statusFilter}`;

            let res = await authApi(cookies.load('token')).get(url);

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

    useEffect(() => {
        loadBorrows();
    }, [page, kw, statusFilter]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (kw !== searchInput) {
                setKw(searchInput);
                setPage(1);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [searchInput, kw]);

    const handleFilterStatus = (e) => {
        setStatusFilter(e.target.value);
        setPage(1);
    };

    const barChartData = {
        labels: chartData.slice(0, 10).map(item => item[1].length > 25 ? item[1].substring(0, 25) + '...' : item[1]),
        datasets: [
            {
                label: 'Số lượt mượn',
                data: chartData.slice(0, 10).map(item => item[2]),
                backgroundColor: '#1D559F', 
                borderColor: '#154078',
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

    return (
        <div style={borrowStatsStyles.containerStyle}>

            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h3 className="mb-1" style={borrowStatsStyles.headerTitle}>
                        Thống kê mượn trả
                    </h3>
                    <p className="mb-0" style={borrowStatsStyles.headerDesc}>
                        Quản lý hoạt động mượn tài liệu và theo dõi quá hạn.
                    </p>
                </div>
                {overdueDocs.length > 0 && (
                    <div style={borrowStatsStyles.overdueAlert}>
                        <RiErrorWarningLine size={18} />
                        Cảnh báo: Có {overdueDocs.length} phiếu mượn đang quá hạn!
                    </div>
                )}
            </div>

            <Row className="mb-4">
                <Col md={12}>
                    <div style={borrowStatsStyles.chartCard}>
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h5 className="mb-0" style={borrowStatsStyles.chartCardTitle}>Biểu đồ lượt mượn tài liệu</h5>
                            <Form.Select
                                value={statYear}
                                onChange={(e) => setStatYear(e.target.value)}
                                style={borrowStatsStyles.chartSelect}
                            >
                                <option value="2024">Năm 2024</option>
                                <option value="2025">Năm 2025</option>
                                <option value="2026">Năm 2026</option>
                            </Form.Select>
                        </div>
                        <div style={{ height: '350px' }}>
                            {isChartLoading ? (
                                <div style={borrowStatsStyles.chartLoading}>
                                    <Spinner animation="border" style={{ color: '#1D559F' }} />
                                </div>
                            ) : chartData.length > 0 ? (
                                <Bar data={barChartData} options={barChartOptions} />
                            ) : (
                                <div style={borrowStatsStyles.chartNoData}>
                                    Không có dữ liệu thống kê cho năm này
                                </div>
                            )}
                        </div>
                    </div>
                </Col>
            </Row>

            <div style={borrowStatsStyles.tableCard}>
                <h5 className="mb-4" style={borrowStatsStyles.tableTitle}>Danh sách phiếu mượn</h5>
                <div className="d-flex gap-3 mb-4 flex-wrap">
                    <InputGroup style={borrowStatsStyles.searchInputGroup}>
                        <InputGroup.Text
                            className="border-0 px-3"
                            style={borrowStatsStyles.searchInputText}
                        >
                            <IoSearchSharp />
                        </InputGroup.Text>
                        <Form.Control
                            className="border-0 shadow-none ps-1 py-2"
                            style={{ ...borrowStatsStyles.inputStyle, backgroundColor: '#F9FAFB', fontSize: '0.875rem', color: '#111827' }}
                            placeholder="Tìm theo tên tài liệu..."
                            value={searchInput}
                            onChange={e => setSearchInput(e.target.value)}
                        />
                    </InputGroup>

                    <Form.Select
                        value={statusFilter}
                        onChange={handleFilterStatus}
                        style={{ maxWidth: '200px', ...borrowStatsStyles.inputStyle }}
                    >
                        <option value="">Tất cả trạng thái</option>
                        <option value="PENDING">Đang chờ</option>
                        <option value="BORROWING">Đang mượn</option>
                        <option value="RETURNED">Đã trả</option>
                        <option value="OVERDUE">Quá hạn</option>
                    </Form.Select>
                </div>

                {loading && page === 1 ? (
                    <div className="d-flex justify-content-center py-5">
                        <Spinner animation="border" style={{ color: '#1D559F' }} />
                    </div>
                ) : (
                    <div style={{ margin: '0 -24px' }}>
                        <Table hover responsive className="align-middle mb-0" style={{ borderTop: '1px solid #E5E7EB' }}>
                            <thead>
                                <tr>
                                    <th style={{ ...borrowStatsStyles.thStyle, width: '10%' }}>Mã phiếu</th>
                                    <th style={borrowStatsStyles.thStyle}>Người mượn</th>
                                    <th style={borrowStatsStyles.thStyle}>Tài liệu</th>
                                    <th style={borrowStatsStyles.thStyle}>Ngày mượn</th>
                                    <th style={borrowStatsStyles.thStyle}>Ngày trả (Dự kiến)</th>
                                    <th style={borrowStatsStyles.thStyle}>Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                {borrows.length > 0 ? (
                                    borrows.map((b) => (
                                        <tr key={b.id}>
                                            <td style={{ ...borrowStatsStyles.tdStyle, fontWeight: '500', color: '#1D559F' }}>#{b.id}</td>
                                            <td style={{ ...borrowStatsStyles.tdStyle, fontWeight: '500' }}>{b.name || 'N/A'}</td>
                                            <td style={{ ...borrowStatsStyles.tdStyle, fontWeight: '500' }}>{b.documentTitle || 'N/A'}</td>
                                            <td style={{ ...borrowStatsStyles.tdStyle, color: '#4B5563' }}>{b.borrowedDate ? new Date(b.borrowedDate).toLocaleDateString('vi-VN') : '---'}</td>
                                            <td style={{ ...borrowStatsStyles.tdStyle, color: '#4B5563' }}>{b.returnDate ? new Date(b.returnDate).toLocaleDateString('vi-VN') : '---'}</td>
                                            <td style={borrowStatsStyles.tdStyle}>
                                                {b.status === 'PENDING' && <span style={{ ...borrowStatsStyles.badgeStyle, backgroundColor: '#FEF08A', color: '#854D0E' }}>Đang chờ</span>}
                                                {b.status === 'BORROWING' && <span style={{ ...borrowStatsStyles.badgeStyle, backgroundColor: '#DBEAFE', color: '#1E40AF' }}>Đang mượn</span>}
                                                {b.status === 'RETURNED' && <span style={{ ...borrowStatsStyles.badgeStyle, backgroundColor: '#DCFCE7', color: '#166534' }}>Đã trả</span>}
                                                {b.status === 'OVERDUE' && <span style={{ ...borrowStatsStyles.badgeStyle, backgroundColor: '#FEE2E2', color: '#991B1B' }}>Quá hạn</span>}
                                                {!['PENDING', 'BORROWING', 'RETURNED', 'OVERDUE'].includes(b.status) && <span style={{ ...borrowStatsStyles.badgeStyle, backgroundColor: '#F3F4F6', color: '#4B5563' }}>{b.status}</span>}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-center py-5 text-muted" style={borrowStatsStyles.tableNoData}>
                                            <div className="mb-2" style={borrowStatsStyles.tableNoDataIcon}>📭</div>
                                            Không tìm thấy phiếu mượn nào phù hợp.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </div>
                )}

                {hasMore && borrows.length > 0 && (
                    <div className="mt-4">
                        <LoadMoreButton onClick={() => setPage(prev => prev + 1)} isLoading={loading} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default BorrowStats;