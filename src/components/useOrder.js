import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import cookies from "react-cookies";
import { authApi, endpoints } from "../configs/Apis";
import { MyCartBorrowContext, MyCartBuyContext, MyUserContext } from "../configs/Context";

const useOrder = () => {
    const [user] = useContext(MyUserContext);
    const [, dispatchBuy] = useContext(MyCartBuyContext);
    const [, dispatchBorrow] = useContext(MyCartBorrowContext);
    const nav = useNavigate();

    const order = async (doc, actionType) => {
        if (user === null) {
            alert("Vui lòng đăng nhập để mượn hoặc mua sách!");
            nav("/login?next=/");
            return;
        }

        let cookieBuyKey = `cartBuy_${user.id}`;
        let cookieBorrowKey = `cartBorrow_${user.id}`;

        let cartBuy = cookies.load(cookieBuyKey) || {};
        let cartBorrow = cookies.load(cookieBorrowKey) || {};

        let currentBuyQty = cartBuy[doc.id] ? cartBuy[doc.id].quantity : 0;
        let currentBorrowQty = cartBorrow[doc.id] ? cartBorrow[doc.id].quantity : 0;
        let totalInCart = currentBuyQty + currentBorrowQty;

        if (totalInCart >= doc.quantity) {
            alert(`Rất tiếc! Sách "${doc.title}" chỉ còn tổng cộng ${doc.quantity} quyển. Bạn không thể thêm nữa!`);
            return;
        }


        if (actionType === 'BUY') {
            if (doc.id in cartBuy) {
                alert(`Tài liệu "${doc.title}" đã có trong giỏ hàng mua của bạn. Mỗi người chỉ được mua 1 cuốn!`);
                return; 
            } 
            
            try {
                const token = cookies.load('token');
                let res = await authApi(token).get(endpoints['my-buys'], { params: { userId: user.id } }); 
                let hasBought = res.data.some(item => item.documentId === doc.id);

                if (hasBought) {
                    alert(`Bạn đã sở hữu tài liệu "${doc.title}" từ trước rồi. Không cần mua lại nhé!`);
                    return; 
                }
            } catch (ex) {
                console.error("Lỗi khi kiểm tra lịch sử mua:", ex);
            }
            
            cartBuy[doc.id] = {
                'id': doc.id,
                'title': doc.title, 
                'price': doc.price,
                'quantity': 1, 
                'maxQuantity': doc.quantity
            }
            
            cookies.save(cookieBuyKey, cartBuy, { path: '/' });
            dispatchBuy({ "type": "UPDATE", "userId": user.id });
            alert("Đã thêm tài liệu vào giỏ ĐỂ MUA!");

  
        } else if (actionType === 'BORROW') {
            if (doc.id in cartBorrow) {
                cartBorrow[doc.id]['quantity']++;
            } else {
                cartBorrow[doc.id] = {
                    'id': doc.id,
                    'title': doc.title, 
                    'price': 0, 
                    'quantity': 1,
                    'maxQuantity': doc.quantity
                }
            }
            cookies.save(cookieBorrowKey, cartBorrow, { path: '/' });
            dispatchBorrow({ "type": "UPDATE", "userId": user.id });
            alert("Đã thêm tài liệu vào giỏ ĐỂ MƯỢN!");
        }
    };

    return order;
};

export default useOrder;