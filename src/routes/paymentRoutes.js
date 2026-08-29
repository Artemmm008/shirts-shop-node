import { Router } from "express";
import { celebrate } from "celebrate";
import { authenticate, optionalAuthenticate } from "../middleware/authenticate.js";
import { checkRoles } from "../middleware/checkRoles.js"
import { createPaymentSessionController, refundOrderController } from "../controllers/paymentController.js";
import { createCheckoutSessionSchema, refundOrderSchema } from "../validations/paymentValidation.js";

const router = Router();

router.post("/payments/create-checkout-session", optionalAuthenticate, celebrate(createCheckoutSessionSchema), createPaymentSessionController);
router.post("/payments/refund/:orderId", authenticate, checkRoles("admin"), celebrate(refundOrderSchema), refundOrderController);
export default router;
