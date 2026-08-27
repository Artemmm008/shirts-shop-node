import { Router } from "express";
import { celebrate } from "celebrate";
import { optionalAuthenticate } from "../middleware/authenticate.js";
import { createPaymentSessionController, refundOrderController } from "../controllers/paymentController.js";
import { createCheckoutSessionSchema, refundOrderSchema } from "../validations/paymentValidation.js";

const router = Router();

router.post("/payments/create-checkout-session", optionalAuthenticate, celebrate(createCheckoutSessionSchema), createPaymentSessionController);
router.post("/payments/refund/:orderId", optionalAuthenticate, celebrate(refundOrderSchema), refundOrderController);
export default router;
