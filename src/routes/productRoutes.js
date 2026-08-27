import { Router } from "express"
import { celebrate } from "celebrate"
import { getAllProducts, getProductById, createProduct, deleteProduct, updateProduct, uploadProductImage } from "../controllers/productController.js";
import { getAllProductsSchema, createProductSchema, productIdParamSchema, updateProductSchema } from "../validations/productValidation.js";
import { authenticate } from "../middleware/authenticate.js";
import { checkRoles } from "../middleware/checkRoles.js";
import { upload } from "../middleware/multer.js";

const router = Router();

router.get("/products", celebrate(getAllProductsSchema), getAllProducts);
router.get("/products/:id", celebrate(productIdParamSchema), getProductById);
router.post("/products/", authenticate, checkRoles("admin"), celebrate(createProductSchema), createProduct)
router.delete("/products/:id", authenticate, checkRoles("admin"), celebrate(productIdParamSchema), deleteProduct)
router.patch("/products/:id", authenticate, checkRoles("admin"), celebrate(updateProductSchema), updateProduct)
router.patch("/products/:id/images", authenticate, checkRoles("admin"), upload.array("images", 5), uploadProductImage);
export default router;
