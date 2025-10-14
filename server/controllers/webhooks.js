import { Webhooks, Configuration } from 'yookassa'

import Transaction from '../models/Transaction.js'
import User from '../models/User.js'







    
export const webhooks = async (req, res) => {
    const yookassa = new YooKassa({
        shopId: process.env.YOOKASSA_SHOP_ID,
        secretKey: process.env.YOOKASSA_SECRET_KEY
    })
    const signature = req.headers['x-yookassa-signature'];
    console.log(yookassa)
    console.log(signature)
    console.log(req.headers)
    console.log(req.body)
}
const configuration = new Configuration({
    events: [
        'payment.succeeded',
        'payment.failed',
        'payment.partially_succeeded',
        'payment.canceled',
        'payment.expired',
        'payment.waiting_for_capture',
    ]
})
const webhooks = new Webhooks(configuration)
webhooks.on('payment.succeeded', (event) => {
    console.log(event)
})
webhooks.on('payment.failed', (event) => {
    console.log(event)
})
webhooks.on('payment.partially_succeeded', (event) => {
    console.log(event)
})
webhooks.on('payment.canceled', (event) => {
    console.log(event)
})
webhooks.on('payment.expired', (event) => {
    console.log(event)
})
webhooks.on('payment.waiting_for_capture', (event) => {
    console.log(event)
})
console.log(webhooks)