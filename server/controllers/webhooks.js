import YooKassa from 'yookassa'


export const webhooks = async (req, res) => {
    try {
        const yookassa = new YooKassa({
            shopId: process.env.YOOKASSA_SHOP_ID,
            secretKey: process.env.YOOKASSA_SECRET_KEY
        })
        const response = await yookassa.webhook(req.body)
        console.log(response)
    } catch (error) {
        console.log(error)
    }
    
    
    
}