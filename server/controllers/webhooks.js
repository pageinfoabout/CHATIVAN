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

                const transactionId = payload.event.metadata
                const appId = payload.event.metadata

            

                if(appId === 'ivanchat'){
                const transaction = await Transaction.findOne({ _id: transactionId, isPaid: false })
                
                await User.updateOne({ _id: transaction.userId }, { $inc: { credits: transaction.credits } })
                try {
                    transaction.isPaid = true
                    await transaction.save()
                   
                    return res.json({ success: true })
                } catch (error) {
                    console.log(error.message)
                    
                }

                
                
                
                    
                
            }else{
                return res.json({ success: true })
            }
            break;
                
            }
        }
        return res.json({ success: true})

        
            
    } catch (error) {
        console.log(error)
        return res.json({ success: false, message: error.message })
    }
    
}
