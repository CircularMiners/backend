import express, { Request, Response } from "express";
import { LoginDTO } from "../entities/login_entity";
import { checkCredentials } from "../services/login";

const router = express.Router();
router.use(express.json());

router.post("", async (req: Request, res: Response) => {
  const userDTO = req.body as LoginDTO;
  const response = await checkCredentials(userDTO);
  //   const error
  res.status(200).send(response);
});
export default router;
