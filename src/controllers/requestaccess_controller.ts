import express, { Request, Response } from "express";
import {
  RequestAccessDTO,
  RequestAccesswithStatusDTO,
} from "../entities/requestaccess_entity";
import {
  getAllAccessRequest,
  getAllAccessRequestForDataRequestor,
  getOneAccessRequest,
  insertToDB,
  updateAccessRequest,
} from "../services/requestaccess";
import { Guid } from "guid-typescript";

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
router.get("/miner/:mineRepId", async (req: Request, res: Response) => {
  const mineRepId = Guid.parse(req.params.mineRepId);
  const requestaccess = getAllAccessRequest(mineRepId);
  const response = await requestaccess;
  res.status(200).send(response);
});

// Get all view as the data requestor which request they have made
router.get(
  "/requestor/:dataRequestorId",
  async (req: Request, res: Response) => {
    const dataRequestorId = Guid.parse(req.params.dataRequestorId);
    if (dataRequestorId == null) {
      res.status(400).send("Invalid id");
      console.log(dataRequestorId);
    }
    const requestaccess = getAllAccessRequestForDataRequestor(dataRequestorId);
    const response = await requestaccess;
    res.status(200).send(response);
  }
);

//single view as data representative which request is coming to them
router.get(
  "/:mineRepId/:dataRequestorId",
  async (req: Request, res: Response) => {
    const mineRepId = Guid.parse(req.params.mineRepId);
    const dataRequestorId = req.params.dataRequestorId;
    const requestaccess = getOneAccessRequest(mineRepId, dataRequestorId);
    const response = await requestaccess;
    res.status(200).send(response);
  }
);

//Update the status of the request access to either approved or rejected
router.put("/:mineRepId", async (req: Request, res: Response) => {
  const mineRepId = req.params.mineRepId;
  const accessStatus = req.body as RequestAccesswithStatusDTO;
  updateAccessRequest(mineRepId, accessStatus);
  res.status(204).send("Status Updated");
});

export default router;
