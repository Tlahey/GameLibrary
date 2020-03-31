export default () => ({
    SERVER_PORT: process.env.SERVER_PORT ? parseInt(process.env.SERVER_PORT) : null,
    CORS_ORIGIN: process.env.CORS_ORIGIN || "*",
    CORS_METHODS: process.env.CORS_METHODS || "GET,HEAD,PUT,PATCH,POST,DELETE"
});