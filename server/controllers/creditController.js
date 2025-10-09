import Transaction from '../models/Transaction.js'
import YooKassa from 'yookassa'





const plans = [
    {
        _id: "basic",
        name: "Basic",
        price: 10,
        credits: 100,
        features: ['100 text generations', '50 image generations', 'Standard support', 'Access to basic models']
    },
    {
        _id: "pro",
        name: "Pro",
        price: 20,
        credits: 500,
        features: ['500 text generations', '200 image generations', 'Priority support', 'Access to pro models', 'Faster response time']
    },
    {
        _id: "premium",
        name: "Premium",
        price: 30,
        credits: 1000,
        features: ['1000 text generations', '500 image generations', '24/7 VIP support', 'Access to premium models', 'Dedicated account manager']
    }
]


// api controller to get plans
export const getPlans = async (req, res) => {
    try {
        
        res.json({ success: true, plans })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}


    const yooKassa = new YooKassa({
        shopId: process.env.YOOKASSA_SHOP_ID,
        secretKey: process.env.YOOKASSA_SECRET_KEY
    })


console.log(yooKassa)


//api controller to buy a plan
export const buyPlan = async (req, res) => {
    try {
        const { planId } = req.body;
        const userId = req.user._id 
        const plan = plans.find(plan => plan._id === planId);
        console.log(plan)

        if(!plan){
            return res.json({ success: false, message: 'Plan not found' })
        }
        console.log(userId)
        

        //create a transaction

        const transaction = await Transaction.create({ 
            userId,
            planId,
            amount: plan.price,
            credits: plan.credits,
            isPaid: false
        })
        console.log(transaction)

        
        


        const {origin} = req.headers;

        console.log(origin)



        const payment = await yooKassa.createPayment({
            amount: {
              value: plan.price,
              currency: "RUB"
            },
            
            confirmation: {
              type: "redirect",
              return_url: `${origin}/loading`
            },
            description: `Purchase of ${plan.name} plan`
        });

        res.json({ success: true, message: 'Plan bought successfully', payment })
            
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}


