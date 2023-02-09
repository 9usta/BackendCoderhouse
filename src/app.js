import express from "express";
import { __dirname } from './utils.js'
import handlebars from "express-handlebars";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import {Server} from "socket.io";
import './dbConfig.js'

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

app.use('/products',productsRouter);
app.use('/cart',cartsRouter);

app.get("/chat", (req, res) => {
  res.render("chat");
});
const mensajes = [];


socketServer.on("connection", (socket) => {
  console.log("New client connected",socket.id);

  socket.on("disconnect", () => {
    console.log(`Cliente desconectado, id: ${socket.id}`);
  });

  socket.on("nuevo ingreso", (user) => {
    socket.broadcast.emit("nuevo ingreso", user);
  });

  socket.on("mensaje", (msj) => {
    mensajes.push(msj);
    socketServer.emit("mensaje", mensajes);
  });
});

