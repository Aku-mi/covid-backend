export default {
  PORT: process.env.PORT || 13550,
  JWT: {
    ACCESS: process.env.ACCESSS || "acc",
    REFRESH: process.env.REFRESH || "ref",
  },
  DB: {
    USER: process.env.PSQL_USER || "user",
    HOST: process.env.PSQL_HOST || "host",
    DATABASE: process.env.PSQL_DATABASE || "db",
    PASSWORD: process.env.PSQL_PASSWORD || "psw",
    PORT: parseInt(process.env.PSQL_PORT || "5432") || 5432,
  },
  CORS: {
    ORIGIN: ["*", "http://localhost:3000"],
  },
};
