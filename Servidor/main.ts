import express, { Request, Response } from "express"
import dotenv from 'dotenv';
import { apiController } from "./src/interfaces/controllers/api.controller";
import cookieParser from "cookie-parser"
import cors from "cors";

dotenv.config();
const app = express();

app.listen(process.env.PORT, () => {
    console.log(`Server Listening at port ${process.env.PORT}`)
})
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use('/api/v1/', apiController);




app.use('*', (req: Request, res: Response) => {
    res.status(404).send("Error, Page not found!");
})