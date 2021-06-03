import { Router } from "express";
import { casesController } from "../controllers/cases.controller";
import { validateToken } from "../middlewares";

const router: Router = Router();

router.post("/add", validateToken, casesController.add);

router.post("/update/:case_id", validateToken, casesController.updateState);

router.get("/all", validateToken, casesController.getAllCases);

router.get("/id/:case_id", validateToken, casesController.getCaseById);

router.get("/dni/:dni", validateToken, casesController.getCaseByDni);

router.get("/name/:name", validateToken, casesController.getCasesByName);

router.get("/data", casesController.getData);

export default router;
