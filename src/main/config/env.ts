export default {
  mongoUrl: process.env.MONGO_URL || 'mongodb://localhost:27017/clean-node-api',
  jwtSecret: process.env.JWT_SECRET || 'asdAS==123x',
  port: process.env.PORT || 5050
}
