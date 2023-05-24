import express, { Request, Response } from "express";
import { Guid } from "guid-typescript";
import { MineRepresentativeDTO } from "../entities/mine_rep_entity";
import {
  insertToDB,
  getMineRepresentative,
} from "../services/mine_representative";
import { DataRequestorDTO } from "../entities/datarequestor_entity";
import {
  insertToDB_DataReq,
  getDataRequestor,
} from "../services/data_requestor";
import { encryptPassword } from "../utils/constants";

const router = express.Router();
router.use(express.json());

router.post("/minerepresentative", async (req: Request, res: Response) => {
  const userdto = req.body as MineRepresentativeDTO;
  const encryptedPassword = await encryptPassword(
    userdto.mineRepresentativePassword
  );
  const userRepresentativeDAO = insertToDB(userdto, encryptedPassword);
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

router.post("/datarequestor", async (req: Request, res: Response) => {
  const userdto = req.body as DataRequestorDTO;
  const encryptedPassword = await encryptPassword(
    userdto.dataRequestorPassword
  );
  const userRequestorDAO = insertToDB_DataReq(userdto, encryptedPassword);
  const response = await userRequestorDAO;
  res.status(201).send(response);
});

router.get("/datarequestor/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  const guid = Guid.parse(id);
  const userRequestorDAO = getDataRequestor(guid);
  const response = await userRequestorDAO;
  res.status(200).send(response);
});
export default router;
