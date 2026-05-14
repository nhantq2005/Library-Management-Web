import 'bootstrap/dist/css/bootstrap.min.css';
import Auth from './screens/Auth/Auth';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PageNotFound from './screens/Exception/PageNotFound';
import Home from './screens/Home/Home';
import { useReducer } from 'react';
import MyUserReducer from './reducers/MyUserReducer';
import { MyUserContext } from './configs/Context';

const App = () => {
  const [user, dispatch] = useReducer(MyUserReducer, null);
  return (
    <MyUserContext.Provider value={[user, dispatch]}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Auth page="login" />} />
          <Route path="/register" element={<Auth page="register" />} />
          <Route path="/" element={<Home />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </MyUserContext.Provider>
  );
};

export default App;