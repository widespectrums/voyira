import express from "express";
import { authMiddleware} from "../middlewares/auth.middleware.js";

const router = express.Router();
router.use(authMiddleware("ROLE_ADMIN"));
router.get("/dashboard", (req, res) => {
    res.send("This is only for admins!");
})

export default router;