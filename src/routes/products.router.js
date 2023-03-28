import {Router} from "express";
import * as productsController from "../controller/products.controller.js";
import ProductManager from "../dao/mongoManagers/ProductManager.js";
const router = Router();

const productM = new ProductManager();

router.post("/", productsController.post);

router.get("/?", productsController.getAll);

router.get("/:pid", productsController.getById);

router.put("/:pid", productsController.putById);

router.delete("/:pid", productsController.deleteById);
export default router;
