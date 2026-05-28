// import { Navigate } from "react-router-dom";

// // Tạo một component PrivateRoute
// const LibrarianRoute = ({ user, children }) => {
//   if (!user) {
//     return <Navigate to="/login" replace />; // Chưa đăng nhập thì về trang login
//   }
  
//   // KIỂM TRA ĐÚNG TÊN TRƯỜNG ROLE CỦA BẠN (VD: user.role)
//   if (user.role !== 'ROLE_LIBRARIAN' && user.role !== 'LIBRARIAN') {
//     return <Navigate to="/" replace />; // Đăng nhập rồi nhưng sai quyền thì về trang chủ
//   }

//   return children; // Hợp lệ thì cho phép render <Base />
// };

// export default LibrarianRoute;