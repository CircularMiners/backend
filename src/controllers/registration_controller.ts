import express, { Request, Response } from "express";
import { Guid } from "guid-typescript";
import { MineRepresentativeDTO } from "../entities/mine_rep_entity";
import {
  insertToDB,
  getMineRepresentative,
} from "../services/mine_representative";

const router = express.Router();
router.use(express.json());

router.post("/minerepresentative", async (req: Request, res: Response) => {
  const userdto = req.body as MineRepresentativeDTO;
  const userRepresentativeDAO = insertToDB(userdto);
  const response = await userRepresentativeDAO;
  res.status(201).send(response);
});

router.get("/minerepresentative/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  const guid = Guid.parse(id);
  const userRepresentativeDAO = getMineRepresentative(guid);
  const response = await userRepresentativeDAO;
  res.status(200).send(response);
});

export default router;
