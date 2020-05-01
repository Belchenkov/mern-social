const config = {
  env: process.env.NODE_ENV || 'development',
  port: 3002,
  jwtSecret: process.env.JWT_SECRET || "secret_key",
  mongoUri: process.env.MONGODB_URI ||
    process.env.MONGO_HOST ||
      'mongodb://belchenkov:12qwasZX@ds125526.mlab.com:25526/mern-social'
};

export default config;
