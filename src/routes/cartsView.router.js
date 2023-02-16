import {Router} from "express";
import CartManager from "../dao/mongoManagers/CartManager.js";


const router = Router();
const cartManager = new CartManager();


router.get("/:cid", async (req, res) => {
  const id = req.params.cid;
  const cart = await cartManager.getCartById(id);
  console.log(cart);
 res.render("cart", cart);
});

export default router;