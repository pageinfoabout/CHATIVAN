import YooKassa from 'yookassa'

import Transaction from '../models/Transaction.js'
import User from '../models/User.js'

export const webhooks = async (req, res) => {
    const yookassa = new YooKassa({
        shopId: process.env.YOOKASSA_SHOP_ID,
        secretKey: process.env.YOOKASSA_SECRET_KEY
    })
    console.log(yookassa)
    // req.body is a Buffer because of express.raw({ type: 'application/json' })
    let payload
    try {
        payload = JSON.parse(Buffer.isBuffer(req.body) ? req.body.toString('utf8') : req.body)
        
    } catch (e) {
        return res.status(400).send('Invalid JSON')
    } 
    console.log(payload) 
    try {
        switch (payload.event.type) {
            case 'payment.succeeded':{
                
                const transactionId = payload.event.metadata.transactionId
                const appId = payload.event.metadata.appId

                if(appId !== 'ivanchat'){
                const transaction = await Transaction.findOne({ _id: transactionId, isPaid: false })
                
                await User.updateOne({ _id: transaction.userId }, { $inc: { credits: transaction.credits } })

                transaction.isPaid = true
                await transaction.save()
                
            }else{
                return res.json({ success: true, message: 'ignored' })
            }
            break;
                
            }
        }
        return res.json({ success: true, message: 'ignored' })
            
    } catch (error) {
        console.log(error)
        return res.json({ success: false, message: error.message })
    }
    
}
