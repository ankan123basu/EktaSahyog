import express from "express";
import { chatWithCouncil } from "../controllers/council.js";

const router = express.Router();

router.post("/chat", chatWithCouncil);

export default router;
