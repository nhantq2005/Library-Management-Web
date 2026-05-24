import React, { useState, useEffect } from 'react';
import { Table, Spinner, Form, InputGroup, Row, Col } from 'react-bootstrap';
import { authApi } from '../../configs/Apis';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { RiErrorWarningLine } from 'react-icons/ri';
import LoadMoreButton from '../../components/LoadMoreButton';
import { Cookies } from 'react-cookie';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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

    useEffect(() => {
        const loadStats = async () => {
            setChartLoading(true);
            try {
                let resStats = await authApi(new Cookies().get('token')).get(`/stats/secure/borrowing?year=${statYear}`);
                setChartData(resStats.data);

                // API lấy danh sách sách quá hạn chưa trả
                let resOverdue = await authApi(new Cookies().get('token')).get('/stats/secure/overdue-documents');
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

            let res = await authApi(new Cookies().get('token')).get(url);
            
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
        // eslint-disable-next-line
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
                backgroundColor: '#1D559F', // Đổi màu chart sang Lumina Primary
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

    // --- LUMINA DESIGN STYLES ---
    const inputStyle = { backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '4px', padding: '10px 14px', fontSize: '0.875rem', color: '#111827', boxShadow: 'none', fontFamily: 'Inter, sans-serif' };
    const thStyle = { padding: '12px 20px', fontSize: '0.75rem', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #E5E7EB', backgroundColor: '#FFFFFF' };
    const tdStyle = { padding: '16px 20px', fontSize: '0.875rem', color: '#111827', verticalAlign: 'middle', borderBottom: '1px solid #E5E7EB' };
    const badgeStyle = { padding: '4px 8px', borderRadius: '2px', fontSize: '0.7rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'inline-block' };

    return (
        <div style={{ padding: '32px 40px', backgroundColor: '#F9FAFB', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
            
            {/* PHẦN 1: HEADER & CẢNH BÁO */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h3 className="mb-1" style={{ color: '#111827', fontWeight: '600', letterSpacing: '-0.02em', fontSize: '1.5rem' }}>
                        Thống kê mượn trả
                    </h3>
                    <p className="mb-0" style={{ fontSize: '0.875rem', color: '#4B5563' }}>
                        Quản lý hoạt động mượn tài liệu và theo dõi quá hạn.
                    </p>
                </div>
                {overdueDocs.length > 0 && (
                    <div style={{ backgroundColor: '#DC2626', color: '#FFFFFF', padding: '8px 16px', borderRadius: '4px', fontSize: '0.875rem', fontWeight: '500' }} className="d-flex align-items-center gap-2">
                        <RiErrorWarningLine size={18} />
                        Cảnh báo: Có {overdueDocs.length} phiếu mượn đang quá hạn!
                    </div>
                )}
            </div>

            {/* PHẦN 2: BIỂU ĐỒ THỐNG KÊ */}
            <Row className="mb-4">
                <Col md={12}>
                    <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '4px', padding: '24px' }}>
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h5 className="mb-0" style={{ color: '#111827', fontWeight: '600', fontSize: '1.1rem' }}>Biểu đồ lượt mượn tài liệu</h5>
                            <Form.Select 
                                value={statYear} 
                                onChange={(e) => setStatYear(e.target.value)}
                                style={{ width: '130px', ...inputStyle }}
                            >
                                <option value="2024">Năm 2024</option>
                                <option value="2025">Năm 2025</option>
                                <option value="2026">Năm 2026</option>
                            </Form.Select>
                        </div>
                        <div style={{ height: '350px' }}>
                            {chartLoading ? (
                                <div className="h-100 d-flex justify-content-center align-items-center">
                                    <Spinner animation="border" style={{ color: '#1D559F' }} />
                                </div>
                            ) : chartData.length > 0 ? (
                                <Bar data={barChartData} options={barChartOptions} />
                            ) : (
                                <div className="h-100 d-flex justify-content-center align-items-center" style={{ color: '#6B7280', fontSize: '0.875rem' }}>
                                    Không có dữ liệu thống kê cho năm này
                                </div>
                            )}
                        </div>
                    </div>
                </Col>
            </Row>

            {/* PHẦN 3: DANH SÁCH PHIẾU MƯỢN */}
            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '4px', padding: '24px' }}>
                <h5 className="mb-4" style={{ color: '#111827', fontWeight: '600', fontSize: '1.1rem' }}>Danh sách phiếu mượn</h5>
                
                <div className="d-flex gap-3 mb-4 flex-wrap">
                    <InputGroup style={{ maxWidth: '400px', borderRadius: '4px', overflow: 'hidden', border: '1px solid #E5E7EB' }}>
                        <InputGroup.Text 
                            className="border-0 px-3" 
                            style={{ backgroundColor: '#F9FAFB', color: '#9CA3AF', fontSize: '1rem' }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </InputGroup.Text>
                        <Form.Control
                            className="border-0 shadow-none ps-1 py-2"
                            style={{ backgroundColor: '#F9FAFB', fontSize: '0.875rem', color: '#111827' }}
                            placeholder="Tìm theo tên tài liệu..."
                            value={searchInput}
                            onChange={e => setSearchInput(e.target.value)}
                        />
                    </InputGroup>

                    <Form.Select 
                        value={statusFilter} 
                        onChange={handleFilterStatus}
                        style={{ maxWidth: '200px', ...inputStyle }}
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
                    <div className="d-flex justify-content-center py-5">
                        <Spinner animation="border" style={{ color: '#1D559F' }} />
                    </div>
                ) : (
                    <div style={{ margin: '0 -24px' }}>
                        <Table hover responsive className="align-middle mb-0" style={{ borderTop: '1px solid #E5E7EB' }}>
                            <thead>
                                <tr>
                                    <th style={{ ...thStyle, width: '10%' }}>Mã phiếu</th>
                                    <th style={thStyle}>Người mượn</th>
                                    <th style={thStyle}>Tài liệu</th>
                                    <th style={thStyle}>Ngày mượn</th>
                                    <th style={thStyle}>Ngày trả (Dự kiến)</th>
                                    <th style={thStyle}>Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                {borrows.length > 0 ? (
                                    borrows.map((b) => (
                                        <tr key={b.id}>
                                            <td style={{ ...tdStyle, fontWeight: '500', color: '#1D559F' }}>#{b.id}</td>
                                            <td style={{ ...tdStyle, fontWeight: '500' }}>{b.name || 'N/A'}</td>
                                            <td style={{ ...tdStyle, fontWeight: '500' }}>{b.documentTitle || 'N/A'}</td>
                                            <td style={{ ...tdStyle, color: '#4B5563' }}>{b.borrowedDate ? new Date(b.borrowedDate).toLocaleDateString('vi-VN') : '---'}</td>
                                            <td style={{ ...tdStyle, color: '#4B5563' }}>{b.returnDate ? new Date(b.returnDate).toLocaleDateString('vi-VN') : '---'}</td>
                                            <td style={tdStyle}>
                                                {b.status === 'PENDING' && <span style={{ ...badgeStyle, backgroundColor: '#FEF08A', color: '#854D0E' }}>Đang chờ</span>}
                                                {b.status === 'BORROWING' && <span style={{ ...badgeStyle, backgroundColor: '#DBEAFE', color: '#1E40AF' }}>Đang mượn</span>}
                                                {b.status === 'RETURNED' && <span style={{ ...badgeStyle, backgroundColor: '#DCFCE7', color: '#166534' }}>Đã trả</span>}
                                                {b.status === 'OVERDUE' && <span style={{ ...badgeStyle, backgroundColor: '#FEE2E2', color: '#991B1B' }}>Quá hạn</span>}
                                                {!['PENDING', 'BORROWING', 'RETURNED', 'OVERDUE'].includes(b.status) && <span style={{ ...badgeStyle, backgroundColor: '#F3F4F6', color: '#4B5563' }}>{b.status}</span>}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-center py-5 text-muted" style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                                            <div className="mb-2" style={{ fontSize: '1.5rem' }}>📭</div>
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