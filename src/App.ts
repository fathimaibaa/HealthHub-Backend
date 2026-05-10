// import express, { Application, NextFunction } from "express";
// import http from "http";
// import serverConfig from "./Frameworks/Webserver/Server";
// import routes from "./Frameworks/Webserver/Routes/Index";
// import connectDb from "./Frameworks/Database/Connection";
// import expressConfig from "./Frameworks/Webserver/ExpressConfig";
// import errorHandlingMiddleware from "./Frameworks/Webserver/Middlewares/ErrorhandleMiddleware";
// import CustomError from "./Utils/CustomError";
// import { Server } from "socket.io";
// import socketConfig from "./Frameworks/Webserver/WebSocket/Socket";
// import path from "path";
// import configKeys from "./Config";
// import cors from "cors";

// const app : Application = express();

// const server = http.createServer(app);

// expressConfig(app);

// connectDb();

// app.use(cors({
//   origin: true,
//   credentials: true
// }));


// const io = new Server(server, {
//   cors: {
//     origin: true,
//     credentials: true
//   },
// });




//   socketConfig(io);




// routes(app);
// console.log("CLIENT_PORT =>", configKeys.CLIENT_PORT);
// serverConfig(server).startServer()

// app.get("/", (req, res) => {
//     res.send("HealthHub Backend is running!");
// });

// app.use(errorHandlingMiddleware)

// app.all("*",(req, res, next: NextFunction)=>{
//     next(new CustomError(`Not found : ${req.url}`, 404));
// });


import express, { Application, NextFunction } from "express";
import http from "http";
import cors from "cors";
import routes from "./Frameworks/Webserver/Routes/Index";
import connectDb from "./Frameworks/Database/Connection";
import expressConfig from "./Frameworks/Webserver/ExpressConfig";
import errorHandlingMiddleware from "./Frameworks/Webserver/Middlewares/ErrorhandleMiddleware";
import CustomError from "./Utils/CustomError";
import { Server } from "socket.io";
import socketConfig from "./Frameworks/Webserver/WebSocket/Socket";
import serverConfig from "./Frameworks/Webserver/Server";

const app: Application = express();
const server = http.createServer(app);

/* 🔴 MUST BE FIRST */
app.use(cors({
  origin: "https://health-hub-frontend.vercel.app",
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

expressConfig(app);
connectDb();

/* 🔴 ROUTES AFTER CORS */
routes(app);

/* 🔴 SOCKET.IO AFTER CORS */
const io = new Server(server, {
  cors: {
    origin: "https://health-hub-frontend.vercel.app",
    credentials: true,
  },
});

socketConfig(io);

app.get("/", (req, res) => {
  res.send("HealthHub Backend is running!");
});

app.use(errorHandlingMiddleware);

app.all("*", (req, res, next: NextFunction) => {
  next(new CustomError(`Not found : ${req.url}`, 404));
});

serverConfig(server).startServer();




//  app.use(
//     express.static(path.join(__dirname, "../../Frontend/dist"))
// );