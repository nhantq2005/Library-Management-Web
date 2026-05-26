import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useReducer } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Auth from './screens/Auth/Auth';
import Home from './screens/Home/Home';
import DocumentDetails from './screens/Document/DocumentDetails';
import PageNotFound from './screens/Exception/PageNotFound';
import Cart from './screens/Cart/Cart';
import MyUserReducer from './reducers/MyUserReducer';
import { MyCartBorrowContext, MyCartBuyContext, MyUserContext } from './configs/Context';
import MyCartBorrowReducer from './reducers/MyCartBorrowReducer';
import MyCartBuyReducer from './reducers/MyCartBuyReducer';
import cookies from 'react-cookies'
import MyDocuments from './screens/Document/MyDocuments';
import LibrarianDashboard from './screens/Librarian/LibrarianDashboard';
import AddUpdateDocument from './screens/Librarian/AddUpdateDocument';
import PaymentStats from './screens/Librarian/PaymentStats';
import Base from './screens/Librarian/Base';
import ManageDocument from './screens/Librarian/ManageDocument';
import Message from './screens/Librarian/Message';
import ManageCategory from './screens/Librarian/ManageCategory';
import BorrowStats from './screens/Librarian/BorrowStats';
import Payment from './screens/Payment/Payment';
import MessageClient from './screens/Message/MessageClient';
import PaymentResult from './screens/Payment/PaymentResult';

const App = () => {
  const [user, dispatchUser] = useReducer(MyUserReducer, cookies.load('user') || null);
  const [cartBuy, dispatchCartBuy] = useReducer(MyCartBuyReducer, { totalQuantity: 0, totalAmount: 0 });
  const [cartBorrow, dispatchCartBorrow] = useReducer(MyCartBorrowReducer, { totalQuantity: 0 });
  console.log("Current User in App:", user);
  console.log("Is User exist?", !!user);
  return (
    <MyUserContext.Provider value={[user, dispatchUser]}>
      <MyCartBuyContext.Provider value={[cartBuy, dispatchCartBuy]}>
        <MyCartBorrowContext.Provider value={[cartBorrow, dispatchCartBorrow]}>

          <BrowserRouter>
            <Header />
            <Routes>
              <Route path="/login" element={<Auth page="login" />} />
              <Route path="/register" element={<Auth page="register" />} />
              <Route path="/" element={<Home />} />
              <Route path="/documents/:documentId" element={<DocumentDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/my-documents" element={<MyDocuments />} />
              <Route path="/payment" element= {<Payment/>} />
              <Route path="/payment-result" element={<PaymentResult />} />
              <Route path="/message-client" element={<MessageClient />} />
              <Route path="/librarian" element={<Base />} > 
                <Route index element={<LibrarianDashboard />} />
                <Route path="manage-document" element={<ManageDocument />} />
                <Route path="stats" element={<BorrowStats />} />
                <Route path="category" element={<ManageCategory />} />
                <Route path="payment-stats" element={<PaymentStats />} />
                <Route path="add-document" element={<AddUpdateDocument />} />
                <Route path="messages" element={<Message />} />
                <Route path="edit-document/:id" element={<AddUpdateDocument />} />
              </Route>
              <Route path="*" element={<PageNotFound />} />
            </Routes>
            <Footer />
          </BrowserRouter>

        </MyCartBorrowContext.Provider>
      </MyCartBuyContext.Provider>
    </MyUserContext.Provider>
  );
};

export default App;