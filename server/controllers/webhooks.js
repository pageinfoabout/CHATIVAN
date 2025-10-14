import YooKassa from 'yookassa'


export const webhooks = async (req, res) => {
    try {
        const yooKasa = new YooKassa({
            shopId: process.env.YOOKASSA_SHOP_ID,
            secretKey: process.env.YOOKASSA_SECRET_KEY
        })
        const response = await yooKasa.getWebHookList()
        console.log(response)
    } catch (error) {
        console.log(error)
    }

    res.json({ success: true, message: 'Webhook received' })
    
    
}