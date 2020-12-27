import Express, { Router } from 'express';
import NamedRouter from 'named-routes';
import { RoutesBook } from './routesBook';


export class RouteManager {
    protected router: Router;
    protected namedRouter: NamedRouter;
    public books: RoutesBook;

    constructor(express: Express.Express) {
        this.router = Express.Router();
        this.namedRouter = new NamedRouter();
        this.namedRouter.extendExpress(express);
        this.namedRouter.registerAppHelpers(express);

        this.books = new RoutesBook(this.router, express, this.namedRouter);
        this.books.initialiseRoutes();

        express.use(this.router);
    }
}

