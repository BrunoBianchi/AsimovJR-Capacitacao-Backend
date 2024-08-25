import { NextFunction, Request, Response } from "express";
import { JWTService } from "../../services/jwt.service";
const jwt = new JWTService();
import { TodoListService } from "../../services/todolist.service";
const todo = new TodoListService()
import { User } from "../../entities/user.type";
export const isOwnerMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authorization = req.headers.authorization!.split("Bearer")[1] as string;
        const user: User = await jwt.decryptJWTToken(authorization) as User;
        const todoListId = req.params.id;
        if (!todoListId) return res.sendStatus(401);
        const todoList = await todo.getListById(todoListId);
        if (todoList?.userId != user.id) return res.sendStatus(401);
        return next();
    } catch {
        return res.sendStatus(401)
    }

}