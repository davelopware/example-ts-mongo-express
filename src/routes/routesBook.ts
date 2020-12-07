import { Router } from "express";
import { Response } from "express-serve-static-core";
import BookModel from "../models/bookModel";
import { IModel } from "../models/IModel";
import { HateoasBookHandler } from '../rest/hateoasBookHandler'

export class RoutesBook {

    private hateoas: HateoasBookHandler;
    private router: Router;

    constructor(router: Router) {
        this.hateoas = new HateoasBookHandler();
        this.router = router;
    }

    public initialiseRoutes() {
        this.router.post('/api/books', async (req, res) => {
            const book = new BookModel(this.hateoas.parseInputResource(req.body));
            await book.save();
            return this.sendResponseForModel(res, book, 201);
        });

        this.router.get('/api/books/:isbn', async (req, res) => {
            const isbn:string = req.params.isbn;
            const book = await BookModel.findOne({isbn});
            return this.sendResponseForModel(res, book);
        });

        this.router.get('/api/books', async (req, res) => {
            const books = await BookModel.find();
            return this.sendResponseForModelCollection(res, books);
        });
    }

    protected sendResponseForModel(res: Response<any, number>, model: IModel | null, status = 200) {
        if (model) {
            return res.status(status)
                .contentType(this.hateoas.contentType)
                .send(this.hateoas.outputModel(model));
        } else {
            return res.status(404).send();
        }
    }

    protected sendResponseForModelCollection(res: Response<any, number>, models: IModel[], status = 200) {
        return res.status(status)
            .contentType(this.hateoas.contentTypeCollection)
            .send(this.hateoas.outputModelCollection(models));
    }
}