import { Router } from "express";
import { postPrintTicket } from "../controllers/print.controller.js";

export const printRouter = Router();

printRouter.post("/ticket", postPrintTicket);
