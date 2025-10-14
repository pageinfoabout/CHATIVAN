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
        // Verify with YooKassa (don’t trust webhook blindly)
        const payment = await yookassa.getPayment(paymentObject.id)

        // Use metadata you set during creation
        const transactionId = payment?.metadata?.transactionId
        const appId = payment?.metadata?.appId

        // Ignore unrelated events
        if (appId !== 'ivanchat' || !transactionId) {
            return res.status(200).end()
        }

        const tx = await Transaction.findById(transactionId)
        if (!tx) {
            return res.status(200).end()
        }

        // Apply credits on success; only once
        if (payment.status === 'succeeded' && !tx.isPaid) {
            // Transaction.credits is a String in your schema; convert for $inc
            const inc = Number(tx.credits) || 0

            await Transaction.findByIdAndUpdate(transactionId, { isPaid: true })
            if (inc > 0) {
                await User.findByIdAndUpdate(tx.userId, { $inc: { credits: inc } })
            }
        }

        return res.status(200).end()
    } catch (err) {
        console.error('Webhook error:', err?.message || err)
        // Acknowledge to prevent retries; keep logs for investigation
        return res.status(200).end()
    }
}