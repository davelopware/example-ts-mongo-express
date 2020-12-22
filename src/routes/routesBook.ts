import { Router } from "express";
import { RoutesBase } from "./routesBase";
import BookModel, { IBookModel } from "../models/bookModel";
import { HateoasBookHandler } from '../rest/hateoasBookHandler'
import { FilterQuery } from "mongodb";
import { QueryFindOneAndUpdateOptions } from "mongoose";

export class RoutesBook extends RoutesBase<IBookModel> {

    constructor(router: Router) {
        super({
            router: router,
            hateoas: new HateoasBookHandler(),
            routeBase: "/api/books",
            idDbFieldName: "isbn",
        });
    }

    public initialiseRoutes() {
        this.router.get('/api/books', async (req, res) => {
            // TODO pagination handling
            const books = await this.find({});
            return this.sendResponseForModelCollection(res, books);
        });
        
        this.router.get('/api/books/:isbn', async (req, res) => {
            return this.getOneHelper(req.params, res);
        });

        this.router.post('/api/books', async (req, res) => {
            return this.postHelper(req.body, res);
        });
 
        this.router.put('/api/books/:isbn', async (req, res) => {
            const isbn:string = req.params.isbn;
            return this.putHelper<string>(
                req.body,
                res,
                isbn,
                "isbn"
            );
        });
 
        this.router.patch('/api/books/:isbn', async (req, res) => {
            try {
                const isbn:string = req.params.isbn;
                return this.patchHelper<string>(
                    req.body,
                    res,
                    isbn,
                    "isbn"
                );
            } catch (err) {
                return res.status(500).json({error:err});
            }
        });
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
}
