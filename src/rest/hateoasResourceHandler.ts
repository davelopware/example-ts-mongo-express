import { IModel } from "../models/IModel";

export interface HateoasLink {
    name: string;
    uri: string
}

export interface HateoasResourceParams<TModel extends IModel> {
    contentType: string;
    contentTypeCollection?: string;
    resourceTypeName: string;
    resourceTypeCollectionName?: string;
    outFields: string[];
    inFields: string[] | null;
    buildLinksFn?: (model: TModel) => HateoasLink[];
}

/**
 * Handles HATEOAS style object shapes for easy HATEOAS controller implementation
 */
export class HateoasResourceHandler<TModel extends IModel> {
    protected _params: HateoasResourceParams<TModel>;
    // protected _contentType: string;
    // protected _contentTypeCollection?: string;
    // protected _resourceTypeName: string;
    // protected _resourceTypeCollectionName?: string;
    // protected _inFields: string[];
    // protected _outFields: string[];
    protected _model: TModel | null = null;
    // protected _buildLinksFn?: HateoasBuildLinksFn<TModel>;

    constructor( params: HateoasResourceParams<TModel>) {
        this._params = params;
        this._params.inFields = this._params.inFields ?? [...this._params.outFields];
        // this._contentType = params.contentType;
        // this._contentTypeCollection = params.contentTypeCollection;
        // this._resourceTypeName = params.resourceTypeName;
        // this._resourceTypeCollectionName = params.resourceTypeCollectionName;
        // this._outFields = params.outFields;
        // this._inFields = params.inFields ?? [...this._outFields];
        // this._buildLinksFn = params.buildLinks;
    }

    // set contentType(val: string) { this._contentType = val; } 
    get contentType() { return this._params.contentType; }
    get contentTypeCollection(): string { return this._params.contentTypeCollection ?? 'application/hal+json'; }
    // set resourceType(val: string) { this._resourceTypeName = val; } 
    // get resourceType() { return this._resourceTypeName; }
    set model(val: TModel | null) { this._model = val; }
    get model(){ return this._model; }
    // set inFields(val: string[]) { this._inFields = val; }
    // get inFields() { return this._inFields; }
    // set outFields(val: string[]) { this._outFields = val; }
    // get outFields() { return this._outFields; }

    public outputModel(model: TModel, wrap?: boolean) {
        let innerResult = this.getJustFields(model,this._params.outFields);
        const links = this.buildLinks(model);
        if (links.length > 0) {
            let linksObj = links.reduce<any>((result, link) => ({...result, [link.name] : link.uri}), {});
            console.log(linksObj);
            innerResult._links = linksObj;
        }
        return (wrap !== false) ? this.wrapDataIn(innerResult, this._params.resourceTypeName) : innerResult;
    }

    protected wrapDataIn(data:any, outer: string) {
        let result:any = {};
        result[outer] = data;
        return result;
    }

    public outputModelCollection(models: TModel[]) {
        let result:any = {};
        result._embedded = this.wrapDataIn(
            models.map((model) => this.outputModel(model, false)),
            this._params.resourceTypeCollectionName ?? this._params.resourceTypeName+'s'
        );
        const links = this.buildCollectionLinks(models);
        if (links.length > 0) {
            let linksObj = links.reduce<any>((result, link) => ({...result, [link.name] : link.uri}), {});
            console.log(linksObj);
            result._links = linksObj;
        }
        return result;
    }

    public parseInputResource(input:any) {
        const innerResource = input[this._params.resourceTypeName];
        if (innerResource !== undefined) {
            return this.getInFieldsOf(innerResource);
        }
    }

    public getInFieldsOf(obj:any) {
        return this.getJustFields(obj, this._params.inFields??[]);
    }

    public getOutFieldsOf(obj:any) {
        return this.getJustFields(obj, this._params.outFields);
    }

    protected getJustFields(obj:any, keys:string[]) {
        return keys.reduce((a:any, c:string) => ({ ...a, [c]: obj[c] }), {});
    }

    protected buildLinks(model: TModel) : HateoasLink[] {
        if (this._params.buildLinksFn) {
            return this._params.buildLinksFn(model);
        } else {
            return [];
        }
    }

    protected buildCollectionLinks(models: TModel[]) : HateoasLink[] {
        return [];
    }

}