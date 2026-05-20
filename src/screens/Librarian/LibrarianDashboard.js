import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import './LibrarianDashboard.css';
import { authApi, endpoints } from '../../configs/Apis';

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

  return (
    <div className="dashboard-main-content">
      <h1 className="dashboard-title">Tổng quan Thống kê Thư viện</h1>

      <div className="charts-grid">
        <div className="chart-card">
          <h3>Tài liệu theo Danh mục</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoriesData}
                cx="50%" cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="Số_Lượng"
              >
                {categoriesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Người dùng theo Chuyên ngành</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={majorsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="User" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Số lượng tài liệu theo Tác giả</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={authorsData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip />
              <Legend />
              <Bar dataKey="Tài_Liệu" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Lượt đánh giá theo Tài liệu</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={reviewsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" hide /> 
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Đánh_Giá" stroke="#ff7300" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
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
            <p className="no-data">Tuyệt vời! Hiện không có tài liệu nào quá hạn (Hoặc không có dữ liệu).</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LibrarianDashboard;