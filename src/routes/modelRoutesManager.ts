import Express, { Router } from 'express';
import NamedRouter from 'named-routes';
import { IModelRoutesBase } from './modelRoutesBase';

export type ModelRoutesManagerNewModelRouteFn =
    (
        router: Router,
        express: Express.Express,
        namedRouter: NamedRouter
    ) => IModelRoutesBase;

export class ModelRoutesManager {
    protected express: Express.Express;
    protected router: Router;
    protected namedRouter: NamedRouter;
    // public books: RoutesBook;
    public allModelRoutes: IModelRoutesBase[];

    constructor(express: Express.Express) {
        this.express = express;
        this.router = Express.Router();
        this.namedRouter = new NamedRouter();
        this.namedRouter.extendExpress(express);
        this.namedRouter.registerAppHelpers(express);

        this.allModelRoutes = [];

        express.use(this.router);
    }

    // public addModelRoute(modelRoutes: RoutesBase<IModel>) {
    //     this.allModelRoutes.push(modelRoutes);
    // }

    /**
     * Add a new Model Router to the routeManager and calls initialiseRoutes() on it.
     * The passed function will be called with the router, express and named router
     * Simply return a model router that implements IRoutesBase (usually an instance
     * of a class derived from RoutesBase<TModel>) 
     */
    public addModelRouteByFunction(newModelRouteFn: ModelRoutesManagerNewModelRouteFn) {
        let modelRoutes = newModelRouteFn(this.router, this.express, this.namedRouter);
        modelRoutes.initialiseRoutes();
        this.allModelRoutes.push(modelRoutes);
    }
}

