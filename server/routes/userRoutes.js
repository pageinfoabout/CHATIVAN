import express from 'express';
import { registerUser, loginUser, getUser } from '../controllers/userController.js';
import { protect } from '../middlewares/auth.js';
import { Router } from 'express';

const userRouter = express.Router();

userRouter.post('/register', registerUser)
userRouter.post('/login' , loginUser)
userRouter.get('/data',protect, getUser)

export default userRouter;
