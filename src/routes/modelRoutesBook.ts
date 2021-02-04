import Express, { Router } from 'express';
import { ModelRoutesBase } from "./modelRoutesBase";
import BookModel, { IBookModel } from "../models/bookModel";
import { HateoasBookHandler } from '../rest/hateoasBookHandler'
import { FilterQuery } from "mongodb";
import { Query,  QueryOptions, UpdateQuery } from "mongoose";
import NamedRouter from "named-routes";

export class ModelRoutesBook extends ModelRoutesBase<IBookModel> {

    constructor(router: Router, express: Express.Express, namedRouter: NamedRouter) {
        super({
            express,
            router,
            namedRouter,
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

    protected findOne(filter: FilterQuery<IBookModel>) : Query<IBookModel | null, IBookModel> {
        return BookModel.findOne(filter);
    }

    protected find(filter: FilterQuery<IBookModel>) : Query<Array<IBookModel>, IBookModel> {
        return BookModel.find(filter);
    }

    protected findOneAndUpdate(filter: FilterQuery<IBookModel>, updateQuery: UpdateQuery<IBookModel>, options?: QueryOptions) : Query<IBookModel | null, IBookModel> {
        if (options) {
            return BookModel.findOneAndUpdate(filter, updateQuery, options);
        } else {
            return BookModel.findOneAndUpdate(filter, updateQuery);
        }
    }

    protected idAsFindableConditionFromModel(model: IBookModel) {
        return this.idAsFindableCondition(model.isbn);
    }
}
