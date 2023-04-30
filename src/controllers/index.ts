import express, { Request, Response } from "express";
import { MineRepresentativeDTO} from '../entities/user_entity';
import PingController from "../services/ping";
import {insertToDB} from "../services/mine_representative";


const router = express.Router();
router.use(express.json());

router.get("/ping", async (_req, res) => {
  const controller = new PingController();
  const response = await controller.getMessage();
  return res.send(response);
});

router.post("/registration/representative", async (req: Request, res: Response) => {
  const userdto = req.body as MineRepresentativeDTO;
  const userRepresentativeDAO = insertToDB( userdto);
  const response = await userRepresentativeDAO;
  res.status(201).send(response);
});



export default router;