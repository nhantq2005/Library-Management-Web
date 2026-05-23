import cookies from 'react-cookies'

const MyCartBuyReducer = (current, action) => {
    switch (action.type) {
        case 'UPDATE': 
            if (!action.userId) return { "totalQuantity": 0, "totalAmount": 0 };
            let cart = cookies.load(`cartBuy_${action.userId}`) || null; 
            if (cart != null) {
                let totalAmount = 0;
                let totalQuantity = 0;
                
                for (let c of Object.values(cart)) {
                    totalQuantity += c.quantity;
                    totalAmount += c.quantity * c.price;
                }

                return {
                    "totalQuantity": totalQuantity,
                    "totalAmount": totalAmount
                }
            }
            return { "totalQuantity": 0, "totalAmount": 0 };
            
        case 'PAID':
            if (action.userId) {
                cookies.remove(`cartBuy_${action.userId}`, { path: '/' });
            }
            return { "totalQuantity": 0, "totalAmount": 0 }
            
        case 'CLEAR':
            return { "totalQuantity": 0, "totalAmount": 0 }

        default:
            return current;
    }
}

export default MyCartBuyReducer;