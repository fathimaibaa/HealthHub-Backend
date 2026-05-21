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

const allowedOrigins: string[] = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

if (process.env.CLIENT_URL) {
  allowedOrigins.push(process.env.CLIENT_URL);
}

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

expressConfig(app);

/* 🔴 ROUTES AFTER CORS */
routes(app);

/* 🔴 SOCKET.IO AFTER CORS */
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

socketConfig(io);

app.get("/", (req, res) => {
  res.send("HealthHub Backend is running!");
});

app.all("*", (req, res, next: NextFunction) => {
  next(new CustomError(`Not found : ${req.url}`, 404));
});

app.use(errorHandlingMiddleware);

const bootstrap = async () => {
  await connectDb();
  serverConfig(server).startServer();
};

bootstrap();




//  app.use(
//     express.static(path.join(__dirname, "../../Frontend/dist"))
// );