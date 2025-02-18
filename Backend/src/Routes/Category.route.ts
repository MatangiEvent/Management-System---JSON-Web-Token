import express from "express";
import { createCategory, deleteCategory, getCategories, getCategoryById, updateCategory } from "../Controllers/Category.controller";
import { requireAdminAuth } from "../Middleware/AdminAuth.middleware";

const router = express.Router();

router.get("/", getCategories);

router.get("/:category_id", getCategoryById);

router.post("/create", requireAdminAuth, createCategory);

router.patch("/update/:category_id", updateCategory);

router.delete("/delete/:category_id",requireAdminAuth, deleteCategory);


export default router;