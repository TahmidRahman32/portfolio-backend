
import { Prisma, User,} from "@prisma/client";
import { prisma } from "../../config/db";
import bcrypt from "bcrypt";


const createUser = async (payload: Prisma.UserCreateInput): Promise<User> => {
   try {
      // Hash password before creating user
      if (payload.password) {
         const saltRounds = 12;
         payload.password = await bcrypt.hash(payload.password, saltRounds);
      }

      const createdUser = await prisma.user.create({
         data: payload,
      });

      return createdUser;
   } catch (error: any) {
      throw new Error(`Failed to create user: ${error.message}`);
   }
};
const getAllUsers = async () => {
   const result = await prisma.user.findMany({
      select: {
         id: true,
         first_name: true,
         email: true,
         phone: true,
         picture: true,
         createdAt: true,
         updatedAt: true,
         role: true,
         status: true,

      },
      orderBy: {
         createdAt: "desc",
      },
   });
   return result;
};

const getSingleUser = async (id: string) => {
   const result = await prisma.user.findUnique({
      where: {
         id,
      },
      select: {
         id: true,
         first_name: true,
         email: true,
         role: true,
         phone: true,
         picture: true,
         createdAt: true,
         updatedAt: true,
         status: true,
      },
   });
   return result;
};
const updateUser = async (id: string, payload: Partial<User>) => {
   const result = await prisma.user.update({
      where: {
         id,
      },
      data: payload,
   });
   return result;
};

const deleteUser = async (id: string) => {
   const result = await prisma.user.delete({
      where: {
         id,
      },
   });
   return result;
};

export const UserService = {
   createUser,
   getAllUsers,
   getSingleUser,
   updateUser,
   deleteUser,
};