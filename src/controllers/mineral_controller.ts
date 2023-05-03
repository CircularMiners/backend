import express, { Request, Response } from "express";
import { MineralDTO } from '../entities/mineral_entity';
import {insertToDB, getMineral } from "../services/mineral";

const router = express.Router();
router.use(express.json());


router.put("/mineral/", async (req: Request, res: Response) => {
  const mineraldto = req.body as MineralDTO;
  const mineralDAO = insertToDB( mineraldto );
  const response = await mineralDAO;
  res.status(201).send(response);
});

router.get("/mineral/:mineralChemicalFormula?/:mineralChemicalName?/:mineralName?", async (req: Request, res: Response) => {
  const chemicalFormula =  req.params.mineralChemicalFormula ? req.params.mineralChemicalFormula : "";
  const chemicalName =  req.params.mineralChemicalName ? req.params.mineralChemicalName : "";
  const normalName =  req.params.mineralName ? req.params.mineralName : "";
  
  const mineralDAO = getMineral(chemicalFormula, chemicalName, normalName);
  const response = await mineralDAO;
  res.status(200).send(response);
});

export default router;