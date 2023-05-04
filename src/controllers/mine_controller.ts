import express, { Request, Response } from "express";
import { Guid } from "guid-typescript";
import { MineDTO } from '../entities/mine_entity';
import {insertToDB, getMine } from "../services/mine";

const router = express.Router();
router.use(express.json());


router.put("/addmine", async (req: Request, res: Response) => {
  const minedto = req.body as MineDTO;
  const userDAO = insertToDB( minedto );
  const response = await userDAO;
  res.status(201).send(response);
});

//router.get("/mine/:mineID?/:mineName?/:mineLocation?:mineDescription?:mineRepresentativeID?", async (req: Request, res: Response) => {
router.get("/searchmine", async (req: Request, res: Response) => {
  const ID =  req.query.mineID ? req.query.mineID : "";
  const guid = (ID && typeof ID.toString() === "string") ? Guid.parse(ID.toString()) : null;
  const name =  req.query.mineName ? req.query.mineName : "";
  const location =  req.query.mineLocation ? req.query.mineLocation : "";
  const description =  req.query.mineDescription ? req.query.mineDescription : "";
  const representativeID =  req.query.mineRepresentativeID ? req.query.mineRepresentativeID : "";
  const gRepresentativeID = (representativeID && typeof representativeID.toString() === "string") ? Guid.parse(representativeID.toString()) : null;

  /*const ID =  req.params.mine ? req.params.mine : "";
  const guid = (ID !== "") ? Guid.parse(ID) : null;
  const name =  req.params.mineName ? req.params.mineName : "";
  const location =  req.params.mineLocation ? req.params.mineLocation : "";
  const description =  req.params.mineDescription ? req.params.mineDescription : "";
  const representativeID =  req.params.mineRepresentativeID ? req.params.mineRepresentativeID : "";
  const gRepresentativeID  = (representativeID !== "") ? Guid.parse(representativeID) : null;*/
  
  const mineDAO = getMine(guid, name.toString(), location.toString(), description.toString(), gRepresentativeID);

  const response = await mineDAO;


	console.log("mineDAO : " + mineDAO.toString());
	console.log("response : " + response);

  res.status(200).send(response);
});

export default router;