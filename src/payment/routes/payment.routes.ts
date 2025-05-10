import { Router } from 'express';
import { PaymentController } from '../controller/payment.controller';
import { authMiddleware } from '../../auth/middleware/auth.middleware';

const router = Router();
const paymentController = new PaymentController();

// Create payment link
router.post('/pay', authMiddleware, paymentController.createPaymentLink);

export default router; 