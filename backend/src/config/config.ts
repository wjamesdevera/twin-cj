import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

interface AppConfig {
  port: number;
  environment: string;
  appOrigin: string;
  serviceName: string;
  databaseUrl: string;
  jwtSecret: string;
  jwtRefreshSecret: string;
  resendApiKey: string;
  emailSender: string;
  logLevel: string;
}

const config: AppConfig = {
  port: parseInt(process.env.PORT || "8080", 10),
  environment: process.env.NODE_ENV || "development",
  appOrigin: process.env.APP_ORIGIN || "http://localhost:3000",
  serviceName: process.env.SERVICE_NAME || "My Express Service",
  databaseUrl: process.env.DATABASE_URL || "mongodb://localhost:27017/mydb",
  jwtSecret: process.env.JWT_SECRET || "default_secret",
  jwtRefreshSecret: process.env.JWT_SECRET || "default_secret",
  resendApiKey: process.env.RESEND_KEY || "",
  emailSender: process.env.EMAIL_SENDER || "onboarding@resend.dev",
  logLevel: process.env.LOG_LEVEL || "info",
};

export default config;
