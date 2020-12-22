import { Router } from "express";
import { Response, ParamsDictionary } from "express-serve-static-core";
import { QueryFindOneAndUpdateOptions } from "mongoose";
import { FilterQuery } from "mongodb";
import { IModel } from "../models/IModel";
import { HateoasResourceHandler } from "../rest/hateoasResourceHandler";

export interface RoutesParams<TModel extends IModel> {
    router: Router;
    hateoas: HateoasResourceHandler<TModel>;
    routeBase: string;
    idDbFieldName: string;
}

export class RoutesBase<TModel extends IModel> {

    protected hateoas: HateoasResourceHandler<TModel>;
    protected router: Router;
    protected routeBase: string;
    protected idDbFieldName: string;

    constructor(params: RoutesParams<TModel>) {
        this.router = params.router;
        this.routeBase = params.routeBase;
        this.hateoas = params.hateoas;
        this.idDbFieldName = params.idDbFieldName;
    }

    public initialiseRoutes() {
    }

    protected newModel(doc?: any) : TModel {
        throw new Error("Not Implemented");
    }

    protected async findOne(conditions: FilterQuery<TModel>) : Promise<TModel | null> {
        throw new Error("Not Implemented");
    }

    protected async find(conditions: FilterQuery<TModel>) : Promise<TModel[]> {
        throw new Error("Not Implemented");
    }

    protected async findOneAndUpdate(conditions: FilterQuery<TModel>, updateQuery: any, options?: QueryFindOneAndUpdateOptions) : Promise<TModel> {
        throw new Error("Not Implemented");
    }

    protected async getOneHelper(
        reqParams: ParamsDictionary,
        res: Response<any, number>
    ) {
        const urlParamValue:string = reqParams[this.idDbFieldName];
        const condition = this.idAsFindableCondition(urlParamValue);
        const model = await this.findOne(condition);
        return this.sendResponseForModel(res, model);
    }

    protected async postHelper(
        reqBody: any,
        res: Response<any, number>
    ) {
        try {
            const requestParsed = this.hateoas.parseInputResource(reqBody);
            const idFieldReqBodyValue:string = requestParsed[this.idDbFieldName];
            const condition = this.idAsFindableCondition(idFieldReqBodyValue);
            const modelBefore = await this.findOne(condition);
            if (modelBefore) {
                return this.sendErrorResponse(
                    res,
                    `Record already exists with [${this.idDbFieldName}]=[${idFieldReqBodyValue}]`,
                    409
                );
            }
            const model = this.newModel(this.hateoas.parseInputResource(reqBody));
            await model.save();
            return this.sendResponseForModel(res, model, 201);
        } catch (err) {
            return this.sendErrorResponse(res, err, 500);
        }
    }

    protected async putHelper<IDType>(
        reqBody: any,
        res: Response<any, number>,
        urlParamValue:IDType,
        fieldName:string
    ) {
        const requestParsed = this.hateoas.parseInputResource(reqBody);
        if (requestParsed[fieldName] != urlParamValue) {
            return this.sendErrorResponse(res, `The uri parameter and body value for [${fieldName}] do not match`);
        }

        const findCondition = this.idAsFindableCondition(urlParamValue);
        const modelBefore = await this.findOne(findCondition);
        if (modelBefore) {
            const modelAfter = await this.findOneAndUpdate(findCondition, requestParsed, {new:true, overwrite:true});
            return this.sendResponseForModel(res, modelAfter, 200);
        } else {
            const newModel = this.newModel(this.hateoas.parseInputResource(reqBody));
            await newModel.save();
            return this.sendResponseForModel(res, newModel, 201);
        }
    }

    protected async patchHelper<IDType>(
        reqBody: any,
        res: Response<any, number>,
        urlParamValue:IDType,
        fieldName:string
    ) {
        const requestParsed = this.hateoas.parseInputResource(reqBody, false);
        if (requestParsed[fieldName] && requestParsed[fieldName] != urlParamValue) {
            return this.sendErrorResponse(res, `The uri parameter and body value for [${fieldName}] do not match`);
        }

        const findCondition = this.idAsFindableCondition(urlParamValue);
        const modelBefore = await this.findOne(findCondition);
        if (modelBefore) {
            const modelAfter = await this.findOneAndUpdate(findCondition, {$set: requestParsed}, {new:true});
            return this.sendResponseForModel(res, modelAfter, 200);
        } else {
            return this.sendResponseForModel(res, null);
        }
    }

    protected sendResponseForModel(res: Response<any, number>, model: TModel | null, status = 200) {
        if (model) {
            return res.status(status)
                .contentType(this.hateoas.contentType)
                .send(this.hateoas.outputModel(model));
        } else {
            return res.status(404).send();
        }
    }

    protected sendResponseForModelCollection(res: Response<any, number>, models: TModel[], status = 200) {
        return res.status(status)
            .contentType(this.hateoas.contentTypeCollection)
            .send(this.hateoas.outputModelCollection(models));
    }

    protected sendErrorResponse(res: Response<any, number>, errorMsg: string, status = 400) {
        return res.status(status)
            .json({error:errorMsg});
    }

    private idAsFindableCondition(value: any) {
        let id:any = {};
        id[this.idDbFieldName] = value;
        return id;
    }

}
