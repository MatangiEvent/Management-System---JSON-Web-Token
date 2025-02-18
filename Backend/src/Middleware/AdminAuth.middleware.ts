import { RequestHandler } from "express";
import createHttpError from "http-errors";
import AdminModel from "../Models/Admin.model";

export const requireAdminAuth: RequestHandler = (req, res, next) => {
    if(req.session.adminId)
    {
        next();
    }
    else
    {
        next(createHttpError(401, "Admin Not Authenticated"));
    }
}

export const checkSuperAdmin: RequestHandler = async (req, res, next) => {
    try {
      const adminId = req.session.adminId;
  
      if (!adminId) {
        // Use `next` to pass errors instead of returning a response directly
        return next(createHttpError(401, "Unauthorized: Admin ID missing"));
      }
  
      const admin = await AdminModel.findById(adminId);
  
      if (!admin) {
        return next(createHttpError(404, "Admin not found"));
      }
  
      if (admin.role !== "SuperAdmin") {
        return next(createHttpError(403, "Forbidden: You do not have SuperAdmin access"));
      }
  
      // Send a success response if the admin is a SuperAdmin
        next();
    } catch (error) {
      next(error); // Pass any unexpected error to the global error handler
    }
  };