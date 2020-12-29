import { IModel } from "../models/IModel";

export interface HateoasLink {
    name: string;
    uri: string
}

export type HateoasBuildLinks<TModel extends IModel> = (model: TModel) => HateoasLink[];

export interface HateoasResourceParams<TModel extends IModel> {
    contentType: string;
    contentTypeCollection?: string;
    resourceTypeName: string;
    resourceTypeCollectionName?: string;
    outFields: string[];
    inFields: string[] | null;
    buildLinksFn?: HateoasBuildLinks<TModel>;
}

/**
 * Handles HATEOAS style object shapes for easy HATEOAS controller implementation
 */
export class HateoasResourceHandler<TModel extends IModel> {
    protected _params: HateoasResourceParams<TModel>;
    protected _model: TModel | null = null;
    protected _buildLinksFns: HateoasBuildLinks<TModel>[];

    constructor( params: HateoasResourceParams<TModel>) {
        this._params = params;
        this._params.inFields = this._params.inFields ?? [...this._params.outFields];
        this._buildLinksFns = [];
        if (this._params.buildLinksFn) {
            this.addBuildLinksFn(this._params.buildLinksFn);
        }
    }

    public addBuildLinksFn(buildLinksFn: HateoasBuildLinks<TModel>) {
        this._buildLinksFns.push(buildLinksFn);
    }

    get contentType() { return this._params.contentType; }
    get contentTypeCollection(): string { return this._params.contentTypeCollection ?? 'application/hal+json'; }
    get resourceTypeName() { return this._params.resourceTypeName; }
    set model(val: TModel | null) { this._model = val; }
    get model(){ return this._model; }

    public outputModel(model: TModel, wrap?: boolean) {
        let innerResult = this.getJustFields(model,this._params.outFields);
        const links = this.buildLinks(model);
        if (links.length > 0) {
            let linksObj = links.reduce<any>((result, link) => ({...result, [link.name] : {href: link.uri}}), {});
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
            result._links = linksObj;
        }
        return result;
    }

    public parseInputResource(input:any, withUndefined?:boolean) {
        const innerResource = input[this._params.resourceTypeName];
        if (innerResource !== undefined) {
            if (withUndefined == true) {
                return this.getInFieldsOf(innerResource);
            } else {
                return this.getInFieldsOfNotUndefined(innerResource);
            }
        }
    }

    public getInFieldsOf(obj:any) {
        return this.getJustFields(obj, this._params.inFields??[]);
    }

    public getInFieldsOfNotUndefined(obj:any) {
        return this.getJustFieldsNotUndefined(obj, this._params.inFields??[]);
    }

    public getOutFieldsOf(obj:any) {
        return this.getJustFields(obj, this._params.outFields);
    }

    protected getJustFields(obj:any, keys:string[]) {
        return keys.reduce((a:any, c:string) => ({ ...a, [c]: obj[c] }), {});
    }

    protected getJustFieldsNotUndefined(obj:any, keys:string[]) {
        return keys.reduce((a:any, c:string) => (obj[c] == undefined ? a : { ...a, [c]: obj[c] }), {});
    }

    protected buildLinks(model: TModel) : HateoasLink[] {
        let links: HateoasLink[] = [];
        this._buildLinksFns.forEach(buildLinksFn => {
            links = links.concat(buildLinksFn(model));
        });
        return links;
    }

    protected buildCollectionLinks(models: TModel[]) : HateoasLink[] {
        // TODO pagination handling
        return [];
    }

}