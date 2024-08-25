import { NextFunction, Request, Response } from "express";
import { JWTService } from "../../services/jwt.service";
const jwt = new JWTService();
export const authentificatorMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const authorization = req.headers.authorization!.split("Bearer")[1] as string;
    if (!authorization) return res.sendStatus(401);
    const user = await jwt.decryptJWTToken(authorization);
    if (!user) return res.sendStatus(401);
    return next();
}