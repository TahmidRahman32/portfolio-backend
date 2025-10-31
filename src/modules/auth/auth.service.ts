import { Prisma } from "@prisma/client";
import { prisma } from "../../config/db";

const loginWithEmail = async ({ email, password }: { email: string; password: string }) => {
   console.log(email, password);
   try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
         throw new Error("User not found");
      }

      return user;
   } catch (error) {
      console.error("Login error:", error);
      throw error;
   }
};

const googleLogin = async (data: Prisma.UserCreateInput) => {
   // Implementation for Google login
   let user = await prisma.user.findUnique({ where: { email: data.email! } });
   if (!user) {
      user = await prisma.user.create({ data });
   }
   return user;
}

export const authService = {
   loginWithEmail,
   googleLogin,
};
