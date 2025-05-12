import axios from "axios";
import ApiError from "../../utils/apiError";
import config from "../../config/config";

export class PaymentService {
  constructor() {}

  async createPaymentLink(
    email: string,
    full_name: string,
    phone_number: string
  ): Promise<string> {
    // Get token
    const response = await axios.post(
      "https://accept.paymob.com/api/auth/tokens",
      {
        api_key: config.PAYMOB_API_KEY,
      }
    );
    const token = response.data.token;
    console.log(token);
    console.log(config.NTEGRATION_ID);

    const paymentLink = await axios.post(
      "https://accept.paymob.com/api/ecommerce/payment-links",
      {
        email,
        is_live: false,
        full_name,
        phone_number,
        description: "test",
        payment_methods: [config.NTEGRATION_ID],
        amount_cents: 100, // 1.00 EGP
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        redirection_url: "https://www.google.com",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (paymentLink.status !== 201) {
      throw new ApiError(400, "Failed to create payment link");
    }

    return paymentLink.data.client_url;
  }
}
