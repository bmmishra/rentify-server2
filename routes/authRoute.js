import express from "express";
import {
    registerController,
    loginController,
    testController,
    updateProfileController
} from "../controllers/authController.js";

import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

//router object
const router = express.Router();

//routing
//REGISTER || METHOD POST
router.post("/register", registerController);
router.post("/login", loginController);
router.get("/user-auth", requireSignIn, (req, res) => {
    res.status(200).send({ ok: true });
});
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

//test routes
router.get("/test", requireSignIn, isAdmin, testController);

//update profile
router.put("/profile", requireSignIn, updateProfileController);

export default router;