import { Router } from "express";
import { Response } from "express-serve-static-core";
import { IModel } from "../models/IModel";
import { HateoasResourceHandler } from "../rest/hateoasResourceHandler";

export class RoutesBase<TModel extends IModel> {

    protected hateoas: HateoasResourceHandler<TModel>;
    protected router: Router;

    constructor(router: Router, hateoas: HateoasResourceHandler<TModel>) {
        this.router = router;
        this.hateoas = hateoas;
    }

    public initialiseRoutes() {
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
}
