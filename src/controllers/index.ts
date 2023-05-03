import express from "express";
import PingController from "../services/ping";
import registration_controller from "./registration_controller";
import mineral_controller from "./mineral_controller";


const router = express.Router();
router.use(express.json());

router.get("/ping", async (_req, res) => {
  const controller = new PingController();
  const response = await controller.getMessage();
  return res.send(response);
});


router.use("/registration", registration_controller)


router.use("/mineral", mineral_controller)


export default router;