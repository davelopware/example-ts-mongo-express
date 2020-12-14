import { IBookModel } from "../models/bookModel";
import { HateoasLink, HateoasResourceHandler } from "./hateoasResourceHandler";

export class HateoasBookHandler extends HateoasResourceHandler<IBookModel> {
    constructor() {
        super({
            contentType: 'application/vnd.davelopware.examples.book+json',
            contentTypeCollection: 'application/vnd.davelopware.examples.books+json',
            resourceTypeName: 'book',
            outFields: [
                'isbn',
                'title',
                'desc',
                'authorId',
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

    protected buildLinks(model: IBookModel) : HateoasLink[] {
        if (model.authorId) {
            return [{name:'author', uri:`author/${model.authorId}`}]
        }
        return [];
    }
}
