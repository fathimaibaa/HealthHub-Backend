import express, { Application, NextFunction } from "express";
import http from "http";
import serverConfig from "./Frameworks/Webserver/Server";
import routes from "./Frameworks/Webserver/Routes/Index";
import connectDb from "./Frameworks/Database/Connection";
import expressConfig from "./Frameworks/Webserver/ExpressConfig";
import errorHandlingMiddleware from "./Frameworks/Webserver/Middlewares/ErrorhandleMiddleware";
import CustomError from "./Utils/CustomError";
import { Server } from "socket.io";
import socketConfig from "./Frameworks/Webserver/WebSocket/Socket";
import path from "path";

const app: Application = express();
const server = http.createServer(app);

expressConfig(app); // General Express configuration
connectDb(); // Connect to the database

const io = new Server(server, {
    cors: {
        origin: true,
        methods: ["GET", "POST"],
        credentials: true,
    },
});

socketConfig(io); // Configure WebSocket

// Serve static files from the frontend build directory
app.use(express.static(path.join(__dirname, "../../Frontend/dist")));

// Root route for the backend
app.get("/", (req, res) => {
    res.send("Welcome to the backend server!");
});

// Backend API routes
routes(app);

// Fallback to serve index.html for React routing (frontend)
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../../Frontend/dist/index.html"));
});

// Start the server
serverConfig(server).startServer();

// Error-handling middleware
app.use(errorHandlingMiddleware);

// Catch-all handler for undefined routes (ensure this is last)
app.all("*", (req, res, next: NextFunction) => {
    next(new CustomError(`Not found : ${req.url}`, 404));
});
