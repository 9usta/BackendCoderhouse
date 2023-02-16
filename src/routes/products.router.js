import { Router } from "express";
//import ProductManager from "../dao/fileManagers/ProductManager.js";
import ProductManager from "../dao/mongoManagers/ProductManager.js";
import { socketServer } from "../app.js";
import { productsModel } from "../dao/models/products.model.js";

const router = Router();
const productManager = new ProductManager("src/products.json"); //Creación de una instancia de la clase ProductManager);

//Dirección que muestra todos los productos No real time
router.get("/", async (req, res) => {
  const {query, limit, page, sort} = req.query;
  const result = await productManager.getProducts(query, limit, page, sort);
  console.log(result);
 res.json(result);

});


router.get("/", async (req, res) => {
  const page = parseInt(req.query.page)|| 1;
  const limit = parseInt(req.query.limit) || 10;
  const query = (req.query.query);
  let sort = parseInt(req.query.sort)
    if (sort) {
      sort = sort === "asc" ?  1  : -1 ;
    }
   if (query){
    const {docs,hasPrevPage,hasNextPage,nextPage,prevPage} =
  await productsModel.paginate({category:query}, { limit , page, sort: {price: sort}, lean:true});
  const products =docs;
  console.log(products);
  res.render('products',{
    products,limit,query,
      hasPrevPage,
      hasNextPage,
      prevPage,
      nextPage
  });
  }else{
    const {docs,hasPrevPage,hasNextPage,nextPage,prevPage} =
    await productsModel.paginate({}, { limit , page, sort: {price: sort}, lean:true});
    const products =docs;
    console.log(products);
  res.json({
    products,limit,query,sort,
      hasPrevPage,
      hasNextPage,
      prevPage,
      nextPage
  });
  }

  
})

//Dirección con parametro variable para obtener solo un producto determinado por si id
router.get("/:pid", async (req, res) => {
  const { pid } = req.params;
  const product = await productManager.getProductById(pid);
  res.json(product);
});

//Dirección para agregar un nuevo producto
router.post("/", async (req, res) => {
  const productObj = req.body;
  const product = await productManager.addProduct(productObj);
  res.json({ message: "Producto cargado con éxito", product });
});

//Dirección para modificar producto
router.put("/:pid", async (req, res) => {
  const { pid } = req.params;
  const newData = req.body;
  const product = await productManager.updateProduct(pid, newData);
  res.json({message: "Producto modificado con éxito", product});
});

//Dirección para eliminar un producto
router.delete("/:pid", async (req, res) => {
  const { pid } = req.params;
  const products = await productManager.deleteProduct(pid);
  res.json({ message: "producto eliminado con éxito", id });
});

export default router;
