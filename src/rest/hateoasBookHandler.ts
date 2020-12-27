import { IBookModel } from "../models/bookModel";
import { HateoasLink, HateoasResourceHandler, HateoasResourceParams } from "./hateoasResourceHandler";

export class HateoasBookHandler extends HateoasResourceHandler<IBookModel> {
    constructor(params?: HateoasResourceParams<IBookModel> | any) {
        params = params ?? {};
        super({
            ...{
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
            },
            ...params
        });
    }

    protected buildLinks(model: IBookModel) : HateoasLink[] {
        let links = super.buildLinks(model);
        if (model.authorId) {
            links.push({name:'author', uri:`author/${model.authorId}`});
        }
        return links;
    }
}
