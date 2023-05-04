import express, { Request, Response } from "express";
import { SideStreamDTO } from "../entities/sidestream_entity";
import { insertToDB } from "../services/sidestream";

const router = express.Router();
router.use(express.json());

router.post("/miningdata", async (req: Request, res: Response) => {
  const userdto = req.body as SideStreamDTO;
  const userRepresentativeDAO = insertToDB(userdto);
  const response = await userRepresentativeDAO;
  res.status(201).send(response);
});

export default router;
