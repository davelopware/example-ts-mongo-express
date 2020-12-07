import { IBookModel } from "../models/bookModel";
import { IModel } from "../models/IModel";
import { HateoasLink, HateoasResourceHandler } from "./hateoasResourceHandler";

export class HateoasBookHandler extends HateoasResourceHandler {
    constructor() {
        super({
            contentType: 'application/vnd.davelopware.examples.book+json',
            contentTypeCollection: 'application/vnd.davelopware.examples.books+json',
            resourceTypeName: 'book',
            outFields: [
                'isbn',
                'title',
                'desc',
                'createdAt',
                'updatedAt',
            ],
            inFields: [
                'isbn',
                'title',
                'desc',
                'authorId',
            ],
        });
    }

    protected buildLinks(model: IModel) : HateoasLink[] {
        const book = model as IBookModel;
        if (book.authorId) {
            return [{name:'author', uri:`author/${book.authorId}`}]
        }
        return [];
    }
}
