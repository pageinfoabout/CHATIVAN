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

let dbReady = false
export default async function handler(req, res) {
  if (!dbReady) {
    try { await connectDB(); dbReady = true } 
    catch (e) { return res.status(500).json({ success: false, message: e.message }) }
  }
  return app(req, res)
}