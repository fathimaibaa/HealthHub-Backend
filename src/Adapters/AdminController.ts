import { NextFunction, Request, Response } from "express";
import { doctorDbInterface } from "../App/Interfaces/DoctorDBRepository";
import { userDbInterface } from "../App/Interfaces/UserDbRepository";
import { AuthServiceInterfaceType } from "../App/Service-interface/AuthServiceInterface";
import { loginAdmin } from "../App/Use-cases/Admin/AdminAuth";
import { doctorRepositoryMongodbType } from "../Frameworks/Database/Repositories/DoctorRepositoryMongodb";
import { userRepositoryMongodbType } from "../Frameworks/Database/Repositories/UserRepositoryMongodb";
import { AuthService } from "../Frameworks/Services/AuthService";
import { HttpStatus } from "../Types/HttpStatus";
import { blockDoctor, blockUser } from "../App/Use-cases/Admin/AdminUpdate";

import {getAllReports, getAllTheAppoinments, getAllTheDoctors, getDoctor, getDoctorRejected, getSingleDoctor, getUsers } from "../App/Use-cases/Admin/AdminRead";
import { IDepartmentRepository } from "../App/Interfaces/DepartmentRepositoryInterface";
import {
  addDepartment,
  blockDepartment,
  getAllDepartments,
  listDepartments,
  unblockDepartment,
  unlistDepartments,
  updateDepartment,
} from "../App/Use-cases/Admin/AdminDepartment";
import { BookingDbRepositoryInterface } from "../App/Interfaces/BookingDbRepository";
import { BookingRepositoryMongodbType } from "../Frameworks/Database/Repositories/BookingRepositoryMongodb";

export default (
  authServiceInterface: AuthServiceInterfaceType,
  authServiceImpl: AuthService,
  userDbRepository: userDbInterface,
  userDbRepositoryImpl: userRepositoryMongodbType,
  bookingDbRepository: BookingDbRepositoryInterface,
  bookingDbRepositoryImpl: BookingRepositoryMongodbType,
  doctorDbRepository: doctorDbInterface,
  doctorDbRepositoryImpl: doctorRepositoryMongodbType,
  departmentDbRepository: IDepartmentRepository,
  departmentDbRepositoryImpl: () => any
 
) => {
  const dbUserRepository = userDbRepository(userDbRepositoryImpl());
  const dbBookingRepository = bookingDbRepository(bookingDbRepositoryImpl());
  const dbDoctorRepository = doctorDbRepository(doctorDbRepositoryImpl());
  const authService = authServiceInterface(authServiceImpl());
  const dbDepartmentRepository = departmentDbRepository(
    departmentDbRepositoryImpl()
  );
  const adminLogin = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
   
      const { email, password } = req.body;
      console.log(email, password,"lllllllllllllllllllllllllllllllllllllll")
      const { accessToken, refreshToken } = await loginAdmin(email, password, authService);


      
      return res.status(HttpStatus.OK).json({
        success: true,
        message: "Admin login success",
        admin: { name: "Admin user", role: "admin" },
        access_token: accessToken,
        refresh_token: refreshToken,
      });
    } catch (error) {
      next(error);
    }
  };

 
  const getAllUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const users = await getUsers(dbUserRepository);
      return res.status(HttpStatus.OK).json({ success: true, users });
    } catch (error) {
      next(error);
    }
  };


 
  const getAllDoctors = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const doctors = await getAllTheDoctors(dbDoctorRepository);
      return res.status(HttpStatus.OK).json({ success: true, doctors });
    } catch (error) {
      next(error);
    }
  };

 
  const userBlock = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const updatedUser = await blockUser(id, dbUserRepository);
      return res.status(HttpStatus.OK).json({
        success: true,
        message: "User block status updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  };

  
  const doctorBlock = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const updatedDoctor = await blockDoctor(id, dbDoctorRepository);
      return res.status(HttpStatus.OK).json({
        success: true,
        message: "doctor block status updated successfully",
        doctor: updatedDoctor,
      });
    } catch (error) {
      next(error);
    }
  };


  const doctorDetails = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const doctor = await getSingleDoctor(id, dbDoctorRepository);
      return res.status(HttpStatus.OK).json({ success: true, doctor });
    } catch (error) {
      next(error);
    }
  };

  const updateDoctor = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const { action } = req.body;
      const doctor = await getDoctor(id, action, dbDoctorRepository);
      return res
        .status(HttpStatus.OK)
        .json({ success: true, doctor, message: "Verified Successfull" });
    } catch (error) {
      next(error);
    }
  };

  const rejectionDoctor = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const { reason } = req.body;
      const doctor = await getDoctorRejected(
        id,
        status,
        reason,
        dbDoctorRepository
      );
      return res
        .status(HttpStatus.OK)
        .json({ success: true, doctor, message: "Verified Successfully" });
    } catch (error) {
      next(error);
    }
  };

  
  const getAllDepartmentsHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const departments = await getAllDepartments(dbDepartmentRepository);
      return res.status(HttpStatus.OK).json({ success: true, departments });
    } catch (error) {
      next(error);
    }
  };

   const addDepartmentHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { departmentName } = req.body;
      const newDept =  await addDepartment({departmentName}, dbDepartmentRepository);
      return res
        .status(HttpStatus.OK)
        .json({ success: true, message: "Department added successfully",newDept});
    } catch (error) {
      next(error);
    }
  };

  const listDepartmentsHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const departments = await listDepartments(dbDepartmentRepository);
      return res.status(HttpStatus.OK).json({ success: true, departments });
    } catch (error) {
      next(error);
    }
  };

  const updateDepartmentHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const departmentName = req.body;
      await updateDepartment(id, departmentName, dbDepartmentRepository);
      return res
        .status(HttpStatus.OK)
        .json({ success: true, message: "Department updated successfully" });
    } catch (error) {
      next(error);
    }
  };


   const blockDepartmentHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      await blockDepartment(id, dbDepartmentRepository);
      return res
        .status(HttpStatus.OK)
        .json({ success: true, message: "Department blocked successfully" });
    } catch (error) {
      next(error);
    }
  };

   const unblockDepartmentHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      await unblockDepartment(id, dbDepartmentRepository);
      return res
        .status(HttpStatus.OK)
        .json({ success: true, message: "Department unblocked successfully" });
    } catch (error) {
      next(error);
    }
  };


  const getAllAppoinments = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const appoinments = await getAllTheAppoinments(dbDoctorRepository);
      return res.status(HttpStatus.OK).json({ success: true, appoinments });
    } catch (error) {
      next(error);
    }
  };


  const getReports = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const reports = await getAllReports(dbBookingRepository);
      return res.status(HttpStatus.OK).json({ success: true, reports });
    } catch (error) {
      next(error);
    }
  };

  return {
    adminLogin,
    getAllUser,
    getAllDoctors,
    userBlock,
    doctorBlock,
    doctorDetails,
    updateDoctor,
    rejectionDoctor,
    getAllDepartmentsHandler,
    addDepartmentHandler,
    listDepartmentsHandler,
    updateDepartmentHandler,
    blockDepartmentHandler,
    unblockDepartmentHandler,
    getAllAppoinments,
    getReports

   
  };
};




