import { productsModel } from '../models/products.model.js'

export default class CoursesManager {
  async getProducts() {
    try {
      const products = await productsModel.find()
      return products
    } catch (error) {
      console.log(error)
    }
  }

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
