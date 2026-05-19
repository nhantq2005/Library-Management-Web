import 'bootstrap/dist/css/bootstrap.min.css';
import Auth from './screens/Auth/Auth';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PageNotFound from './screens/Exception/PageNotFound';
import Home from './screens/Home/Home';
import { useReducer } from 'react';
import MyUserReducer from './reducers/MyUserReducer';
import { MyUserContext } from './configs/Context';
import Header from './components/Header';
import Footer from './components/Footer';
import DocumentDetails from './screens/Document/DocumentDetails';

const App = () => {
  const [user, dispatch] = useReducer(MyUserReducer, null);
  return (
    <MyUserContext.Provider value={[user, dispatch]}>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/login" element={<Auth page="login" />} />
          <Route path="/register" element={<Auth page="register" />} />
          <Route path="/" element={<Home />} />
          <Route path="/documents/:documentId" element={<DocumentDetails />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </MyUserContext.Provider>
  );
};

export default App;