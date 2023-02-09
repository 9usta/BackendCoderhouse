import { Router } from "express";
//import CartManager from "../dao/fileManagers/CartManager.js";
import CartManager from "../dao/mongoManagers/CartManager.js";
const router = Router();
const cartManager = new CartManager('src/cart.json'); //Creación de una instancia de la clase ProductManager

//Dirección desde la que pueden obtenerse todos los productos o una cantidad limitada si se pasa la query limit
router.post("/", async (req, res) => {
  console.log("creando carrito");
  const carts = await cartManager.newCart();
  res.json({ carts });
});

//Dirección con parametro variable para obtener solo un producto determinado por si id
router.get("/:cid", async (req, res) => {
  const { cid } = req.params;
  const carts = await cartManager.getCartById(cid);
  res.json({ carts });
});

//Dirección desde la que agregan productos al carrito especificado
router.post("/:cid/product/:pid", async (req, res) => {
    const {cid, pid} = req.params
    const carts = await cartManager.updateCart(cid,pid);
res.json({ carts });
});

export default router;
