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
        switch (payload.event) {
            case 'payment.succeeded':{
                console.log(payload.event)

                const metadata = payload?.object?.metadata 
                || {}

                const transactionId = metadata.transactionId
                const appId = metadata.appId
                console.log(metadata)

                console.log(transactionId)
                console.log(appId)

                if(appId === 'ivanchat'){
                    const transaction = await Transaction.findOne({ _id: transactionId, isPaid: false })
                    console.log(transaction)
                    
                    await User.updateOne({ _id: transaction.userId }, { $inc: { credits: transaction.credits } })
                    
                    transaction.isPaid = true
                    await transaction.save()
                    console.log(transaction.isPaid)
                }else{
                    return res.json({ received: true, message: 'ignored' })
                    
                }


                break;
            }
        
            default:
                console.log(unhandled)
                break;  
        }
        return res.json({ received: true, message: 'handled' })
    } catch (error) {
        console.log(error)
        Response.status(500).json({ received: false, message: error.message })
    }
    
    
}
