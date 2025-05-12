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
   *                 description: Customer's email address
   *               full_name:
   *                 type: string
   *                 description: Customer's full name
   *               phone_number:
   *                 type: string
   *                 description: Customer's phone number
   *             example:
   *               email: "test@gmail.com"
   *               full_name: "John Doe"
   *               phone_number: "+200111111111"
   *     responses:
   *       201:
   *         description: Payment link created successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Payment link created successfully
   *                 paymentLink:
   *                   type: string
   *                   description: URL to the payment page
   *       400:
   *         description: Invalid input data
   *       401:
   *         description: Unauthorized
   *       500:
   *         description: Server error
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
        .status(201)
        .json({ message: "Payment link created successfully", paymentLink });
    }
  );
}
