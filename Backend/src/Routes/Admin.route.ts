import express from "express";
import { createAdmin, deleteAdmin, getAdminById, getAdmins, getAuthenticatedAdmin, loginAdmin, logoutAdmin, updateAdmin } from "../Controllers/Admin.controller";
import { checkSuperAdmin } from "../Middleware/AdminAuth.middleware";

const router = express.Router();

router.get("/", getAuthenticatedAdmin)

router.post("/login", loginAdmin);

router.post("/logout", logoutAdmin);

router.get("/getall" , getAdmins );

router.get("/:admin_id", getAdminById);

router.post("/create",checkSuperAdmin, createAdmin);

router.patch<{ admin_id: string }>("/update/:admin_id", checkSuperAdmin, updateAdmin);

router.delete("/delete/:admin_id",checkSuperAdmin, deleteAdmin);

export default router;