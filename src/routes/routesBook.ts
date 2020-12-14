import { Router } from "express";
import { RoutesBase } from "./routesBase";
import BookModel, { IBookModel } from "../models/bookModel";
import { HateoasBookHandler } from '../rest/hateoasBookHandler'

export class RoutesBook extends RoutesBase<IBookModel> {

    constructor(router: Router) {
        super(router, new HateoasBookHandler());
    }

    public initialiseRoutes() {
        this.router.get('/api/books', async (req, res) => {
            const books = await BookModel.find();
            return this.sendResponseForModelCollection(res, books);
        });
        
        this.router.get('/api/books/:isbn', async (req, res) => {
            const isbn:string = req.params.isbn;
            const book = await BookModel.findOne({isbn});
            return this.sendResponseForModel(res, book);
        });

        this.router.post('/api/books', async (req, res) => {
            const book = new BookModel(this.hateoas.parseInputResource(req.body));
            await book.save();
            return this.sendResponseForModel(res, book, 201);
        });
 
        this.router.put('/api/books/:isbn', async (req, res) => {
            const isbn:string = req.params.isbn;
            const requestParsed = this.hateoas.parseInputResource(req.body);
            if (requestParsed["isbn"] != isbn) {
                return this.sendErrorResponse(res, "The uri parameter and body value for isbn do not match");
            }
            const bookBefore = await BookModel.findOne({isbn});
            if (bookBefore) {
                await BookModel.updateOne({isbn}, {$set: requestParsed});
                const bookAfter = await BookModel.findOne({isbn});
                return this.sendResponseForModel(res, bookAfter, 200);
            } else {
                const newBook = new BookModel(this.hateoas.parseInputResource(req.body));
                await newBook.save();
                return this.sendResponseForModel(res, newBook, 201);
            }
        });
   }
}
