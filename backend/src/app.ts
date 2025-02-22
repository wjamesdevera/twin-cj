import express, { Request, Response } from "express";
import { errorMiddleware } from "./middlewares/error-middleware";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import router from "./routes/routes";
import { NOT_FOUND } from "./constants/http";
import cookieParser from "cookie-parser";
import path from "path";
const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(morgan("dev"));
app.use(helmet());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

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
