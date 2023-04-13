import mongoose from 'mongoose'
import { APILogger } from '../logger/index.js'

export const connect = async (service) => {

    try {
        const mongoHost = process.env.MONGO_DB_HOST;
        const mongoPort = process.env.MONGO_DB_PORT;
        const url = `mongodb://${mongoHost}:${mongoPort}`
        APILogger.info("Mongo URL ::: " + url);

        mongoose.set('strictQuery', false);
        await mongoose.connect(url, {
            dbName: process.env.MONGO_INITDB_DATABASE,
            user: process.env.MONGO_INITDB_ROOT_USERNAME,
            pass: process.env.MONGO_INITDB_ROOT_PASSWORD,
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })

        mongoose.connection.once("open", async () => {
            APILogger.info(`Connected to database ${service}`);
        });

        mongoose.connection.on("error", (err) => {
            APILogger.error("Error connecting to database  ", err);
        });
    } catch (error) {
        APILogger.error("Error :" + error.message);
    }
}

const disconnect = () => {

    if (!mongoose.connection) {
        return;
    }

    mongoose.disconnect();

    mongoose.once("close", async () => {
        APILogger.error("Diconnected from database")
    });

};

export const DB = {
    connect,
    disconnect
}