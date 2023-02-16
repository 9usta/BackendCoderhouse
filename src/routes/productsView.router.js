import {Router} from "express";
import ProductManager from "../dao/mongoManagers/ProductManager.js";

const router = Router();
const productManager = new ProductManager();
const url ="http://localhost:8080/products/?";

router.get("/", async (req, res) => {
  const {query, limit, page, sort} = req.query;
  const response = await productManager.getProducts(query, limit, page, sort);
  console.log(response);
  let {
    payload,
    hasNextPage,
    hasPrevPage,
    nextLink,
    prevLink,
    page: resPage,
  } = response;
  
  if (hasNextPage)
    nextLink = `${url}${
      query ? "query=" + query + "&" : ""
    }${"limit=" + limit}${"&page=" + (+page + 1)}${
      sort ? "&sort=" + sort : ""
    }`;
  if (hasPrevPage)
    prevLink = `${url}${
      query ? "query=" + query + "&" : ""
    }${"limit=" + limit}${"&page=" + (+page - 1)}${
      sort ? "&sort=" + sort : ""
    }`;
  res.render("products", {
    payload,
    hasNextPage,
    hasPrevPage,
    nextLink,
    prevLink,
    resPage,
  });
});
export default router;