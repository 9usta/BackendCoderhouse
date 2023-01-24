import fs from "fs";
export default class ProductManager {
  constructor(path) {
    this.path = path;
    if (!fs.existsSync(this.path)) {
      this.#writeFile([]);
    }
  }
  // Mostrar los productos guardados.
  async getProducts(limit) {
    const productFile = await this.#reedFile(limit);
    console.log(productFile);
    return productFile;
  }

  // Agregado de productos - recive un objeto con el formato especificado.
  async addProduct(productObj) {
    const products = await this.#reedFile("all");
    if (
      productObj.title &&
      productObj.description &&
      productObj.code &&
      productObj.price &&
      productObj.status &&
      productObj.stock &&
      productObj.category
    ) {
      const codeAlredyExist = products.some(
        (product) => product.code === productObj.code
      );
      if (!codeAlredyExist) {
        const product = {
          id: await this.#createId(),
          ...productObj,
        };
        products.push(product);
        await this.#writeFile(products);
        console.log("Producto agregado con exito");
        return products;
      } else {
        console.log("No pueden existir dos productos con el mismo código");
        return "No pueden existir dos productos con el mismo código";
      }
    } else {
      console.log("Error al cargar el producto. No se permiten campos vacios");
      return "Error al cargar el producto. No se permiten campos vacios";
    }
  }

  // Mostrar el producto buscado por su número de id
  async getProductById(id) {
    const products = await this.#reedFile("all");
    const searchedProduct = products.find(
      (product) => product.id === parseInt(id)
    );
    if (searchedProduct) {
      console.log(searchedProduct);
      return searchedProduct;
    } else {
      console.log(`Not found: No existe un producto con el id: ${id}`);
      return `Not found: No existe un producto con el id: ${id}`;
    }
  }

  // modificar informacion de un producto introduciendo su id, el nombre del componente a modificar y el nuevo valor
  async updateProduct(pid, newData) {
    const products = await this.#reedFile("all");
    const indexProduct = products.findIndex((p) => p.id === parseInt(pid));
    if (indexProduct != -1) {
      if (
        newData.title ||
        newData.description ||
        newData.code ||
        newData.price ||
        newData.status ||
        newData.stock ||
        newData.category ||
        newData.thumbnail
      ) {
        const ProductAct = { ...products[indexProduct], ...newData };
        products.splice(indexProduct, 1, ProductAct);
        await fs.promises.writeFile(this.path, JSON.stringify(products));
        console.log(`prudcto ${pid} modificado correctamente`);
        return products;
      } else {
        console.log(
          "alguno de los parametros ingresados no se pude modificar, o no es valido. Por favor corrija su peticion"
        );
        return "alguno de los parametros ingresados no se pude modificar, o no es valido. Por favor corrija su peticion";
      }
    } else {
      console.log(`No existe un producto con el id: ${pid}`);
      return `No existe un producto con el id: ${pid}`;
    }
  }
  // Eliminar producto a partir del id, si no queda ningun elemento se elimina el archivo
  async deleteProduct(pid) {
    const products = await this.#reedFile("all");
    let i = products.findIndex((producto) => producto.id === parseInt(pid));
    if (i != -1) {
      products.splice(i, 1);
      products.length === 0
        ? await this.#writeFile([])
        : await this.#writeFile(products);
      console.log(`el producto ${pid} fue removido correctamente`);
      return products;
    } else {
      console.log(`No existe un producto con el id: ${pid}`);
      return `No existe un producto con el id: ${pid}`;
    }
  }

  //Funcion para controlar el numero de Id
  async #createId() {
    const productFile = await this.#reedFile("all");
    const id =
      productFile.length === 0 ? 1 : productFile[productFile.length - 1].id + 1;
    return id;
  }

  //Funcion para leer el archivo
  async #reedFile(limit) {
    const productFile = await fs.promises.readFile(this.path, "utf-8");
    if (limit === "all") {
      return JSON.parse(productFile);
    } else {
      return JSON.parse(productFile).slice(0, parseInt(limit));
    }
  }

  //Funcion para grabar el archivo
  async #writeFile(product) {
    await fs.promises.writeFile(this.path, JSON.stringify(product));
  }
}
