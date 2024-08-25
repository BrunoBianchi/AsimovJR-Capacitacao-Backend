import express from "express"
import { authentificatorMiddleware } from "../middlewares/authentificator.middleware";
import { authRouter } from "../routers/auth.router";
import { libsRouter } from "../routers/libs.router";

export const apiController: express.Router = express.Router();


apiController.use('/auth', authRouter);
apiController.use('/libs', authentificatorMiddleware);
apiController.use('/libs', libsRouter);




