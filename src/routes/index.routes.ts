import { Router } from "express";
import { indexController } from "../controllers/index.controller";
import authRoutes from "./auth.routes";

import casesRoutes from "./cases.routes";

const router: Router = Router();

router.get("/", indexController.index);

router.post("/refresh_token", indexController.refreshToken);

router.post("/revoke_tokens/:id", indexController.revokeRefreshTokens);

router.use("/auth", authRoutes);

router.use("/cases", casesRoutes);

export default router;
