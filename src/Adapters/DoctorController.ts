import { NextFunction, Request, Response } from "express";
import { doctorDbInterface } from "../App/Interfaces/DoctorDBRepository";
import { userDbInterface } from "../App/Interfaces/UserDbRepository";
import {
  AuthServiceInterfaceType
} from "../App/Service-interface/AuthServiceInterface";
import { HttpStatus } from "../Types/HttpStatus";
import { userRepositoryMongodbType } from "../Frameworks/Database/Repositories/UserRepositoryMongodb";
import { AuthService } from "../Frameworks/Services/AuthService";
import {
    addNewDoctor,
    doctorLogin,
    verifyAccount
    
  } from "../App/Use-cases/Doctor/AuthDoctor";
  import { doctorRepositoryMongodbType } from "../Frameworks/Database/Repositories/DoctorRepositoryMongodb";
import { getDoctorProfile, updateDoctor } from "../App/Use-cases/Doctor/ReadnUpdate/Profile";
import { listDepartments } from "../App/Use-cases/Admin/AdminDepartment";
import { IDepartmentRepository } from "../App/Interfaces/DepartmentRepositoryInterface";
import { addTimeSlot, deleteTimeSlot, getTimeSlotsByDoctorId } from "../App/Use-cases/Doctor/Timeslot";
import { TimeSlotDbInterface, timeSlotDbRepository } from "../App/Interfaces/TimeSlotDbRepository";
import { TimeSlotRepositoryMongodbType } from "../Frameworks/Database/Repositories/TimeSlotRepositoryMongodb";
import { getPatientFullDetails, getPatients } from "../App/Use-cases/Doctor/DoctorRead";
import { bookingDbRepository, BookingDbRepositoryInterface } from "../App/Interfaces/BookingDbRepository";
import { BookingRepositoryMongodbType } from "../Frameworks/Database/Repositories/BookingRepositoryMongodb";
import { PrescriptionDbInterface } from "../App/Interfaces/PrescriptionDbRepository";
import { PrescriptionRepositoryMongodbType } from "../Frameworks/Database/Repositories/PrescriptionRepositoryMongodb";
import { addPrescriptionToUser, deletePrescriptionData, fetchPrescriptionForDoctor, fetchPrescriptionUsecase } from "../App/Use-cases/Prescription/PrescriptionUseCase";
import { getSingleUser } from "../App/Use-cases/Admin/AdminRead";



  const doctorController = (
    authServiceInterface: AuthServiceInterfaceType,
    authServiceImpl: AuthService,
    userDbRepository: userDbInterface,
    userRepositoryImpl: userRepositoryMongodbType,
    doctorDbRepository: doctorDbInterface,
    doctorDbRepositoryImpl: doctorRepositoryMongodbType,
    timeSlotDbRepository: TimeSlotDbInterface,
    timeSlotDbRepositoryImpl: TimeSlotRepositoryMongodbType,
    departmentDbRepository: IDepartmentRepository,
    bookingDbRepository: BookingDbRepositoryInterface,
    bookingDbRepositoryImpl: BookingRepositoryMongodbType,
    
    departmentDbRepositoryImpl: () => any,
   
    prescriptionDbRepository:PrescriptionDbInterface,
    prescriptionDbRepositoryImpl:PrescriptionRepositoryMongodbType,
    
   
    
      
  ) => {
    const authService = authServiceInterface(authServiceImpl());
    const dbRepositoryUser = userDbRepository(userRepositoryImpl());
    const dbRepositoryDoctor = doctorDbRepository(doctorDbRepositoryImpl());
    const dbTimeSlotRepository = timeSlotDbRepository(timeSlotDbRepositoryImpl());
   
    const dbDepartmentRepository = departmentDbRepository(departmentDbRepositoryImpl());
    
    const dbBookingRepository = bookingDbRepository(bookingDbRepositoryImpl());
    const dbPrescriptionRepository = prescriptionDbRepository(prescriptionDbRepositoryImpl());
   

  const signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const doctordata = req.body;
      const registerDoctor = await addNewDoctor(
        doctordata,
        dbRepositoryDoctor,
        authService
      );
      if (registerDoctor) {
        return res.status(HttpStatus.OK).json({
          success: true,
          message:
            "Registration success, please verify your email that we sent to your mail",
        });
      }
    } catch (error) {
      next(error);
    }
  };

const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token } = req.params;
    const verifying = await verifyAccount(token, dbRepositoryDoctor);
    if (verifying) {
      return res.status(HttpStatus.OK).json({
        success: true,
        message: "Account is verified ,go n login",
      });
    }
  } catch (error) {
    next(error);
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const { accessToken,refreshToken, isEmailExist } = await doctorLogin(
      email,
      password,
      dbRepositoryDoctor,
      authService
    );

    return res.status(HttpStatus.OK).json({
      success: true,
      message: "Login successful",
      doctor: isEmailExist,
      access_token: accessToken,
      refresh_token : refreshToken ,
    });
  } catch (error) {
    next(error);
  }
};



const doctorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const doctorId = req.doctor;
    if (!doctorId) {
      return res.status(400).json({ success: false, message: "Doctor ID not found" });
    }
    const doctor = await getDoctorProfile(doctorId, dbRepositoryDoctor);
    res.status(200).json({ success: true, doctor });
  } catch (error) {
    next(error);
  }
};



 
 const updateDoctorInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {

    const doctorId = req.doctor;
    const updateData = req.body;


    const doctor = await updateDoctor(
      doctorId,
      updateData,
      dbRepositoryDoctor
    );
    res
      .status(200)
      .json({ success: true, doctor, message: "KYC updated successfully" });
  } catch (error) {
    next(error);
  }
};


 
 const doctorStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const doctorId = req.doctor;
    const doctor = await getDoctorProfile(doctorId, dbRepositoryDoctor);
    res.status(200).json({ success: true, doctor });
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



 
   
 



  
  const getTimeSlots = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const doctorId = req.doctor;
      // const { date } = req.params; 
      const timeSlots = await getTimeSlotsByDoctorId(
        doctorId,
        // date,
        dbTimeSlotRepository
      );
      res.status(HttpStatus.OK).json({ success: true, timeSlots });
    } catch (error) {
      next(error);
    }
  };

  
   
  const getPatientList = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const patients = await getPatients(dbBookingRepository);
      return res.status(HttpStatus.OK).json({ success: true, patients });
    } catch (error) {
      next(error);
    }
  }



  const getPatientDetails = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const {id} = req.params;
      const patient = await getPatientFullDetails(id,dbBookingRepository);
      return res.status(HttpStatus.OK).json({ success: true, patient });
    } catch (error) {
      next(error);
    }
  }


  const addPrescription = async (
    req:Request,
    res:Response,
    next:NextFunction
  )=>{
    try {
      const {userId,appointmentId,prescriptionDate, medicines }=req.body
      const data={userId,appointmentId,prescriptionDate,medicines}
      const response = await addPrescriptionToUser(
        data,
        dbPrescriptionRepository
      );
      res
        .status(HttpStatus.OK)
        .json({ success: true, message: "add Prescription successfully",response });
    } catch (error) {
      next(error);
    }
  }

const fetchPrescription = async(
  req:Request,
  res:Response,
  next:NextFunction
)=>{
  try {
    const { id } = req.params;
    const data =  id 
    const response = await fetchPrescriptionForDoctor(data,dbPrescriptionRepository);
    res.status(HttpStatus.OK).json({sucess:true,response});
  } catch (error) {
    next(error)
  }
}


const deletePrescription = async (
  req:Request,
  res:Response,
  next:NextFunction,
)=>{
  try {
    const prescriptionId = req.params.id;
    const response = await deletePrescriptionData(prescriptionId,dbPrescriptionRepository);
    res.status(HttpStatus.OK).json({sucess:true,response});
  } catch (error) {
    next(error);
  }
}


const receiverDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
 
    const {id} = req.params;

    const doctor = await getDoctorProfile(id,dbRepositoryDoctor);
    return res.status(HttpStatus.OK).json({ success: true, doctor });
  } catch (error) {
    next(error);
  }
}
 

const userDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    
    const {id} = req.params;
    const user = await getSingleUser(id,dbRepositoryUser);
    return res.status(HttpStatus.OK).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};


const scheduleTime = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const doctorId = req.doctor;
    const {slotTime , date } = req.body // Destructure time and date from req.body

    const newTimeSlot = await addTimeSlot(
      doctorId,
      {
        slotTime,  date,
        isAvailable:true,
      }, // Pass time and date as an object
      dbTimeSlotRepository
    );

    res.status(HttpStatus.OK).json({
      success: true,
      message: "Time slot added successfully",
      newTimeSlot,
    });
  } catch (error) {
    next(error);
  }
};


const removeTimeSlot = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    
    const{ id } = req.params;
    await deleteTimeSlot(id, dbTimeSlotRepository);
    res
      .status(HttpStatus.OK)
      .json({ success: true, message: "Slot deleted successfully" });
  } catch (error) {
    next(error);
  }
}

  return{
    signup,
    verifyToken,
    login,
    doctorProfile,
    updateDoctorInfo,
    doctorStatus,
    listDepartmentsHandler,
    getTimeSlots,
    getPatientList,
    getPatientDetails,
    addPrescription,
    fetchPrescription,
    deletePrescription,
    receiverDetails,
    userDetails,
    scheduleTime,
    removeTimeSlot,


  }
}
export default doctorController;
