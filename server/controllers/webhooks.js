import YooKassa from 'yookassa'
import Transaction from '../models/Transaction.js'
import User from '../models/User.js'








    
export const webhooks = async (req, res) => {
    const yooKassa = new YooKassa({
        shopId: process.env.YOOKASSA_SHOP_ID,
        secretKey: process.env.YOOKASSA_SECRET_KEY
    })
    const signature = req.headers['x-yookassa-signature'];
    console.log(signature)
    console.log(req.headers)
    console.log(req.body)

}