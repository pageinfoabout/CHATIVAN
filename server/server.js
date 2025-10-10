import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './configs/db.js'
import userRouter from './routes/userRoutes.js'
import chatRouter from './routes/ChatRoutes.js'
import messageRouter from './routes/messageRoutes.js'
import creditRouter from './routes/creditRoutes.js'
import { webhooks } from './controllers/webhooks.js'
import connectDB from './configs/db.js'

let dbReady = false
app.use(async(req, res, next) => {
    if(dbReady){ await connectDB()
        dbReady = true
        next()
    }
})


dotenv.config()

const app = express()
await connectDB()


//webhooks
app.post('/api/webhooks', express.raw({type: 'application/json'}), webhooks) 

// middleware

app.use(cors()); 
app.use(express.json()) 



// routesq
app.get('/', (req, res) => res.send('Server is running'))
app.use('/api/user', userRouter)
app.use('/api/chat', chatRouter)
app.use('/api/message', messageRouter)
app.use('/api/credits', creditRouter)

const PORT = process.env.PORT || 3000

export default app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))