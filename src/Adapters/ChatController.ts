import { NextFunction, Request, Response } from "express";
import { ChatDbRepositoryInterace } from "../App/Interfaces/ChatDbRepository";
import { addNewChat, newMessage } from "../App/Use-cases/Chat/Add";
import { getChats, getMessages } from "../App/Use-cases/Chat/Read";
import { ChatRepositoryMongodbType } from "../Frameworks/Database/Repositories/ChatRepositoryMongodb";
import { HttpStatus } from "../Types/HttpStatus";


const chatController = (
    chatDbRepository: ChatDbRepositoryInterace,
    chatDbRepositoryImpl: ChatRepositoryMongodbType
  ) => {
    const chatRepository = chatDbRepository(chatDbRepositoryImpl());

    /*
   * METHOD:POST
   * create new chats with two users
   */
  const createNewChat = async (
    req: Request,
    res: Response, 
    next: NextFunction
  ) => {
    try {
      const { senderId, recieverId } = req.body;

      const chats = await addNewChat(senderId, recieverId, chatRepository);
      res.status(HttpStatus.OK).json({ success: true, chats });
    } catch (error) {
      next(error);
    }
  };

   /*
   * METHOD:GET
   * Retrive all the conversations/chats between the users
   */
   const fetchChats = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { senderId } = req.params;
      const chats = await getChats(senderId, chatRepository);
      console.log('chat of doctor',chats);
      
      res.status(HttpStatus.OK).json(chats);
    } catch (error) {
      next(error);
    }
  };


  /*
   * METHOD:POST
   * create new send messages to the users
   */
  const createNewMessage = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const message = await newMessage(req.body, chatRepository);
      res.status(HttpStatus.OK).json(message);
    } catch (error) {
      next(error);
    }
  };

   /*
   * METHOD:GET
   * Retrive all  messages from  the users
   */
   const fetchMessages = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { conversationId } = req.params 

      const messages = await getMessages(
        conversationId,
        chatRepository
      );
      res
        .status(HttpStatus.OK)
        .json({ success: true, messages });
    } catch (error) {
      next(error);
    }
  };
  
  return {
    createNewChat,
    fetchChats,
    createNewMessage,
    fetchMessages,
  }

  };
    export default chatController;    