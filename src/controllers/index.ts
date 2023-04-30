import express from "express";
import {MineRepresentativeDTO} from '../entities/user_entity';
import PingController from "../services/ping";
import {insertToDB} from "../services/mine_representative";

const router = express.Router();

router.get("/ping", async (_req, res) => {
  const controller = new PingController();
  const response = await controller.getMessage();
  return res.send(response);
});

router.post("/registration/representative", async (req, res) => {
  const userDTO = req.body as MineRepresentativeDTO;
  const userRepresentativeDAO = insertToDB(userDTO);
  const response = await userRepresentativeDAO;
  return res.send(response).status(201);
});



export default router;