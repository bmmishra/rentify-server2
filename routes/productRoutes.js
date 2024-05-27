import express from 'express';
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js';
import { createProductCotroller, deleteProductController, getProductController, getSingleProductController, productCountController, productFiltersController, productLikeController, productListController, productPhotoController, updateProductController } from '../controllers/productController.js';
import formidable from 'express-formidable';
const router = express.Router()

router.post('/create-product', requireSignIn, isAdmin,formidable(), createProductCotroller)

router.get("/get-product", getProductController)//without photo

//single product
router.get("/get-product/:pid", getSingleProductController);

router.get("/product-photo/:pid", productPhotoController)//for photo

router.delete("/delete-product/:pid", requireSignIn, isAdmin, deleteProductController)

//filter product
router.post("/product-filters", productFiltersController);

//product count
router.get("/product-count", productCountController);

//product per page
router.get("/product-list/:page", productListController);

//like button
router.post('/like/:id', productLikeController)


router.put(
  "/update-product/:pid",
  requireSignIn,
    isAdmin,
  formidable(),
  updateProductController
);

export default router