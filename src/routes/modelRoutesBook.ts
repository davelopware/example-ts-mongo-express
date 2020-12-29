import Express, { Router } from 'express';
import { ModelRoutesBase } from "./modelRoutesBase";
import BookModel, { IBookModel } from "../models/bookModel";
import { HateoasBookHandler } from '../rest/hateoasBookHandler'
import { FilterQuery } from "mongodb";
import { QueryFindOneAndUpdateOptions } from "mongoose";
import NamedRouter from "named-routes";

export class ModelRoutesBook extends ModelRoutesBase<IBookModel> {

    constructor(router: Router, express: Express.Express, namedRouter: NamedRouter) {
        super({
            express: express,
            router: router,
            namedRouter: namedRouter,
            hateoas: new HateoasBookHandler(),
            routeBase: "/api/books",
            idDbFieldName: "isbn",
        });
    }

    public initialiseRoutes() {
        this.express.get('/api/books', this.routeNameGetMany, async (req, res) => {
            // TODO pagination handling
            const books = await this.find({});
            return this.sendResponseForModelCollection(res, books);
        });
        
        this.express.get('/api/books/:isbn', this.routeNameGetOne, async (req, res) => {
            return this.getOneHelper(req.params, res);
        });

        this.express.post('/api/books', this.routeNamePost, async (req, res) => {
            return this.postHelper(req.body, res);
        });
 
        this.express.put('/api/books/:isbn', this.routeNamePut, async (req, res) => {
            const isbn:string = req.params.isbn;
            return this.putHelper<string>(req.body, res, isbn, "isbn");
        });
 
        this.express.patch('/api/books/:isbn', this.routeNamePatch, async (req, res) => {
            const isbn:string = req.params.isbn;
            return this.patchHelper<string>(req.body, res, isbn, "isbn");
        });
    }

    public routeUriGetOneByISBN(isbn: string) {
        this.namedRouter.build(this.routeNameGetOne, this.idAsFindableCondition(isbn));
    }

    public routeUriPutUpdateByISBN(isbn: string) {
        return this.namedRouter.build(this.routeNamePut, this.idAsFindableCondition(isbn));
    }

    public routeUriPatchUpdateByISBN(isbn: string) {
        return this.namedRouter.build(this.routeNamePatch, this.idAsFindableCondition(isbn));
    }

    protected newModel(doc?: any) {
        return new BookModel(doc);
    }

    protected async findOne(conditions: FilterQuery<IBookModel>) {
        return BookModel.findOne(conditions);
    }

    protected async find(conditions: FilterQuery<IBookModel>) {
        return BookModel.find(conditions);
    }

    protected async findOneAndUpdate(conditions: FilterQuery<IBookModel>, updateQuery: any, options?: QueryFindOneAndUpdateOptions) {
        return BookModel.findOneAndUpdate(conditions, updateQuery, options);
    }

    protected idAsFindableConditionFromModel(model: IBookModel) {
        return this.idAsFindableCondition(model.isbn);
    }
}
