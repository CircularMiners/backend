import express, { Request, Response } from "express";
import { Guid } from "guid-typescript";
import { MineDTO } from "../entities/mine_entity";
import { insertToDB, getMine } from "../services/mine";

const router = express.Router();
router.use(express.json());

router.post("/addmine", async (req: Request, res: Response) => {
  const minedto = req.body as MineDTO;
  const userDAO = insertToDB(minedto);
  const response = await userDAO;
  res.status(201).send(response);
});

//router.get("/mine/:mineID?/:mineName?/:mineLocation?:mineDescription?:mineRepresentativeID?", async (req: Request, res: Response) => {
router.get("/searchmine/:mineRepId", async (req: Request, res: Response) => {
  const representativeID = Guid.parse(req.params.mineRepId);
  const mineDAO = getMine(representativeID);

  const response = await mineDAO;

  res.status(200).send(response);
});

export default router;
