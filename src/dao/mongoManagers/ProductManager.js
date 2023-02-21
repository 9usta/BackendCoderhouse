import { productsModel } from "../models/products.model.js";

const url = "http://localhost:8080/api/products/?";

export default class ProductsManager {
  async getProducts(query, limit, page, sort) {
    try {
      let param = {};
      if (sort) {
        param = {
          limit: parseInt(limit),
          page: parseInt(page),
          sort: { price: sort },
          lean: true,
        };
      } else {
        param = {
          limit: parseInt(limit),
          page: parseInt(page),
          lean: true,
        };
      }
      let q = {};
      if (query) {
        const i = query.indexOf(":");
        const f = query.length;
        const key = query.substring(0, i);
        const value = query.substring(i + 1, f);
        q[key] = value;
      }

      const result = await productsModel.paginate(q, param);

      if (result.hasNextPage)
        result.nextLink = `${url}${query ? "query=" + query + "&" : ""}${
          "limit=" + limit
        }${"&page=" + (+page + 1)}${sort ? "&sort=" + sort : ""}`;
      if (result.hasPrevPage)
        result.prevLink = `${url}${query ? "query=" + query + "&" : ""}${
          "limit=" + limit
        }${"&page=" + (+page - 1)}${sort ? "&sort=" + sort : ""}`;
      console.log(result);
      return {
        status: "success",
        payload: result.docs,
        totalDocs: result.totalDocs,
        limit: result.limit,
        totalPages: result.totalPages,
        page: result.page,
        pagingCounter: result.pagingCounter,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        prevLink: result.prevLink,
        nextLink: result.nextLink,
      };
    } catch (error) {
      console.log("error");
    }
  }

  async addProduct(productObj) {
    try {
      const products = await productsModel.create(productObj);
      return products;
    } catch (error) {
      console.log(error);
    }
  }

  async getProductById(id) {
    try {
      const searchedProduct = await productsModel.findById(id);
      return searchedProduct;
    } catch (error) {
      console.log(error);
    }
  }

  async updateProduct(pid, newData) {
    try {
      const product = await productsModel.findByIdAndUpdate(pid, newData, {
        new: true,
      });
      return product;
    } catch (error) {
      console.log(error);
    }
  }

  async deleteProduct(pid) {
    try {
      const product = await productsModel.findByIdAndDelete(pid);
      return product;
    } catch (error) {
      console.log(error);
    }
  }
}
