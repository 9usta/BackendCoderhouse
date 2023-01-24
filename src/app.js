import express from "express";
import {fileURLToPath} from "url";
import {dirname} from "path";
import handlebars from "express-handlebars";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import {Server} from "socket.io";
const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express();
const PORT = 8080;
const httpServer = app.listen(PORT, () => {
  console.log(`Escuchando al puerto ${PORT}`);
});

export const socketServer = new Server(httpServer);

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use(productsRouter);
app.use(cartsRouter);

socketServer.on("connection", (socket) => {
  console.log("New client connected",socket.id);
});