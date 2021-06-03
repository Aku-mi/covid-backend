import { Router } from "express";
import { authController } from "../controllers/auth.controller";

const router: Router = Router();

router.post("/sign-in", authController.signIn);

router.post("/sign-up", authController.signUp);

router.post("/log-out", authController.logOut);

export default router;
