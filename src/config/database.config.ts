import { ConfigService } from "./config.service";

export default () => ({
    DATABASE_HOST: ConfigService.getKey("DATABASE_HOST") || null,
    DATABASE_PORT: ConfigService.getKey("DATABASE_PORT") ? parseInt(ConfigService.getKey("DATABASE_PORT")) : null,
    DATABASE_USERNAME: ConfigService.getKey("DATABASE_USERNAME") || null,
    DATABASE_PASSWORD: ConfigService.getKey("DATABASE_PASSWORD") || null,
});
  
  