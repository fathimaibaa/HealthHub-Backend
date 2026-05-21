"use strict";
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const Index_1 = __importDefault(require("./Frameworks/Webserver/Routes/Index"));
const Connection_1 = __importDefault(require("./Frameworks/Database/Connection"));
const ExpressConfig_1 = __importDefault(require("./Frameworks/Webserver/ExpressConfig"));
const ErrorhandleMiddleware_1 = __importDefault(require("./Frameworks/Webserver/Middlewares/ErrorhandleMiddleware"));
const CustomError_1 = __importDefault(require("./Utils/CustomError"));
const socket_io_1 = require("socket.io");
const Socket_1 = __importDefault(require("./Frameworks/Webserver/WebSocket/Socket"));
const Server_1 = __importDefault(require("./Frameworks/Webserver/Server"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
/* 🔴 MUST BE FIRST */
const allowedOrigins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
];
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(null, false);
        }
    },
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
(0, ExpressConfig_1.default)(app);
/* 🔴 ROUTES AFTER CORS */
(0, Index_1.default)(app);
/* 🔴 SOCKET.IO AFTER CORS */
const io = new socket_io_1.Server(server, {
    cors: {
        origin: allowedOrigins,
        credentials: true,
    },
});
(0, Socket_1.default)(io);
app.get("/", (req, res) => {
    res.send("HealthHub Backend is running!");
});
app.all("*", (req, res, next) => {
    next(new CustomError_1.default(`Not found : ${req.url}`, 404));
});
app.use(ErrorhandleMiddleware_1.default);
const bootstrap = () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, Connection_1.default)();
    (0, Server_1.default)(server).startServer();
});
bootstrap();
//  app.use(
//     express.static(path.join(__dirname, "../../Frontend/dist"))
// );
