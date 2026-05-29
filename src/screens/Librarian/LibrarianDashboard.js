import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip,
  Legend, ArcElement, PointElement, LineElement,
} from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';
import { dashboardMainContent, dashboardTitle, chartsGrid, chartCard, chartCardTitle, tableSection,
  statCard, statCardTitle, tableResponsive, overdueTable, overdueTableCell, overdueTableHeader,
  overdueTableRowHover, textDanger, badgeUser, loadingSpinner} from '../../style/LibrarianDashboardStyle';
import { authApi, endpoints } from '../../configs/Apis';
import cookies from 'react-cookies'

ChartJS.register(
  CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement,
  PointElement, LineElement);

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const LibrarianDashboard = () => {
  const [overdueDocs, setOverdueDocs] = useState([]);
  const [categoriesData, setCategoriesData] = useState([]);
  const [majorsData, setMajorsData] = useState([]);
  const [authorsData, setAuthorsData] = useState([]);
  const [reviewsData, setReviewsData] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'Ngày không hợp lệ' : date.toLocaleDateString('vi-VN');
  };

  const loadOverdueDocs = async () => {
    try {
      const res = await authApi(cookies.load('token')).get(endpoints['overdue-documents']);
      setOverdueDocs(res.data);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu Tài liệu quá hạn:", error);
    }
  };

  const loadCategoriesStats = async () => {
    try {
      const res = await authApi(cookies.load('token')).get(endpoints['categories-stats']);
      setCategoriesData(res.data.map(item => ({ name: item[1], Số_Lượng: item[2] })));
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu Danh mục:", error);
    }
  };

  const loadMajorsStats = async () => {
    try {
      const res = await authApi(cookies.load('token')).get(endpoints['user-majors-stats']);
      setMajorsData(res.data.map(item => ({ name: item[0] || 'Khác', User: item[1] })));
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu Chuyên ngành:", error);
    }
  };

  const loadAuthorsStats = async () => {
    try {
      const res = await authApi(cookies.load('token')).get(endpoints['authors-stats']);
      setAuthorsData(res.data.map(item => ({ name: item[1], Tài_Liệu: item[2] })));
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu Tác giả:", error);
    }
  };

  const loadReviewsStats = async () => {
    try {
      const res = await authApi(cookies.load('token')).get(endpoints['reviews-stats']);
      setReviewsData(res.data.map(item => ({ name: item[1], Đánh_Giá: item[2], Điểm_TB: item[3] })));
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu Đánh giá:", error);
    }
  };


  useEffect(() => {
    loadOverdueDocs();
    loadCategoriesStats();
    loadMajorsStats();
    loadAuthorsStats();
    loadReviewsStats();
    setLoading(false);
  }, []);
  
  if (loading) {
    return <div style={loadingSpinner}>Đang tải dữ liệu Dashboard...</div>;
  }


  const categoriesChartData = {
    labels: categoriesData.map(d => d.name),
    datasets: [
      {
        label: 'Số lượng',
        data: categoriesData.map(d => d.Số_Lượng),
        backgroundColor: COLORS,
        borderWidth: 1,
      },
    ],
  };

  const majorsChartData = {
    labels: majorsData.map(d => d.name),
    datasets: [
      {
        label: 'User',
        data: majorsData.map(d => d.User),
        backgroundColor: '#82ca9d',
      },
    ],
  };

  const authorsChartData = {
    labels: authorsData.map(d => d.name),
    datasets: [
      {
        label: 'Tài Liệu',
        data: authorsData.map(d => d.Tài_Liệu),
        backgroundColor: '#8884d8',
      },
    ],
  };

  const reviewsChartData = {
    labels: reviewsData.map(d => d.name),
    datasets: [
      {
        label: 'Đánh Giá',
        data: reviewsData.map(d => d.Đánh_Giá),
        borderColor: '#ff7300',
        backgroundColor: '#ff7300',
        tension: 0.3,
      },
    ],
  };

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div style={dashboardMainContent}>
      <h1 style={dashboardTitle}>Tổng quan Thống kê Thư viện</h1>

      <div style={chartsGrid}>
        <div style={chartCard}>
          <h3 style={chartCardTitle}>Tài liệu theo Danh mục</h3>
          <div style={{ height: '300px', width: '100%' }}>
            <Pie data={categoriesChartData} options={commonOptions} />
          </div>
        </div>

        <div style={chartCard}>
          <h3 style={chartCardTitle}>Người dùng theo Chuyên ngành</h3>
          <div style={{ height: '300px', width: '100%' }}>
            <Bar data={majorsChartData} options={commonOptions} />
          </div>
        </div>

        <div style={chartCard}>
          <h3 style={chartCardTitle}>Số lượng tài liệu theo Tác giả</h3>
          <div style={{ height: '300px', width: '100%' }}>
            <Bar
              data={authorsChartData}
              options={{
                ...commonOptions,
                indexAxis: 'y'
              }}
            />
          </div>
        </div>

        <div style={chartCard}>
          <h3 style={chartCardTitle}>Lượt đánh giá theo Tài liệu</h3>
          <div style={{ height: '300px', width: '100%' }}>
            <Line
              data={reviewsChartData}
              options={{
                ...commonOptions,
                scales: {
                  x: {
                    display: false
                  }
                }
              }}
            />
          </div>
        </div>
      </div>

      <div style={tableSection}>
        <div style={statCard}>
          <h3 style={statCardTitle}>Cảnh báo: Tài liệu quá hạn</h3>
          {Array.isArray(overdueDocs) && overdueDocs.length > 0 ? (
            <div style={tableResponsive}>
              <table style={overdueTable}>
                <thead>
                  <tr>
                    <th style={overdueTableHeader}>ID</th>
                    <th style={overdueTableHeader}>Tên Tài Liệu</th>
                    <th style={overdueTableHeader}>Người Mượn</th>
                    <th style={overdueTableHeader}>Ngày Mượn</th>
                    <th style={overdueTableHeader}>Hạn Trả</th>
                  </tr>
                </thead>
                <tbody>
                  {overdueDocs.map((doc, index) => (
                    <tr key={index}>
                      <td style={overdueTableCell}>{doc[0]}</td>
                      <td style={overdueTableCell}>{doc[1]}</td>
                      <td style={overdueTableCell}><span style={badgeUser}>{doc[2]}</span></td>
                      <td style={overdueTableCell}>{formatDate(doc[3])}</td>
                      <td style={{ ...overdueTableCell, ...textDanger }}>{formatDate(doc[4])}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>Không có dữ liệu</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LibrarianDashboard;