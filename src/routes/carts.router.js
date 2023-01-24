import { Router } from "express";

import { Cart } from "../CartManager.js";
const router = Router();
const cart = new Cart('src/cart.json'); //Creación de una instancia de la clase ProductManager

//Dirección desde la que pueden obtenerse todos los productos o una cantidad limitada si se pasa la query limit
router.post("/api/cart/", async (req, res) => {
  console.log("creando carrito");
  const carts = await cart.newCart();
  res.json({ carts });
});

//Dirección con parametro variable para obtener solo un producto determinado por si id
router.get("/api/cart/:cid", async (req, res) => {
  const { cid } = req.params;
  const carts = await cart.getCartById(cid);
  res.json({ carts });
});

//Dirección desde la que agregan productos al carrito especificado
router.post("/api/cart/:cid/product/:pid", async (req, res) => {
    const {cid, pid} = req.params
    const carts = await cart.updateCart(cid,pid);
res.json({ carts });
});

export default router;
