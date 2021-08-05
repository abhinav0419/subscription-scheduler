import { Router } from "express";
import NotificationController from "./controller/subscription.controller";

export const router: Router = Router(),
  controller = new NotificationController();

router.post("/:id", controller.addNewUserSubscription);
