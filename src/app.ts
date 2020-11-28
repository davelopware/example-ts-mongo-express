import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import { json } from 'body-parser';
import { bookRouter } from './routes/bookRoutes';

/**
 * Express server application class.
 * @description Will later contain the routing system.
 */
class App {
    public exp = express();

    constructor() {
        dotenv.config({path: '.env'});
        this.exp.use(json());
        this.exp.use(bookRouter);
    }

    public serverListen() {
        const port = process.env.APP_PORT || 5000;

        // make server listen on some port
        this.exp.listen(port, () => {
            console.log(`> Listening on port ${port}`);
        });
    }

    public mongooseConnect() {
        const connectstr = process.env.MONGODB || 'mongodb://localhost:27017/envmissing';
        mongoose.connect(connectstr, {
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true
        }, () => {
            console.log('> connected to database');
        });
    }
}

const app = new App();
app.mongooseConnect();
app.serverListen();



