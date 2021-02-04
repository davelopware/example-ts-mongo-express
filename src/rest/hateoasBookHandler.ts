import { IBookModel } from "../models/bookModel";
import { HateoasLink, HateoasResourceHandler, HateoasResourceParams } from "./hateoasResourceHandler";

/**
 * Represents the HATEOAS / HAL aspects of the resource
 */
export class HateoasBookHandler extends HateoasResourceHandler<IBookModel> {
    constructor(params?: HateoasResourceParams<IBookModel> | any) {
        params = params ?? {};
        super({
            ...{
                // http content type for the individual resource
                contentType: 'application/vnd.davelopware.examples.book+json',
                // http content type for the collection resource
                contentTypeCollection: 'application/vnd.davelopware.examples.books+json',
                // name of the field in the root level object that contains the resource fields. Also used in route names
                resourceTypeName: 'book',
                // model fields that will be sent out by the api to represent a resource
                outFields: [
                    'isbn',
                    'title',
                    'desc',
                    'authorId',
                    'createdAt',
                    'updatedAt',
                ],
                // model fields tht will be read in by the api to create / update a resource
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

    /**
     * Build a list of links associated with the specified model
     */
    protected buildLinks(model: IBookModel) : HateoasLink[] {
        const links = super.buildLinks(model);
        if (model.authorId) {
            links.push({name:'author', uri:`author/${model.authorId}`});
        }
        return links;
    }
}
