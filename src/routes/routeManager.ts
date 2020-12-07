import Express, { Router } from 'express';
import NamedRouter from 'named-routes';
import { RoutesBook } from './routesBook';


export class RouteManager {
    protected router: Router;
    protected nameRouter: NamedRouter;
    public books: RoutesBook;

    constructor(express: Express.Express) {
        this.router = Express.Router();
        this.nameRouter = new NamedRouter();
        this.nameRouter.extendExpress(express);
        this.nameRouter.registerAppHelpers(express);

        this.books = new RoutesBook(this.router);
        this.books.initialiseRoutes();

        express.use(this.router);
    }
}

