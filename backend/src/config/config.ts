import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

interface AppConfig {
  port: number;
  environment: string;
  serviceName: string;
  databaseUrl: string;
  jwtSecret: string;
  jwtRefreshSecret: string;
  logLevel: string;
}

const config: AppConfig = {
  port: parseInt(process.env.PORT || "3000", 10),
  environment: process.env.NODE_ENV || "development",
  serviceName: process.env.SERVICE_NAME || "My Express Service",
  databaseUrl: process.env.DATABASE_URL || "mongodb://localhost:27017/mydb",
  jwtSecret: process.env.JWT_SECRET || "default_secret",
  jwtRefreshSecret: process.env.JWT_SECRET || "default_secret",
  logLevel: process.env.LOG_LEVEL || "info",
};

export default config;
