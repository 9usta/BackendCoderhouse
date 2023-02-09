import { Router } from "express";
//import ProductManager from "../dao/fileManagers/ProductManager.js";
import ProductManager from "../dao/mongoManagers/ProductManager.js";
import { socketServer } from "../app.js";

const router = Router();
const productManager = new ProductManager("src/products.json"); //Creación de una instancia de la clase ProductManager);

//Dirección que muestra todos los productos No real time
router.get("/", async (req, res) => {
  const { limit } = req.query;
  const products = await productManager.getProducts(limit || "all");
  res.render("index", { products });
});

//Dirección que muestra todos los productos real time
router.get("/realTimeProducts", async (req, res) => {
  const { limit } = req.query;
  const products = await productManager.getProducts(limit || "all");

  socketServer.on("connection", () => {
    socketServer.emit("products", products);
  });
  res.render("realTimeProducts", {});
});
//Dirección con parametro variable para obtener solo un producto determinado por si id
router.get("/:pid", async (req, res) => {
  const { pid } = req.params;
  const product = await productManager.getProductById(pid);
  res.send(product);
});

//Dirección para agregar un nuevo producto
router.post("/", async (req, res) => {
  const productObj = req.body;
  const products = await productManager.addProduct(productObj);
  socketServer.emit("products", products);
  res.render("realTimeProducts", {});
});

//Dirección para modificar producto
router.put("/:pid", async (req, res) => {
  const { pid } = req.params;
  const newData = req.body;
  const products = await productManager.updateProduct(pid, newData);
  socketServer.emit("products", products);
  res.render("realTimeProducts", {});
});

//Dirección para eliminar un producto
router.delete("/:pid", async (req, res) => {
  const { pid } = req.params;
  const products = await productManager.deleteProduct(pid);
  socketServer.emit("products", products);
  res.render("realTimeProducts", {});
});

export default router;
