import express from "express";
import { createRegister, deleteRegister, getAuthenticatedUser, getRegister, getRegisterById, loginUser, logout, updateRegister } from "../Controllers/Register.controller";
import { requireAdminAuth } from "../Middleware/AdminAuth.middleware";

const router = express.Router();

router.get("/getall" , requireAdminAuth, getRegister);

router.get("/", getAuthenticatedUser);

router.post("/login", loginUser);

router.post("/logout", logout)

router.get("/:reg_id", getRegisterById);

router.post("/signup" , createRegister);

router.patch("/update/:reg_id", updateRegister);

router.delete("/delete/:reg_id", requireAdminAuth, deleteRegister);

export default router;