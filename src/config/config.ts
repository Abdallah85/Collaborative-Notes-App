import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV;
const MONGODB_URI_DEV: string = process.env.MONGODB_URI_DEV || "";
const jwt_secret = process.env.JWT_SECRET;
const jwt_expires_in = process.env.JWT_EXPIRES_IN;

export default {
  PORT,
  NODE_ENV,
  jwt_secret,
  jwt_expires_in,
  MONGODB_URI_DEV,
};
