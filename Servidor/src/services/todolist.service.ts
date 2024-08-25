import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()

export class TodoListService {
    public async createList(name: string, userId: string) {

        const newTodoList = await prisma.todolist.create({
            data: {
                name, userId
            }
        })
        return newTodoList;


    }
    public async getAllLists(userId: string) {

        const allTodoLists = await prisma.todolist.findMany({
            where: {
                userId
            }
        })

        return allTodoLists;

    }
    public async getListById(id: string) {

        const todoList = await prisma.todolist.findFirst({
            where: {
                id
            }
        })
        return todoList;

    }
    public async createComponent(id: string, name: string, description: string) {
        const newComponent = await prisma.todocomponent.create({
            data: {
                todolistId: id,
                name, description

            }
        })
        return newComponent;
    }

    public async updateComponent(id: string, name?: string, description?: string, done?: boolean) {
        const updatedComponent = await prisma.todocomponent.update({
            where: {
                id
            },
            data: {
                name, description, done
            }
        })
        return updatedComponent;
    }

    public async getComponent(id: string) {
        const component = await prisma.todocomponent.findFirst({
            where: {
                id
            }
        })
        return component;
    }

    public async getListComponents(todolistId: string) {
        const component = await prisma.todocomponent.findMany({
            where: {
                todolistId
            }
        })
        return component;
    }

    public async deleteComponent(id: string) {
        try {
            await prisma.todocomponent.delete({
                where: {
                    id
                }
            })
            return 200
        } catch {
            return 401
        }


    }
}