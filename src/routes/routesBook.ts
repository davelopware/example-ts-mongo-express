import { Router } from "express";
import BookModel from "../models/bookModel";
import { HateoasBookHandler } from '../rest/hateoasBookHandler'

export class RoutesBook {

    private hateoas: HateoasBookHandler;

    constructor(router: Router) {
        this.hateoas = new HateoasBookHandler();

        router.get('/api/books/:isbn', async (req, res) => {
            const isbn:string = req.params.isbn;
            const book = await BookModel.findOne({isbn});
            console.log(book);
            if (book == null) {
                return res.status(404).send();
            } else {
                return res.contentType(this.hateoas.contentType).send(this.hateoas.outputModel(book));
            }
        });

        router.get('/api/books', async (req, res) => {
            const books = await BookModel.find();
            console.log(books);
            return res.contentType(this.hateoas.contentTypeCollection).send(this.hateoas.outputModelCollection(books));
        });
    }
}