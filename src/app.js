import express from "express";
import { __dirname } from './utils.js'
import handlebars from "express-handlebars";
import productsRouter from "./routes/products.router.js";
import productsViewRouter from  "./routes/productsView.router.js";
import cartsRouter from "./routes/carts.router.js";
import cartsViewRouter from "./routes/cartsView.router.js";
import {Server} from "socket.io";
import './dbConfig.js'
import messagesRouter from "./routes/messages.router.js";
import { MessageManager } from "./dao/mongoManagers/MessageManager.js";

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

app.use('/api/products',productsRouter);
app.use('/api/cart',cartsRouter);
app.use("/messages", messagesRouter);
app.use('/products',productsViewRouter);
app.use('/cart',cartsViewRouter);
const messageManager = new MessageManager();

socketServer.on("connection", async (socket) => {
  console.log(`Cliente conectado. ID: ${socket.id}`);
  socket.emit("bienvenida", {
    message: "Conectado al servidor",
  });
  
  socket.on("disconnect", () => {
    console.log(`Cliente desconectado. ID: ${socket.id}`);
  });

  socket.on("nuevoIngreso", async (user) => {
    socket.broadcast.emit("nuevoIngreso", user);
    socket.emit("chat", await messageManager.getMessages());
  });

  socket.on("chat", async (msjObj) => {
    const newMessages = await messageManager.savedMessages(msjObj);
    socketServer.emit("chat", newMessages);
  });

  socket.on("clean", async (obj) => {
    const newMessages = await messageManager.cleanHisotry();
    socketServer.emit("chat", newMessages);
  });
});