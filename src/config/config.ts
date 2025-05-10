import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV;
const MONGODB_URI_DEV: string = process.env.MONGODB_URI_DEV || "";
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

export default {
  PORT,
  NODE_ENV,

  MONGODB_URI_DEV,
  ACCESS_TOKEN_SECRET,
};
