import { Router } from "express";
import {AuthController} from './auth.controller';
import { authMiddleware } from "../../middlewares/auth.middleware";

const router=Router();
router.post('/register',AuthController.register)
router.post("/login", AuthController.login);

// Protected routes
router.get("/me", authMiddleware, AuthController.getCurrentUser);
router.post("/refresh-token", AuthController.refreshToken);
export default router;