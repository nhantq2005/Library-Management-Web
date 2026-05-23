import 'bootstrap/dist/css/bootstrap.min.css';
import Auth from './screens/Auth/Auth';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PageNotFound from './screens/Exception/PageNotFound';
import Home from './screens/Home/Home';
import { useReducer, useEffect } from 'react';
import MyUserReducer from './reducers/MyUserReducer';
import { MyUserContext } from './configs/Context';

import LibrarianDashboard from './screens/Librarian/LibrarianDashboard';
import AddUpdateDocument from './screens/Librarian/AddUpdateDocument';
// import Stats from './screens/Librarian/Stats';
import PaymentStats from './screens/Librarian/PaymentStats';
import Base from './screens/Librarian/Base';
import ManageDocument from './screens/Librarian/ManageDocument';
import Message from './screens/Librarian/Message';
import ManageCategory from './screens/Librarian/ManageCategory';
import BorrowStats from './screens/Librarian/BorrowStats';

const App = () => {
  const [user, dispatch] = useReducer(MyUserReducer, null);
  // const navigate = useNavigate();

// const isLibrarian = user && (user.role === 'ROLE_LIBRARIAN' || user.userRole === 'ROLE_LIBRARIAN');

  return (
    <MyUserContext.Provider value={[user, dispatch]}>
      <BrowserRouter>
      {/* {isLibrarian && <Navigate to="/librarian" replace />} */}
        <Routes>
          <Route path="/login" element={<Auth page="login" />} />
          <Route path="/register" element={<Auth page="register" />} />
          <Route path="/" element={<Home />} />
          <Route path="*" element={<PageNotFound />} />
          <Route path="/librarian" element={<Base />}>
            <Route index element={<LibrarianDashboard />} />
            <Route path="manage-document" element={<ManageDocument />} />
            <Route path="stats" element={<BorrowStats />} />
            <Route path="category" element={<ManageCategory />} />
            <Route path="payment-stats" element={<PaymentStats />} />
            <Route path="add-document" element={<AddUpdateDocument />} />
            <Route path="messages" element={<Message />} />
            <Route path="edit-document/:id" element={<AddUpdateDocument />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </MyUserContext.Provider>
  );
};

export default App;