import { Router } from "express";
import { createAccount, listAccounts, decryptData } from "../controller/account.controller";
import { validate } from "../middleware/joi"; 
import { userInputSchema } from "../middleware/joiSchema";

const router = Router();

router.post("/accounts", validate(userInputSchema), createAccount);

router.get("/accounts", listAccounts);
router.post("/decrypt", decryptData);

export default router;