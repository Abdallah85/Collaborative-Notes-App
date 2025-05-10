import express from "express";
import connectDB from "./db/database";
import dotenv from "dotenv";
import ApiError from "./utils/apiError";
import authRoutes from "./auth/routes/auth.routes";
import noteRoutes from "./note/routes/note.route";
import paymentRoutes from "./payment/routes/payment.routes";

// Load environment variables
dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/payment", paymentRoutes);
// Error handling middleware
app.use(
  (
    err: ApiError,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const statusCode: number = err.statusCode || 500;
    const message: string = err.message || "Internal Server Error";
    res.status(statusCode).json(message);
  }
);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
