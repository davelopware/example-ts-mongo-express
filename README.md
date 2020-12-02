
# Example for TypeScript, MongoDB and Express

Simple example project to demonstrate basics of using TypeScript with MongoDB (via mongoose) and NodeJS Express

# Steps followed for initial setup of this project

## Node Typescript Project

Credit: https://medium.com/javascript-in-plain-english/typescript-node-js-express-js-create-a-backend-application-f5110dbe5c19

But yarnified by me

1. git init
2. yarn init
3. yarn add -D typescript 
4. tsc --init
5. yarn add dotenv express
6. yarn add -D @types/express @types/node nodemon ts-node 
7. create .env file
   ```
   NODE_ENV='dev'
   APP_PORT=3000
   ```
8. create src folder
9. create src/app.ts containing:
   ```typescript
    import dotenv from 'dotenv';
    import express from 'express';

    // load the environment variables from the .env file
    dotenv.config({
        path: '.env'
    });

    /**
    * Express server application class.
    * @description Will later contain the routing system.
    */
    class Server {
        public app = express();
    }

    // initialize server app
    const server = new Server();

    // make server listen on some port
    ((port = process.env.APP_PORT || 5000) => {
        server.app.listen(port, () => console.log(`> Listening on port ${port}`));
    })();
   ```
10. add script section to package.json
   ```
    "scripts": {
        "dev": "nodemon src/app.ts"
    }
   ```
11. run the following: `npm run dev`

## Mongo DB typescript

Credit: https://thecodebarbarian.com/working-with-mongoose-in-typescript.html


1. install mongoose for accessing mongodb and body-parser for instant json handling
   ```bash
   yarn add body-parser
   yarn add mongoose
   yarn add -D @types/mongoose
   ```
2. Use models using mongoose to wrap access to MongoDb for typescript type safety as follows in src/models/bookModel.ts
   ```typescript
    import mongoose, { Schema, Document } from 'mongoose';

    export interface IBookModel extends Document {
        isbn: string;
        title: string;
        desc: string;
        createdAt: Date; // lets typescript know about the field added by the Schema setting 'timestamps: true'
        updatedAt: Date; // lets typescript know about the field added by the Schema setting 'timestamps: true'
    }

    const BookSchema:Schema = new Schema(
        {
            isbn: {
                type: String,
                required: true,
                unique: true,
            },
            title: {
                type: String,
                required: true,
            },
            desc: {
                type: String,
                required: true,
            }
        },
        {
            timestamps: true  // this adds the createdAt & updatedAt fields
        }
    );

    const BookModel = mongoose.model<IBookModel>('book', BookSchema);

    export default BookModel;
   ```
3. Implement routes to turn api calls into model manipulations in src/routes/bookRoutes.ts
   ```typescript
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
   ```
   Note Exception handling is needed in here!

4. Implement the helper method used to simplify limiting the fields read and returned in src/routes/routeHelpers.ts
   ```typescript
    export function getJustFields(obj:any, keys:string[]) {
        return keys.reduce((a:any, c:string) => ({ ...a, [c]: obj[c] }), {});
    }
   ```
   Note: this is a variation on a neat little routine I found on stackoverflow from [Muhammet Enginar](https://stackoverflow.com/users/9125072/muhammet-enginar)

   Credit: https://stackoverflow.com/questions/35939289/how-to-destructure-into-dynamically-named-variables-in-es6/47916931#47916931

5. Fold all of that into the application by updating app.ts
   ```typescript
    import mongoose from 'mongoose';
    import { json } from 'body-parser';
    import { bookRouter } from './routes/bookRoutes';

    ...

    class App {
        public exp = express();

        constructor() {
            dotenv.config({path: '.env'});
            this.exp.use(json());
            this.exp.use(bookRouter);
        }

        public serverListen() {
            const port = process.env.APP_PORT || 5000;

            // make server listen on some port
            this.exp.listen(port, () => {
                console.log(`> Listening on port ${port}`);
            });
        }

        public mongooseConnect() {
            const connectstr = process.env.MONGODB || 'mongodb://localhost:27017/envmissing';
            mongoose.connect(connectstr, {
                useCreateIndex: true,
                useNewUrlParser: true,
                useUnifiedTopology: true
            }, () => {
                console.log('> connected to database');
            });
        }
    }

    const app = new App();
    app.mongooseConnect();
    app.serverListen();
   ```

