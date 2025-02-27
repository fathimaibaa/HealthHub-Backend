"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Add_1 = require("../App/Use-cases/Chat/Add");
const Read_1 = require("../App/Use-cases/Chat/Read");
const HttpStatus_1 = require("../Types/HttpStatus");
const chatController = (chatDbRepository, chatDbRepositoryImpl) => {
    const chatRepository = chatDbRepository(chatDbRepositoryImpl());
    /*
   * METHOD:POST
   * create new chats with two users
   */
    const createNewChat = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { senderId, recieverId } = req.body;
            const chats = yield (0, Add_1.addNewChat)(senderId, recieverId, chatRepository);
            res.status(HttpStatus_1.HttpStatus.OK).json({ success: true, chats });
        }
        catch (error) {
            next(error);
        }
    });
    /*
    * METHOD:GET
    * Retrive all the conversations/chats between the users
    */
    const fetchChats = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { senderId } = req.params;
            const chats = yield (0, Read_1.getChats)(senderId, chatRepository);
            console.log('chat of doctor', chats);
            res.status(HttpStatus_1.HttpStatus.OK).json(chats);
        }
        catch (error) {
            next(error);
        }
    });
    /*
     * METHOD:POST
     * create new send messages to the users
     */
    const createNewMessage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const message = yield (0, Add_1.newMessage)(req.body, chatRepository);
            res.status(HttpStatus_1.HttpStatus.OK).json(message);
        }
        catch (error) {
            next(error);
        }
    });
    /*
    * METHOD:GET
    * Retrive all  messages from  the users
    */
    const fetchMessages = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { conversationId } = req.params;
            const messages = yield (0, Read_1.getMessages)(conversationId, chatRepository);
            res
                .status(HttpStatus_1.HttpStatus.OK)
                .json({ success: true, messages });
        }
        catch (error) {
            next(error);
        }
    });
    return {
        createNewChat,
        fetchChats,
        createNewMessage,
        fetchMessages,
    };
};
exports.default = chatController;
