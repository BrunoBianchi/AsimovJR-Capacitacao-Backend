import express, { Request, Response } from "express"
import { z } from "zod"
import { JWTService } from "../../services/jwt.service";
import { TodoListService } from "../../services/todolist.service";
import { User } from "../../entities/user.type";
import { isOwnerMiddleware } from "../middlewares/isOwner.middleware";
import { canUserModifyMiddleware } from "../middlewares/canUserModify.middleware";
const todo = new TodoListService();
const jwt = new JWTService();
export const libsRouter: express.Router = express.Router();


libsRouter.post('/create-todo', async (req: Request, res: Response) => {
    try {
        const params = z.object({
            name: z.string(),
        }).parse(req.body);
        const authorization = req.headers.authorization!.split("Bearer")[1] as string;
        const user: User = await jwt.decryptJWTToken(authorization) as User;
        const newTodoList = await todo.createList(params.name, user.id || "")
        return res.send(newTodoList)
    } catch {

        return res.sendStatus(400);
    }

})

libsRouter.get('/getAllLists', async (req: Request, res: Response) => {
    try {
        const authorization = req.headers.authorization!.split("Bearer")[1] as string;
        const user: User = await jwt.decryptJWTToken(authorization) as User;
        const allTodosList = await todo.getAllLists(user.id || "");
        return res.json(allTodosList)
    } catch (err) {
        console.log(err)
        return res.sendStatus(400);
    }
})

libsRouter.get('/getList/:id', isOwnerMiddleware, async (req: Request, res: Response) => {
    try {
        const params = z.object({
            id: z.string()
        }).parse(req.params);
        const todoList = await todo.getListById(params.id);
        const componentsFromList = await todo.getListComponents(todoList!.id)
        return res.json({ ...todoList, components: componentsFromList })
    } catch {
        return res.sendStatus(400);
    }
})

libsRouter.post('/list/:id/create-component', isOwnerMiddleware, async (req: Request, res: Response) => {
    try {
        const paramsHeader = z.object({
            id: z.string(),
        }).parse(req.params);
        const paramsBody = z.object({
            name: z.string(),
            description: z.string()
        }).parse(req.body)
        const newComponentList = await todo.createComponent(paramsHeader.id, paramsBody.name, paramsBody.description)
        return res.json(newComponentList)
    } catch {
        return res.sendStatus(400);
    }
})

libsRouter.patch('/list/component/:id/update', canUserModifyMiddleware, async (req: Request, res: Response) => {
    try {
        const paramsHeader = z.object({
            id: z.string(),
        }).parse(req.params);
        const paramsBody = z.object({
            name: z.string().optional(),
            description: z.string().optional(),
            done: z.boolean().optional()
        }).parse(req.body)
        const updatedComponent = await todo.updateComponent(paramsHeader.id, paramsBody.name, paramsBody.description, paramsBody.done)
        res.json(updatedComponent)
    } catch {
        return res.sendStatus(400);
    }

})

libsRouter.delete('/list/component/:id/delete', canUserModifyMiddleware, async (req: Request, res: Response) => {
    try {
        const params = z.object({
            id: z.string(),
        }).parse(req.params);
        await todo.deleteComponent(params.id)
        res.json('deletado')
    } catch {
        return res.sendStatus(400);
    }

})