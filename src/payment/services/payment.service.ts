import axios from "axios";
import ApiError from "../../utils/apiError";

export class PaymentService {
  private readonly API_KEY: string;
  private readonly INTEGRATION_ID: string;
  private readonly BASE_URL: string;

  constructor() {
    this.API_KEY = process.env.PAYMOB_API_KEY || "";
    this.INTEGRATION_ID = process.env.PAYMOB_INTEGRATION_ID || "";
    this.BASE_URL = "https://accept.paymob.com/api";
  }

  async createPaymentLink(
    amount: number,
    currency: string = "EGP"
  ): Promise<string> {
    try {
      // Step 1: Authentication
      const authResponse = await axios.post(`${this.BASE_URL}/auth/tokens`, {
        api_key: this.API_KEY,
      });

      const token = authResponse.data.token;

      // Step 2: Create Order
      const orderResponse = await axios.post(
        `${this.BASE_URL}/ecommerce/orders`,
        {
          auth_token: token,
          delivery_needed: false,
          amount_cents: amount * 100, // Convert to cents
          currency,
          items: [],
        }
      );

      const orderId = orderResponse.data.id;

      // Step 3: Create Payment Key
      const paymentKeyResponse = await axios.post(
        `${this.BASE_URL}/acceptance/payment_keys`,
        {
          auth_token: token,
          amount_cents: amount * 100,
          expiration: 3600,
          order_id: orderId,
          billing_data: {
            apartment: "NA",
            email: "NA",
            floor: "NA",
            first_name: "NA",
            street: "NA",
            building: "NA",
            phone_number: "NA",
            shipping_method: "NA",
            postal_code: "NA",
            city: "NA",
            country: "NA",
            last_name: "NA",
            state: "NA",
          },
          currency,
          integration_id: this.INTEGRATION_ID,
        }
      );

      const paymentKey = paymentKeyResponse.data.token;

      // Step 4: Generate Payment Link
      const paymentLink = `https://accept.paymob.com/api/acceptance/iframes/${this.INTEGRATION_ID}?payment_token=${paymentKey}`;

      return paymentLink;
    } catch (error) {
      throw new ApiError(
        500, // Internal Server Error
        "Failed to create payment link"
      );
    }
  }
}
