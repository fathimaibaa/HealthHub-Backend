"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Config_1 = __importDefault(require("../../Config"));
const serverConfig = (server) => {
    const startServer = () => {
        server.listen(Config_1.default.PORT, () => {
            console.log(`Server listening on Port  http://localhost:${Config_1.default.PORT}`);
        }).on("error", (err) => {
            if (err.code === "EADDRINUSE") {
                console.error(`Port ${Config_1.default.PORT} is already in use. Stop the other process (e.g. netstat -ano | findstr :${Config_1.default.PORT}) or change PORT in .env.`);
            }
            else {
                console.error("Server failed to start:", err.message);
            }
            process.exit(1);
        });
    };
    return {
        startServer
    };
};
exports.default = serverConfig;
