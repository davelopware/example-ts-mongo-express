import express from 'express';
import BookModel, { IBookModel } from '../models/bookModel';
import { getJustFields } from './routeHelpers';

const router = express.Router();

const inFields = [
    'isbn',
    'title',
    'desc',
];

const outFields = [
    'isbn',
    'title',
    'desc',
    'createdAt',
    'updatedAt',
];

router.get('/api/books', async (req, res) => {
    const books: Array<IBookModel> = await BookModel.find({});
    console.log(books);
    return res.send(books.map((rec) => getJustFields(rec,outFields)));
});

router.get('/api/books/:isbn', async (req, res) => {
    const isbn:string = req.params.isbn;
    const book = await BookModel.findOne({isbn});
    console.log(book);
    return res.send(getJustFields(book,outFields));
});

router.post('/api/books', async (req, res) => {
    const book = new BookModel(getJustFields(req.body,inFields));

    await book.save();
    return res.status(201).send(getJustFields(book, outFields));
});

router.patch('/api/books/:isbn', async (req, res) => {
    const isbn:string = req.params.isbn;

    await BookModel.update(
        {isbn},
        req.body
    );
    const bookAfter = await BookModel.findOne({isbn});

    if (bookAfter === undefined) {
        return res.status(404).send();
    } else {
        return res.status(201).send(bookAfter);
    }
});

export { router as bookRouter };
