import { Router } from "express";
import { User } from "../models/userModel";
import bcrypt from "bcrypt";
import  jwt  from "jsonwebtoken"
import { signInSchema, signupSchema } from "../schemas/schema";

export const userRouter = Router();

userRouter.get("/", (req, res) => {
    return res.json({
      message: "healthy server",
    });
  });

userRouter.post("/signup", async (req, res) => {
  const parsedBody = signupSchema.safeParse(req.body);

  if (!parsedBody.success) {
    return res.status(411).json({
      message: "Invalid Inputs",
      error: parsedBody.error,
    });
  }

  try {
    const { username, email, password } = parsedBody.data;

    const isUserExist = await User.findOne({ $or: [{ username }, { email }] });

    if (isUserExist) {
      return res.status(409).json({
        message: "User Already Exists",
      });
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    await User.create({
      username,
      email,
      password: encryptedPassword,
    });

    return res.status(201).json({
      message: "User Successfully Created",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error!",
      error: error,
    });
  }
});

userRouter.post("/signin", async (req, res) => {
  const parsedBody = signInSchema.safeParse(req.body);

  if (!parsedBody.success) {
    return res.status(411).json({
      message: "Invalid Inputs",
      error: parsedBody.error,
    });
  }

  try {
    const { email, password } = parsedBody.data;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User Doesn't Exist",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Incorrect Password",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string);

    return res.status(200).json({
      message: "User Successfully Signed In",
      token,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});
