import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './configs/db.js'
import userRouter from './routes/userRoutes.js'
import chatRouter from './routes/chatRoutes.js'
import messageRouter from './routes/messageRoutes.js'
import creditRouter from './routes/creditRoutes.js'
import { webhooks } from './controllers/webhooks.js'
import imagekit from './configs/imagekit.js'




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

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))

