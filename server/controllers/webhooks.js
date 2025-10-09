import YooKassa from 'yookassa'
import Transaction from '../models/Transaction.js'
import User from '../models/User.js'


export const webhooks = async (req, res) => {
    const yooKassa = new YooKassa({
        shopId: process.env.YOOKASSA_SHOP_ID,
        secretKey: process.env.YOOKASSA_SECRET_KEY
    })
    const signature = req.headers['x-yookassa-signature'];
    console.log(signature)
    let event;

    try {
        event = yooKassa.webhooks.constructEvent(req.body, signature, process.env.YOOKASSA_WEBHOOK_SECRET);
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
    try {
        switch (event.type) {
            case 'payment.succeeded': {
                const paymentIntent = event.data.object;
                const sessionList = await Transaction.find({paymentIntentId: paymentIntent.id})
                
                const session = sessionList.data[0]
                const {transactionId, appId} = session.metadata
                
                if (appId === 'ivan_chat'){
                    const transaction = await Transaction.findOne({_id: transactionId, isPaid: false});
                    
                    await User.updateOne({_id: transaction.userId}, {$inc: {credits: transaction.credits}});

                    //UPDATE STATUS OF TRANSACTION
                    await Transaction.updateOne({_id: transactionId}, {$set: {isPaid: true}});

                    //SEND EMAIL TO USER
                    const user = await User.findById(transaction.userId);
                    const email = user.email;
                    const subject = 'Payment Successful';
                    await sendEmail(email, subject, 'Payment Successful');
                    await transaction.save();
                } else {
                    return res.json({ received: false, message: 'Invalid appId' })
                }
            }
                
                break;
        
            default:
                console.log('Invalid event type', event.type);
                break;
        }
        res.json({ received: true, message: 'Webhook received' })
        

    } catch (error) {
        console.log(error)
        res.json({ received: false, message: error.message })
    }



    

}