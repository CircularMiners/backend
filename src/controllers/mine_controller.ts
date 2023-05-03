import express, { Request, Response } from "express";
import { Guid } from "guid-typescript";
import { MineDTO } from '../entities/mine_entity';
import {insertToDB, getMine } from "../services/mine";

const router = express.Router();
router.use(express.json());


router.post("/mine", async (req: Request, res: Response) => {
  const minedto = req.body as MineDTO;
  const userDAO = insertToDB( minedto );
  const response = await userDAO;
  res.status(201).send(response);
});

router.get("/mine/:mineID?/:mineName?/:mineLocation?:mineDescription?:mineRepresentativeID?", async (req: Request, res: Response) => {
  const ID =  req.params.mine ? req.params.mine : "";
  const guid = (ID !== "") ? Guid.parse(ID) : null;
  const name =  req.params.mineName ? req.params.mineName : "";
  const location =  req.params.mineLocation ? req.params.mineLocation : "";
  const description =  req.params.mineDescription ? req.params.mineDescription : "";
  const representativeID =  req.params.mineRepresentativeID ? req.params.mineRepresentativeID : "";
  const gRepresentativeID  = (representativeID !== "") ? Guid.parse(representativeID) : null;
  
  const mineDAO = getMine(guid, name, location, description, gRepresentativeID);
  const response = await mineDAO;
  res.status(200).send(response);
});

export default router;