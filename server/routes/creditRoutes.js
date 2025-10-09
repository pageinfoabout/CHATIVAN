import express from 'express';
import { getPlans, buyPlan} from '../controllers/creditController.js'
import { protect } from '../middlewares/auth.js';


const creditRouter = express.Router();


creditRouter.get('/plan', getPlans)
creditRouter.post('/buy', protect, buyPlan)


export default creditRouter