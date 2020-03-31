import { ConfigService } from "./config.service";

export default () => ({
    SERVER_PORT: ConfigService.getKey("SERVER_PORT") ? parseInt(ConfigService.getKey("SERVER_PORT")) : null,
    CORS_ORIGIN: ConfigService.getKey("CORS_ORIGIN") || "*",
    CORS_METHODS: ConfigService.getKey("CORS_METHODS") || "GET,HEAD,PUT,PATCH,POST,DELETE"
});