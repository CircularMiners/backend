import express from "express";
import PingController from "../services/ping";
import registration_controller from "./registration_controller";
import mine_controller from "./mine_controller";


const router = express.Router();
router.use(express.json());

router.get("/ping", async (_req, res) => {
  const controller = new PingController();
  const response = await controller.getMessage();
  return res.send(response);
});


router.use("/registration", registration_controller)


router.use("/mine", mine_controller)


export default router;