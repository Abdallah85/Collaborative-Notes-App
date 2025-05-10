import { Request, Response } from "express";
import { PaymentService } from "../services/payment.service";
import ApiError from "../../utils/apiError";

export class PaymentController {
  private paymentService: PaymentService;

  constructor() {
    this.paymentService = new PaymentService();
  }

  createPaymentLink = async (req: Request, res: Response) => {
    try {
      const { amount, currency } = req.body;

      if (!amount || amount <= 0) {
        throw new ApiError(
          400, // Bad Request
          "Amount is required and must be greater than 0"
        );
      }

      const paymentLink = await this.paymentService.createPaymentLink(
        amount,
        currency
      );

      res.status(200).json({
        status: "success",
        data: {
          paymentLink,
        },
      });
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        500, // Internal Server Error
        "Failed to create payment link"
      );
    }
  };
}
