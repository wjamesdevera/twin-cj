import app from "./app";
import config from "./config/config";

app.listen(config.port, () => {
  console.info(`
  ==========================================================
    🚀 Service Name: ${config.serviceName}
    🌐 Environment: ${config.environment} 
    🌎 URL: http://localhost:${config.port} 
    📅 Started at: ${new Date().toLocaleString()} 
    ✅ Status: Running
==========================================================
    `);
});
