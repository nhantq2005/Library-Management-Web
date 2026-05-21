import React, { useState, useEffect, useContext } from 'react';
import cookies from 'react-cookies';
import { authApi, endpoints } from '../../configs/Apis';
import { MyUserContext } from '../../configs/Context';
import { useNavigate } from 'react-router-dom';
import moment from "moment";
import 'moment/locale/vi';
import MyDocumentsStyles from '../../style/MyDocumentsStyles';

const MyDocuments = () => {
    const [activeTab, setActiveTab] = useState('borrowed');
    const [user] = useContext(MyUserContext);
    const nav = useNavigate();
    const [borrowedDocs, setBorrowedDocs] = useState([]);
    const [purchasedDocs, setPurchasedDocs] = useState([]);
    const [pageBorrow, setPageBorrow] = useState(1);
    const [pageBuy, setPageBuy] = useState(1);
    const [loadingBorrow, setLoadingBorrow] = useState(false);
    const [loadingBuy, setLoadingBuy] = useState(false);
    const [isExpandedBorrow, setIsExpandedBorrow] = useState(false);
    const [isExpandedBuy, setIsExpandedBuy] = useState(false);

    const groupDocuments = (docs, type) => {
        if (!docs || !Array.isArray(docs)) return [];

        const grouped = docs.reduce((acc, currentItem) => {
            const docTitle = currentItem.documentTitle || currentItem.document?.title || currentItem.title || 'Tài liệu không tên';

            const dateField = currentItem.borrowedDate || currentItem.transactionDate || currentItem.borrowDate || currentItem.createdDate || currentItem.buyDate;
            let dateStr = 'no-date';

            if (dateField) {
                const d = new Date(dateField);
                if (!isNaN(d.getTime())) {
                    const day = d.toLocaleDateString('vi-VN');
                    const h = d.getHours().toString().padStart(2, '0');
                    const m = d.getMinutes().toString().padStart(2, '0');
                    dateStr = `${day} ${h}:${m}`;
                }
            }

            const uniqueKey = `${docTitle}-${dateStr}`;

            if (!acc[uniqueKey]) {
                acc[uniqueKey] = { ...currentItem };
                acc[uniqueKey].quantity = 1;
                acc[uniqueKey].rawDate = dateField;

                if (type === 'purchased') {
                    acc[uniqueKey].amount = currentItem.amount || 0;
                }
            } else {
                acc[uniqueKey].quantity += 1;

                if (type === 'purchased') {
                    acc[uniqueKey].amount += (currentItem.amount || 0);
                }
            }
            return acc;
        }, {});

        return Object.values(grouped).sort((a, b) => {
            const dateA = a.borrowedDate || a.transactionDate || a.createdDate || a.buyDate || 0;
            const dateB = b.borrowedDate || b.transactionDate || b.createdDate || b.buyDate || 0;
            return new Date(dateB) - new Date(dateA);
        });
    };

    const loadBorrowedDocs = async () => {
        const token = cookies.load('token');
        if (!token || !user) return;

        setLoadingBorrow(true);
        try {
            let res = await authApi(token).get(endpoints['my-borrows'], {
                params: {
                    userId: user.id,
                    page: pageBorrow
                }
            });

            if (res.data.length < 20) {
                setPageBorrow(0);
            }

            const groupedData = groupDocuments(res.data, 'borrowed');

            if (pageBorrow === 1) {
                setBorrowedDocs(groupedData);
            } else {
                setBorrowedDocs(prev => [...prev, ...groupedData]);
            }
        } catch (error) {
            console.error("Lỗi tải lịch sử mượn:", error);
        } finally {
            setLoadingBorrow(false);
        }
    };

    const loadPurchasedDocs = async () => {
        const token = cookies.load('token');
        if (!token || !user) return;

        setLoadingBuy(true);
        try {
            let res = await authApi(token).get(endpoints['my-buys'], {
                params: {
                    userId: user.id,
                    page: pageBuy
                }
            });

            if (res.data.length < 20) {
                setPageBuy(0);
            }

            const groupedData = groupDocuments(res.data, 'purchased');

            if (pageBuy === 1) {
                setPurchasedDocs(groupedData);
            } else {
                setPurchasedDocs(prev => [...prev, ...groupedData]);
            }
        } catch (error) {
            console.error("Lỗi tải lịch sử mua:", error);
        } finally {
            setLoadingBuy(false);
        }
    };

    const handleLoadMoreBorrow = () => {
        setIsExpandedBorrow(true);
        setPageBorrow(pageBorrow + 1);
    };

    const handleLoadMoreBuy = () => {
        setIsExpandedBuy(true);
        setPageBuy(pageBuy + 1);
    };

    useEffect(() => {
        if (pageBorrow > 0) loadBorrowedDocs();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageBorrow, user]);

    useEffect(() => {
        if (pageBuy > 0) loadPurchasedDocs();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageBuy, user]);

    const handleRowClick = (item) => {
        const docId = item.document?.id || item.documentId || item.id;
        nav(`/documents/${docId}`);
    };

    return (
        <div className="container mt-5" style={MyDocumentsStyles.container}>
            <div className="card shadow-sm border-0">
                <div className="card-header bg-white pt-4 pb-0 border-0">
                    <h3 className="fw-bold mb-4" style={MyDocumentsStyles.pageTitle}>
                        <i className="fa-solid fa-folder-open me-2"></i> Tủ sách của tôi
                    </h3>

                    <ul className="nav nav-tabs border-bottom-0">
                        <li className="nav-item">
                            <button
                                className={`nav-link px-4 py-2 border-0 fw-semibold ${activeTab === 'borrowed' ? 'active text-primary border-bottom border-2 border-primary bg-light' : 'text-muted bg-white'}`}
                                onClick={() => setActiveTab('borrowed')}
                                style={MyDocumentsStyles.tabButton}
                            >
                                <i className="fa-solid fa-book-open me-2"></i>Tài liệu đã mượn
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`nav-link px-4 py-2 border-0 fw-semibold ${activeTab === 'purchased' ? 'active text-success border-bottom border-2 border-success bg-light' : 'text-muted bg-white'}`}
                                onClick={() => setActiveTab('purchased')}
                                style={MyDocumentsStyles.tabButton}
                            >
                                <i className="fa-solid fa-basket-shopping me-2"></i>Tài liệu đã mua
                            </button>
                        </li>
                    </ul>
                </div>

                <div className="card-body bg-light p-4 rounded-bottom" style={MyDocumentsStyles.cardBody}>

                    {activeTab === 'borrowed' && (
                        <div className="table-responsive bg-white rounded shadow-sm p-3">
                            {borrowedDocs.length === 0 && !loadingBorrow ? (
                                <div className="text-center py-4 text-muted">Bạn chưa mượn tài liệu nào.</div>
                            ) : (
                                <>
                                    <table className="table table-hover align-middle mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th scope="col" style={MyDocumentsStyles.colStt}>STT</th>
                                                <th scope="col" style={MyDocumentsStyles.colCover}>Ảnh bìa</th>
                                                <th scope="col" style={MyDocumentsStyles.colTitleBorrow}>Tên tài liệu</th>
                                                <th scope="col" style={MyDocumentsStyles.colAuthorBorrow}>Tác giả</th>
                                                <th scope="col" style={MyDocumentsStyles.colQuantity}>Số lượng</th>
                                                <th scope="col" style={MyDocumentsStyles.colTime}>Thời gian</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {borrowedDocs.map((item, index) => (
                                                <tr key={item.id || index} onClick={() => handleRowClick(item)} style={MyDocumentsStyles.tableRow} title="Bấm để xem chi tiết">
                                                    <td className="fw-bold text-muted">{index + 1}</td>
                                                    <td>
                                                        <img
                                                            src={item.image || item.document?.image || "https://res.cloudinary.com/duk4u0tsp/image/upload/v1715421501/default-book_k0lbbk.png"}
                                                            alt="cover"
                                                            style={MyDocumentsStyles.bookCover}
                                                        />
                                                    </td>
                                                    <td className="fw-semibold text-primary">
                                                        {item.documentTitle || item.document?.title || item.title || "Tài liệu không tên"}
                                                    </td>
                                                    <td className="text-muted small">
                                                        {item.authorNames || item.document?.authorSet?.map(a => a.name).join(', ') || 'Đang cập nhật'}
                                                    </td>
                                                    <td>
                                                        <span className="badge bg-primary px-3 py-2 rounded-pill">
                                                            {item.quantity} cuốn
                                                        </span>
                                                    </td>
                                                    <td className="text-muted fw-semibold small">
                                                        <span className="text-success"><i className="fa-regular fa-clock me-1"></i>
                                                            {item.rawDate ? moment(item.rawDate).fromNow() : "---"}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                    <div className="text-center mt-4 d-flex justify-content-center gap-2">
                                        {loadingBorrow && <div className="spinner-border text-primary" role="status"></div>}

                                        {pageBorrow > 0 && !loadingBorrow && (
                                            <button
                                                className="btn btn-outline-primary"
                                                onClick={handleLoadMoreBorrow}
                                            >
                                                Xem thêm sách mượn...
                                            </button>
                                        )}

                                        {isExpandedBorrow && !loadingBorrow && (
                                            <button
                                                className="btn btn-outline-secondary"
                                                onClick={() => {
                                                    setPageBorrow(1);
                                                    setIsExpandedBorrow(false);
                                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                                }}
                                            >
                                                Ẩn bớt
                                            </button>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {activeTab === 'purchased' && (
                        <div className="table-responsive bg-white rounded shadow-sm p-3">
                            {purchasedDocs.length === 0 && !loadingBuy ? (
                                <div className="text-center py-4 text-muted">Bạn chưa mua tài liệu nào.</div>
                            ) : (
                                <>
                                    <table className="table table-hover align-middle mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th scope="col" style={MyDocumentsStyles.colStt}>STT</th>
                                                <th scope="col" style={MyDocumentsStyles.colCover}>Ảnh bìa</th>
                                                <th scope="col" style={MyDocumentsStyles.colTitleBuy}>Tên tài liệu</th>
                                                <th scope="col" style={MyDocumentsStyles.colAuthorBuy}>Tác giả</th>
                                                <th scope="col" style={MyDocumentsStyles.colQuantityBuy}>Số lượng</th>
                                                <th scope="col" style={MyDocumentsStyles.colAmountBuy}>Tổng tiền</th>
                                                <th scope="col" style={MyDocumentsStyles.colTime}>Thời gian</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {purchasedDocs.map((item, index) => (
                                                <tr key={item.id || index} onClick={() => handleRowClick(item)} style={MyDocumentsStyles.tableRow} title="Bấm để xem chi tiết">
                                                    <td className="fw-bold text-muted">{index + 1}</td>
                                                    <td>
                                                        <img
                                                            src={item.image || item.document?.image || "https://res.cloudinary.com/duk4u0tsp/image/upload/v1715421501/default-book_k0lbbk.png"}
                                                            alt="cover"
                                                            style={MyDocumentsStyles.bookCover}
                                                        />
                                                    </td>
                                                    <td className="fw-semibold text-primary">
                                                        {item.documentTitle || item.document?.title || item.title || "Tài liệu không tên"}
                                                    </td>
                                                    <td className="text-muted small">
                                                        {item.authorNames || item.document?.authorSet?.map(a => a.name).join(', ') || 'Đang cập nhật'}
                                                    </td>
                                                    <td>
                                                        <span className="badge bg-primary px-3 py-2 rounded-pill">
                                                            {item.quantity} cuốn
                                                        </span>
                                                    </td>
                                                    <td className="text-danger fw-bold">
                                                        {item.amount ? `${item.amount.toLocaleString('vi-VN')} đ` : "Miễn phí"}
                                                    </td>
                                                    <td className="text-muted fw-semibold small">
                                                        <span className="text-success"><i className="fa-regular fa-clock me-1"></i>
                                                            {item.rawDate ? moment(item.rawDate).fromNow() : "---"}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                    <div className="text-center mt-4 d-flex justify-content-center gap-2">
                                        {loadingBuy && <div className="spinner-border text-primary" role="status"></div>}

                                        {pageBuy > 0 && !loadingBuy && (
                                            <button
                                                className="btn btn-outline-success"
                                                onClick={handleLoadMoreBuy}
                                            >
                                                Xem thêm sách mua...
                                            </button>
                                        )}

                                        {isExpandedBuy && !loadingBuy && (
                                            <button
                                                className="btn btn-outline-secondary"
                                                onClick={() => {
                                                    setPageBuy(1);
                                                    setIsExpandedBuy(false);
                                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                                }}
                                            >
                                                Ẩn bớt
                                            </button>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyDocuments;