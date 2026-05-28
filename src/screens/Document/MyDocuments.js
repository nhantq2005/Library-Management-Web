import React, { useState, useEffect, useContext } from 'react';
import cookies from 'react-cookies';
import { authApi, endpoints } from '../../configs/Apis';
import { MyUserContext } from '../../configs/Context';
import { useNavigate } from 'react-router-dom';
import 'moment/locale/vi';
import MyDocumentsStyles from '../../style/MyDocumentsStyles';
import DocumentTable from '../../components/DocumentTable';
import Footer from '../../components/Footer';
import Header from '../../components/Header';

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
                params: { userId: user.id, page: pageBorrow }
            });

            if (res.data.length < 20) setPageBorrow(0); 

            const groupedData = groupDocuments(res.data, 'borrowed');
            setBorrowedDocs(prev => pageBorrow === 1 ? groupedData : [...prev, ...groupedData]);
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
                params: { userId: user.id, page: pageBuy }
            });

            if (res.data.length < 20) setPageBuy(0);

            const groupedData = groupDocuments(res.data, 'purchased');
            setPurchasedDocs(prev => pageBuy === 1 ? groupedData : [...prev, ...groupedData]);
        } catch (error) {
            console.error("Lỗi tải lịch sử mua:", error);
        } finally {
            setLoadingBuy(false);
        }
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
         <>
        <Header />
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
                            <DocumentTable 
                                docs={borrowedDocs}
                                type="borrowed"
                                emptyMessage="Bạn chưa mượn tài liệu nào."
                                loading={loadingBorrow}
                                page={pageBorrow}
                                onLoadMore={() => setPageBorrow(pageBorrow + 1)}
                                onRowClick={handleRowClick}
                            />
                        </div>
                    )}

                    {activeTab === 'purchased' && (
                        <div className="table-responsive bg-white rounded shadow-sm p-3">
                            <DocumentTable 
                                docs={purchasedDocs}
                                type="purchased"
                                emptyMessage="Bạn chưa mua tài liệu nào."
                                loading={loadingBuy}
                                page={pageBuy}
                                onLoadMore={() => setPageBuy(pageBuy + 1)}
                                onRowClick={handleRowClick}
                            />
                        </div>
                    )}

                </div>
            </div>
        </div>
        <Footer />
    </>
    );
};

export default MyDocuments;