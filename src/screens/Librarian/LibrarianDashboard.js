import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,  CategoryScale,  LinearScale,  BarElement,  Title,  Tooltip,
  Legend,  ArcElement,  PointElement,  LineElement,} from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';
import './LibrarianDashboard.css';
import { authApi, endpoints } from '../../configs/Apis';

ChartJS.register(
  CategoryScale,  LinearScale,  BarElement,  Title,  Tooltip,  Legend,  ArcElement,
  PointElement,  LineElement);

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const LibrarianDashboard = () => {
  const [overdueDocs, setOverdueDocs] = useState([]);
  const [categoriesData, setCategoriesData] = useState([]);
  const [majorsData, setMajorsData] = useState([]);
  const [authorsData, setAuthorsData] = useState([]);
  const [reviewsData, setReviewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJsaWJyYXJpYW4wMSIsInJvbGUiOiJST0xFX0xJQlJBUklBTiIsImV4cCI6MTc3OTU2Njk3MSwiaWF0IjoxNzc5NDgwNTcxfQ.6I3wLNVu_Mv87GJ3VAZ0SngQLBiihcJg1KyqnwIlPH4";

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'Ngày không hợp lệ' : date.toLocaleDateString('vi-VN');
  };

  const loadOverdueDocs = async () => {
    try {
      const res = await authApi(TOKEN).get(endpoints['overdue-documents']);
      setOverdueDocs(res.data);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu Tài liệu quá hạn:", error);
    }
  };

  const loadCategoriesStats = async () => {
    try {
      const res = await authApi(TOKEN).get(endpoints['categories-stats']);
      setCategoriesData(res.data.map(item => ({ name: item[1], Số_Lượng: item[2] })));
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu Danh mục:", error);
    }
  };

  const loadMajorsStats = async () => {
    try {
      const res = await authApi(TOKEN).get(endpoints['user-majors-stats']);
      setMajorsData(res.data.map(item => ({ name: item[0] || 'Khác', User: item[1] })));
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu Chuyên ngành:", error);
    }
  };

  const loadAuthorsStats = async () => {
    try {
      const res = await authApi(TOKEN).get(endpoints['authors-stats']);
      setAuthorsData(res.data.map(item => ({ name: item[1], Tài_Liệu: item[2] })));
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu Tác giả:", error);
    }
  };

  const loadReviewsStats = async () => {
    try {
      const res = await authApi(TOKEN).get(endpoints['reviews-stats']);
      setReviewsData(res.data.map(item => ({ name: item[1], Đánh_Giá: item[2], Điểm_TB: item[3] })));
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu Đánh giá:", error);
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      await Promise.all([
        loadOverdueDocs(),
        loadCategoriesStats(),
        loadMajorsStats(),
        loadAuthorsStats(),
        loadReviewsStats()
      ]);
      setLoading(false);
    };
    
    fetchAllData();
  }, []);

  if (loading) {
    return <div className="loading-spinner">Đang tải dữ liệu Dashboard...</div>;
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
    <div className="dashboard-main-content">
      <h1 className="dashboard-title">Tổng quan Thống kê Thư viện</h1>

      <div className="charts-grid">
        <div className="chart-card">
          <h3>Tài liệu theo Danh mục</h3>
          <div style={{ height: '300px', width: '100%' }}>
            <Pie data={categoriesChartData} options={commonOptions} />
          </div>
        </div>

        <div className="chart-card">
          <h3>Người dùng theo Chuyên ngành</h3>
          <div style={{ height: '300px', width: '100%' }}>
            <Bar data={majorsChartData} options={commonOptions} />
          </div>
        </div>

        <div className="chart-card">
          <h3>Số lượng tài liệu theo Tác giả</h3>
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

        <div className="chart-card">
          <h3>Lượt đánh giá theo Tài liệu</h3>
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

      <div className="table-section">
        <div className="stat-card">
          <h3>Cảnh báo: Tài liệu quá hạn</h3>
          {Array.isArray(overdueDocs) && overdueDocs.length > 0 ? (
            <div className="table-responsive">
              <table className="overdue-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Tên Tài Liệu</th>
                    <th>Người Mượn</th>
                    <th>Ngày Mượn</th>
                    <th>Hạn Trả</th>
                  </tr>
                </thead>
                <tbody>
                  {overdueDocs.map((doc, index) => (
                    <tr key={index}>
                      <td>{doc[0]}</td>
                      <td>{doc[1]}</td>
                      <td><span className="badge-user">{doc[2]}</span></td>
                      <td>{formatDate(doc[3])}</td>
                      <td className="text-danger">{formatDate(doc[4])}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="no-data">Không có dữ liệu</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LibrarianDashboard;