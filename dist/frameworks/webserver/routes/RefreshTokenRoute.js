"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const TokenController_1 = __importDefault(require("../../../Adapters/TokenController"));
const DoctorDBRepository_1 = require("../../../App/Interfaces/DoctorDBRepository");
const UserDbRepository_1 = require("../../../App/Interfaces/UserDbRepository");
const AuthServiceInterface_1 = require("../../../App/Service-interface/AuthServiceInterface");
const DoctorRepositoryMongodb_1 = require("../../Database/Repositories/DoctorRepositoryMongodb");
const UserRepositoryMongodb_1 = require("../../Database/Repositories/UserRepositoryMongodb");
const AuthService_1 = require("../../Services/AuthService");
const refreshTokenRoute = () => {
    const router = express_1.default.Router();
    const controller = (0, TokenController_1.default)(AuthServiceInterface_1.authServiceInterface, AuthService_1.authService, UserDbRepository_1.userDbRepository, UserRepositoryMongodb_1.userRepositoryMongodb, DoctorDBRepository_1.doctorDbRepository, DoctorRepositoryMongodb_1.doctorRepositoryMongodb);
    router.get("/accessToken", controller.returnAccessToClient);
    router.post("/refresh_token", controller.getNewAccessToken);
    return router;
};
exports.default = refreshTokenRoute;
