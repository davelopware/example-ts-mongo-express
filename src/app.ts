import dotenv from 'dotenv';
import Express from 'express';
import mongoose from 'mongoose';
import { json } from 'body-parser';
import { RouteManager } from './routes/routeManager';

/**
 * Express server application class.
 * @description Will later contain the routing system.
 */
class App {
    public exp = Express();
    public routeManager;

    constructor() {
        console.log(`================================================================================`);
        console.log(`               ---=== davelopware/example-ts-mongo-express ===---               `);
        console.log(`================================================================================`);
        console.log(`loading configuration from environment file...`);
        dotenv.config({path: '.env'});
        this.exp.use(json());
        this.routeManager = new RouteManager(this.exp);
    }

    public mongooseConnect() {
        const connectstr = process.env.MONGODB || 'mongodb://localhost:27017/envmissing';
        console.log(`connecting to mongo database: [${connectstr}]...`);
        mongoose.connect(connectstr, {
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true
        }, () => {
            console.log(`> connected to database: [${connectstr}]`);
        });
    }

    public serverListen() {
        const port = process.env.APP_PORT || 5000;
        console.log(`opening socket on port: [${port}]...`);
        this.exp.listen(port, () => {
            console.log(`> Listening on port: [${port}]`);
        });
    }
}

const app = new App();
app.mongooseConnect();
app.serverListen();



