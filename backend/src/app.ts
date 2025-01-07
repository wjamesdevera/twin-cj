import express, { Request, Response } from "express";
import { errorMiddleware } from "./middlewares/error-middleware";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import router from "./routes/routes";
import { NOT_FOUND, OK } from "./constants/http";
import sequelize from "./config/db";
import PersonalDetail from "./models/personal_detail.model";
import UserAccount from "./models/user_account.model";

const app = express();

// database
(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });
    console.log(`Connection has been established successfully.`);
  } catch (error) {
    console.error(`Unable to connect to the database:`, error);
  }
})();

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
