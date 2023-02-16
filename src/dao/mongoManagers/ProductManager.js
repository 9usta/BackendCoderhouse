import { productsModel } from '../models/products.model.js'

const url ="http://localhost:8080/api/products/?";

export default class ProductsManager {
  async getProducts(query, limit = 10, page = 1, sort) {
    try {
      let result ={}
      if (query){
      result = await productsModel.paginate({"category":query}, {
        limit: limit,
        page: page,
        sort: {price: sort},
        lean: true,
      });}
      else{      result = await productsModel.paginate({}, {
        limit: limit,
        page: page,
        sort: {price: sort},
        lean: true,
      });}
      if (result.hasNextPage)
        result.nextLink = `${url}${
          query ? "query=" + query + "&" : ""
        }${"limit=" + limit}${"&page=" + (+page + 1)}${
          sort ? "&sort=" + sort : ""
        }`;
      if (result.hasPrevPage)
        result.prevLink = `${url}${
          query ? "query=" + query + "&" : ""
        }${"limit=" + limit}${"&page=" + (+page - 1)}${
          sort ? "&sort=" + sort : ""
        }`;
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
      }
    } catch (error) {
      console.log(error);
    }
    };  


  async addProduct(productObj) {
    try {
      const products = await productsModel.create(productObj)
      return products
    } catch (error) {
      console.log(error)
    }
  }

  async getProductById(id) {
    try {
      const searchedProduct = await productsModel.findById(id)
      return searchedProduct
    } catch (error) {
      console.log(error)
    }
  }

  async updateProduct(pid, newData) {
    try {
      const product = await productsModel.findByIdAndUpdate(pid,newData,{new:true})
      return product
    } catch (error) {
      console.log(error)
    }
  }

  async deleteProduct(pid) {
    try {
      const product = await productsModel.findByIdAndDelete(pid)
      return product
    } catch (error) {
      console.log(error)
    }
  }
}
