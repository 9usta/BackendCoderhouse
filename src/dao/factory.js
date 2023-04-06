import config from "../config/config.js";
import mongoose from 'mongoose';

export let users, carts, products, connection;

switch (config.persistence) {
    case "MONGO":
        connection = mongoose.connect(config.connection);
        users = await import('./mongoManagers/UserManager.js');
        carts = await import('./mongoManagers/CartManager.js');
        products = await import('./mongoManagers/ProductManager.js');
        break;
    case "MEMORY":
        products = await import('./memory/products.js');
        console.log("No memory");
        break;
}