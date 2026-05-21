import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useReducer } from 'react';

// --- Import Components & Screens ---
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

const App = () => {
  const [user, dispatchUser] = useReducer(MyUserReducer, cookies.load('user') || null);
  const [cartBuy, dispatchCartBuy] = useReducer(MyCartBuyReducer, { totalQuantity: 0, totalAmount: 0 });
  const [cartBorrow, dispatchCartBorrow] = useReducer(MyCartBorrowReducer, { totalQuantity: 0 });

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
              <Route path="/my-documents" element={<MyDocuments/>} />
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