import express from "express";
import userController from "../../../Adapters/UserController";

import { userDbRepository } from "../../../App/Interfaces/UserDbRepository";
import { authService } from "../../Services/AuthService";
import { userRepositoryMongodb } from "../../Database/Repositories/UserRepositoryMongodb";
import { authServiceInterface } from "../../../App/Service-interface/AuthServiceInterface";
import { doctorDbRepository } from "../../../App/Interfaces/DoctorDBRepository";
import { doctorRepositoryMongodb } from "../../Database/Repositories/DoctorRepositoryMongodb";

import { timeSlotDbRepository } from "../../../App/Interfaces/TimeSlotDbRepository";
import {  timeSlotRepositoryMongodb } from "../../Database/Repositories/TimeSlotRepositoryMongodb";

import BookingController from "../../../Adapters/BookingController";
import { bookingDbRepository } from "../../../App/Interfaces/BookingDbRepository";
import { bookingRepositoryMongodb } from "../../Database/Repositories/BookingRepositoryMongodb";
import { prescriptionDbRepository } from "../../../App/Interfaces/PrescriptionDbRepository";
import { prescriptionRepositoryMongodb } from "../../Database/Repositories/PrescriptionRepositoryMongodb";


import { departmentDbRepository } from "../../../App/Interfaces/DepartmentRepositoryInterface";
import { departmentRepositoryMongodb } from "../../Database/Repositories/DepartmentRepositoryMongodb";
import authenticateUser from '../Middlewares/AuthMiddleware';



const userRoutes = () => {
    const router = express.Router();
    const controller = userController(
        authServiceInterface,
        authService,
        userDbRepository,
        userRepositoryMongodb,
        doctorDbRepository,
        doctorRepositoryMongodb,
        timeSlotDbRepository,
        timeSlotRepositoryMongodb,
        prescriptionDbRepository,
        prescriptionRepositoryMongodb,
       
        departmentDbRepository,
        departmentRepositoryMongodb,  
    )

    const _bookingController = BookingController(
        userDbRepository,
        userRepositoryMongodb,
        doctorDbRepository,
        doctorRepositoryMongodb,
        timeSlotDbRepository,
        timeSlotRepositoryMongodb,
        bookingDbRepository,
        bookingRepositoryMongodb,
    )









    router.post('/register',controller.registerUser)
    router.post('/verify_otp',controller.verifyOtp)
    router.post("/resend_otp",controller.resendOtp);
    router.post("/forgot_password",controller.forgotPassword);
    router.post("/reset_password/:token",controller.resetPassword);
    router.post("/google_signIn", controller.googleSignIn);
    router.post("/login",controller.userLogin)



    router.get("/doctors",controller.doctorPage)
    router.get("/doctor/:id",controller.doctorDetails)
    router.get("/user/:id",controller.userDetails)
    router.get('/department/list', controller.listDepartmentsHandler);
    router.get("/profile",authenticateUser,controller.userProfile);
    router.patch("/profile/edit",authenticateUser,controller.updateUserInfo);
    router.get("/time-slots/:id",authenticateUser,controller.getTimeslots);
    router.get("/time-slots/:id/dates",authenticateUser,controller.getDateSlots);
    router.get("/fetchWallet/:id",authenticateUser,controller.getWallet);
    router.get("/transactions", authenticateUser, controller.getTransactions);
    router.post("/fetchPrescription",authenticateUser,controller.fetchPrescription);
    

      router.post("/appointments",authenticateUser,_bookingController.BookAppoinment);//last booking ......
      router.get("/allAppoinments",authenticateUser,_bookingController.getAllAppoinments);
      router.patch("/payment/status/:id",authenticateUser,_bookingController.updatePaymentStatus);
      router.post("/walletPayment",authenticateUser,_bookingController.walletPayment);
      router.put("/updateWallet",authenticateUser,_bookingController.changeWalletAmount);
      router.get("/bookingdetails/:id",authenticateUser,_bookingController.getBookingDetails);//id-bookingid
      router.get("/bookings/:id",authenticateUser,_bookingController.getAllBookingDetails);
      router.put("/bookingdetails/:id",authenticateUser,_bookingController.cancelAppoinment);



      router.post("/uploadDocuments",authenticateUser,controller.labRecords);
      router.get("/documents/:id",authenticateUser,controller.fetchDocuments);
      router.delete("/documents/:id",authenticateUser,controller.deleteDocument);
      



    return router
}

export default userRoutes