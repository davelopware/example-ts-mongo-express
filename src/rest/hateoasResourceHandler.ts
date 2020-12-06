import { IBookModel } from "../models/bookModel";
import { IModel } from "../models/IModel";

export interface HateoasLink {
    name: string;
    uri: string
}

export interface HateoasResourceParams {
    contentType: string;
    contentTypeCollection?: string;
    resourceTypeName: string;
    resourceTypeCollectionName?: string;
    outFields: string[];
    inFields: string[] | null;
    buildLinks?: (model: IModel) => HateoasLink[];
}

export class HateoasResourceHandler {
    protected _contentType: string;
    protected _contentTypeCollection?: string;
    protected _resourceTypeName: string;
    protected _resourceTypeCollectionName?: string;
    protected _inFields: string[];
    protected _outFields: string[];
    protected _model: IModel | null = null;
    protected _buildLinksFn?: (model: IModel) => HateoasLink[];

    constructor( params: HateoasResourceParams) {
        this._contentType = params.contentType;
        this._contentTypeCollection = params.contentTypeCollection;
        this._resourceTypeName = params.resourceTypeName;
        this._resourceTypeCollectionName = params.resourceTypeCollectionName;
        this._outFields = params.outFields;
        this._inFields = params.inFields ?? [...this._outFields];
        this._buildLinksFn = params.buildLinks;
    }

    // set contentType(val: string) { this._contentType = val; } 
    get contentType() { return this._contentType; }
    get contentTypeCollection(): string { return this._contentTypeCollection ?? 'application/hal+json'; }
    // set resourceType(val: string) { this._resourceTypeName = val; } 
    // get resourceType() { return this._resourceTypeName; }
    set model(val: IModel | null) { this._model = val; }
    get model(){ return this._model; }
    // set inFields(val: string[]) { this._inFields = val; }
    // get inFields() { return this._inFields; }
    // set outFields(val: string[]) { this._outFields = val; }
    // get outFields() { return this._outFields; }

    public outputModel(model: IModel, wrap?: boolean) {
        let innerResult = this.getJustFields(model,this._outFields);
        const links = this.buildLinks(model);
        if (links.length > 0) {
            let linksObj = links.reduce<any>((result, link) => ({...result, [link.name] : link.uri}), {});
            console.log(linksObj);
            innerResult._links = linksObj;
        }
        return (wrap !== false) ? this.wrapDataIn(innerResult, this._resourceTypeName) : innerResult;
    }

    protected wrapDataIn(data:any, outer: string) {
        let result:any = {};
        result[outer] = data;
        return result;
    }

    public outputModelCollection(models: IModel[]) {
        let result:any = {};
        result._embedded = this.wrapDataIn(
            models.map((model) => this.outputModel(model, false)),
            this._resourceTypeCollectionName ?? this._resourceTypeName+'s'
        );
        const links = this.buildCollectionLinks(models);
        if (links.length > 0) {
            let linksObj = links.reduce<any>((result, link) => ({...result, [link.name] : link.uri}), {});
            console.log(linksObj);
            result._links = linksObj;
        }
        return result;
    }

    protected getJustFields(obj:any, keys:string[]) {
        return keys.reduce((a:any, c:string) => ({ ...a, [c]: obj[c] }), {});
    }

    protected buildLinks(model: IModel) : HateoasLink[] {
        if (this._buildLinksFn) {
            return this._buildLinksFn(model);
        } else {
            return [];
        }
    }

    protected buildCollectionLinks(models: IModel[]) : HateoasLink[] {
        return [];
    }

}