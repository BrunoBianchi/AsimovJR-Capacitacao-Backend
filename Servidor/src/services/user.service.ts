import { User } from "../entities/user.type";
import { PrismaClient } from '@prisma/client'
import bcrypt from "bcrypt"
const prisma = new PrismaClient()
export class UserService {
    public async findUserByEmail(email: string) {
        return await prisma.user.findFirst({
            where: {
                email: email
            }
        })
    }

    public async createUser(user: User) {

        if (await this.findUserByEmail(user.email)) throw 'Email already in use! '
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(user.password, salt);
        user.password = hash;
        const response = await prisma.user.create({ data: user });
        return response;


    }

    public async getUserByEmailAndPassword(credentials: { email: string, password: string }) {

        const user: User = await this.findUserByEmail(credentials.email) as User;
        if (!await bcrypt.compare(credentials.password, user.password)) throw "Email or Password Incorrect!"
        return user;

    }

}

