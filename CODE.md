# Architecture

```text
App
 |
 RouteManager
  |
  |
  |
  |     RoutesBase
  |     |  routeNames
  |     |  get/post/put/patch helpers
  |     |
  RoutesBook
   |
   +------------------------------------------------
   |                                               |
   |     HateoasResourceHandler                    |     mongoose.model<>
   |     |                                         |     |
   HateoasBookHandler                              BookModel
    |  outFields                                       fields = properties
    |  inFields
    |
    |
    |





```