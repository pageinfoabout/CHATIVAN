import YooKassa from 'yookassa'


export const webhooks = async (req, res) => {
    try {
        const yookassa = new YooKassa({
            shopId: process.env.YOOKASSA_SHOP_ID,
            secretKey: process.env.YOOKASSA_SECRET_KEY
        })
        console.log(yookassa)
    } catch (error) {
        console.log(error)
    }

    res.json({ success: true, message: 'Webhook received' })
    
    
}