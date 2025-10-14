import YooKassa from 'yookassa'

import Transaction from '../models/Transaction.js'
import User from '../models/User.js'

export const webhooks = async (req, res) => {
    // req.body is a Buffer because of express.raw({ type: 'application/json' })
    let payload
    try {
        payload = JSON.parse(Buffer.isBuffer(req.body) ? req.body.toString('utf8') : req.body)
    } catch (e) {
        return res.status(400).send('Invalid JSON')
    }
    console.log(payload)

    const yookassa = new YooKassa({
        shopId: process.env.YOOKASSA_SHOP_ID,
        secretKey: process.env.YOOKASSA_SECRET_KEY
    })
    console.log(yookassa)

    const event = payload?.event
    const paymentObject = payload?.object

    if (!paymentObject?.id) {
        return res.status(200).end()
    }

    try {
        // Verify the payment with YooKassa (don’t trust webhook blindly)
        const payment = await yookassa.getPayment(paymentObject.id)

        const transactionId = payment?.metadata?.transactionId
        if (!transactionId) {
            return res.status(200).end()
            console.log('Transaction ID not found')
        }

        const tx = await Transaction.findById(transactionId)
        if (!tx) {
            return res.status(200).end()
            console.log('Transaction not found')
        }

        if (payment.status === 'succeeded' && !tx.isPaid) {
            await Transaction.findByIdAndUpdate(transactionId, { isPaid: true })

            // credits in your Transaction schema is a String; convert to Number for $inc
            const inc = Number(tx.credits) || 0
            if (inc > 0) {
                await User.findByIdAndUpdate(tx.userId, { $inc: { credits: inc } })
            }
        }

        // For other statuses (e.g., canceled/refunded) handle accordingly if needed

        return res.status(200).end()
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message })
        // Acknowledge anyway to prevent repeated retries; log for diagnostics
       
    }
}