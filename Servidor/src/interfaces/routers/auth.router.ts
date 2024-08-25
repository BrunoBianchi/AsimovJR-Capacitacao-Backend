import express, { Request, Response } from "express"
import { z } from "zod"
export const authRouter: express.Router = express.Router();
import { UserService } from "../../services/user.service";
import { JWTService } from "../../services/jwt.service";
import { User } from "../../entities/user.type";

const jwt = new JWTService();
const crude = new UserService();
authRouter.post('/sign-up', async (req: Request, res: Response) => {
    try {
        const params = z.object({
            name: z.string(),
            password: z.string(),
            email: z.string(),
        }).required({ name: true, password: true, email: true }).parse(req.body)
        const response = await crude.createUser(params) as User;
        const token = await jwt.generateJwtToken(response)
        res.cookie('accessToken', token);
        return res.json(token)

    } catch {
        return res.sendStatus(401);
    }
})

authRouter.post('/login', async (req: Request, res: Response) => {
    try {
        const params = z.object({
            email: z.string(),
            password: z.string()
        }).required({ email: true, password: true }).parse(req.body);
        const user = await crude.getUserByEmailAndPassword(params)
        res.cookie('accessToken', await jwt.generateJwtToken(user));
        return res.send("Logged in!")
    } catch {
        return res.status(401).send("Email or password Incorrect!")
    }
})


