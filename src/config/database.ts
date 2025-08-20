
import { Sequelize } from "sequelize";
import env from "./env";

const sequelize = new Sequelize(env.DATABASE_URL || '', {
    dialect: 'postgres',
    logging: env.NODE_ENV === 'development' ? console.log : false,
    dialectOptions:{
        ssl: env.NODE_ENV === 'production' ? { require: true, rejectUnauthorized: false } : false
    },
    pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
}); 

export default sequelize;

