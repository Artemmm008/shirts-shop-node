import express from "express"
import cors from "cors"
import "dotenv/config"
import { errors } from "celebrate"
import authRoutes from "./routes/authRoutes.js"
import orderRoutes from "./routes/orderRoutes.js"
import productRoutes from "./routes/productRoutes.js"
import paymentRoutes from "./routes/paymentRoutes.js"
import { handlePaymentWebhook } from "./controllers/paymentController.js"
import { connectMongoDB } from "./db/connectMongoDB.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFoundHandler } from "./middleware/notFoundHandler.js";
import cookieParser from "cookie-parser"

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(cors());
app.use(cookieParser());

app.post("/payments/webhook", express.raw({ type: "application/json" }), handlePaymentWebhook);

app.use(express.json());

app.use(authRoutes);
app.use(orderRoutes);
app.use(paymentRoutes);
app.use(productRoutes);

app.use(notFoundHandler)
app.use(errors())
app.use(errorHandler)

await connectMongoDB()

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
