import YooKassa from 'yookassa'


export const getWebHookList = async (req, res) => {
    try {
        const yookassa = new YooKassa({
            shopId: process.env.YOOKASSA_SHOP_ID,
            secretKey: process.env.YOOKASSA_SECRET_KEY
        })
        const response = await yookassa.getWebHookList()
        console.log(response)
    } catch (error) {
        console.log(error)
    }
    
    
    
}

export default webhooks