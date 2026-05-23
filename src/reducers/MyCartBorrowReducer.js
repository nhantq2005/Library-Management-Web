import cookies from 'react-cookies'

const MyCartBorrowReducer = (current, action) => {
    switch (action.type) {
        case 'UPDATE': 
            if (!action.userId) return { "totalQuantity": 0 };
            let cart = cookies.load(`cartBorrow_${action.userId}`) || null; 
            if (cart != null) {
                let totalQuantity = 0;
                
                for (let c of Object.values(cart)) {
                    totalQuantity += c.quantity;
                }

                return {
                    "totalQuantity": totalQuantity
                }
            }
            return { "totalQuantity": 0 };
            
        case 'PAID':
            if (action.userId) {
                cookies.remove(`cartBorrow_${action.userId}`, { path: '/' });
            }
            return { "totalQuantity": 0 }
            
        case 'CLEAR':
            return { "totalQuantity": 0 }

        default:
            return current;
    }
}

export default MyCartBorrowReducer;