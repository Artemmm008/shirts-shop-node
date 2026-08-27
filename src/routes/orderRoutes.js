import { Router } from "express"
import { celebrate } from "celebrate"
import { createOrder, getAllOrders, getOrderById, updateOrderStatus } from "../controllers/orderController.js";
import { createOrderSchema } from "../validations/orderValidation.js"
import { authenticate, optionalAuthenticate } from "../middleware/authenticate.js";
import { checkRoles } from "../middleware/checkRoles.js";

const router = Router();

router.post("/orders", optionalAuthenticate, celebrate(createOrderSchema), createOrder)
router.get("/orders", optionalAuthenticate, getAllOrders)
router.get("/orders/:id", optionalAuthenticate, getOrderById)
router.patch("/orders/:id/status", authenticate, checkRoles("admin"), updateOrderStatus)
export default router;
