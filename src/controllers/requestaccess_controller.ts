import express, { Request, Response } from "express";
import { RequestAccessDTO } from "../entities/requestaccess_entity";
import {
  getAllAccessRequest,
  getOneAccessRequest,
  insertToDB,
} from "../services/requestaccess";

const router = express.Router();
router.use(express.json());

router.post(
  "/:dataRequestorId/:sideStreamId",
  async (req: Request, res: Response) => {
    const dataRequestorId = req.params.dataRequestorId;
    const sideStreamId = req.params.sideStreamId;
    const message = req.body as RequestAccessDTO;
    const requestaccess = insertToDB(dataRequestorId, sideStreamId, message);
    const response = await requestaccess;
    res.status(201).send(response);
  }
);

//ALL view as data representative which request is coming to them
router.get("/:mineRepId", async (req: Request, res: Response) => {
  const mineRepId = req.params.mineRepId;
  const requestaccess = getAllAccessRequest(mineRepId);
  const response = await requestaccess;
  res.status(200).send(response);
});

//single view as data representative which request is coming to them
router.get(
  "/:mineRepId/:dataRequestorId",
  async (req: Request, res: Response) => {
    const mineRepId = req.params.mineRepId;
    const dataRequestorId = req.params.dataRequestorId;
    const requestaccess = getOneAccessRequest(mineRepId, dataRequestorId);
    const response = await requestaccess;
    res.status(200).send(response);
  }
);

export default router;
