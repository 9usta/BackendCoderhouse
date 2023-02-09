import fs from "fs";

// Carrito.
export default class CartManager {
  constructor(path) {
    this.path = path;
    if (!fs.existsSync(this.path)) {
      this.#writeCart([]);
    }
  }
  // Agregado de productos al carrito.
  async newCart() {
    const carts = await this.#reedCart();
    const basket = {
      id: await this.#createCartId(),
      products: [],
    };
    carts.push(basket);
    await this.#writeCart(carts);
    console.log("Nuevo carrito agregado correctamente");
    return "Nuevo carrito agregado correctamente";
  }

  // Mostrar el carrito buscado por su número de id
  async getCartById(cid) {
    const carts = await this.#reedCart();
    const searchedCart = carts.find((basket) => basket.id === parseInt(cid));
    if (searchedCart) {
      console.log(searchedCart);
      return searchedCart;
    } else {
      console.log(`Not found: No existe un carrito con el id: ${cid}`);
      return `Not found: No existe un carrito con el id: ${cid}`;
    }
  }
  // Agregar productos a un carrito
  async updateCart(cid, pid) {
    const carts = await this.#reedCart();
    const cart = carts.find((cart) => cart.id === parseInt(cid));


      if (cart){
        const productsInCart = cart.products.find((prod) => prod.product === parseInt(pid));
      if (productsInCart) {
        productsInCart.quantity++;
      } else {
        cart.products.push({ product: parseInt(pid), quantity: 1 });
      }
      await this.#writeCart(carts);
      console.log(`prudcto ${pid} agregado correctamente al carrito ${cid}`);
      return `prudcto ${pid} agregado correctamente al carrito ${cid}`;
    }else {
      console.log(`No existe un carrito con el id: ${cid}`);
      return `No existe un carritocon el id: ${cid}`;
    }
  }

  //Funcion para controlar el numero de Id
  async #createCartId() {
    const cartFile = await this.#reedCart();
    const id = cartFile.length === 0 ? 1 : cartFile[cartFile.length - 1].id + 1;
    return id;
  }
  //Funcion para leer el archivo
  async #reedCart() {
    const cartFile = await fs.promises.readFile(this.path, "utf-8");
    return JSON.parse(cartFile);
  }
  //Funcion para grabar el archivo
  async #writeCart(cart) {
    await fs.promises.writeFile(this.path, JSON.stringify(cart));
  }
}
