import { Request, Response } from "express";
import { authService } from "./auth.service";

const loginWithEmail = async (req: Request, res: Response) => {
   try {
      const result = await authService.loginWithEmail(req.body);

      if (!result) {
         return res.status(401).json({
            success: false,
            message: "Invalid user",
         });
      }
      if (result.password !== req.body.password) {
         return res.status(401).json({
            success: false,
            message: "Invalid email or password",
         });
      }
      res.status(200).json({
         success: true,
         message: "Login successfully",
         data: result,
      });
   } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({
         success: false,
         message: "Internal server error",
      });
   }
};

const googleLogin = async (req: Request, res: Response) => {
   try {
      const result = await authService.googleLogin(req.body);     
      res.status(200).json({
         success: true,
         message: "Login successfully",
         data: result,
      });
   } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({
         success: false,
         message: "Internal server error",
      });
   }
};

export const authController = {
   loginWithEmail,
   googleLogin,
};
