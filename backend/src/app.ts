import express, { Request, Response } from "express";
import { errorMiddleware } from "./middlewares/error-middleware";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import router from "./routes/routes";
import { NOT_FOUND, OK } from "./constants/http";
import { PrismaClient } from "@prisma/client";
const app = express();

// database
const prisma = new PrismaClient();
(async () => {
  const allUsers = await prisma.userAccount.findMany();
})()
  .then(async () => {
    console.log(`Database connected successfully`);
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
  });

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("dev"));
app.use(helmet());

// Routes
app.use("/api", router);

// 404 handler
app.use("*", (request: Request, response: Response) => {
  response.status(NOT_FOUND).json({
    status: "fail",
    data: {
      message: "Resource not found",
    },
  });
});

// error middleware
app.use(errorMiddleware);

export default app;
