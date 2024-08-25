import { NextFunction, Request, Response } from "express";
import { JWTService } from "../../services/jwt.service";
const jwt = new JWTService();
import { TodoListService } from "../../services/todolist.service";
const todo = new TodoListService()
import { User } from "../../entities/user.type";
export const canUserModifyMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authorization = req.headers.authorization!.split("Bearer")[1] as string;
        const user: User = await jwt.decryptJWTToken(authorization) as User;
        const componentId = req.params.id;
        if (!componentId) return res.sendStatus(401);
        const component = await todo.getComponent(componentId);
        const todoList = await todo.getListById(component?.todolistId || "");
        if (todoList?.userId != user.id) return res.sendStatus(401);
        return next();
    } catch {
        return res.sendStatus(401)
    }

}