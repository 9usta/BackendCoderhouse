import { cartModel } from '../models/cart.model.js'

export default class CartManager {
  async newCart() {
    try {
      const cart = await cartModel.create({products: []})
      return cart
    } catch (error) {
      console.log(error)
    }
  }

  async getCartById(cid)  {
    try {
      const searchedCart = await cartModel.findById(cid)
      return searchedCart
    } catch (error) {
      console.log(error)
    }
  }

  async updateCart(cid, pid) {
    try {
      const cart = await cartModel.findById(cid)
      if (cart){
        const productsInCart = cart.products.find((prod) => prod.product === (pid))
      if (productsInCart) {
        productsInCart.quantity++;
      } else {
        cart.products.push({ product: pid, quantity: 1 });
      }
      const newCart = await cartModel.findByIdAndUpdate(cid,cart,{new:true})
      return newCart;
    }else {
      console.log(`No existe un carrito con el id: ${cid}`);
      return `No existe un carritocon el id: ${cid}`;
    }
    } catch (error) {
      console.log(error)
    }
  }
}