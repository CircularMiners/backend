import express, { Request, Response } from "express";
import { SideStreamDTO } from "../entities/sidestream_entity";
import {
  findMineandSidestream,
  getAllMineandSidestream,
  insertToDB,
} from "../services/sidestream";

const router = express.Router();
router.use(express.json());

router.post("/:mineRepId/:mineId", async (req: Request, res: Response) => {
  const sidestream = req.body as SideStreamDTO;
  const mineRepId = req.params.mineRepId;
  const mineId = req.params.mineId;
  const sidestreamResponse = insertToDB(sidestream, mineRepId, mineId);
  const response = await sidestreamResponse;
  res.status(201).send(response);
});

router.put(
  "/:mineRepId/:mineId/:sidestreamId",
  async (req: Request, res: Response) => {
    const sidestream = req.body as SideStreamDTO;
    const mineRepId = req.params.mineRepId;
    const mineId = req.params.mineId;
    const sidestreamResponse = insertToDB(sidestream, mineRepId, mineId);
    const response = await sidestreamResponse;
    res.status(200).send(response);
  }
);

//this is for data requestor
router.get("/:oreName", async (req: Request, res: Response) => {
  const oreName = req.params.oreName;
  const sidestreams = findMineandSidestream(oreName);
  const response = await sidestreams;
  res.status(200).send(response);
});

//this is for data representative
router.get("/:mineRepId/:mineId", async (req: Request, res: Response) => {
  const mineRepId = req.params.mineRepId;
  const mineId = req.params.mineId;
  const sidestreams = getAllMineandSidestream(mineRepId, mineId);
  const response = await sidestreams;
  res.status(200).send(response);
});

export default router;
