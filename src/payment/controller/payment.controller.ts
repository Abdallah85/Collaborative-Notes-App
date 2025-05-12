import { Request, Response } from "express";
import { PaymentService } from "../services/payment.service";
import ApiError from "../../utils/apiError";
import expressAsyncHandler from "express-async-handler";

export class PaymentController {
  private paymentService: PaymentService;

  constructor() {
    this.paymentService = new PaymentService();
  }

  /**
   * @swagger
   * /api/payment/create-payment-link:
   *   post:
   *     summary: Create a payment link
   *     tags: [Payment]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - full_name
   *               - phone_number
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *               full_name:
   *                 type: string
   *               phone_number:
   *                 type: string
   *             example:
   *               email: "test@gmail.com"
   *               full_name: "abdallah"
   *               phone_number: "+200111111111"
   *     responses:
   *       200:
   *         description: Payment link created successfully
   *       400:
   */

  createPaymentLink = expressAsyncHandler(
    async (req: Request, res: Response) => {
      const { email, full_name, phone_number } = req.body;
      const paymentLink = await this.paymentService.createPaymentLink(
        email,
        full_name,
        phone_number
      );

      res
        .status(200)
        .json({ message: "Payment link created successfully", paymentLink });
    }
  );
}
