export default () => ({
    DATABASE_HOST: process.env.DATABASE_HOST || null,
    DATABASE_PORT: process.env.DATABASE_PORT ? parseInt(process.env.DATABASE_PORT) : null,
    DATABASE_USERNAME: process.env.DATABASE_USERNAME || null,
    DATABASE_PASSWORD: process.env.DATABASE_PASSWORD || null,
});
  
  