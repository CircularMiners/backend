import express, { Request, Response } from "express";
import { MineralDTO } from "../entities/mineral_entity";
import { insertToDB, getMineral } from "../services/mineral";

const router = express.Router();
router.use(express.json());

router.post("/addmineral/", async (req: Request, res: Response) => {
  const mineraldto = req.body as MineralDTO;
  const mineralDAO = insertToDB(mineraldto);
  const response = await mineralDAO;
  res.status(201).send(response);
});

router.get("/searchmineral", async (req: Request, res: Response) => {
  const chemicalFormula = req.query.mineralChemicalFormula
    ? req.query.mineralChemicalFormula
    : "";
  const chemicalName = req.query.mineralChemicalName
    ? req.query.mineralChemicalName
    : "";
  const normalName = req.query.mineralName ? req.query.mineralName : "";

  const mineralDAO = getMineral(
    chemicalFormula.toString(),
    chemicalName.toString(),
    normalName.toString()
  );
  const response = await mineralDAO;

  console.log(mineralDAO);

  res.status(200).send(response);
});

export default router;
