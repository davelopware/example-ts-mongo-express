import dotenv from 'dotenv';
import Express from 'express';
import mongoose from 'mongoose';
import { json } from 'body-parser';
// import { bookRouter } from './routes/bookRoutes';
import { RouteManager } from './routes/routeManager';

/**
 * Express server application class.
 * @description Will later contain the routing system.
 */
class App {
    public exp = Express();
    public routeManager;

    constructor() {
        dotenv.config({path: '.env'});
        this.exp.use(json());
        this.routeManager = new RouteManager(this.exp);
        // this.exp.use(bookRouter);
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



