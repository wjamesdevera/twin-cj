import express, { Request, Response } from "express";
import { errorMiddleware } from "./middlewares/error-middleware";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import router from "./routes/routes";
import { NOT_FOUND } from "./constants/http";
import cookieParser from "cookie-parser";
const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());
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
