import {Router} from "express";
import CartManager from "../dao/mongoManagers/CartManager.js";
import ProductManager from "../dao/mongoManagers/ProductManager.js";

const productManager = new ProductManager(); //Instancio la clase para verificar que el producto a agregar existe.
const cartManager = new CartManager(); //Instancia de la clase para gestionar el carrito

const router = Router();

//Rutas
router.post("/", async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res
      .status(200)
      .json({ message: "Nuevo carrito generado con éxito", cart: newCart });
    } catch (error) {
      console.log(error)
    }
});

router.get("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartManager.getCartById(cid);
    res.json({
      message: `Productos del carrito con id: ${cid} obtenido con éxito`,
      cart,
    });
  } catch (error) {
    console.log(error)
  }
});

//Aqui implemento el middleware que, de existir el producto, permite continuar. De lo contario devuelveerror.
router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await cartManager.addProductToCart(cid, pid);
    res.json({ message: "Producto agregado con éxito", cart }); 
  } catch (error) {
      console.log(error)
    }
  }
);

router.put("/:cid", async (req, res) => {
  const { cid } = req.params;
  const products = req.body;
  const cart = await cartManager.updateCart(cid, products);
  res.json({
    message: "Carrito actualizado",
    cart,
  });
});

router.put("/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const quantity = req.body.quantity;
  const cart = await cartManager.updateProductInCart(cid, pid, quantity);
  res.json({
    message: `El producto con id: ${pid} ha sido actualizado`,
    cart,
  });
});

router.delete("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const cart = await cartManager.deleteProductById(cid, pid);
  res.json({
    message: `Eliminado el producto con el id: ${pid} del carrito`,
    cart,
  });
});

router.delete("/:cid", async (req, res) => {
  const { cid } = req.params;
  const cart = await cartManager.deleteProducts(cid);
  res.json({
    message: `Eliminados todos los productos del carrito con id: ${cid}`,
    cart,
  });
});

export default router;